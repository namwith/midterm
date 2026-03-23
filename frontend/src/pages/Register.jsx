import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success(data.message);
      navigate('/login'); // Đăng ký xong tự động chuyển sang trang Đăng nhập
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng Ký Tài Khoản</h2>
      <form onSubmit={handleRegister} className="product-form" style={{boxShadow: 'none', padding: 0}}>
        <input type="text" placeholder="Tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="btn-orange-solid">Đăng Ký</button>
      </form>
      <p style={{marginTop: '20px'}}>
        Đã có tài khoản? <Link to="/login" style={{color: 'var(--primary-orange)'}}>Đăng nhập ngay</Link>
      </p>
    </div>
  );
}

export default Register;