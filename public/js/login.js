document.addEventListener('DOMContentLoaded', function () {
    // Bắt sự kiện submit của form
    document.querySelector('.auth-form.login-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của form
        // ...
        var user_address = document.querySelector('#signin-email').value;
        var user_password = document.querySelector('#signin-password').value;

  // Tạo đối tượng dữ liệu để gửi đi
        var data = {
            user_address: user_address,
            user_password: user_password
        };
        
  // Gửi yêu cầu POST sử dụng fetch
        fetch('https://factory-binhdong.vercel.app/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            
        })
        .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Đăng nhập không thành công');
        }
        })
        .then(function (responseData) {
        // Xử lý phản hồi thành công
            console.log(responseData);
            console.log(data);
        // Chuyển hướng đến đường dẫn /dulieutron
            window.location.replace('https://factory-binhdong.vercel.app/dulieutron');
        })
        .catch(function (error) {
        // Xử lý lỗi
            console.error(error);
        // Hiển thị thông báo lỗi cho người dùng
            alert('Tên đăng nhập hoặc mật khẩu không đúng');
        });
        // ...
    });
});
