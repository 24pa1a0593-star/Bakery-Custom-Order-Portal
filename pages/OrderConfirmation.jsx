import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { FaCheckCircle, FaSearch, FaShoppingBag } from 'react-icons/fa';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const summary = location.state || {};

  const customerEmail = summary.customer?.email || 'your email';

  return (
    <>
      <style>{`
        .confirmation-card {
          max-width: 650px;
          margin: 40px auto;
          background: var(--white);
          border-radius: var(--radius-lg);
          padding: 48px 36px;
          box-shadow: var(--shadow-lg);
          text-align: center;
        }
        .success-icon-wrapper {
          color: #2e7d32;
          font-size: 5rem;
          margin-bottom: 20px;
          display: inline-block;
          animation: pulse 1.5s ease;
        }
        .confirmation-title {
          font-family: var(--font-heading);
          font-size: 2.6rem;
          color: var(--chocolate);
          margin-bottom: 10px;
        }
        .confirmation-subtitle {
          font-size: 1.15rem;
          color: var(--text-light);
          margin-bottom: 30px;
        }
        .order-id-box {
          background: var(--cream);
          border: 2px dashed var(--brown);
          border-radius: var(--radius);
          padding: 24px;
          margin: 30px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .order-id-label {
          text-transform: uppercase;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-light);
          letter-spacing: 1.5px;
        }
        .order-id-value {
          font-family: monospace;
          font-size: 2rem;
          font-weight: 800;
          color: var(--chocolate);
          letter-spacing: 2px;
          user-select: all;
        }
        .order-id-hint {
          font-size: 0.82rem;
          color: var(--brown);
        }
        .confirmation-details-box {
          text-align: left;
          background: #faf8f5;
          border-radius: var(--radius-sm);
          padding: 20px;
          margin-bottom: 28px;
          font-size: 0.95rem;
          color: var(--text);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .conf-row {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid var(--cream-dark);
          padding-bottom: 8px;
        }
        .conf-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .contact-notice {
          background: #e3f2fd;
          color: #1565c0;
          padding: 14px 18px;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          margin-bottom: 20px;
        }
        .payment-notice {
          background: #e8f5e9;
          color: #2e7d32;
          padding: 12px 18px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 32px;
        }
        .confirmation-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }
      `}</style>

      <div className="container" style={{ padding: '40px 20px 80px' }}>
        <div className="confirmation-card">
          <div className="success-icon-wrapper">
            <FaCheckCircle />
          </div>

          <h1 className="confirmation-title">Order Confirmed!</h1>
          <p className="confirmation-subtitle">
            Thank you for ordering with Sweet Bliss Bakery!
          </p>

          <div className="order-id-box">
            <span className="order-id-label">Your Order ID</span>
            <span className="order-id-value">{orderId}</span>
            <span className="order-id-hint">Save this ID to track your order anytime</span>
          </div>

          {/* Details summary if available */}
          {(summary.customer || summary.items || summary.cakeDetails) && (
            <div className="confirmation-details-box">
              {summary.customer?.name && (
                <div className="conf-row">
                  <span style={{ color: 'var(--text-light)' }}>Recipient:</span>
                  <strong>{summary.customer.name}</strong>
                </div>
              )}
              {summary.deliveryDate && (
                <div className="conf-row">
                  <span style={{ color: 'var(--text-light)' }}>Delivery Date:</span>
                  <strong>{summary.deliveryDate} ({summary.deliveryTime})</strong>
                </div>
              )}
              {summary.isCustom && summary.cakeDetails && (
                <div className="conf-row">
                  <span style={{ color: 'var(--text-light)' }}>Custom Cake:</span>
                  <strong>
                    {summary.cakeDetails.cakeType} ({summary.cakeDetails.flavor})
                  </strong>
                </div>
              )}
              {(summary.total || summary.estimatedPrice) && (
                <div className="conf-row">
                  <span style={{ color: 'var(--text-light)' }}>Total Amount:</span>
                  <strong style={{ color: 'var(--brown)', fontSize: '1.1rem' }}>
                    ₹{(summary.total || summary.estimatedPrice).toLocaleString('en-IN')}
                  </strong>
                </div>
              )}
            </div>
          )}

          <div className="contact-notice">
            📩 We'll contact you at <strong>{customerEmail}</strong> within 2 hours to confirm your order details.
          </div>

          <div className="payment-notice">
            💵 Payment: Cash on Delivery / Pickup when received
          </div>

          <div className="confirmation-actions">
            <Link to="/track-order" className="btn btn-primary btn-lg">
              <FaSearch size={14} /> Track Your Order
            </Link>
            <Link to="/menu" className="btn btn-secondary btn-lg">
              <FaShoppingBag size={14} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
