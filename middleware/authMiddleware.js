const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_COOKIE_NAME } = require('../config/jwt');

/**
 * Lấy JWT token từ nhiều nguồn (ưu tiên theo thứ tự):
 * 1. Authorization: Bearer <token>
 * 2. Cookie (httpOnly)
 * 3. Query string ?token=xxx
 */
function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  const cookieToken = req.cookies?.[JWT_COOKIE_NAME];
  if (cookieToken) return cookieToken;
  const queryToken = req.query?.token;
  if (queryToken) return queryToken;
  return null;
}

module.exports = function (req, res, next) {
  const token = extractToken(req);

  if (!token) {
    if (req.accepts('html')) {
      return res.redirect('/auth/login?error=Vui lòng đăng nhập&redirect=' + encodeURIComponent(req.originalUrl));
    }
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (req.accepts('html')) {
      return res.redirect('/auth/login?error=Phiên đăng nhập hết hạn&redirect=' + encodeURIComponent(req.originalUrl));
    }
    const status = err.name === 'TokenExpiredError' ? 401 : 401;
    return res.status(status).json({ message: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token' });
  }
};
