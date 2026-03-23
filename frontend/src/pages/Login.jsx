import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", username);

      alert("Đăng nhập thành công!");
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2 style={{ color: "var(--primary-orange)" }}>Đăng Nhập Hệ Thống</h2>

      <form
        onSubmit={handleLogin}
        className="product-form"
        style={{ boxShadow: "none", padding: 0 }}
      >
        <input
          type="text"
          placeholder="Tên đăng nhập (admin / user)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu (123)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-orange-solid">
          Đăng Nhập
        </button>
      </form>

      {/* ĐÂY CHÍNH LÀ ĐOẠN CHUYỂN HƯỚNG SANG TRANG ĐĂNG KÝ */}
      <div
        style={{
          marginTop: "25px",
          fontSize: "15px",
          color: "var(--text-sub)",
        }}
      >
        Chưa có tài khoản?{" "}
        <Link
          to="/register"
          style={{
            color: "var(--primary-orange)",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Đăng ký tại đây
        </Link>
      </div>
    </div>
  );
}

export default Login;
