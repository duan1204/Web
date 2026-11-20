# Design system & phân tích ảnh tham khảo

## Nguồn đã xem

Đã đọc trực tiếp 6 PNG đính kèm (khác với mô tả “5 ảnh”). Các ảnh hiển thị PNJ: banner quảng cáo toàn vùng, danh mục ảnh, khu vực sản phẩm, chiến dịch cưới, hai lưới sản phẩm. Không gán các ảnh này là giao diện SJC khi không có bằng chứng logo SJC.

| Ảnh tham khảo | Quan sát | Quyết định LUMIÈRE |
|---|---|---|
| 084010 | Header có tìm kiếm, tài khoản, giỏ; hero lớn, chỉ báo; lợi ích ngay sau hero | Header ba vùng; 5 hero ảnh riêng, chữ HTML và điều khiển; dải dịch vụ |
| 084017 | Danh mục ảnh dễ nhận diện, nhãn dưới ảnh; thương hiệu/bộ sưu tập nổi bật | 5 danh mục ảnh; bộ sưu tập 5 cá tính; không sao chép logo hoặc thương hiệu phụ |
| 084027 | Sản phẩm mới/bán chạy và chiến dịch xen kẽ | Khu mới, bán chạy tính theo đơn không hủy, editorial cưới, bộ sưu tập |
| 084046 | Banner cưới và lọc danh mục/thuộc tính | Eternal Love và bộ lọc tên + phân loại + khoảng giá + sắp xếp |
| 084056 | Lưới sản phẩm nền sáng, kiểu nhẫn khác nhau, giá rõ | Desktop 4 cột; nhẫn solitaire, vàng sóng, bypass hồng, Art Déco, hai cặp cưới khác nhau |
| 084107 | Ảnh toàn món trang sức, nhẫn và dây chuyền khác cấu trúc | Ảnh catalog riêng, object-fit contain; tên, vật liệu và giá tách bậc |

## Bản sắc

Màu ivory #FAF8F4, emerald #193B32, champagne #A58448 cho chữ giá/điểm nhấn, charcoal #23201D, đường phân cách #E4DFD6. Bố cục dùng khoảng trắng vừa đủ, đường viền mảnh và hình ảnh làm trọng tâm. Không dùng logo, slogan hay ảnh cắt từ website PNJ/SJC.

Tiêu đề Georgia/Times New Roman; nội dung Arial/Helvetica. Dùng font hệ thống để không cần tải mạng. UTF-8 khai báo trong index.html. Hình dáng chữ có thể khác nhẹ giữa hệ điều hành.

Kích thước: tiêu đề chính desktop 48–68 px, mobile 32–45 px; tiêu đề khối 27–34 px; nội dung 12–14 px. Lưới 4 cột desktop, 2 cột từ 800 px. Các breakpoint 1600, 1100, 800 và 520 px; cần kiểm tra thực tế tại 1920/1366/768/390.

## Tương tác và trợ năng

Nút có focus rõ, biểu mẫu có nhãn, toast aria-live, dialog nguyên bản, ảnh có alt, slide không hiện có aria-hidden và inert. Slider hỗ trợ 5 giây, vòng lặp, chọn trực tiếp, trước/sau, dừng/chạy. Reduced motion tắt tự động chạy ở lần khởi tạo, tắt transition CSS. Người dùng vẫn có thể chủ động bật bằng nút chạy.

Menu mobile mở/đóng; bảng Admin cuộn trong vùng bảng. CTA dẫn đến danh mục/bộ sưu tập thật. Các trạng thái trống/lỗi/hết hàng/đã thêm thành công đều có giao diện.

## Giới hạn QA

Đã xem trực tiếp toàn bộ ảnh và kiểm tra tạo HTML, chưa xem trang được render bằng Chrome. Không coi các breakpoint hoặc kiểm tra source là bằng chứng giao diện không tràn ngang. Chưa kiểm tra screen reader, độ tương phản bằng công cụ, layout screenshot hay tương tác bàn phím end-to-end.
