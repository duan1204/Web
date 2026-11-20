# Hướng dẫn sử dụng và bảo vệ đồ án

## Giới thiệu ngắn trước giảng viên

“Nhóm em xây dựng LUMIÈRE JEWELRY bằng HTML, CSS và JavaScript thuần. Website dùng một trang index và điều hướng theo hash để dữ liệu không bị mất khi chuyển màn hình. Khách có thể tìm kiếm, chọn size, mua hàng và xem lại đơn; Admin quản lý sản phẩm, khách hàng, trạng thái đơn và thống kê Top 5. Bản này giữ dữ liệu trong bộ nhớ của phiên, không có CSDL thật và không thanh toán ngân hàng thật.”

Không giới thiệu đây là hệ thống bán hàng production hoặc khẳng định đạt mọi điểm khi chưa được chấm.

## Kiến trúc dễ hiểu

`index.html` tải CSS rồi lần lượt tải `store.js` và `app.js`. Không dùng import module hoặc fetch file JSON, tránh phụ thuộc máy chủ khi mở file trực tiếp.

`store.js` tạo một đối tượng chứa các mảng products, users, orders, cart, favorites và hai ID phiên đăng nhập. Các hàm nghiệp vụ nằm cùng lớp repository: login, saveUser, filterProducts, addCart, changeCart, checkout, saveProduct, removeProduct, transition, filterOrders, topCustomers.

`app.js` đọc URL sau dấu # để chọn màn hình. Ví dụ `#/catalog`, `#/product/1` và `#/admin/orders`. Hàm render dựng nội dung từ nguồn dữ liệu. Những thao tác submit/click được xử lý tại document bằng event delegation, vì giao diện được thay lại sau mỗi thao tác.

CSS dùng Grid/Flexbox và media query; màu, font có biến chung ở :root. Header, footer, product card và order table được tạo bằng các hàm dùng lại.

## Các thuật toán chính

**Tìm kiếm:** chuẩn hóa chữ thường, tách dấu Unicode rồi bỏ dấu, đổi đ thành d, dùng includes để tìm tương đối. Tất cả điều kiện tên, danh mục, bộ sưu tập, giá tối thiểu/tối đa được nối bằng AND. Nếu chỉ nhập một đầu giá, chỉ dùng điều kiện đầu đó.

**Phân trang:** sau khi lọc và sắp xếp, tính tổng trang bằng ceil(số kết quả / 8). Trang k dùng slice((k−1)×8, k×8). Không chia trang trước khi lọc vì sẽ làm thiếu kết quả.

**Đăng ký/đăng nhập:** email không trùng, điện thoại 10 chữ số bắt đầu bằng 0, mật khẩu tối thiểu 8 ký tự. Login kiểm tra email, mật khẩu, role và locked. Buyer và Admin giữ ID riêng. Đây là logic trình diễn, người có DevTools vẫn có thể sửa code/dữ liệu.

**Giỏ hàng:** khóa của một dòng là productId + size. Cùng SKU và size thì cộng số lượng; khác size là dòng khác. Tổng tiền là tổng price×qty. Kiểm tra tổng mọi size so với stock của SKU, không chỉ kiểm tra từng dòng.

**Đặt hàng:** kiểm tra login, giỏ không rỗng, thông tin nhận hàng, phương thức và tồn kho. Sau khi mọi dòng hợp lệ mới tạo đơn, sao chép thông tin item, trừ kho, thêm orders rồi xóa cart. Đơn có userId nên lịch sử chỉ lọc đơn thuộc người đăng nhập.

**Sửa sản phẩm:** form nạp lại dữ liệu hiện tại, ảnh và phân loại. FileReader tạo data URL trong bộ nhớ để preview và lưu vào product.image. Không upload lên máy chủ. Ảnh mới chỉ tồn tại trong phiên.

**Xóa/ẩn:** nếu có bất kỳ đơn chứa productId thì chỉ đặt hidden=true. Nếu chưa có đơn thì hàm trả yêu cầu xác nhận; khi người dùng đồng ý mới xóa khỏi mảng. Điều này bảo vệ lịch sử tham chiếu.

**Trạng thái đơn:** pending → confirmed hoặc cancelled; confirmed → delivered hoặc cancelled; delivered/cancelled kết thúc. Mảng chuyển trạng thái hợp lệ chặn lùi trạng thái và chặn bỏ qua xác nhận. Hủy đơn hoàn lại kho một lần.

**Top 5:** lọc đơn theo khoảng ngày, bỏ cancelled, nhóm theo userId, cộng total, lưu danh sách đơn cấu thành, sắp giảm dần, lấy 5 người đầu. Nếu dưới 5 khách thì hiển thị số thực có. Đây là tổng mức đặt mua hợp lệ, không khẳng định tất cả đã trả tiền.

## Kịch bản trình diễn 10 phút

1. Mở index.html đã giải nén, giới thiệu thiết kế và 5 banner. Dùng nút sau để xem nhanh đủ chiến dịch.
2. Mở danh mục, tìm kiếm kết hợp và đổi trang. Giải thích filter trước, slice sau.
3. Chọn Solène, size 12, số lượng 2, thêm giỏ. Thử tăng vượt kho rồi trở lại số lượng hợp lệ.
4. Login khach@lumiere.vn / Lumiere123, dùng địa chỉ mới, chọn tiền mặt, đặt hàng. Đọc mã đơn và xem lại lịch sử.
5. Trong cùng tab, vào footer → Quản trị cửa hàng. Login admin@lumiere.vn / Admin123.
6. Xem đơn vừa đặt, xác nhận rồi giao. Chỉ ra không có nút quay ngược.
7. Thêm một sản phẩm, chọn ảnh có sẵn trong assets/products để demo upload; sau khi lưu, về storefront để thấy dữ liệu mới. Khi bảo vệ, giải thích ảnh dùng lại ở thao tác thử là dữ liệu kiểm thử, không phải SKU mẫu bàn giao.
8. Sửa phân loại/giá; xóa sản phẩm vừa thêm và xác nhận. Thử ẩn một sản phẩm đã bán.
9. Lọc đơn theo ngày, địa điểm và trạng thái. Mở Top 5, xem tổng, nhấn một đơn chi tiết.
10. Kết luận phạm vi: dữ liệu trong phiên, chưa CSDL thật; F5 khởi tạo lại. Chỉ chạy reset cuối buổi.

## 20 câu hỏi thường gặp

1. **Website có CSDL không?** Không. Bản này dùng mảng đối tượng trong bộ nhớ JavaScript. Không xem đây là CSDL thật.
2. **Vì sao chọn kiến trúc này?** Để mở trực tiếp index.html, không yêu cầu cài máy chủ, phù hợp phương án trình diễn không giữ dữ liệu qua lần mở lại.
3. **F5 thì chuyện gì xảy ra?** Script chạy lại, dữ liệu mẫu được tạo mới; tài khoản/đơn/ảnh upload vừa tạo bị mất.
4. **Mở hai tab có chung giỏ không?** Không, mỗi tab có bộ nhớ riêng. Kiểm tra buyer và Admin trong cùng tab.
5. **Tại sao chuyển trang không mất giỏ?** Hash routing chỉ thay nội dung HTML, không tải lại tài liệu index.
6. **Tìm tương đối là gì?** Tên chứa chuỗi cần tìm sau chuẩn hóa, không bắt buộc nhập đầy đủ tên.
7. **Các bộ lọc là AND hay OR?** AND: sản phẩm phải thỏa tất cả điều kiện đã nhập.
8. **Vì sao phân trang sau lọc?** Để số trang và tập sản phẩm dựa trên đúng kết quả tìm kiếm.
9. **Giỏ gộp sản phẩm thế nào?** Gộp khi productId và size cùng nhau; khác size giữ dòng riêng.
10. **Giá đổi sau mua có làm đơn cũ đổi không?** Không, đơn lưu bản sao giá/tên/ảnh tại thời điểm đặt.
11. **Tại sao kiểm tra tồn kho ở cả thêm giỏ và checkout?** Dữ liệu có thể thay đổi trước khi khách hoàn tất; checkout là kiểm tra cuối.
12. **Tại sao sản phẩm đã bán không xóa?** Để bảo toàn lịch sử; hidden loại khỏi catalog nhưng không hủy dữ liệu đơn.
13. **Đơn đã hủy có tính Top 5 không?** Không. Thống kê bỏ cancelled trước khi nhóm khách.
14. **Top 5 ít hơn 5 người thì sao?** Hiển thị số khách thực sự có đơn trong khoảng ngày, không thêm dữ liệu giả.
15. **Đơn đã giao có hủy được không?** Không trong quy trình này. Hoàn trả là nghiệp vụ khác chưa triển khai.
16. **Ảnh upload đi đâu?** FileReader chuyển sang data URL giữ trong product.image của phiên; không có máy chủ nhận ảnh.
17. **Admin có bảo mật thực tế không?** Không. Có kiểm tra vai trò trong logic để demo, nhưng bảo mật thật cần xác thực và phân quyền phía server.
18. **Trực tuyến có thu tiền không?** Không, chỉ lưu lựa chọn. Không báo giao dịch ngân hàng thành công.
19. **Nếu giảng viên bắt buộc CSDL?** Cần bổ sung backend/API và CSDL thật, thay repository, cấu hình môi trường tương ứng. Bản hiện tại chưa đáp ứng phần đó.
20. **Đã kiểm thử đến đâu?** 33 test logic và 105 lần tạo HTML trong Node VM, kiểm tra đủ ảnh/cú pháp. Chưa kiểm thử trực tiếp Chrome/responsive trong môi trường tạo, phải chạy checklist trên máy bảo vệ.

## Về hình ảnh và thương hiệu

Ảnh được AI tạo riêng theo prompt. 60 SKU có 12 kiểu dáng/ảnh khác nhau. Banner là ảnh concept chiến dịch, không bảo đảm mọi chi tiết giống SKU. Không dùng ảnh screenshot PNJ làm tài nguyên bán hàng. Vật liệu, giá và chính sách giả lập phục vụ đồ án, không phải chứng thư sản phẩm thật.
