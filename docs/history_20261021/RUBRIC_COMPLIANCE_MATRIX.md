# Đối chiếu biên bản chấm điểm

Nguồn đã đọc trực tiếp: `BienBanDanhGia_Web1_2025-caoth(1).doc`, 2 trang, Khoa CNTT – SGU, Cô PHAN THỊ KIM LOAN, học phần “Lập trình web và ứng dụng nâng cao”. Đọc toàn bộ nội dung trích xuất, gồm bảng tiêu chí và ghi chú. Yêu cầu lấy ảnh trang gốc không trả được ảnh render; không tự khẳng định vị trí điểm bị xuống dòng trong văn bản trích xuất.

## Những điểm cần xác minh với giảng viên

Nguyên văn: “Thực hiện GIAO DIỆN website sử dụng HTML, CSS, Js bán sản phẩm theo đề tài đã đăng kí. Mọi chức năng của website không được hoạt động không có cơ sở dữ liệu dưới mọi hình thức.”

Ghi chú nguyên văn: “Chấm bài trên web browser Chrome trực tiếp từ file html index trên máy laptop của giảng viên, mọi lỗi UI (mất font tiếng Việt, lỗi CSDL…) đều bị tính là lỗi.”

Hai nhóm chức năng ghi **5.0** và **5.0**, dòng “Tổng cộng” ghi **12**. Giữ nguyên, không cộng lại thành điểm mới hoặc dùng để hứa số điểm.

Theo mô tả được người dùng xác nhận, dữ liệu không cần duy trì khi mở lại. Bản triển khai chọn phương án HTML/CSS/JS chạy file trực tiếp, lưu trạng thái trong bộ nhớ. **Không có CSDL thật**. Nếu giảng viên diễn giải câu trên là bắt buộc CSDL thật, phần đó **Fail / chưa triển khai**, cần một backend và môi trường chạy khác. Không gọi repository JavaScript là CSDL.

## Cách đọc trạng thái

“Logic Pass” nghĩa là kiểm thử thực tế hàm nghiệp vụ bằng Node. “HTML Pass” nghĩa là hàm tạo HTML chạy trong Node VM và kiểm tra nội dung/đường dẫn, không phải Chrome. Cột Chrome luôn **Not Tested** vì chưa có phiên kiểm thử trình duyệt. Không có dòng nào được coi là nghiệm thu end-to-end hoàn toàn.

Điểm người mua bị lệch dòng giữa hai trang khi trích xuất: giữ nhóm 5.0; không gán chắc chắn từng điểm con. Chuỗi điểm đọc thấy theo thứ tự là 0.5, 0.5, 0.25, 0.5, 0.5, 0.5, 0.5, 0.25, 0.5, 0.5, 0.5. Cần xem bảng gốc để đối chiếu vị trí chính xác. Các điểm Admin dưới đây theo văn bản đã đọc.

| ID | Tiêu chí sát biên bản | Điểm | Màn hình / mã thực hiện | Cách kiểm thử | Kết quả thực tế | Chrome |
|---|---|---|---|---|---|---|
| U01 | Hiển thị sản phẩm theo phân loại | Trong nhóm 5.0 | #/catalog; store.filterProducts, app.catalog | Chọn Nhẫn cưới, chỉ thấy 12 cặp | Logic Pass, HTML Pass | Not Tested |
| U02 | Hiển thị chi tiết sản phẩm | Như trên | #/product/:id; app.product | Đúng ảnh, tên, mã, giá, size | HTML Pass | Not Tested |
| U03 | Tìm cơ bản theo tên tương đối | Như trên | Header / catalog; norm, filterProducts | “solene”, “NHAN”, không dấu | Logic Pass | Not Tested |
| U04 | Tìm nâng cao tên + phân loại + khoảng giá | Như trên | #/catalog; filterProducts | Nhẫn, nhan, 14–19 triệu → kết quả đúng cả ba điều kiện | Logic Pass | Not Tested |
| U05 | Phân trang phân loại và kết quả tìm | Như trên | #/catalog; app.catalog | Trang 1/2: 8/8; trang 8: 4, không trùng | Logic và HTML Pass | Not Tested |
| U06 | Đăng ký người mua trên end-user | Như trên | #/register; saveUser | Dữ liệu đúng, email trùng, phone sai | Logic Pass, HTML Pass | Not Tested |
| U07 | Giỏ hàng và yêu cầu đăng nhập, tự hiện thông tin | Như trên | #/cart, #/checkout; addCart, changeCart, buyer | Thêm/gộp size, sửa số lượng; chặn đặt khi chưa login | Logic Pass, HTML Pass | Not Tested |
| U08 | Chọn địa chỉ tài khoản hoặc nhập mới | Như trên | #/checkout; address-choice, checkout | Chọn saved/new; kiểm tra đơn lưu người nhận mới | Kiểm tra source; logic địa chỉ hợp lệ Pass | Not Tested |
| U09 | Chi trả trực tuyến hoặc tiền mặt, không yêu cầu trang thanh toán | Như trên | #/checkout; checkout | Hai lựa chọn được lưu; không giả thanh toán | Logic Pass | Not Tested |
| U10 | Hiển thị và lưu đơn khi kết thúc giao dịch | Như trên | #/success/:id; checkout, orderDetail | Tổng đúng, mã riêng, trừ kho, xóa giỏ | Logic Pass, HTML Pass; lưu trong phiên | Not Tested |
| U11 | Lịch sử mua được nhóm theo đơn hàng | Như trên | #/orders, #/orders/:id; orders | Chỉ xem đơn đúng user, có chi tiết | HTML Pass và dữ liệu logic Pass | Not Tested |
| A01 | Admin login/logout URL riêng | 0.5 | #/admin/login; login, admin-logout | Tài khoản sai vai trò bị từ chối | Logic Pass, HTML Pass; logout chưa bấm thực tế | Not Tested |
| A02 | Thêm, sửa, khóa/mở user | 0.5 | #/admin/users; saveUser, lockUser | Sửa giữ mật khẩu khi trống; khóa vô hiệu phiên buyer | Logic Pass | Not Tested |
| A03 | Thêm đúng phân loại; upload ảnh, xem trước | 0.5 | #/admin/products; productForm, FileReader, saveProduct | Chọn ảnh hợp lệ, preview, lưu và mở storefront | Logic lưu Pass; upload/preview trình duyệt chưa chạy | Not Tested |
| A04 | Sửa hiện thông tin hiện tại, nhất là phân loại và ảnh | 0.5 | productForm; saveProduct | Form prefill ảnh hiện tại và selected category | Logic Pass, HTML Pass | Not Tested |
| A05 | Đã bán thì ẩn; chưa bán hỏi lại rồi xóa | 0.75 | removeProduct, delete-product, confirm-delete | Solène ẩn; Ginkgo phải xác nhận mới xóa | Logic Pass; dialog source đã kiểm tra | Not Tested |
| A06 | Cập nhật trạng thái xuôi, không ngược | 0.5 | #/admin/orders/:id; transition | Pending→confirmed→delivered; terminal không đổi | Logic Pass | Not Tested |
| A07 | Lọc tình trạng/khoảng ngày/địa điểm | 0.75 | #/admin/orders; filterOrders | Pending + 03/10 + Ba Đình → LM1003 | Logic Pass | Not Tested |
| A08 | Top 5 theo thời gian; từng đơn có link; tổng giảm dần | 1 | #/admin/stats; topCustomers, orderTable | So với tổng từng user; bỏ đơn hủy; ngày biên | Logic Pass, HTML Pass | Not Tested |
| R01 | HTML/CSS/JS, mở index bằng Chrome | Không ghi riêng | index.html + css/main.css + js/*.js | Mở file trực tiếp khi mất mạng | Source không phụ thuộc mạng Pass | Not Tested |
| R02 | CSDL theo câu nguyên văn | Không rõ | Chưa có backend/CSDL | Xác minh cách hiểu với giảng viên | Fail nếu bắt buộc CSDL thật | Not Tested |

## Quy tắc nghiệp vụ bổ sung đã thực hiện

- Tổng Top 5 gồm pending, confirmed, delivered; bỏ cancelled. Đây là mức mua, không gọi là tiền đã thu.
- Ngày lọc theo ngày địa phương của trình duyệt, gồm cả hai đầu khoảng ngày.
- Hủy đơn hoàn lại tồn kho một lần; không hủy đơn đã giao.
- Bất kỳ sản phẩm đã có trong lịch sử đơn đều giữ lại và chỉ ẩn, kể cả đơn hủy, để không mất tham chiếu.
- Đơn lưu bản sao tên, giá, ảnh, size, số lượng tại thời điểm đặt. Sửa catalog không đổi lịch sử.
- Tồn kho kiểm tra tổng mọi size của một SKU. Bản mẫu chưa có tồn kho riêng cho từng size.

## Yêu cầu thiết kế ngoài rubric

60 SKU / 60 ảnh riêng, 5 banner / 5 ảnh riêng, 5 bộ sưu tập, 5 danh mục. Có slider tự động 5 giây, vòng lặp, thủ công, nút dừng, reduced motion. CSS responsive và các trang phụ đồng bộ. Đã kiểm tra ảnh gốc và tạo HTML; chưa kiểm chứng layout trên Chrome. Chưa có ảnh nhiều góc cho từng SKU, chưa có quản lý banner/danh mục trong Admin (mục tùy chọn).
