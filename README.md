# Giới thiệu/Quy mô:

-Trang website về bảo vệ môi trường cho phép người dùng mua bán, trao đổi các sản phẩm thân thiện với môi trường. Người dùng có thể đăng tải các bài viết như một mạng xã hội nhằm cung cấp thông tin và kêu gọi cộng đồng bảo vệ môi trường.

# User case:

1. Home
2. Products
3. Blogs
4. About
5. Account

# Tính năng:

1. Đăng ký / đăng nhập tài khoản
2. Đặt / sửa / xóa đơn hàng
3. Tìm kiếm
4. Đăng bán
5. Đăng blog

# Models:

1. User (id, username, password, email, phone,…)
2. Product (id, name, cost, description, detail, create_at, imageUrl, rate, remain, id_user)
3. Oder (id, note, id_product, id_buyer, address, phone)
4. Blog (id, description, detail, videos, images)

# Quản lý source:

- Git & Github

# Client:

- React Js, bootstrap, …

# Server:

- Node Js.
- Database: MongoDB

# Configuration

1. Install Node Js, npm, mongodb (connected)
2. Install dependencies in folder:

- Client: npm install
- Server: npm install

3. Run: (At root folder)

- Client: cd ./client; npm start
- Server: cd ./server; npm start

4. Access: <a href='http://localhost:3000'>http://localhost:3000</a>
