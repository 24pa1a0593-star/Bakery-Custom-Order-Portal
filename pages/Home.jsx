import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBirthdayCake, FaPalette, FaTruck, FaArrowRight } from 'react-icons/fa';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/products?featured=true');
        // Handle variations in API response: array, or { data: [...] }, or { products: [...] }
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.products || res.data.data || [];
        setFeaturedProducts(data.slice(0, 6));
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <>
      <style>{`
        /* Hero */
        .hero-section {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, var(--cream) 0%, #fae6ec 50%, var(--pink) 100%);
          position: relative;
          overflow: hidden;
          padding: 60px 0;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          align-items: center;
          gap: 40px;
        }
        .hero-title {
          font-family: var(--font-heading);
          font-size: 3.5rem;
          color: var(--chocolate);
          line-height: 1.15;
          margin-bottom: 24px;
          white-space: pre-line;
        }
        .hero-subtitle {
          font-size: 1.2rem;
          color: var(--text-light);
          line-height: 1.6;
          margin-bottom: 36px;
          max-width: 520px;
        }
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .hero-cake-card {
          position: relative;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, #fff, var(--cream-dark));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg);
          border: 10px solid var(--white);
        }
        .hero-cake-emoji {
          font-size: 10rem;
          user-select: none;
        }

        /* Features Strip */
        .features-strip {
          background: var(--white);
          padding: 60px 0;
          box-shadow: var(--shadow-sm);
        }
        .feature-card {
          text-align: center;
          padding: 30px 24px;
          border-radius: var(--radius);
          background: var(--cream);
          transition: var(--transition);
          border: 1px solid var(--cream-dark);
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow);
          background: var(--white);
        }
        .feature-icon-wrapper {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: var(--white);
          color: var(--brown);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          margin: 0 auto 20px;
          box-shadow: var(--shadow-sm);
        }
        .feature-card h3 {
          font-size: 1.25rem;
          color: var(--chocolate);
          margin-bottom: 10px;
        }
        .feature-card p {
          color: var(--text-light);
          font-size: 0.95rem;
        }

        /* Offers Banner */
        .offers-banner {
          background: linear-gradient(135deg, var(--gold) 0%, #b8960e 50%, var(--brown) 100%);
          color: var(--white);
          padding: 50px 30px;
          border-radius: var(--radius-lg);
          margin: 40px auto;
          box-shadow: var(--shadow-lg);
          text-align: center;
        }
        .offers-banner h2 {
          font-size: 2.2rem;
          margin-bottom: 12px;
        }
        .offers-banner p {
          font-size: 1.15rem;
          margin-bottom: 8px;
          color: #fffde7;
        }
        .promo-code-box {
          display: inline-block;
          background: rgba(0, 0, 0, 0.25);
          border: 2px dashed #fff;
          padding: 8px 24px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: 1.5px;
          margin: 16px 0 24px;
        }

        /* How it works */
        .steps-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: 40px;
        }
        .step-item {
          background: var(--white);
          padding: 36px 24px;
          border-radius: var(--radius);
          text-align: center;
          position: relative;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
        }
        .step-item:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow);
        }
        .step-badge {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--brown);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.2rem;
          margin: 0 auto 16px;
        }
        .step-emoji {
          font-size: 2.5rem;
          margin-bottom: 12px;
          display: block;
        }
        .step-item h4 {
          font-size: 1.2rem;
          color: var(--chocolate);
          margin-bottom: 8px;
        }
        .step-item p {
          color: var(--text-light);
          font-size: 0.9rem;
        }

        /* CTA Bottom */
        .cta-strip {
          background: var(--chocolate);
          color: var(--cream);
          padding: 70px 20px;
          text-align: center;
          margin-top: 60px;
          border-radius: var(--radius);
        }
        .cta-strip h2 {
          font-size: 2.5rem;
          color: var(--cream);
          margin-bottom: 16px;
        }
        .cta-strip p {
          color: rgba(255, 248, 240, 0.8);
          font-size: 1.1rem;
          margin-bottom: 30px;
        }

        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-title {
            font-size: 2.6rem;
          }
          .hero-subtitle {
            margin: 0 auto 30px;
          }
          .hero-actions {
            justify-content: center;
          }
          .hero-cake-card {
            width: 260px;
            height: 260px;
          }
          .hero-cake-emoji {
            font-size: 6.5rem;
          }
          .steps-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div>
              <h1 className="hero-title">
                {'Baked with Love,\nDelivered with Care'}
              </h1>
              <p className="hero-subtitle">
                Artisan cakes, cupcakes, and pastries crafted fresh daily for every special moment.
              </p>
              <div className="hero-actions">
                <Link to="/menu" className="btn btn-primary btn-lg">
                  Explore Menu <FaArrowRight size={14} />
                </Link>
                <Link to="/custom-order" className="btn btn-secondary btn-lg">
                  Order Custom Cake 🎂
                </Link>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-cake-card floating-element">
                <span className="hero-cake-emoji">🎂</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Strip */}
      <section className="features-strip">
        <div className="container">
          <div className="grid-3">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <FaBirthdayCake />
              </div>
              <h3>🌿 Fresh Daily</h3>
              <p>Baked fresh every morning with 100% natural and premium ingredients.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <FaPalette />
              </div>
              <h3>🎨 Custom Designs</h3>
              <p>Tailored themes, colors, and flavors handcrafted for your unique celebrations.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <FaTruck />
              </div>
              <h3>🚚 Fast Delivery</h3>
              <p>Reliable same-day and scheduled doorstep delivery across Mumbai.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 className="section-title">Our Bestsellers</h2>
            <p className="section-subtitle">Customer favorites baked to perfection</p>
          </div>

          {loading ? (
            <LoadingSpinner size={48} message="Fetching popular treats..." />
          ) : error ? (
            <div className="empty-state">
              <div className="empty-icon">⚠️</div>
              <h3>{error}</h3>
              <Link to="/menu" className="btn btn-primary" style={{ marginTop: '16px' }}>
                Browse Full Menu
              </Link>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🍰</div>
              <h3>No featured products available at the moment</h3>
              <Link to="/menu" className="btn btn-primary" style={{ marginTop: '16px' }}>
                Browse Full Menu
              </Link>
            </div>
          ) : (
            <div className="grid-3">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/menu" className="btn btn-outline btn-lg">
              View All Menu Items <FaArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Special Offers Banner */}
      <section className="container">
        <div className="offers-banner">
          <h2>🎉 Special Offer!</h2>
          <p>15% OFF on all custom cake orders this week!</p>
          <div className="promo-code-box">Use code: SWEET15</div>
          <div>
            <Link to="/custom-order" className="btn btn-primary btn-lg" style={{ background: 'var(--white)', color: 'var(--chocolate)' }}>
              Design Your Cake Now
            </Link>
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="section" style={{ background: 'rgba(245, 230, 211, 0.4)' }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three easy steps to your sweet celebration</p>
          </div>

          <div className="steps-container">
            <div className="step-item">
              <div className="step-badge">1</div>
              <span className="step-emoji">🛍️</span>
              <h4>Browse or Customize</h4>
              <p>Explore our artisan menu or design your bespoke dream cake with our interactive creator.</p>
            </div>

            <div className="step-item">
              <div className="step-badge">2</div>
              <span className="step-emoji">📝</span>
              <h4>Place Your Order</h4>
              <p>Choose your convenient delivery slot, provide address details, and confirm with ease.</p>
            </div>

            <div className="step-item">
              <div className="step-badge">3</div>
              <span className="step-emoji">🎂</span>
              <h4>Enjoy Fresh Bliss</h4>
              <p>Your freshly baked goods arrive safely right at your doorstep, ready to savor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA Banner */}
      <section className="container">
        <div className="cta-strip">
          <h2>Ready to Order?</h2>
          <p>Treat yourself and your loved ones with fresh, mouthwatering cakes and pastries.</p>
          <Link to="/menu" className="btn btn-secondary btn-lg">
            Order Now 🍰
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
