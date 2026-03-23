const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const SECRET_KEY = "my_secret_key_midterm";

app.use(cors());
app.use(express.json());

// --- HÀM TIỆN ÍCH ĐỌC/GHI JSON ---
const readJSON = (filename) =>
  JSON.parse(fs.readFileSync(path.join(__dirname, filename), "utf-8"));
const writeJSON = (filename, data) =>
  fs.writeFileSync(
    path.join(__dirname, filename),
    JSON.stringify(data, null, 2),
    "utf-8",
  );

// --- MIDDLEWARE PHÂN QUYỀN ---
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(403).json({ message: "Vui lòng đăng nhập!" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Lưu thông tin user vào request
    next();
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Bạn không có quyền Admin để thực hiện thao tác này!" });
  }
  next();
};

// ==========================================
// API AUTH & CHECKOUT
// ==========================================

// Đăng nhập
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = readJSON("users.json");
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user)
    return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });

  // Tạo token chứa id và role
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
    expiresIn: "1h",
  });
  res.json({ message: "Đăng nhập thành công", token, role: user.role });
});

// API Đăng ký tài khoản mới
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    let users = readJSON('users.json');

    // Kiểm tra xem user đã tồn tại chưa
    const userExists = users.find(u => u.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'Tên đăng nhập này đã có người sử dụng!' });
    }

    // Tạo user mới (mặc định role là 'user')
    const newUser = {
        id: Date.now(),
        username,
        password,
        role: 'user' // Mặc định ai đăng ký cũng là khách hàng
    };

    users.push(newUser);
    writeJSON('users.json', users);

    res.status(201).json({ message: 'Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.' });
});

// Thanh toán (Nhận giỏ hàng -> Lưu order -> Trừ stock)
app.post("/checkout", (req, res) => {
  try {
    const { cart, total } = req.body;
    if (!cart || cart.length === 0)
      return res.status(400).json({ message: "Giỏ hàng trống!" });

    let products = readJSON("products.json");
    let orders = readJSON("orders.json");

    // 1. Kiểm tra tồn kho và Trừ số lượng (Stock)
    for (let item of cart) {
      const productIndex = products.findIndex((p) => p.id === item.id);
      if (productIndex !== -1) {
        if (products[productIndex].stock < item.quantity) {
          return res
            .status(400)
            .json({ message: `Sản phẩm ${item.name} không đủ số lượng!` });
        }
        products[productIndex].stock -= item.quantity; // Trừ stock
      }
    }

    // 2. Lưu đơn hàng
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: cart,
      total: total,
    };
    orders.push(newOrder);

    // 3. Ghi lại vào file
    writeJSON("products.json", products);
    writeJSON("orders.json", orders);

    res
      .status(200)
      .json({ message: "Thanh toán thành công!", orderId: newOrder.id });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi thanh toán!" });
  }
});

// ==========================================
// API PRODUCTS (CRUD)
// ==========================================

// Lấy danh sách (Ai cũng xem được)
app.get("/products", (req, res) => {
  let products = readJSON("products.json");
  const { category, search } = req.query;
  if (category)
    products = products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
  if (search)
    products = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  res.json(products);
});

// Thêm sản phẩm (Chỉ Admin)
app.post("/products", verifyToken, isAdmin, (req, res) => {
  let products = readJSON("products.json");
  const newProduct = { ...req.body, id: Date.now() };
  products.push(newProduct);
  writeJSON("products.json", products);
  res.status(201).json({ message: "Thêm thành công", product: newProduct });
});

// Cập nhật sản phẩm (Chỉ Admin)
app.put("/products/:id", verifyToken, isAdmin, (req, res) => {
  let products = readJSON("products.json");
  const index = products.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Không tìm thấy!" });

  products[index] = { ...products[index], ...req.body };
  writeJSON("products.json", products);
  res.json({ message: "Cập nhật thành công" });
});

// Xóa sản phẩm (Chỉ Admin)
app.delete("/products/:id", verifyToken, isAdmin, (req, res) => {
  let products = readJSON("products.json");
  const filteredProducts = products.filter(
    (p) => p.id !== parseInt(req.params.id),
  );
  writeJSON("products.json", filteredProducts);
  res.json({ message: "Xóa thành công" });
});

app.listen(PORT, () =>
  console.log(`Backend chạy tại http://localhost:${PORT}`),
);
