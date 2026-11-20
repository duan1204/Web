# LUMIÈRE JEWELRY — Bản sửa 8 vấn đề, 22/10/2026

Giải nén toàn bộ ZIP rồi mở index.html bằng Chrome. Không cần Internet, Node, XAMPP, backend hoặc CSDL. Sửa trên chính bản RAR người dùng gửi; giữ nguyên 60 ảnh SKU, 5 banner và nội dung thương hiệu.

## Tài khoản mẫu

- Khách hàng: khach@lumiere.vn / Lumiere123.
- Khách khác: khach2@lumiere.vn đến khach5@lumiere.vn / Lumiere123.
- Admin: admin@lumiere.vn / Admin123; vào liên kết Quản trị cửa hàng ở chân trang.
- khach6@lumiere.vn đang bị khóa như dữ liệu gốc.

## Cách dùng

Đăng nhập, chọn sản phẩm, size và số lượng. Thêm vào giỏ mở popup xác nhận trước khi ghi dữ liệu. Hủy popup không thêm. Mua ngay chuyển sang checkout của đúng sản phẩm vừa chọn, giữ nguyên giỏ hiện có. Đặt hàng từ giỏ sẽ làm trống giỏ sau thành công. Thanh toán chỉ mô phỏng.

Trái tim đã chọn tô đen. Giỏ và yêu thích tách theo ID tài khoản; đăng xuất không xóa dữ liệu. Tài khoản → Chỉnh sửa hồ sơ cho phép sửa tên/email/điện thoại/địa chỉ. Đổi email sẽ dùng email mới khi đăng nhập; ID và quyền không đổi.

Lịch sử mua hàng → Xem chi tiết → Hủy đơn hàng chỉ có ở đơn Chưa xác nhận của chính khách hàng. Xác nhận hủy hoàn kho một lần. Admin đọc cùng nguồn đơn hàng và thống kê bỏ đơn hủy.

Hai nút Về cửa hàng/Đăng xuất nằm sau nhóm chức năng trong sidebar; desktop sidebar sticky và cuộn riêng. Màn hình nhỏ dùng bố cục xếp dọc.

## Dữ liệu cục bộ

Nguồn chính localStorage: lumiere_state_v2, version 2. Chứa users/products/orders chung và carts/favorites được đánh chỉ mục bằng user ID. Một lần ghi JSON giúp đơn hàng và tồn kho được lưu cùng nhau. Không lưu trạng thái đăng nhập; tải lại trang cần đăng nhập lại nhưng dữ liệu vẫn còn nếu quyền lưu trữ cho phép.

Bản RAR gốc chỉ dùng RAM, không có localStorage cũ để chuyển đổi. Giữ nguyên tài khoản và đơn demo. Không tự gán mảng yêu thích không rõ chủ cho bất kỳ ai; không đọc/xóa các khóa legacy không xác định. Dữ liệu RAM ở tab cũ không nằm trong file RAR nên không thể phục hồi từ gói này.

localStorage chỉ thuộc trình duyệt/profile/đường dẫn môi trường hiện tại; không đồng bộ giữa máy. Đổi vị trí file hoặc chế độ riêng tư có thể tạo vùng lưu khác. Frontend không có bảo mật máy chủ. Không dùng mật khẩu thật. Nếu hết quota hoặc bị chặn, thao tác báo lỗi và hoàn nguyên thay đổi trong RAM, không báo lưu thành công giả.

Để kiểm tra trên máy chấm: mở tests/storage.html bằng file://, nhấn Ghi dữ liệu thử rồi Tải lại và kiểm tra. Sau đó kiểm tra giỏ/yêu thích/hồ sơ qua đăng xuất/đăng nhập và F5. Nếu FAIL, dùng Chrome profile thường, cho phép lưu dữ liệu và giữ nguyên đường dẫn dự án; không chuyển sang backend. Không bảo đảm file:// lưu được trên mọi cấu hình Chrome.

## Kết quả kiểm thử

Xem docs/FIX_REPORT.md và docs/TEST_RESULTS.txt. 33 test nghiệp vụ, 11 kịch bản sửa lỗi, 105 lượt render HTML và mô phỏng event delegation đã đạt trên Node. Chrome preview chạy 33 test logic đạt, xem được trang chủ/sản phẩm, nút thêm giỏ khi chưa đăng nhập chuyển đúng trang login, phép thử lưu trữ qua reload đạt.

Chưa nghiệm thu end-to-end các thao tác khách/Admin đã đăng nhập, upload ảnh, responsive nhiều kích thước và file://. Không đánh dấu các ca đó Pass. Chrome tự động bị giới hạn nhập thông tin đăng nhập; kiểm thử các hàm và trình xử lý được thực hiện độc lập trong Node VM.

Mở tests/index.html để chạy logic trên Chrome. Nếu có Node, chạy các file tests/store.test.cjs, tests/repairs.test.cjs, tests/templates.test.cjs, tests/events.test.cjs. Không cần Node để sử dụng website.

Tài liệu docs/history_20261021 là lịch sử trước sửa, có quy tắc RAM/reset cũ đã hết hiệu lực. Yêu cầu hiện hành do giảng viên xác nhận: web tĩnh, không CSDL; localStorage được phép. Không còn yêu cầu bổ sung backend.
