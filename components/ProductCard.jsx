import React, { useState } from 'react';
import { FaPlus, FaCheck, FaStar } from 'react-icons/fa';

export const getCategoryImage = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('cake') && !cat.includes('cupcake')) {
    return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80';
  }
  if (cat.includes('cupcake')) {
    return 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=400&q=80';
  }
  if (cat.includes('cookie')) {
    return 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80';
  }
  if (cat.includes('pastr')) {
    return 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80';
  }
  if (cat.includes('bread')) {
    return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80';
  }
  return 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=400&q=80';
};

const ProductCard = ({ product, onAddToCart }) => {
  const [imgError, setImgError] = useState(false);
  const [addedRecently, setAddedRecently] = useState(false);

  if (!product) return null;

  const imgSrc = (!imgError && product.imageUrl) ? product.imageUrl : getCategoryImage(product.category);

  const getBadgeClass = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('cupcake')) return 'badge-cupcakes';
    if (cat.includes('cake')) return 'badge-cakes';
    if (cat.includes('cookie')) return 'badge-cookies';
    if (cat.includes('pastr')) return 'badge-pastries';
    if (cat.includes('bread')) return 'badge-breads';
    return 'badge-cakes';
  };

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(product);
      setAddedRecently(true);
      setTimeout(() => setAddedRecently(false), 1200);
    }
  };

  return (
    <>
      <style>{`
        .product-card {
          min-height: 380px;
          display: flex;
          flex-direction: column;
          position: relative;
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-hover);
        }
        .product-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: linear-gradient(135deg, var(--cream-dark), var(--pink));
        }
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .product-card:hover .product-image {
          transform: scale(1.06);
        }
        .product-fallback-img {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          background: linear-gradient(135deg, var(--cream-dark), var(--pink));
        }
        .product-featured-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: linear-gradient(135deg, var(--gold), #B8960E);
          color: var(--white);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          z-index: 2;
        }
        .product-category-tag {
          position: absolute;
          bottom: 12px;
          left: 12px;
          z-index: 2;
        }
        .product-details {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .product-name {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          color: var(--chocolate);
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .product-desc {
          color: var(--text-light);
          font-size: 0.88rem;
          line-height: 1.5;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }
        .product-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px dashed var(--cream-dark);
        }
        .product-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--brown-dark);
        }
        .product-add-btn {
          width: 100%;
          margin-top: 14px;
          padding: 10px 16px;
          font-size: 0.9rem;
          border-radius: var(--radius-sm);
        }
      `}</style>
      <div className="product-card">
        <div className="product-image-container">
          {product.featured && (
            <span className="product-featured-badge">
              <FaStar size={10} /> Bestseller
            </span>
          )}

          {imgError ? (
            <div className="product-fallback-img">🧁</div>
          ) : (
            <img
              src={imgSrc}
              alt={product.name || 'Bakery Item'}
              className="product-image"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}

          <div className="product-category-tag">
            <span className={`badge ${getBadgeClass(product.category)}`}>
              {product.category || 'Treat'}
            </span>
          </div>
        </div>

        <div className="product-details">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-desc">{product.description || 'Deliciously handcrafted with love.'}</p>

          <div className="product-footer">
            <span className="product-price">
              ₹{(Number(product.price) || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <button
            className="btn btn-primary product-add-btn"
            onClick={handleAdd}
            disabled={product.available === false}
          >
            {product.available === false ? (
              'Sold Out'
            ) : addedRecently ? (
              <>
                <FaCheck /> Added!
              </>
            ) : (
              <>
                <FaPlus size={12} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
