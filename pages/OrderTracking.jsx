import React, { useState } from 'react';
import { FaSearch, FaExclamationCircle } from 'react-icons/fa';
import api from '../api/axios';
import StatusTimeline from '../components/StatusTimeline';

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setErrorMsg('Please enter your Order ID');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSearched(true);
    setOrder(null);

    try {
      const res = await api.get('/orders/track', {
        params: {
          orderId: orderId.trim(),
          phone: phone.trim() || undefined,
        },
      });

      const foundOrder = res.data?.order || res.data;
      if (foundOrder && (foundOrder.orderId || foundOrder._id)) {
        setOrder(foundOrder);
      } else {
        setErrorMsg('❌ Order not found. Please check your Order ID and phone number.');
      }
    } catch (err) {
      console.error('Tracking error:', err);
      setErrorMsg('❌ Order not found. Please check your Order ID and phone number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .tracking-search-card {
          max-width: 650px;
          margin: 0 auto 40px;
          background: var(--white);
          border-radius: var(--radius);
          padding: 36px;
          box-shadow: var(--shadow);
        }
        .order-result-card {
          max-width: 800px;
          margin: 0 auto;
          background: var(--white);
          border-radius: var(--radius-lg);
          padding: 40px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--cream-dark);
        }
        .order-header-strip {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 20px;
          border-bottom: 2px solid var(--cream-dark);
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .order-id-highlight {
          font-family: monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--chocolate);
        }
        .greeting-text {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          color: var(--chocolate);
          margin-bottom: 24px;
        }
        .order-meta-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          background: var(--cream);
          padding: 24px;
          border-radius: var(--radius);
          margin: 30px 0;
        }
        .meta-item strong {
          display: block;
          font-size: 0.85rem;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .meta-item span {
          font-size: 1.05rem;
          color: var(--text);
          font-weight: 600;
        }
        .order-items-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }
        .order-items-table th {
          text-align: left;
          padding: 10px;
          border-bottom: 2px solid var(--cream-dark);
          color: var(--text-light);
          font-size: 0.88rem;
        }
        .order-items-table td {
          padding: 12px 10px;
          border-bottom: 1px solid var(--gray-200);
          font-size: 0.95rem;
        }
        @media (max-width: 600px) {
          .order-meta-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page-header">
        <div className="container">
          <h1>Track Your Order</h1>
          <p>Check the live preparation and delivery status of your baked delights</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '80px' }}>
        {/* Search Card */}
        <div className="tracking-search-card">
          <form onSubmit={handleTrack}>
            <div className="form-group">
              <label htmlFor="orderId">
                Order ID <span className="required">*</span>
              </label>
              <input
                type="text"
                id="orderId"
                className="form-control"
                placeholder="e.g., BKRABC12345"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '4px' }}>
                Hint: Provided on your order confirmation page
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number (Optional)</label>
              <input
                type="tel"
                id="phone"
                className="form-control"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? (
                'Searching...'
              ) : (
                <>
                  <FaSearch size={14} /> Search Order
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <div
              style={{
                marginTop: '20px',
                padding: '14px',
                background: '#ffebee',
                color: '#c62828',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.95rem',
              }}
            >
              <FaExclamationCircle />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Order Result Card */}
        {order && (
          <div className="order-result-card fade-in">
            <div className="order-header-strip">
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'block' }}>
                  Order Reference
                </span>
                <span className="order-id-highlight">
                  {order.orderId || order._id}
                </span>
              </div>
              <div>
                <span
                  className={`badge ${
                    order.cakeDetails || order.isCustom ? 'badge-custom' : 'badge-regular'
                  }`}
                  style={{ fontSize: '0.85rem', padding: '6px 16px' }}
                >
                  {order.cakeDetails || order.isCustom ? 'Custom Cake' : 'Menu Order'}
                </span>
              </div>
            </div>

            <h2 className="greeting-text">
              Hello, {order.customer?.name || 'Valued Customer'}!
            </h2>

            {/* Visual Timeline */}
            <StatusTimeline currentStatus={order.status || 'Pending'} />

            {/* Order Meta details */}
            <div className="order-meta-grid">
              <div className="meta-item">
                <strong>Delivery Date & Time</strong>
                <span>
                  {order.deliveryDate || 'Scheduled Soon'} ({order.deliveryTime || 'Standard'})
                </span>
              </div>

              <div className="meta-item">
                <strong>Payment Method</strong>
                <span>{order.paymentMethod || 'Cash on Delivery / Pickup'}</span>
              </div>

              <div className="meta-item">
                <strong>Total Amount</strong>
                <span style={{ color: 'var(--brown)', fontSize: '1.2rem' }}>
                  ₹{(Number(order.total || order.estimatedPrice) || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="meta-item">
                <strong>Order Placed On</strong>
                <span>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Recently'}
                </span>
              </div>
            </div>

            {/* Details according to order type */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--chocolate)', marginBottom: '14px' }}>
                Order Items & Specifications
              </h3>

              {order.cakeDetails ? (
                <div
                  style={{
                    background: 'var(--white)',
                    border: '1px solid var(--cream-dark)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div>
                    <strong>Occasion / Type:</strong> {order.cakeDetails.cakeType}
                  </div>
                  <div>
                    <strong>Size:</strong> {order.cakeDetails.size}
                  </div>
                  <div>
                    <strong>Flavor:</strong> {order.cakeDetails.flavor}
                  </div>
                  <div>
                    <strong>Frosting:</strong> {order.cakeDetails.frosting}
                  </div>
                  {order.cakeDetails.theme && (
                    <div>
                      <strong>Theme / Design:</strong> {order.cakeDetails.theme}
                    </div>
                  )}
                  {order.cakeDetails.message && (
                    <div>
                      <strong>Message on Cake:</strong> "{order.cakeDetails.message}"
                    </div>
                  )}
                  <div>
                    <strong>Quantity:</strong> {order.cakeDetails.quantity || 1}
                  </div>
                </div>
              ) : order.items && order.items.length > 0 ? (
                <table className="order-items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th style={{ textAlign: 'center' }}>Quantity</th>
                      <th style={{ textAlign: 'right' }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((it, idx) => (
                      <tr key={idx}>
                        <td>{it.name || it.product?.name || 'Bakery Item'}</td>
                        <td style={{ textAlign: 'center' }}>{it.quantity}</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>
                          ₹{((Number(it.price || it.product?.price) || 0) * it.quantity).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: 'var(--text-light)' }}>Order details confirmed by bakery team.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderTracking;
