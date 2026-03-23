// src/App.jsx
import { Routes, Route, Link } from "react-router-dom";
import { useCart } from "./context/CartContext";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/Register";

function App() {
  const { cart } = useCart();
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Lấy trạng thái đăng nhập từ LocalStorage
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  // Hàm Đăng xuất
  const handleLogout = () => {
    localStorage.clear(); // Xóa sạch token
    window.location.href = "/login"; // Đẩy về trang đăng nhập
  };

  return (
    <div>
      {/* THANH ĐIỀU HƯỚNG */}
      <nav className="navbar">
        <Link to="/" className="nav-brand">
          TechStore
        </Link>

        <div className="nav-links">
          <Link to="/">🛒 Cửa Hàng</Link>
          <Link to="/cart">
            🛍️ Giỏ Hàng
            <span
              style={{
                background:
                  cartItemCount > 0 ? "var(--primary-orange)" : "#eee",
                color: cartItemCount > 0 ? "white" : "#555",
                padding: "2px 8px",
                borderRadius: "10px",
                marginLeft: "5px",
                fontSize: "12px",
              }}
            >
              {cartItemCount}
            </span>
          </Link>

          {/* KIỂM TRA ĐĂNG NHẬP ĐỂ HIỂN THỊ NÚT PHÙ HỢP */}
          {token ? (
            <>
              {/* Nếu là Admin mới hiện nút Quản Lý */}
              {role === "admin" && (
                <Link to="/admin" className="btn-nav-admin">
                  ⚙️ Quản Lý
                </Link>
              )}
              {/* Hiển thị tên User và nút Đăng xuất */}
              <span style={{ color: "var(--text-sub)", fontWeight: "bold" }}>
                Chào, {username}
              </span>
              <button
                onClick={handleLogout}
                className="btn-action-delete"
                style={{ marginLeft: "10px" }}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            /* Chưa đăng nhập thì hiện nút Đăng nhập */
            <Link
              to="/login"
              style={{ fontWeight: "bold", color: "var(--primary-orange)" }}
            >
              👤 Đăng Nhập
            </Link>
          )}
        </div>
      </nav>

      {/* ĐỊNH TUYẾN TRANG */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
}

export default App;
