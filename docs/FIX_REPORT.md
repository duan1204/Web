# Báo cáo sửa trực tiếp bản RAR — 22/10/2026

Bản gốc được giữ làm checkpoint trước sửa. Mã ứng dụng sửa: js/store.js, js/app.js, css/main.css. index.html và 65 ảnh giữ nguyên byte. Bổ sung/điều chỉnh bộ kiểm thử và tài liệu; không thay framework hay cấu trúc storefront.

| Vấn đề | Nguyên nhân | Cách sửa | Kiểm thử đã chạy | UI đầy đủ |
|---|---|---|---|---|
| 1. Nút mua không chạy | input name=id che form.id; switch không khớp | getAttribute('id'), kiểm tra buyer và lựa chọn | Pass: VM submit với form.id bị che; Chrome nút khách chưa login | Not Tested khi đã login |
| 2. Giỏ/Mua ngay | Giỏ chung RAM; Mua ngay thêm vào cùng giỏ rồi checkout tất cả | carts theo user ID; checkout riêng chế độ buy-now; ghi localStorage | Pass: merge, tồn kho, tổng tiền, checkout riêng, reload bằng adapter | Not Tested E2E |
| 3. Trái tim | Chi tiết thiếu active; fill/stroke chưa đồng bộ | active và aria-pressed theo favorites; SVG #111111 | Pass: HTML trạng thái cả detail/card; kiểm tra CSS | Not Tested màu trên UI đã login |
| 4. Popup | Popup cũ xuất hiện sau khi đã thêm | pending selection; chỉ xác nhận mới thêm; consume pending chống double-click | Pass: VM hủy không thêm, xác nhận thêm đúng một lần | Not Tested UI đã login |
| 5. Hồ sơ | Chưa có form và hàm sửa của buyer | Form prefill; whitelist trường; kiểm tra email/phone/address; giữ ID/role | Pass: đổi email, reload, không sửa nhầm user | Not Tested UI đã login |
| 6. Tách yêu thích | Một mảng global dùng cho mọi buyer | favorites[userId]; logout chỉ xóa phiên; reload đúng user | Pass: A có 1/2, B có 3; xóa của A không ảnh hưởng B; tài khoản mới rỗng | Not Tested E2E |
| 7. Hủy đơn | Chỉ có transition của Admin | cancelOrder kiểm tra owner+pending, popup xác nhận, hoàn kho một lần | Pass: owner sai, confirmed, lặp hủy, Admin và Top5 cùng nguồn | Not Tested UI đã login |
| 8. Sidebar | margin-top:auto đẩy nút xuống cuối cột theo chiều cao nội dung | chiều cao viewport, sticky, scroll riêng, margin 12px; mobile xếp dọc | Kiểm tra mã bố cục hoàn tất | Not Tested sidebar/multi-size |

Ngoài ra bỏ @import Google Fonts để không cần tải mạng; giữ font dự phòng Georgia/Arial. Đã phát hiện và sửa lỗi CSS phát sinh khi bỏ import, sau đó quan sát lại screenshot Chrome: màu emerald, typography và CTA hiển thị bình thường.

## Kiểm thử hồi quy thực tế

- Node: 33 kiểm thử nghiệp vụ cũ được cập nhật điều kiện cần đăng nhập; memory-only test dùng adapter null rõ ràng.
- Node: 11 kịch bản sửa lỗi gồm dữ liệu A/B, tài khoản mới, nạp lại, mua ngay, hồ sơ, hủy, quota rollback và dữ liệu JSON hỏng.
- Node VM: 105 lượt tạo HTML; 65 đường dẫn ảnh tồn tại. Event simulation kiểm tra submit bị shadow, popup, double-click, mua ngay, markup tim, hồ sơ và hủy đơn.
- Chrome preview HTTP: trang chủ và sản phẩm hiển thị; screenshot trang chủ được xem trực tiếp; nhấn thêm giỏ khi chưa login mở login. 33 test logic browser đạt. Test localStorage ghi → reload → đọc đạt. Lỗi console quan sát thấy thuộc extension, không phải mã ứng dụng.
- Not Tested: file:// và offline thực tế, UI đã đăng nhập khách/Admin, upload ảnh, resize 390/768/1920, carousel đủ vòng và tương tác toàn bộ menu. Không suy diễn Pass từ Node sang trình duyệt.

## Checklist nghiệm thu file://

1. Mở index.html, đăng nhập A, lưu yêu thích 1/2 và thêm giỏ 1. Hủy popup lần đầu, xác nhận lần sau.
2. Đăng xuất, đăng ký/đăng nhập B: giỏ và yêu thích rỗng. Lưu 3. Quay lại A vẫn 1/2; bỏ 1; B vẫn 3.
3. F5, đăng nhập lại: dữ liệu riêng giữ nguyên. Sửa hồ sơ, F5 và đăng nhập email mới.
4. Giữ một món trong giỏ, mua ngay món khác, đặt đơn: đơn chỉ có món mua ngay; giỏ cũ còn.
5. Hủy đơn pending: popup Quay lại không đổi; Xác nhận hủy chuyển Đã hủy. Admin thấy cùng trạng thái. Không hủy đơn confirmed/delivered.
6. Admin sửa sản phẩm/người dùng; upload preview; xác nhận/giao đơn; Top5; hai nút sidebar dễ tiếp cận khi danh sách dài.
7. Kiểm tra banner/menu/tìm kiếm/phân trang/ảnh, Chrome Console và các chiều rộng màn hình.

Dữ liệu cục bộ không đồng bộ máy khác; mở nhiều tab đồng thời có thể có giới hạn cạnh tranh ghi của localStorage. Ứng dụng nghe storage event để nạp lại dữ liệu tab khác, nhưng không tuyên bố cơ chế giao dịch máy chủ.
