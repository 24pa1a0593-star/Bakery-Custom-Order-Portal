import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();

  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    deliveryDate: tomorrowStr,
    deliveryTime: 'Morning (9am-12pm)',
    instructions: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // If cart is empty, redirect to /cart
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const subtotal = getTotal();
  const deliveryFee = subtotal >= 500 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Must be a valid 10-digit Indian mobile number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required';
    }

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Delivery date is required';
    } else if (formData.deliveryDate < tomorrowStr) {
      newErrors.deliveryDate = 'Delivery date must be at least tomorrow';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.product._id || item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const payload = {
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
        },
        items: orderItems,
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime,
        instructions: formData.instructions.trim(),
        subtotal,
        deliveryFee,
        total,
      };

      const res = await api.post('/orders', payload);
      const data = res.data?.order || res.data;
      const orderId = data.orderId || data._id || data.id || 'BKR' + Date.now().toString().slice(-6);

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${orderId}`, {
        state: {
          orderId,
          customer: payload.customer,
          items: orderItems,
          deliveryDate: payload.deliveryDate,
          deliveryTime: payload.deliveryTime,
          subtotal,
          deliveryFee,
          total,
          isCustom: false,
        },
      });
    } catch (err) {
      console.error('Checkout error:', err);
      const msg = err.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <style>{`
        .checkout-layout {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 40px;
          align-items: start;
        }
        .checkout-form-card {
          background: var(--white);
          border-radius: var(--radius);
          padding: 32px;
          box-shadow: var(--shadow);
        }
        .checkout-summary-card {
          background: var(--white);
          border-radius: var(--radius);
          padding: 30px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--cream-dark);
          position: sticky;
          top: 100px;
        }
        .checkout-item-mini {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          font-size: 0.95rem;
          border-bottom: 1px solid var(--cream-dark);
        }
        .payment-display-box {
          background: #f1f8e9;
          border: 1px solid #c8e6c9;
          border-radius: var(--radius-sm);
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 10px;
        }
        .payment-icon {
          font-size: 1.8rem;
        }
        .payment-title {
          font-weight: 700;
          color: #2e7d32;
        }
        .payment-desc {
          font-size: 0.85rem;
          color: #558b2f;
        }
        @media (max-width: 868px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }
          .checkout-summary-card {
            position: static;
          }
        }
      `}</style>

      <div className="page-header">
        <div className="container">
          <h1>Checkout</h1>
          <p>Provide your delivery information to complete your order</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '80px' }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="checkout-layout">
            {/* Form Column */}
            <div className="checkout-form-card">
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--chocolate)', marginBottom: '24px' }}>
                Delivery Information
              </h3>

              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="name">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="e.g., Rohan Gupta"
                    className={`form-control ${errors.name ? 'error' : ''}`}
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <div className="form-error">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Phone Number <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="10-digit mobile number"
                    className={`form-control ${errors.phone ? 'error' : ''}`}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <div className="form-error">{errors.phone}</div>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="e.g., rohan@example.com"
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="address">
                  Delivery Address <span className="required">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  placeholder="House/Apartment #, Street, Locality, City, Pincode"
                  className={`form-control ${errors.address ? 'error' : ''}`}
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && <div className="form-error">{errors.address}</div>}
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="deliveryDate">
                    Delivery Date <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id="deliveryDate"
                    name="deliveryDate"
                    min={tomorrowStr}
                    className={`form-control ${errors.deliveryDate ? 'error' : ''}`}
                    value={formData.deliveryDate}
                    onChange={handleChange}
                  />
                  {errors.deliveryDate && <div className="form-error">{errors.deliveryDate}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="deliveryTime">Delivery Time Slot</label>
                  <select
                    id="deliveryTime"
                    name="deliveryTime"
                    className="form-control"
                    value={formData.deliveryTime}
                    onChange={handleChange}
                  >
                    <option value="Morning (9am-12pm)">Morning (9am-12pm)</option>
                    <option value="Afternoon (12pm-4pm)">Afternoon (12pm-4pm)</option>
                    <option value="Evening (4pm-7pm)">Evening (4pm-7pm)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="instructions">Special Instructions</label>
                <textarea
                  id="instructions"
                  name="instructions"
                  rows="2"
                  placeholder="Doorbell notes, landmarks, preferred contact method, etc."
                  className="form-control"
                  value={formData.instructions}
                  onChange={handleChange}
                />
              </div>

              {/* Payment Method section */}
              <div style={{ marginTop: '30px' }}>
                <label style={{ fontWeight: 600, color: 'var(--text)' }}>Payment Method</label>
                <div className="payment-display-box">
                  <span className="payment-icon">💵</span>
                  <div>
                    <div className="payment-title">Cash on Delivery / Pickup Only</div>
                    <div className="payment-desc">
                      Pay securely with cash or UPI scanner upon delivery or at bakery pickup counter.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Column */}
            <aside>
              <div className="checkout-summary-card">
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--chocolate)', marginBottom: '16px' }}>
                  Order Summary
                </h3>

                <div style={{ marginBottom: '20px', maxHeight: '220px', overflowY: 'auto' }}>
                  {items.map((item) => (
                    <div key={item.product._id || item.product.id} className="checkout-item-mini">
                      <div>
                        <strong>{item.product.name}</strong>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
                          Qty: {item.quantity} × ₹{(Number(item.product.price) || 0).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div style={{ fontWeight: 600 }}>
                        ₹{((Number(item.product.price) || 0) * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)' }}>
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)' }}>
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 700,
                      fontSize: '1.3rem',
                      color: 'var(--chocolate)',
                      borderTop: '2px dashed var(--cream-dark)',
                      paddingTop: '12px',
                    }}
                  >
                    <span>Total Amount</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  disabled={submitting}
                >
                  {submitting ? 'Placing Order...' : 'Place Order'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <Link to="/cart" style={{ color: 'var(--brown)', fontSize: '0.9rem', fontWeight: 500 }}>
                    ← Return to Cart
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </>
  );
};

export default Checkout;
