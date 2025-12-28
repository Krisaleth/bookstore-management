# 📚 ĐỒ ÁN HỆ THỐNG QUẢN LÝ NHÀ SÁCH (BOOKSTORE MANAGEMENT SYSTEM)

Dự án là một hệ thống Full-stack hoàn chỉnh, cho phép người dùng tìm kiếm, đặt mua sách và quản trị viên quản lý kho hàng, đơn hàng. Hệ thống được đóng gói bằng Docker để đảm bảo tính nhất quán trên mọi môi trường.

---

## 1. PHÂN TÍCH THIẾT KẾ CƠ SỞ DỮ LIỆU (DATABASE DESIGN)

Hệ thống sử dụng cơ sở dữ liệu quan hệ **MySQL 8.0** với các thực thể chính:

* **Users**: Lưu trữ thông tin người dùng, mật khẩu đã mã hóa (BCrypt) và phân quyền (Admin/User).
* **Books**: Lưu trữ thông tin sách, ISBN, giá, số lượng tồn kho và đường dẫn ảnh bìa.
* **Authors & Categories**: Thông tin tác giả và thể loại (Quan hệ Nhiều-Nhiều với Books).
* **Orders & OrderItems**: Lưu trữ thông tin đơn hàng. `OrderItem` đóng vai trò lưu lại giá sách tại thời điểm mua (Snapshot) để đối soát hóa đơn về sau.



---

## 2. CẤU TRÚC TRANG (SITE MAP)

Hệ thống được thiết kế với luồng trải nghiệm người dùng tối ưu qua các phân hệ:

### 2.1. Phân hệ Khách hàng (Client Facing)
* **Trang chủ (Home)**: Hiển thị các sách mới nhất, sách tiêu biểu.
* **Danh mục & Tìm kiếm**: Lọc sách theo thể loại, tác giả hoặc tìm kiếm theo từ khóa.
* **Chi tiết sách**: Hiển thị mô tả nội dung, giá và trạng thái còn hàng/hết hàng.
* **Giỏ hàng (Cart)**: Quản lý danh sách sách chờ đặt mua.
* **Thanh toán (Checkout)**: Nhập thông tin nhận hàng và xác nhận đơn đơn.
* **Đăng nhập/Đăng ký**: Quản lý tài khoản cá nhân.

### 2.2. Phân hệ Quản trị (Admin Dashboard)
* **Quản lý Sách**: Thêm mới sách (kèm upload ảnh), cập nhật thông tin và số lượng tồn.
* **Quản lý Danh mục/Tác giả**: CRUD các thực thể liên quan.
* **Quản lý Đơn hàng**: Xem danh sách đơn hàng toàn hệ thống và cập nhật trạng thái (Chờ xử lý -> Đang giao -> Đã giao).



---

## 3. GIẢI THUẬT CỐT LÕI (CORE ALGORITHMS)

* **Xử lý Thanh toán & Tồn kho**: Khi một đơn hàng được tạo, hệ thống thực hiện kiểm tra số lượng tồn (`stock`). Nếu đủ, đơn hàng được tạo và số lượng `stock` sẽ được trừ tương ứng trong một **Database Transaction** để đảm bảo tính nhất quán.
* **Xác thực JWT**: Frontend gửi thông tin đăng nhập, Backend kiểm tra và trả về một **JSON Web Token**. Token này được lưu ở Cookie và gửi kèm trong header `Authorization` ở các request sau để xác thực quyền truy cập.
* **Snapshot Giá**: Giá sách trong `OrderItem` được lưu cố định lúc mua. Điều này đảm bảo khi Admin thay đổi giá sách ở bảng `Books`, doanh thu của các đơn hàng cũ trong quá khứ không bị thay đổi theo.



---

## 4. HƯỚNG DẪN CÀI ĐẶT & CHẠY (DOCKER - KHUYÊN DÙNG)

Đây là cách nhanh nhất để chạy toàn bộ hệ thống mà không cần cài đặt Java hay Node.js trên máy.

### Yêu cầu
* **Docker** và **Docker Desktop** đã được cài đặt.

### Các bước thực hiện

**1. Clone dự án:**
```bash
git clone https://github.com/Krisaleth/bookstore-management.git
cd bookstore-project

**2. Khởi chạy hệ thống: Tại thư mục gốc (nơi chứa file docker-compose.yml), chạy lệnh:**
```bash
docker-compose up --build -d
```

**3. Kiểm tra kết quả:**

- Frontend UI: http://localhost:3000

- Backend API: http://localhost:8080/api

## 5. KẾT LUẬN & HƯỚNG PHÁT TRIỂN
### Kết luận

Dự án đã xây dựng thành công một hệ thống quản lý nhà sách hiện đại, đáp ứng tốt các yêu cầu về nghiệp vụ thương mại điện tử cơ bản. Việc sử dụng Docker giúp dự án dễ dàng triển khai (Deploy) lên bất kỳ hệ thống Server nào một cách nhanh chóng.
Hướng phát triển

   - Tích hợp thanh toán trực tuyến qua các cổng VNPay, PayPal.

   - Phát triển thêm hệ thống gợi ý sách (Recommendation System) dựa trên lịch sử mua hàng.

   - Tối ưu hóa tìm kiếm với Elasticsearch để hỗ trợ tìm kiếm theo nội dung sách.