// middleware.js

function checkAuthentication(req, res, next) {
  if (req.session && req.session.user && req.session.cookie.expires > new Date()) {
    // Phiên đăng nhập hợp lệ
    next();
  } else {
    // Phiên đăng nhập đã hết hạn hoặc không tồn tại
    res.redirect('https://binhdongfactorygapp.vercel.app/'); // Chuyển hướng người dùng đến trang đăng nhập
  }
}

module.exports = {
  checkAuthentication: checkAuthentication
};
