import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaRedo } from 'react-icons/fa';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Cakes', 'Cupcakes', 'Cookies', 'Pastries', 'Breads'];

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart, getItemCount } = useCart();
  const cartCount = getItemCount();

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const res = await api.get('/products', { params });
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.products || res.data.data || [];
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch menu products:', err);
      setError('Unable to load menu products. Please check your connection or server.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, debouncedSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <>
      <style>{`
        .search-container {
          max-width: 520px;
          margin: 0 auto 30px;
          position: relative;
        }
        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 16px;
          color: var(--gray-500);
          font-size: 1.1rem;
        }
        .search-input {
          padding-left: 48px;
          border-radius: 50px;
          box-shadow: var(--shadow-sm);
        }
        .categories-tabs {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 40px;
          overflow-x: auto;
          padding: 8px 4px 16px;
          scrollbar-width: none;
        }
        .categories-tabs::-webkit-scrollbar {
          display: none;
        }
        .cat-tab-btn {
          padding: 10px 22px;
          border-radius: 50px;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid var(--cream-dark);
          transition: var(--transition);
          white-space: nowrap;
          background: var(--cream);
          color: var(--brown);
        }
        .cat-tab-btn:hover {
          background: var(--cream-dark);
          color: var(--chocolate);
        }
        .cat-tab-btn.active {
          background: var(--brown);
          color: var(--white);
          border-color: var(--brown);
          box-shadow: var(--shadow-sm);
        }
        .floating-cart-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: var(--brown);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          box-shadow: var(--shadow-lg);
          z-index: 999;
          transition: var(--transition);
        }
        .floating-cart-btn:hover {
          background: var(--brown-dark);
          transform: scale(1.08);
        }
        .floating-cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #e53935;
          color: var(--white);
          font-size: 0.75rem;
          font-weight: 700;
          min-width: 22px;
          height: 22px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--white);
        }
      `}</style>

      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>Our Menu</h1>
          <p>Freshly baked everyday with premium ingredients and irresistible flavors</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '80px' }}>
        {/* Search bar */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search cakes, cookies, pastries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="categories-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner size={48} message="Loading freshly baked menu..." />
        ) : error ? (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h3>{error}</h3>
            <button className="btn btn-primary" onClick={fetchProducts} style={{ marginTop: '16px' }}>
              <FaRedo size={12} /> Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try a different search term or category filter.</p>
            <button
              className="btn btn-secondary"
              style={{ marginTop: '16px' }}
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {products.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating cart button */}
      <Link to="/cart" className="floating-cart-btn" aria-label="View Shopping Cart">
        <FaShoppingCart />
        {cartCount > 0 && <span className="floating-cart-badge">{cartCount}</span>}
      </Link>
    </>
  );
};

export default Menu;
