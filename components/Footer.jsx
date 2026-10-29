import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <style>{`
        .footer-wrapper {
          background-color: var(--chocolate);
          color: var(--cream);
          padding-top: 60px;
          margin-top: 60px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr;
          gap: 40px;
          padding-bottom: 50px;
          border-bottom: 1px solid rgba(255, 248, 240, 0.15);
        }
        .footer-col h3 {
          font-family: var(--font-heading);
          color: var(--gold-light);
          margin-bottom: 18px;
          font-size: 1.3rem;
        }
        .footer-about-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .footer-about-logo span.emoji {
          font-size: 1.8rem;
        }
        .footer-about-logo span.name {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          color: var(--cream);
          font-weight: 700;
        }
        .footer-desc {
          color: rgba(255, 248, 240, 0.8);
          font-size: 0.95rem;
          line-height: 1.7;
          max-width: 380px;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-links a {
          color: rgba(255, 248, 240, 0.8);
          font-size: 0.95rem;
          transition: var(--transition);
        }
        .footer-links a:hover {
          color: var(--gold-light);
          padding-left: 4px;
        }
        .footer-contact-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          color: rgba(255, 248, 240, 0.85);
          font-size: 0.95rem;
        }
        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .footer-bottom {
          padding: 24px 0;
          text-align: center;
          font-size: 0.9rem;
          color: rgba(255, 248, 240, 0.6);
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
      <footer className="footer-wrapper">
        <div className="container">
          <div className="footer-grid">
            {/* Column 1: About */}
            <div className="footer-col">
              <div className="footer-about-logo">
                <span className="emoji">🎂</span>
                <span className="name">Sweet Bliss Bakery</span>
              </div>
              <p className="footer-desc">
                Crafting joyful memories with custom cakes, handcrafted pastries, and artisan baked goods. Freshly prepared daily with the finest ingredients and a dash of love.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-col">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/menu">Menu</Link></li>
                <li><Link to="/custom-order">Custom Order</Link></li>
                <li><Link to="/track-order">Track Order</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/admin/login">Admin</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div className="footer-col">
              <h3>Visit Us</h3>
              <ul className="footer-contact-list">
                <li className="footer-contact-item">
                  <span>📍</span>
                  <span>123 Sweet Street, Baker's Lane, Mumbai - 400001</span>
                </li>
                <li className="footer-contact-item">
                  <span>📞</span>
                  <span>+91 98765 43210</span>
                </li>
                <li className="footer-contact-item">
                  <span>✉️</span>
                  <span>hello@sweetbliss.com</span>
                </li>
                <li className="footer-contact-item">
                  <span>⏰</span>
                  <span>Mon-Sat: 8am-8pm, Sun: 9am-6pm</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2024 Sweet Bliss Bakery. Made with ❤️</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
