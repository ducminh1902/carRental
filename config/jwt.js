const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_a_real_secret_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'token';
const JWT_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 giờ (ms)

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_COOKIE_NAME,
  JWT_COOKIE_MAX_AGE,
};
