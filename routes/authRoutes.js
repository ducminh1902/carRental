const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

// render forms
router.get('/register', (req, res) => {
  res.render('auth/register', {
    success: req.query.success || null,
    error: req.query.error || null
  });
});
router.get('/login', (req, res) => {
  res.render('auth/login', {
    success: req.query.success || null,
    error: req.query.error || null,
    token: req.query.token || null,
    redirect: req.query.redirect || null
  });
});

// POST /auth/register
router.post('/register', register);

// POST /auth/login
router.post('/login', login);

// POST /auth/logout
router.post('/logout', logout);
router.get('/logout', logout);

// GET /auth/me - Lấy thông tin user đang đăng nhập (cần token)
router.get('/me', auth, getMe);

module.exports = router;
