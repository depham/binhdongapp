const { request } = require('http');
var path = require('path');
const db = require('../common/connect');

exports.home = function(req, res){
    res.render('login');
}

exports.about = function(req, res){
    res.send("Hello About");
}

exports.show = function(req, res){
    res.sendFile(path.join(__dirname, '../public', 'home.html'));
}

exports.login = function(req, res){

    var user_address = req.body.user_address;
    var user_password = req.body.user_password;

    if (user_address && user_password) {
        // Truy vấn kiểm tra tên đăng nhập và mật khẩu
        const query = `SELECT * FROM userlogin WHERE user_address = '${user_address}' AND user_password = '${user_password}'`;
        db.query(query, (error, results) => {
          if (error) {
            console.error('Lỗi truy vấn: ' + error.stack);
            res.sendStatus(500);
            return;
          }
    
          if (results.length === 1) {
            // Đăng nhập thành công
            req.session.user = { 
                username: user_address
             };
            res.json({ success: true });
          } else {
            // Đăng nhập không thành công
            res.send('Tên đăng nhập hoặc mật khẩu không đúng.');
          }
        });
    }
}

