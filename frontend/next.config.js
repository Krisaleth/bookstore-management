/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Cho phép Next.js hiểu các domain chứa ảnh của bạn
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // BẮT BUỘC: Thêm domain localhost để hiển thị ảnh khi chạy dev/docker
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
      // BẮT BUỘC: Thêm tên service của backend trong Docker mạng nội bộ
      {
        protocol: 'http',
        hostname: 'bookstore-api',
        port: '8080',
        pathname: '/**',
      },
    ],
  },
  // Giúp Next.js đóng gói gọn nhẹ hơn khi chạy Docker (nếu dùng bản mới)
  output: 'standalone', 
}

module.exports = nextConfig