import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await api.post('/contact', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        message: formData.message.trim(),
      });

      setSubmitted(true);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Contact submit error:', err);
      const msg = err.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .contact-layout {
          display: grid;
          grid-template-columns: 1.1fr 1.3fr;
          gap: 48px;
          align-items: start;
        }
        .contact-info-card {
          background: var(--white);
          border-radius: var(--radius);
          padding: 36px;
          box-shadow: var(--shadow);
        }
        .contact-info-card h3 {
          font-family: var(--font-heading);
          color: var(--chocolate);
          font-size: 1.5rem;
          margin-bottom: 24px;
        }
        .contact-details-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 32px;
        }
        .contact-detail-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .contact-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--cream);
          color: var(--brown);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .contact-detail-text strong {
          display: block;
          color: var(--chocolate);
          font-size: 0.95rem;
          margin-bottom: 2px;
        }
        .contact-detail-text span, .contact-detail-text a {
          color: var(--text-light);
          font-size: 0.95rem;
        }
        .hours-table {
          width: 100%;
          margin-top: 8px;
          border-collapse: collapse;
          font-size: 0.88rem;
        }
        .hours-table td {
          padding: 4px 0;
          color: var(--text-light);
        }
        .map-placeholder-box {
          border: 2px dashed var(--brown);
          border-radius: var(--radius-sm);
          background: var(--cream);
          height: 160px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
          color: var(--brown);
        }
        .map-placeholder-title {
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 4px;
        }
        .map-placeholder-sub {
          font-size: 0.82rem;
          color: var(--text-light);
        }
        .contact-form-card {
          background: var(--white);
          border-radius: var(--radius);
          padding: 36px;
          box-shadow: var(--shadow);
        }
        .contact-form-card h3 {
          font-family: var(--font-heading);
          color: var(--chocolate);
          font-size: 1.5rem;
          margin-bottom: 24px;
        }
        .success-inline-msg {
          background: #e8f5e9;
          border: 1px solid #c8e6c9;
          border-radius: var(--radius-sm);
          padding: 20px;
          color: #2e7d32;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        @media (max-width: 868px) {
          .contact-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>

      <div className="page-header">
        <div className="container">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Questions, custom cake inquiries, or wholesale orders</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '80px' }}>
        <div className="contact-layout">
          {/* Left Column: Bakery Info */}
          <div className="contact-info-card">
            <h3>Bakery Information</h3>

            <ul className="contact-details-list">
              <li className="contact-detail-item">
                <div className="contact-icon-box">
                  <FaMapMarkerAlt />
                </div>
                <div className="contact-detail-text">
                  <strong>📍 Visit Us</strong>
                  <span>123 Sweet Street, Baker's Lane, Mumbai - 400001</span>
                </div>
              </li>

              <li className="contact-detail-item">
                <div className="contact-icon-box">
                  <FaPhoneAlt />
                </div>
                <div className="contact-detail-text">
                  <strong>📞 Call Us</strong>
                  <a href="tel:+919876543210">+91 98765 43210</a>
                </div>
              </li>

              <li className="contact-detail-item">
                <div className="contact-icon-box">
                  <FaEnvelope />
                </div>
                <div className="contact-detail-text">
                  <strong>✉️ Email Us</strong>
                  <a href="mailto:hello@sweetbliss.com">hello@sweetbliss.com</a>
                </div>
              </li>

              <li className="contact-detail-item">
                <div className="contact-icon-box">
                  <FaClock />
                </div>
                <div className="contact-detail-text" style={{ width: '100%' }}>
                  <strong>⏰ Opening Hours</strong>
                  <table className="hours-table">
                    <tbody>
                      <tr>
                        <td>Mon - Sat:</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>8:00 AM - 8:00 PM</td>
                      </tr>
                      <tr>
                        <td>Sunday:</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>9:00 AM - 6:00 PM</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </li>
            </ul>

            <div className="map-placeholder-box">
              <div className="map-placeholder-title">📍 Google Maps</div>
              <div className="map-placeholder-sub">
                Map embed available after deploying
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="contact-form-card">
            <h3>Send us a Message</h3>

            {submitted && (
              <div className="success-inline-msg fade-in">
                <FaCheckCircle size={24} />
                <div>
                  <strong>Message Sent!</strong>
                  <div>Thank you! We'll reply within 24 hours.</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  className={`form-control ${errors.name ? 'error' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="10-digit mobile number"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  Message <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="How can our bakers assist you today?"
                  className={`form-control ${errors.message ? 'error' : ''}`}
                  value={formData.message}
                  onChange={handleChange}
                />
                {errors.message && <div className="form-error">{errors.message}</div>}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '8px' }}
                disabled={submitting}
              >
                {submitting ? (
                  'Sending...'
                ) : (
                  <>
                    <FaPaperPlane size={14} /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
