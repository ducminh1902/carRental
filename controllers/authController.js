const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN, JWT_COOKIE_NAME, JWT_COOKIE_MAX_AGE } = require('../config/jwt');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    if (req.accepts('html')) {
      return res.redirect('/auth/register?error=Bạn phải nhập tên và mật khẩu');
    }
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const existing = await User.findOne({ username });
    if (existing) {
      if (req.accepts('html')) {
        return res.redirect('/auth/register?error=Tên đăng nhập đã tồn tại');
      }
      return res.status(400).json({ message: 'Username already taken' });
    }

    const user = new User({ username, password });
    await user.save();
    if (req.accepts('html')) {
      return res.redirect('/auth/login?success=Đăng ký thành công, xin mời đăng nhập');
    }
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    if (req.accepts('html')) {
      return res.redirect('/auth/register?error=Lỗi máy chủ');
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    if (req.accepts('html')) {
      return res.redirect('/auth/login?error=Bạn phải nhập tên và mật khẩu');
    }
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      if (req.accepts('html')) {
        return res.redirect('/auth/login?error=Tài khoản không tồn tại');
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      if (req.accepts('html')) {
        return res.redirect('/auth/login?error=Mật khẩu không đúng');
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    if (req.accepts('html')) {
      res.cookie(JWT_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: JWT_COOKIE_MAX_AGE,
      });
      const redirectTo = req.body.redirect || req.query.redirect || '/';
      // Chỉ thêm token vào URL khi về trang chủ (để hiển thị), không thêm khi redirect đến trang khác (bảo mật)
      if (redirectTo === '/' || redirectTo.startsWith('/?')) {
        return res.redirect('/?token=' + token);
      }
      return res.redirect(redirectTo);
    }

    res.json({ token });
  } catch (err) {
    console.error(err);
    if (req.accepts('html')) {
      return res.redirect('/auth/login?error=Lỗi máy chủ');
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie(JWT_COOKIE_NAME);
  if (req.accepts('html')) {
    return res.redirect('/auth/login?success=Đã đăng xuất');
  }
  res.json({ message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
