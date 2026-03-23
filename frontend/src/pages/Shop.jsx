import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const API_URL = "http://localhost:5000/products";

function Shop() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const [detailProduct, setDetailProduct] = useState(null); // State quản lý popup chi tiết

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi tải sản phẩm:", err));
  }, []);

  return (
    <div className="container">
      <h1>Sản Phẩm Mới Nhất</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
            <p className="stock">Còn lại: {product.stock}</p>

            {/* HAI NÚT CHI TIẾT VÀ THÊM VÀO GIỎ */}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                className="btn-orange-light"
                style={{ flex: 1 }}
                onClick={() => setDetailProduct(product)}
              >
                Chi tiết
              </button>
              <button
                className="btn-orange-solid"
                style={{ flex: 1 }}
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Hết hàng" : "Mua ngay"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* POPUP MODAL HIỂN THỊ CHI TIẾT SẢN PHẨM */}
      {detailProduct && (
        <div className="modal-overlay" onClick={() => setDetailProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>Chi tiết sản phẩm</h2>
            <img
              src={detailProduct.image}
              alt={detailProduct.name}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "contain",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            />
            <p>
              <strong>Tên:</strong> {detailProduct.name}
            </p>
            <p>
              <strong>Danh mục:</strong> {detailProduct.category}
            </p>
            <p>
              <strong>Giá:</strong>{" "}
              <span
                style={{
                  color: "var(--primary-orange)",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                ${detailProduct.price}
              </span>
            </p>
            <p>
              <strong>Tồn kho:</strong> {detailProduct.stock} sản phẩm
            </p>

            <button
              onClick={() => setDetailProduct(null)}
              className="btn-action-delete"
              style={{ marginTop: "20px", width: "100%", padding: "12px" }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shop;
