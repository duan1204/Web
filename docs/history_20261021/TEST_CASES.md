# Kiểm thử và nghiệm thu

## Đã chạy trong môi trường tạo dự án

Lệnh `node tests/store.test.cjs`: 33 test đạt. Bao gồm tìm kiếm không dấu/không phân biệt hoa thường, AND nhiều điều kiện, biên giá, kết quả trống, sắp xếp, tập phân trang, đăng nhập đúng vai trò, mật khẩu sai, tài khoản khóa, đăng ký và trùng email, gộp giỏ theo SKU/size, tồn kho cộng gộp các size, kiểm tra số lượng, yêu cầu đăng nhập, thông tin nhận hàng, đơn và snapshot giá, lựa chọn chi trả, chặn thiếu tồn kho, quyền sửa dữ liệu, thêm/sửa sản phẩm, dữ liệu sai, xóa/ẩn, trạng thái xuôi, cấm bỏ bước, hoàn kho một lần, lọc ngày/vùng/trạng thái, Top 5, khóa phiên và reset.

Lệnh `node tests/templates.test.cjs`: 105 lần tạo HTML đạt. Đã kiểm tra phần nội dung của trang chủ, danh mục, trang 2, tìm kiếm trống, giá sai, bộ sưu tập, chi tiết và sản phẩm không tồn tại, tài khoản, giỏ, checkout, đơn hàng đúng chủ, trang nội dung, Admin và thống kê. Kiểm tra prefill ảnh/phân loại, escape HTML và tài nguyên cục bộ.

Kiểm tra tài nguyên: 65 PNG giải mã hợp lệ và hash riêng; 65 đường dẫn ảnh được tham chiếu tồn tại. Không có HTTP/CDN/fetch/module import hoặc lưu trữ trình duyệt trong mã ứng dụng. JavaScript parse hợp lệ bằng `node --check`. Xem log `TEST_RESULTS.txt`.

**Node VM chỉ tạo chuỗi HTML với các đối tượng giả tối thiểu, không có DOM/layout thực. Không dùng kết quả này để ghi Pass cho thao tác bấm, CSS, dialog, upload, chuyển banner hoặc Chrome.**

Có thể mở `tests/index.html` trong Chrome để chạy lại 33 kiểm thử logic, không cần Node. Phần ghép script của trang test đã kiểm tra bằng Node VM; trang test này chưa được mở trực tiếp bằng Chrome trong môi trường tạo.

## Checklist Chrome cần chạy — toàn bộ hiện Not Tested

Giải nén trên máy kiểm tra, mở index.html trực tiếp. Mỗi nhóm bắt đầu bằng F5 để dữ liệu mẫu được phục hồi khi cần. Test mua rồi quản trị phải làm cùng tab và không F5 giữa chừng.

| ID | Thao tác | Kết quả mong đợi | Trạng thái |
|---|---|---|---|
| C01 | Mở index.html bằng Chrome, ngắt mạng rồi F5 | Có UI, 60 ảnh SKU, không lỗi tải file | Not Tested |
| C02 | Kiểm tra ở 1920, 1366, 768, 390 px | Không chồng chữ/tràn ngang toàn trang; bảng cuộn riêng | Not Tested |
| C03 | Chờ 30 giây ở trang chủ, đưa chuột ra ngoài hero | Đủ 5 banner, trở về banner đầu | Not Tested |
| C04 | Nhấn trước/sau/chấm/dừng/chạy, hover và focus hero | Chuyển đúng; dừng khi thao tác; reduced motion tắt auto ban đầu | Not Tested |
| C05 | Nhấn 5 danh mục, 5 bộ sưu tập và CTA | Mở đúng tập dữ liệu, liên kết không rỗng | Not Tested |
| C06 | Tìm “solene”, “nhan”; kết hợp Nhẫn và 14–19 triệu | 1 kết quả với solene; có Ondine/Rosée và các mẫu mới thỏa bộ lọc | Not Tested |
| C07 | Mở catalog, trang 2; thử từ khóa không tồn tại và giá đảo | Tập sản phẩm đổi; empty/error đúng | Not Tested |
| C08 | Mở sản phẩm, chọn size, số lượng, phóng to | Thông tin và ảnh đúng, dialog đóng được với X/Escape | Not Tested |
| C09 | Đăng ký dữ liệu sai/đúng/trùng; đăng nhập sai/khóa | Chặn dữ liệu sai; đúng hiện tên người dùng | Not Tested |
| C10 | Thêm 2 sản phẩm, đổi số lượng, xóa; thử vượt kho | Tổng chính xác, cập nhật badge, thông báo lỗi đúng | Not Tested |
| C11 | Checkout khi chưa login | Yêu cầu login rồi trở về checkout | Not Tested |
| C12 | Chọn địa chỉ tài khoản rồi nhập địa chỉ mới | Điền đúng hoặc xóa để nhập mới; lưu đúng người nhận | Not Tested |
| C13 | Đặt 1 đơn tiền mặt và 1 đơn trực tuyến | Tạo 2 mã riêng, không báo ngân hàng đã thu tiền | Not Tested |
| C14 | Xem lịch sử và chi tiết; login khách khác | Đúng nhóm đơn, không xem được đơn của người khác | Not Tested |
| C15 | Admin login URL riêng rồi logout | Đúng vai trò; logout chặn màn hình quản trị | Not Tested |
| C16 | Admin thêm/sửa/khóa/mở khách hàng | Dữ liệu cập nhật; user bị khóa không login/checkout | Not Tested |
| C17 | Thêm sản phẩm với PNG/JPEG/WebP, file sai, file >8 MB | Preview trước khi lưu; chặn sai; sản phẩm mới xuất hiện storefront | Not Tested |
| C18 | Sửa sản phẩm | Có ảnh và phân loại hiện tại; lưu đúng thông tin mới | Not Tested |
| C19 | Xóa Solène; xóa Ginkgo rồi chọn giữ lại/xác nhận | Solène chỉ ẩn, lịch sử giữ nguyên; Ginkgo chỉ xóa sau xác nhận | Not Tested |
| C20 | Xác nhận/giao/hủy đơn; thử quay về trước | Chỉ chuyển xuôi, terminal không có nút đổi; hủy hoàn kho | Not Tested |
| C21 | Lọc pending + ngày 03/10/2026 + “Ba Dinh” | LM1003, kết quả kết hợp cả ba điều kiện | Not Tested |
| C22 | Top 5 01–12/10/2026; nhấn đơn; lọc năm 2027 | Giảm dần, có link chi tiết, bỏ đơn hủy; năm 2027 trống | Not Tested |
| C23 | Sửa giá SKU đã có đơn rồi xem lại đơn | Giá lịch sử không đổi | Not Tested |
| C24 | Tab bàn phím, focus, màn hình mobile, menu, các form | Nhãn đọc được, không mắc kẹt focus, nút trong viewport | Not Tested |
| C25 | DevTools Console khi thực hiện C01–C24 | Không lỗi JavaScript nghiêm trọng | Not Tested |
| C26 | F5 sau khi tạo đơn và sửa sản phẩm | Trở về 12 đơn mẫu/60 SKU; mất dữ liệu phát sinh đúng thiết kế | Not Tested |

## Lỗi đã phát hiện và sửa qua rà soát

- Chuẩn hóa chữ Đ viết hoa trước khi bỏ dấu để tìm kiếm không dấu đúng.
- Lọc ngày dùng ngày địa phương của trình duyệt, tránh lệch ngày giữa hiển thị và lọc.
- Checkout kiểm tra lại size còn thuộc sản phẩm sau khi Admin đổi phân loại.
- Danh mục có ảnh dự phòng cục bộ khi tất cả sản phẩm thuộc nhóm bị xóa.
- Khóa nút lưu khi đang đọc ảnh upload; tránh lưu trước khi preview sẵn sàng.
- Liên kết bỏ qua điều hướng chuyển focus vào main, không thay hash route.
- Bán chạy được xếp từ số lượng trong đơn không hủy, không dùng thứ hạng trang trí cố định.

Các thay đổi này đã nằm trong mã nguồn bàn giao. Chưa có vòng kiểm tra screenshot để khẳng định layout hoàn hảo.
