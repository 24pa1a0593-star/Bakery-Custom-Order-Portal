import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { FaChartBar, FaBox, FaBirthdayCake, FaSignOutAlt, FaStore, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLayout = ({ children, title }) => {
  const { adminUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <>
      <style>{`
        .admin-wrapper {
          display: flex;
          min-height: 100vh;
          background: #fdfaf7;
        }
        .admin-sidebar {
          width: 250px;
          background-color: var(--chocolate);
          color: var(--cream);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          box-shadow: 4px 0 15px rgba(0,0,0,0.1);
        }
        .admin-brand {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255, 248, 240, 0.12);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .admin-brand h2 {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          color: var(--cream);
          margin: 0;
        }
        .admin-user-info {
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0,0,0,0.15);
          border-bottom: 1px solid rgba(255, 248, 240, 0.08);
        }
        .admin-avatar {
          font-size: 2rem;
          color: var(--gold-light);
        }
        .admin-user-details {
          overflow: hidden;
        }
        .admin-user-name {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--cream);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .admin-user-role {
          font-size: 0.78rem;
          color: var(--pink);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .admin-nav {
          flex: 1;
          padding: 20px 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          color: rgba(255, 248, 240, 0.85);
          font-size: 0.95rem;
          font-weight: 500;
          text-decoration: none;
          transition: var(--transition);
        }
        .admin-nav-item:hover {
          background: rgba(139, 94, 60, 0.35);
          color: var(--white);
          padding-left: 24px;
        }
        .admin-nav-item.active {
          background: var(--brown);
          color: var(--white);
          border-left: 4px solid var(--gold);
        }
        .admin-sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(255, 248, 240, 0.1);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .admin-store-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          color: var(--cream);
          font-size: 0.9rem;
          background: rgba(255, 255, 255, 0.08);
          transition: var(--transition);
        }
        .admin-store-link:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        .admin-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          background: transparent;
          border: 1px solid rgba(229, 57, 53, 0.4);
          color: #ff8a80;
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          width: 100%;
        }
        .admin-logout-btn:hover {
          background: #e53935;
          color: var(--white);
        }
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          min-width: 0;
        }
        .admin-topbar {
          background: var(--white);
          padding: 20px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--gray-200);
          box-shadow: var(--shadow-sm);
        }
        .admin-topbar h1 {
          font-size: 1.6rem;
          color: var(--chocolate);
          margin: 0;
        }
        .admin-content {
          padding: 32px;
          flex: 1;
        }
        @media (max-width: 868px) {
          .admin-wrapper {
            flex-direction: column;
          }
          .admin-sidebar {
            width: 100%;
          }
          .admin-nav {
            flex-direction: row;
            overflow-x: auto;
            padding: 10px;
          }
          .admin-nav-item {
            padding: 8px 14px;
            white-space: nowrap;
          }
          .admin-content {
            padding: 20px 16px;
          }
          .admin-topbar {
            padding: 16px;
          }
        }
      `}</style>
      <div className="admin-wrapper">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <span style={{ fontSize: '1.8rem' }}>🎂</span>
            <h2>Sweet Bliss Admin</h2>
          </div>

          <div className="admin-user-info">
            <FaUserCircle className="admin-avatar" />
            <div className="admin-user-details">
              <div className="admin-user-name">
                {adminUser?.username || adminUser?.name || 'Administrator'}
              </div>
              <div className="admin-user-role">{adminUser?.email || 'Admin Portal'}</div>
            </div>
          </div>

          <ul className="admin-nav">
            <li>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `admin-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <FaChartBar />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `admin-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <FaBox />
                <span>Orders</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `admin-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <FaBirthdayCake />
                <span>Products</span>
              </NavLink>
            </li>
          </ul>

          <div className="admin-sidebar-footer">
            <Link to="/" className="admin-store-link" target="_blank" rel="noopener noreferrer">
              <FaStore />
              <span>View Storefront</span>
            </Link>
            <button className="admin-logout-btn" onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="admin-main">
          <header className="admin-topbar">
            <h1>{title || 'Admin Dashboard'}</h1>
          </header>
          <div className="admin-content">{children}</div>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
