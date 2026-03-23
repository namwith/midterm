// src/context/CartContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { toast } from 'react-toastify';

// 1. Tạo Context
const CartContext = createContext();

// 2. Custom hook để dùng cho tiện gọn
export const useCart = () => useContext(CartContext);

// 3. Provider chứa logic giỏ hàng
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Thêm vào giỏ hàng
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Kiểm tra xem sản phẩm đã có trong giỏ chưa
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        // Có rồi thì tăng số lượng
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Chưa có thì thêm mới với số lượng là 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast.success(`Đã thêm ${product.name} vào giỏ!`);
  };

  // Xóa khỏi giỏ hàng
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  // Tính tổng tiền
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Xóa sạch giỏ hàng (dùng khi thanh toán xong)
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};