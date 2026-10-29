import React, { useState, useEffect, useCallback } from 'react';
import { FaEye, FaRedo, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected order for modal details
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 10,
      };
      if (statusFilter !== 'All') {
        params.status = statusFilter;
      }

      const res = await api.get('/admin/orders', { params });
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.orders || res.data.data || [];

      setOrders(data);

      if (res.data.totalPages) {
        setTotalPages(res.data.totalPages);
      } else if (res.data.total) {
        setTotalPages(Math.ceil(res.data.total / 10));
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
      setError('Unable to load orders from the server.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      // Update local state smoothly
      setOrders((prev) =>
        prev.map((o) =>
          (o._id === orderId || o.orderId === orderId) ? { ...o, status: newStatus } : o
        )
      );
      if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.orderId === orderId)) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Status change error:', err);
      const msg = err.response?.data?.message || 'Failed to update order status';
      toast.error(msg);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || 'pending').toLowerCase();
    let badgeClass = 'badge-pending';
    if (s === 'confirmed') badgeClass = 'badge-confirmed';
    if (s === 'preparing') badgeClass = 'badge-preparing';
    if (s === 'ready') badgeClass = 'badge-ready';
    if (s === 'completed') badgeClass = 'badge-completed';

    return <span className={`badge ${badgeClass}`}>{status || 'Pending'}</span>;
  };

  return (
    <AdminLayout title="Manage Customer Orders">
      <style>{`
        .orders-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .filter-label {
          font-weight: 600;
          color: var(--chocolate);
          font-size: 0.95rem;
        }
        .filter-select {
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--cream-dark);
          background: var(--white);
          font-family: var(--font-body);
          font-size: 0.9rem;
          color: var(--text);
          outline: none;
        }
        .order-id-btn {
          background: none;
          border: none;
          font-family: monospace;
          font-weight: 700;
          color: var(--brown);
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
          font-size: 0.95rem;
        }
        .order-id-btn:hover {
          color: var(--chocolate);
        }
        .status-dropdown {
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid var(--cream-dark);
          font-size: 0.85rem;
          font-weight: 600;
          background: var(--white);
          cursor: pointer;
        }
        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }
        .page-info {
          font-size: 0.9rem;
          color: var(--text-light);
        }
      `}</style>

      {/* Toolbar */}
      <div className="orders-toolbar">
        <div className="filter-group">
          <label htmlFor="statusFilter" className="filter-label">Filter Status:</label>
          <select
            id="statusFilter"
            className="filter-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Orders</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-outline btn-sm" onClick={fetchOrders}>
          <FaRedo size={12} /> Refresh Orders
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner size={44} message="Fetching bakery orders..." />
      ) : error ? (
        <div className="empty-state card">
          <div className="empty-icon">⚠️</div>
          <h3>{error}</h3>
          <button className="btn btn-primary" onClick={fetchOrders} style={{ marginTop: '16px' }}>
            <FaRedo size={12} /> Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📦</div>
          <h3>No orders found</h3>
          <p>No orders match the current status filter ({statusFilter}).</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Update Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const id = order._id || order.orderId;
                const isCustom = Boolean(order.cakeDetails || order.isCustom);
                const orderAmount = Number(order.total || order.estimatedPrice) || 0;

                return (
                  <tr key={id}>
                    <td>
                      <button
                        type="button"
                        className="order-id-btn"
                        onClick={() => setSelectedOrder(order)}
                        title="Click to view details"
                      >
                        {order.orderId || id?.slice(-8)}
                      </button>
                    </td>
                    <td>{order.customer?.name || 'Customer'}</td>
                    <td>{order.customer?.phone || '—'}</td>
                    <td>
                      <span className={`badge ${isCustom ? 'badge-custom' : 'badge-regular'}`}>
                        {isCustom ? 'Custom' : 'Regular'}
                      </span>
                    </td>
                    <td>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })
                        : 'Recent'}
                    </td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <strong>₹{orderAmount.toLocaleString('en-IN')}</strong>
                    </td>
                    <td>
                      <select
                        className="status-dropdown"
                        value={order.status || 'Pending'}
                        onChange={(e) => handleStatusChange(id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px 12px' }}
                        onClick={() => setSelectedOrder(order)}
                        aria-label="View Order Details"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-bar">
          <button
            className="btn btn-outline btn-sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            <FaChevronLeft size={10} /> Prev
          </button>

          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn btn-outline btn-sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            Next <FaChevronRight size={10} />
          </button>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details: {selectedOrder.orderId || selectedOrder._id}</h3>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ color: 'var(--chocolate)', marginBottom: '8px' }}>Customer Information</h4>
                <div><strong>Name:</strong> {selectedOrder.customer?.name}</div>
                <div><strong>Phone:</strong> {selectedOrder.customer?.phone}</div>
                <div><strong>Email:</strong> {selectedOrder.customer?.email}</div>
                <div><strong>Address:</strong> {selectedOrder.customer?.address}</div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ color: 'var(--chocolate)', marginBottom: '8px' }}>Delivery Slot & Status</h4>
                <div><strong>Scheduled Date:</strong> {selectedOrder.deliveryDate} ({selectedOrder.deliveryTime})</div>
                <div><strong>Current Status:</strong> {selectedOrder.status}</div>
                <div><strong>Payment:</strong> {selectedOrder.paymentMethod || 'Cash on Delivery / Pickup'}</div>
                {selectedOrder.instructions && (
                  <div><strong>Special Instructions:</strong> {selectedOrder.instructions}</div>
                )}
              </div>

              <div>
                <h4 style={{ color: 'var(--chocolate)', marginBottom: '8px' }}>
                  {selectedOrder.cakeDetails ? 'Custom Cake Specifications' : 'Purchased Items'}
                </h4>

                {selectedOrder.cakeDetails ? (
                  <div style={{ background: 'var(--cream)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                    <div><strong>Type:</strong> {selectedOrder.cakeDetails.cakeType}</div>
                    <div><strong>Size:</strong> {selectedOrder.cakeDetails.size}</div>
                    <div><strong>Flavor:</strong> {selectedOrder.cakeDetails.flavor}</div>
                    <div><strong>Frosting:</strong> {selectedOrder.cakeDetails.frosting}</div>
                    {selectedOrder.cakeDetails.theme && <div><strong>Theme:</strong> {selectedOrder.cakeDetails.theme}</div>}
                    {selectedOrder.cakeDetails.message && <div><strong>Message:</strong> "{selectedOrder.cakeDetails.message}"</div>}
                    <div><strong>Quantity:</strong> {selectedOrder.cakeDetails.quantity || 1}</div>
                  </div>
                ) : selectedOrder.items ? (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {selectedOrder.items.map((it, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '8px 0',
                          borderBottom: '1px solid var(--cream-dark)',
                        }}
                      >
                        <span>
                          {it.name || it.product?.name} × {it.quantity}
                        </span>
                        <strong>
                          ₹{((Number(it.price || it.product?.price) || 0) * it.quantity).toLocaleString('en-IN')}
                        </strong>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '2px solid var(--cream-dark)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--chocolate)',
                  }}
                >
                  <span>Total:</span>
                  <span>₹{(Number(selectedOrder.total || selectedOrder.estimatedPrice) || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
