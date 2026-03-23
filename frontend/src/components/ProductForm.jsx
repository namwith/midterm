import React from 'react';

function ProductForm({ formData, handleInputChange, handleSubmit, editingId, setEditingId, setFormData }) {
  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>{editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h2>
      <input type="text" name="name" placeholder="Tên sản phẩm" value={formData.name} onChange={handleInputChange} required />
      <input type="text" name="category" placeholder="Danh mục (Phone, Laptop...)" value={formData.category} onChange={handleInputChange} required />
      <input type="number" name="price" placeholder="Giá tiền" value={formData.price} onChange={handleInputChange} required min="1" />
      <input type="text" name="image" placeholder="URL Hình ảnh" value={formData.image} onChange={handleInputChange} required />
      <input type="number" name="stock" placeholder="Số lượng trong kho" value={formData.stock} onChange={handleInputChange} required min="0" />
      
      <button type="submit" className={editingId ? 'btn-update' : 'btn-add'}>
        {editingId ? 'Lưu Cập Nhật' : 'Thêm Sản Phẩm'}
      </button>
      {editingId && (
        <button type="button" onClick={() => { 
          setEditingId(null); 
          setFormData({ name: '', category: '', price: '', image: '', stock: '' });
        }}>
          Hủy thao tác
        </button>
      )}
    </form>
  );
}

export default ProductForm;