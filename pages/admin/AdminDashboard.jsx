import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaHourglassHalf, FaBirthdayCake, FaEnvelope, FaArrowRight, FaRedo } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const AdminDashboard = () => {
  const { adminUser } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalMessages: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch stats
      let statsData = {
        totalOrders: 0,
        pendingOrders: 0,
        totalProducts: 0,
        totalMessages: 0,
      };

      try {
        const statsRes = await api.get('/admin/stats');
        statsData = statsRes.data?.stats || statsRes.data || statsData;
      } catch (err) {
        console.warn('Could not fetch /admin/stats, will calculate from orders & products', err);
      }

      // Fetch orders to populate recent orders & fallback stats
      const ordersRes = await api.get('/admin/orders', { params: { limit: 5 } });
      const orders = Array.isArray(ordersRes.data)
        ? ordersRes.data
        : ordersRes.data?.orders || ordersRes.data?.data || [];

      setRecentOrders(orders.slice(0, 5));

      // If stats were not populated from /admin/stats
      if (!statsData.totalOrders && orders.length) {
        statsData.totalOrders = ordersRes.data?.total || orders.length;
        statsData.pendingOrders = orders.filter((o) => (o.status || '').toLowerCase() === 'pending').length;
      }

      // Products count fallback
      if (!statsData.totalProducts) {
        try {
          const prodRes = await api.get('/admin/products');
          const prods = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data?.products || [];
          statsData.totalProducts = prods.length;
        } catch {
          // ignore
        }
      }

      setStats(statsData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
    <AdminLayout title="Dashboard Overview">
      <style>{`
        .admin-welcome-banner {
          margin-bottom: 28px;
        }
        .admin-welcome-banner h2 {
          font-family: var(--font-heading);
          color: var(--chocolate);
          font-size: 1.8rem;
          margin-bottom: 6px;
        }
        .admin-welcome-banner p {
          color: var(--text-light);
          font-size: 0.95rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 36px;
        }
        .stat-card {
          background: var(--white);
          border-radius: var(--radius);
          padding: 24px;
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          gap: 18px;
          border: 1px solid var(--cream-dark);
          transition: var(--transition);
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow);
        }
        .stat-card.highlight {
          background: #fff8e1;
          border-color: #ffe082;
        }
        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          background: var(--cream);
          color: var(--brown);
        }
        .stat-card.highlight .stat-icon-wrapper {
          background: #ffecb3;
          color: #f57f17;
        }
        .stat-value {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--chocolate);
          line-height: 1.1;
        }
        .stat-label {
          font-size: 0.88rem;
          color: var(--text-light);
          margin-top: 4px;
        }
        .recent-orders-card {
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--cream-dark);
          overflow: hidden;
        }
        .recent-orders-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--cream-dark);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .recent-orders-header h3 {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          color: var(--chocolate);
          margin: 0;
        }
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="admin-welcome-banner">
        <h2>
          Welcome back, {adminUser?.username || adminUser?.name || 'Admin'}! 👋
        </h2>
        <p>Here is what's happening in Sweet Bliss Bakery today.</p>
      </div>

      {loading ? (
        <LoadingSpinner size={44} message="Gathering bakery statistics..." />
      ) : error ? (
        <div className="empty-state card">
          <div className="empty-icon">⚠️</div>
          <h3>{error}</h3>
          <button className="btn btn-primary" onClick={fetchDashboardData} style={{ marginTop: '16px' }}>
            <FaRedo size={12} /> Reload Dashboard
          </button>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <FaBox />
              </div>
              <div>
                <div className="stat-value">{stats.totalOrders || 0}</div>
                <div className="stat-label">Total Orders</div>
              </div>
            </div>

            <div className="stat-card highlight">
              <div className="stat-icon-wrapper">
                <FaHourglassHalf />
              </div>
              <div>
                <div className="stat-value">{stats.pendingOrders || 0}</div>
                <div className="stat-label">Pending Orders</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <FaBirthdayCake />
              </div>
              <div>
                <div className="stat-value">{stats.totalProducts || 0}</div>
                <div className="stat-label">Total Products</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <FaEnvelope />
              </div>
              <div>
                <div className="stat-value">{stats.totalMessages || 0}</div>
                <div className="stat-label">Contact Messages</div>
              </div>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="recent-orders-card">
            <div className="recent-orders-header">
              <h3>Recent Customer Orders</h3>
              <Link to="/admin/orders" className="btn btn-outline btn-sm">
                View All Orders <FaArrowRight size={12} />
              </Link>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-light)' }}>
                        No orders recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((ord) => (
                      <tr key={ord._id || ord.orderId}>
                        <td>
                          <strong style={{ fontFamily: 'monospace' }}>
                            {ord.orderId || ord._id?.slice(-8)}
                          </strong>
                        </td>
                        <td>{ord.customer?.name || 'Anonymous'}</td>
                        <td>
                          <span
                            className={`badge ${
                              ord.cakeDetails || ord.isCustom ? 'badge-custom' : 'badge-regular'
                            }`}
                          >
                            {ord.cakeDetails || ord.isCustom ? 'Custom' : 'Standard'}
                          </span>
                        </td>
                        <td>{getStatusBadge(ord.status)}</td>
                        <td>
                          <strong>
                            ₹{(Number(ord.total || ord.estimatedPrice) || 0).toLocaleString('en-IN')}
                          </strong>
                        </td>
                        <td>
                          {ord.createdAt
                            ? new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                              })
                            : 'Today'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
