const jwt = require('jsonwebtoken');
const SECRET_KEY = "my_secret_key_midterm"; // Khóa bí mật tạo token

// Middleware kiểm tra user đã đăng nhập chưa
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Vui lòng đăng nhập!' });

    try {
        const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
};

// Middleware kiểm tra quyền Admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này!' });
    }
    next();
};

module.exports = { verifyToken, isAdmin, SECRET_KEY };