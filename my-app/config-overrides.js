// Đây là hàm ghi đè cấu hình Webpack cho dự án React
// Hàm này thêm cấu hình fallback để thay thế module http bằng stream-http

module.exports = function override(config) {
  // Thêm polyfill cho module http
  config.resolve.fallback = {
    ...config.resolve.fallback, // Giữ lại các fallback hiện tại (nếu có)
    http: require.resolve("stream-http"), // Thay thế http bằng stream-http
  };

  return config; // Trả về cấu hình đã được sửa đổi
};
