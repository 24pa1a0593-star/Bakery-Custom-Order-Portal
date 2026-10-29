import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaArrowRight, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { getCategoryImage } from '../components/ProductCard';

const CartItemImage = ({ product }) => {
  const [imgErr, setImgErr] = useState(false);
  const src = !imgErr && product.imageUrl ? product.imageUrl : getCategoryImage(product.category);

  return imgErr ? (
    <div
      style={{
        width: '90px',
        height: '90px',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--cream-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
      }}
    >
      🍰
    </div>
  ) : (
    <img
      src={src}
      alt={product.name}
      onError={() => setImgErr(true)}
      style={{
        width: '90px',
        height: '90px',
        objectFit: 'cover',
        borderRadius: 'var(--radius-sm)',
      }}
    />
  );
};

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotal } = useCart();
  const subtotal = getTotal();
  const deliveryFee = subtotal >= 500 || subtotal === 0 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const getProductId = (product) => product?._id || product?.id;

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
    <>
      <style>{`
        .cart-layout {
          display: grid;
          grid-template-columns: 1.8fr 1fr;
          gap: 40px;
          align-items: start;
        }
        .cart-items-card {
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 24px;
        }
        .cart-item-row {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px 0;
          border-bottom: 1px solid var(--cream-dark);
        }
        .cart-item-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .cart-item-info {
          flex: 1;
        }
        .cart-item-name {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          color: var(--chocolate);
          margin-bottom: 4px;
        }
        .cart-item-price {
          font-weight: 700;
          color: var(--brown);
          font-size: 1.05rem;
          margin-top: 6px;
        }
        .qty-control {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--cream);
          border: 1px solid var(--cream-dark);
          border-radius: 50px;
          padding: 4px 8px;
        }
        .qty-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: var(--white);
          color: var(--brown);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.85rem;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }
        .qty-btn:hover {
          background: var(--brown);
          color: var(--white);
        }
        .qty-val {
          font-weight: 600;
          min-width: 24px;
          text-align: center;
          font-size: 0.95rem;
        }
        .cart-remove-btn {
          background: transparent;
          border: none;
          color: #e53935;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cart-remove-btn:hover {
          background: #ffebee;
        }
        .cart-summary-card {
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 30px;
          position: sticky;
          top: 100px;
        }
        .cart-summary-title {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          color: var(--chocolate);
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid var(--cream-dark);
        }
        .summary-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 20px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          color: var(--text-light);
        }
        .summary-row.total-row {
          border-top: 2px dashed var(--cream-dark);
          padding-top: 14px;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--chocolate);
        }
        .free-delivery-badge {
          color: #2e7d32;
          font-weight: 700;
        }
        .continue-shopping-link {
          display: block;
          text-align: center;
          margin-top: 16px;
          color: var(--brown);
          font-weight: 600;
          font-size: 0.95rem;
          transition: var(--transition);
        }
        .continue-shopping-link:hover {
          text-decoration: underline;
        }
        @media (max-width: 868px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }
          .cart-summary-card {
            position: static;
          }
          .cart-item-row {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div className="page-header">
        <div className="container">
          <h1>Shopping Cart</h1>
          <p>Review your selected artisan treats before checkout</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '80px' }}>
        {items.length === 0 ? (
          <div className="empty-state card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p style={{ marginBottom: '24px' }}>
              Browse our delicious menu and add something sweet to your day!
            </p>
            <Link to="/menu" className="btn btn-primary btn-lg">
              <FaShoppingBag /> Browse Menu
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Left: Cart Items List */}
            <div className="cart-items-card">
              {items.map((item) => {
                const pId = getProductId(item.product);
                return (
                  <div key={pId} className="cart-item-row">
                    <CartItemImage product={item.product} />

                    <div className="cart-item-info">
                      <h4 className="cart-item-name">{item.product.name}</h4>
                      <span className={`badge ${getBadgeClass(item.product.category)}`}>
                        {item.product.category || 'Bakery'}
                      </span>
                      <div className="cart-item-price">
                        ₹{(Number(item.product.price) || 0).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="qty-control">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQuantity(pId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQuantity(pId, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: '90px' }}>
                      <div style={{ fontWeight: 700, color: varDarkChocolate }}>
                        ₹{((Number(item.product.price) || 0) * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(pId)}
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Right: Order Summary Card */}
            <aside>
              <div className="cart-summary-card">
                <h3 className="cart-summary-title">Order Summary</h3>

                <ul className="summary-list">
                  <li className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </li>

                  <li className="summary-row">
                    <span>Delivery Fee</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="free-delivery-badge">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </li>

                  {subtotal < 500 && (
                    <li style={{ fontSize: '0.8rem', color: 'var(--brown)' }}>
                      💡 Add ₹{500 - subtotal} more for FREE delivery!
                    </li>
                  )}

                  <li className="summary-row total-row">
                    <span>Total Amount</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </li>
                </ul>

                <div
                  style={{
                    background: '#e8f5e9',
                    color: '#2e7d32',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    marginBottom: '20px',
                    textAlign: 'center',
                  }}
                >
                  💵 Payment: Cash on Delivery / Pickup
                </div>

                <Link
                  to="/checkout"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  Proceed to Checkout <FaArrowRight size={14} />
                </Link>

                <Link to="/menu" className="continue-shopping-link">
                  ← Continue Shopping
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  );
};

const varDarkChocolate = 'var(--chocolate)';

export default Cart;
