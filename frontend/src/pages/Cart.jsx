// src/pages/Cart.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cart, removeFromCart, cartTotal, clearCart } = useCart();

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Giỏ hàng đang trống!");
    
    try {
      const res = await fetch('http://localhost:5000/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, total: cartTotal })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(`Thanh toán thành công! Mã đơn hàng của bạn là: ${data.orderId}`);
      clearCart(); // Xóa giỏ hàng
      window.location.href = "/"; // Đẩy user về trang chủ để xem stock đã bị trừ chưa
    } catch (error) {
      alert(`Lỗi thanh toán: ${error.message}`);
    }
  };

  if (cart.length === 0) {
    return <div className="container" style={{textAlign: 'center', marginTop: '50px'}}><h2>Giỏ hàng của bạn đang trống.</h2></div>;
  }

  return (
    <div className="container cart-page">
      <h1>Giỏ Hàng Của Bạn</h1>
      
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} width="80" />
            <div className="item-details">
              <h4>{item.name}</h4>
              <p>${item.price} x {item.quantity}</p>
            </div>
            <div className="item-total">
              <p><strong>${item.price * item.quantity}</strong></p>
              <button onClick={() => removeFromCart(item.id)} className="btn-action-delete">Xóa</button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Tổng cộng: <span style={{color: '#0a2b2a'}}>${cartTotal}</span></h2>
        <button onClick={handleCheckout} className="btn-orange-solid">Tiến Hành Thanh Toán</button>
      </div>
    </div>
  );
}

export default Cart;