const cors = require('cors');

// Cho phép nhiều origin, phân cách bằng dấu phẩy trong .env
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép requests không có origin (vd: Postman, cùng origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Tạm cho phép tất cả - sửa thành callback(new Error('Not allowed by CORS')) nếu cần hạn chế
    }
  },
  credentials: true, // Cho phép gửi cookies / Authorization header
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400, // Cache preflight 24h
};

module.exports = cors(corsOptions);
