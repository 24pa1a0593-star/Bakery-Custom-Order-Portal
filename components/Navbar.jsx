import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes, FaUserShield } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getItemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const itemCount = getItemCount();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <style>{`
        .navbar-wrapper {
          position: sticky;
          top: 0;
          background: var(--white);
          box-shadow: var(--shadow-sm);
          z-index: 1000;
          transition: var(--transition);
        }
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .brand-emoji {
          font-size: 2rem;
          line-height: 1;
        }
        .brand-text {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--chocolate);
          letter-spacing: -0.5px;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 28px;
          list-style: none;
        }
        .nav-item-link {
          font-family: var(--font-body);
          font-weight: 500;
          font-size: 1rem;
          color: var(--text);
          text-decoration: none;
          position: relative;
          padding: 6px 0;
          transition: color 0.2s ease;
        }
        .nav-item-link:hover {
          color: var(--brown);
        }
        .nav-item-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--brown);
          transition: width 0.3s ease;
        }
        .nav-item-link:hover::after,
        .nav-item-link.active::after {
          width: 100%;
        }
        .nav-item-link.active {
          color: var(--brown);
          font-weight: 600;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .cart-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--cream);
          color: var(--brown);
          transition: var(--transition);
        }
        .cart-btn:hover {
          background: var(--cream-dark);
          color: var(--chocolate);
          transform: translateY(-2px);
        }
        .cart-badge {
          position: absolute;
          top: -2px;
          right: -4px;
          background: #e53935;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 700;
          min-width: 20px;
          height: 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .admin-link-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: var(--cream-dark);
          color: var(--chocolate);
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 50px;
          transition: var(--transition);
        }
        .admin-link-pill:hover {
          background: var(--pink);
          color: var(--chocolate);
        }
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--chocolate);
          cursor: pointer;
          padding: 8px;
        }
        @media (max-width: 868px) {
          .mobile-toggle {
            display: block;
          }
          .navbar-links {
            position: fixed;
            top: 80px;
            left: 0;
            width: 100%;
            background: var(--white);
            flex-direction: column;
            padding: 24px;
            gap: 20px;
            box-shadow: 0 10px 20px rgba(61,26,0,0.1);
            transform: translateY(-150%);
            transition: transform 0.35s ease-in-out;
            border-bottom: 2px solid var(--cream-dark);
          }
          .navbar-links.open {
            transform: translateY(0);
          }
          .navbar-links li {
            width: 100%;
            text-align: center;
          }
          .nav-item-link {
            font-size: 1.1rem;
            display: inline-block;
          }
        }
      `}</style>
      <header className="navbar-wrapper">
        <div className="container navbar-container">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            <span className="brand-emoji">🎂</span>
            <span className="brand-text">Sweet Bliss Bakery</span>
          </Link>

          <nav>
            <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `nav-item-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                  end
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/menu"
                  className={({ isActive }) =>
                    `nav-item-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Menu
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/custom-order"
                  className={({ isActive }) =>
                    `nav-item-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Custom Order
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/track-order"
                  className={({ isActive }) =>
                    `nav-item-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Track Order
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `nav-item-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="navbar-actions">
            {isAuthenticated && (
              <Link to="/admin" className="admin-link-pill" title="Go to Admin Portal">
                <FaUserShield />
                <span>Admin</span>
              </Link>
            )}

            <Link to="/cart" className="cart-btn" aria-label="Shopping Cart">
              <FaShoppingCart size={19} />
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>

            <button
              className="mobile-toggle"
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
