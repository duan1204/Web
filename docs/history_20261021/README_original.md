# LUMIÈRE JEWELRY — Timeless Elegance

Website đồ án HTML/CSS/JavaScript thuần. Mã nguồn, 60 ảnh sản phẩm riêng và 5 banner AI đã được đóng gói đầy đủ. Không cần Internet, Node.js, XAMPP hoặc cài thư viện để sử dụng.

## Mở website

1. Giải nén toàn bộ ZIP (không mở index.html ngay bên trong trình xem ZIP).
2. Mở thư mục `LUMIERE_JEWELRY_WEB_PROJECT`.
3. Nhấp phải `index.html` → Open with → Google Chrome.
4. Dùng liên kết trong website để chuyển màn hình. Không mở tab mới để kiểm tra dữ liệu chung.

Mọi tài nguyên dùng đường dẫn tương đối. Giữ nguyên các thư mục `assets`, `css` và `js` cạnh `index.html`.

## Tài khoản trình diễn

| Vai trò | Email | Mật khẩu | Đường dẫn sau index.html |
|---|---|---|---|
| Khách hàng | khach@lumiere.vn | Lumiere123 | #/login |
| Quản trị | admin@lumiere.vn | Admin123 | #/admin/login |
| Khách hàng khác | khach2@lumiere.vn đến khach5@lumiere.vn | Lumiere123 | #/login |
| Tài khoản khóa | khach6@lumiere.vn | Lumiere123 | #/login |

Nhấn “Quản trị cửa hàng” ở chân trang để vào Admin. Nhấn “Về cửa hàng” trong Admin để kiểm tra thay đổi trong cùng phiên.

## Luồng kiểm tra nhanh

- Tìm `nhan`, chọn “Nhẫn”, giá 14.000.000–19.000.000: có Ondine và Rosée.
- Mở tất cả trang sức, chuyển trang 1 → 2: 8 rồi 8 sản phẩm (trang 8 có 4), hai tập khác nhau.
- Chọn size, thêm giỏ, tăng/giảm số lượng, đăng nhập, chọn địa chỉ, đặt hàng và xem lịch sử.
- Đăng nhập Admin trong cùng tab: đơn mới xuất hiện. Chuyển “Chưa xác nhận” → “Đã xác nhận” → “Đã giao thành công”.
- Admin: xóa Solène (đã có đơn) sẽ ẩn; xóa Ginkgo (chưa có đơn ở dữ liệu mẫu) sẽ hỏi xác nhận.
- Vào Top 5, chọn 01/10/2026–12/10/2026; nhấn liên kết đơn để xem chi tiết.
- Tải lại trang để bắt đầu phiên trình diễn mới.

## Phạm vi đã tạo

Cửa hàng gồm trang chủ, 5 bộ sưu tập, 5 danh mục, tìm kiếm kết hợp khoảng giá, phân trang, chi tiết và phóng to ảnh, yêu thích, đăng ký/đăng nhập, giỏ hàng, checkout, lịch sử và chi tiết đơn, trang thương hiệu, chính sách và hướng dẫn size.

Admin gồm tổng quan tính từ dữ liệu, thêm/sửa/khóa khách hàng, thêm/sửa sản phẩm có ảnh xem trước, xóa/ẩn theo lịch sử đơn, hiện lại sản phẩm, lọc đơn, cập nhật trạng thái xuôi, thống kê Top 5 và liên kết chi tiết đơn.

Banner tự chuyển 5 giây, có trước/sau/chấm chọn/dừng, tạm dừng khi trỏ chuột hoặc focus và không tự chạy khi hệ điều hành yêu cầu giảm chuyển động.

## Kiểm thử và giới hạn thực tế

- 33 kiểm thử nghiệp vụ Node: **Pass**.
- 105 lần tạo HTML màn hình trong Node VM: **Pass**; đây không phải kiểm thử DOM hay trình duyệt.
- 65 ảnh tồn tại, giải mã được và không trùng hash; đã xem trực tiếp từng ảnh.
- Kiểm tra cú pháp JavaScript: **Pass**.
- **Chưa kiểm thử trực tiếp trong Chrome, file://, offline và các độ rộng màn hình.** Đã thử mở bản preview bằng công cụ Chrome ngày 21/10/2026 nhưng bị timeout; chưa có bằng chứng kiểm thử trình duyệt. Không có screenshot thực tế để bàn giao. Xem checklist `docs/TEST_CASES.md`.

Website được thiết kế để mở file trực tiếp: script thường, không module import, không fetch JSON, không CDN, không font tải mạng. Tuy nhiên chưa xác nhận bằng Chrome thực tế trong môi trường tạo sản phẩm.

Dữ liệu chỉ ở bộ nhớ JavaScript, mất khi F5/đóng tab. Không có CSDL thật, localStorage, sessionStorage, IndexedDB hoặc cookie. Phiên ở các tab không đồng bộ. Tài khoản và phân quyền phía client chỉ phục vụ đồ án, không bảo mật như hệ thống thật. Không nhập mật khẩu thật. Không có giao dịch ngân hàng, gửi email hoặc giao hàng thật.

Câu CSDL và tổng điểm trong biên bản gốc có bất nhất; xem `docs/RUBRIC_COMPLIANCE_MATRIX.md`. Bản này không tuyên bố đáp ứng yêu cầu CSDL thật nếu giảng viên xác nhận bắt buộc.

Mỗi sản phẩm có một ảnh chính và khả năng phóng to, chưa có bộ ảnh nhiều góc. Banner là ảnh chiến dịch, có thể khác chi tiết với ảnh catalog; không quảng bá như ảnh chính xác của một SKU. Bộ sưu tập dùng lại ảnh chiến dịch tương ứng; các SKU không dùng chung ảnh.

## Cấu trúc và kiểm thử dành cho người đọc code

- `index.html`: điểm vào duy nhất.
- `css/main.css`: hệ thống giao diện và responsive.
- `js/store.js`: dữ liệu mẫu, repository trong bộ nhớ và nghiệp vụ.
- `js/app.js`: tạo HTML, hash routing và xử lý tương tác.
- `assets/products/`: 60 ảnh độc lập.
- `assets/banners/`: 5 chiến dịch độc lập.
- `docs/`: rubric, kiểm thử, thiết kế, kiểm kê hình ảnh, hướng dẫn bảo vệ.
- `tests/`: kiểm thử nghiệp vụ và tạo HTML bằng Node; không cần chạy để sử dụng website.

Bạn có thể mở `tests/index.html` bằng Chrome để tự chạy bộ test logic (không cần cài thêm). Trang này không thay thế kiểm tra giao diện.

Nếu đã có Node.js, có thể chạy:

```bash
node tests/store.test.cjs
node tests/templates.test.cjs
```

Không cần cài thêm package. Kết quả thực tế lúc bàn giao nằm ở `docs/TEST_RESULTS.txt`.
