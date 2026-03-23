// src/pages/Admin.jsx
import React, { useState, useEffect } from "react";
import ProductForm from "../components/ProductForm";

const API_URL = "http://localhost:5000/products";

function Admin() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // Lấy role kiểm tra

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    stock: "",
  });
  const [editingId, setEditingId] = useState(null);

  // NẾU KHÔNG PHẢI ADMIN THÌ CHẶN LUÔN
  if (role !== "admin") {
    return (
      <div
        className="container"
        style={{ textAlign: "center", marginTop: "100px" }}
      >
        <h2 style={{ color: "red" }}>🚫 Truy cập bị từ chối!</h2>
        <p>Chỉ có tài khoản Quản trị viên (Admin) mới được xem trang này.</p>
      </div>
    );
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProducts(data);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(data.message);
      setFormData({ name: "", category: "", price: "", image: "", stock: "" });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Chắc chắn xóa?")) {
      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Lỗi khi xóa");
        fetchProducts();
      } catch (err) {
        alert(`Lỗi: ${err.message}`);
      }
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container">
      <h2>Quản Trị Sản Phẩm</h2>
      <div className="admin-layout">
        <div className="admin-sidebar">
          <ProductForm
            formData={formData}
            handleInputChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            handleSubmit={handleProductSubmit}
            editingId={editingId}
            setEditingId={setEditingId}
            setFormData={setFormData}
          />
        </div>
        <div className="admin-content">
          <div
            className="product-grid"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card"
                style={{ padding: "15px" }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ height: "140px" }}
                />
                <h4>{product.name}</h4>
                <p>
                  Kho:{" "}
                  <span
                    style={{
                      color: "var(--primary-orange)",
                      fontWeight: "bold",
                    }}
                  >
                    {product.stock}
                  </span>
                </p>
                <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
                  <button
                    onClick={() => handleEdit(product)}
                    className="btn-orange-light"
                    style={{ flex: 1 }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="btn-action-delete"
                    style={{ flex: 1 }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
