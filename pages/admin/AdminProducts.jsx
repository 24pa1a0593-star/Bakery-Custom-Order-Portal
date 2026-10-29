import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaRedo } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getCategoryImage } from '../../components/ProductCard';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const CATEGORIES = ['Cakes', 'Cupcakes', 'Cookies', 'Pastries', 'Breads'];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Cakes',
    imageUrl: '',
    available: true,
    featured: false,
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/admin/products');
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.products || res.data?.data || [];
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products for admin:', err);
      // Fallback: try public /products endpoint if /admin/products is identical
      try {
        const pubRes = await api.get('/products');
        const pubData = Array.isArray(pubRes.data)
          ? pubRes.data
          : pubRes.data?.products || [];
        setProducts(pubData);
      } catch (err2) {
        console.error('Failed fallback fetch as well:', err2);
        setError('Unable to load bakery products.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Cakes',
      imageUrl: '',
      available: true,
      featured: false,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || 'Cakes',
      imageUrl: product.imageUrl || '',
      available: product.available !== false,
      featured: Boolean(product.featured),
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.price || Number(formData.price) <= 0) {
      errors.price = 'Please enter a valid positive price';
    }
    if (!formData.category) errors.category = 'Category is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setModalLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        imageUrl: formData.imageUrl.trim(),
        available: formData.available,
        featured: formData.featured,
      };

      if (editingProduct) {
        const pId = editingProduct._id || editingProduct.id;
        const res = await api.put(`/admin/products/${pId}`, payload);
        const updated = res.data?.product || { ...editingProduct, ...payload };
        setProducts((prev) =>
          prev.map((p) => ((p._id || p.id) === pId ? updated : p))
        );
        toast.success('Product updated successfully!');
      } else {
        const res = await api.post('/admin/products', payload);
        const created = res.data?.product || res.data;
        setProducts((prev) => [created, ...prev]);
        toast.success('Product added successfully!');
      }

      closeModal();
    } catch (err) {
      console.error('Error saving product:', err);
      const msg = err.response?.data?.message || 'Failed to save product.';
      toast.error(msg);
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleAvailable = async (product) => {
    const pId = product._id || product.id;
    const newStatus = !product.available;
    try {
      await api.put(`/admin/products/${pId}`, { available: newStatus });
      setProducts((prev) =>
        prev.map((p) => ((p._id || p.id) === pId ? { ...p, available: newStatus } : p))
      );
      toast.success(`${product.name} is now ${newStatus ? 'Available' : 'Sold Out'}`);
    } catch (err) {
      console.error('Toggle error:', err);
      toast.error('Failed to update product availability');
    }
  };

  const handleToggleFeatured = async (product) => {
    const pId = product._id || product.id;
    const newFeatured = !product.featured;
    try {
      await api.put(`/admin/products/${pId}`, { featured: newFeatured });
      setProducts((prev) =>
        prev.map((p) => ((p._id || p.id) === pId ? { ...p, featured: newFeatured } : p))
      );
      toast.success(`${product.name} featured status updated!`);
    } catch (err) {
      console.error('Toggle error:', err);
      toast.error('Failed to update featured status');
    }
  };

  const handleDelete = async (product) => {
    const pId = product._id || product.id;
    const confirmed = window.confirm(`Are you sure you want to delete "${product.name}"?`);
    if (!confirmed) return;

    try {
      await api.delete(`/admin/products/${pId}`);
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== pId));
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('Delete product error:', err);
      const msg = err.response?.data?.message || 'Failed to delete product';
      toast.error(msg);
    }
  };

  const getBadgeClass = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('cupcake')) return 'badge-cupcakes';
    if (cat.includes('cake')) return 'badge-cakes';
    if (cat.includes('cookie')) return 'badge-cookies';
    if (cat.includes('pastr')) return 'badge-pastries';
    if (cat.includes('bread')) return 'badge-breads';
    return 'badge-cakes';
  };

  return (
    <AdminLayout title="Manage Products">
      <style>{`
        .products-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .table-prod-img {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          object-fit: cover;
          background: var(--cream-dark);
        }
        .action-btns-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>

      {/* Toolbar */}
      <div className="products-toolbar">
        <div>
          <button className="btn btn-primary" onClick={openAddModal}>
            <FaPlus size={12} /> Add New Product
          </button>
        </div>

        <button className="btn btn-outline btn-sm" onClick={fetchProducts}>
          <FaRedo size={12} /> Refresh
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner size={44} message="Loading bakery products..." />
      ) : error ? (
        <div className="empty-state card">
          <div className="empty-icon">⚠️</div>
          <h3>{error}</h3>
          <button className="btn btn-primary" onClick={fetchProducts} style={{ marginTop: '16px' }}>
            <FaRedo size={12} /> Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">🎂</div>
          <h3>No products in menu yet</h3>
          <p>Click 'Add New Product' above to introduce delicious items to your menu.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th style={{ textAlign: 'center' }}>Available</th>
                <th style={{ textAlign: 'center' }}>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => {
                const pId = prod._id || prod.id;
                const imgSrc = prod.imageUrl || getCategoryImage(prod.category);

                return (
                  <tr key={pId}>
                    <td>
                      <img
                        src={imgSrc}
                        alt={prod.name}
                        className="table-prod-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getCategoryImage(prod.category);
                        }}
                      />
                    </td>
                    <td>
                      <strong>{prod.name}</strong>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-light)',
                          maxWidth: '260px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {prod.description}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getBadgeClass(prod.category)}`}>
                        {prod.category}
                      </span>
                    </td>
                    <td>
                      <strong>₹{(Number(prod.price) || 0).toLocaleString('en-IN')}</strong>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={prod.available !== false}
                          onChange={() => handleToggleAvailable(prod)}
                        />
                        <span className="slider"></span>
                      </label>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(prod.featured)}
                        onChange={() => handleToggleFeatured(prod)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </td>
                    <td>
                      <div className="action-btns-group">
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '6px 12px' }}
                          onClick={() => openEditModal(prod)}
                          title="Edit Product"
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          style={{ padding: '6px 12px' }}
                          onClick={() => handleDelete(prod)}
                          title="Delete Product"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="modal-close-btn" onClick={closeModal} aria-label="Close modal">
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit} noValidate>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="prodName">
                    Product Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="prodName"
                    className={`form-control ${formErrors.name ? 'error' : ''}`}
                    placeholder="e.g., Red Velvet Truffle Cake"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {formErrors.name && <div className="form-error">{formErrors.name}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="prodDesc">
                    Description <span className="required">*</span>
                  </label>
                  <textarea
                    id="prodDesc"
                    rows="3"
                    className={`form-control ${formErrors.description ? 'error' : ''}`}
                    placeholder="Rich layers with cream cheese frosting..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  {formErrors.description && <div className="form-error">{formErrors.description}</div>}
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label htmlFor="prodPrice">
                      Price (₹) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      id="prodPrice"
                      min="1"
                      className={`form-control ${formErrors.price ? 'error' : ''}`}
                      placeholder="e.g., 650"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                    {formErrors.price && <div className="form-error">{formErrors.price}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="prodCategory">
                      Category <span className="required">*</span>
                    </label>
                    <select
                      id="prodCategory"
                      className="form-control"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="prodImg">Image URL (Optional)</label>
                  <input
                    type="url"
                    id="prodImg"
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '30px', marginTop: '14px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: 600 }}>Available in Stock</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: 600 }}>Featured Bestseller</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={modalLoading}>
                  {modalLoading ? 'Saving...' : editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
