import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const SIZES = [
  { id: '6-inch', label: '6-inch (Serves 4-6)', price: 500 },
  { id: '8-inch', label: '8-inch (Serves 8-10)', price: 800 },
  { id: '10-inch', label: '10-inch (Serves 14-16)', price: 1200 },
  { id: '12-inch', label: '12-inch (Serves 20-25)', price: 1800 },
];

const FLAVORS = [
  { value: 'Vanilla', label: 'Vanilla', premium: 0 },
  { value: 'Chocolate', label: 'Chocolate', premium: 0 },
  { value: 'Strawberry', label: 'Strawberry', premium: 0 },
  { value: 'Lemon', label: 'Lemon', premium: 0 },
  { value: 'Red Velvet', label: 'Red Velvet (+₹100)', premium: 100 },
  { value: 'Black Forest', label: 'Black Forest (+₹100)', premium: 100 },
  { value: 'Hazelnut', label: 'Hazelnut (+₹100)', premium: 100 },
];

const FROSTINGS = [
  { value: 'Buttercream', label: 'Buttercream', premium: 0 },
  { value: 'Whipped Cream', label: 'Whipped Cream', premium: 0 },
  { value: 'Ganache', label: 'Chocolate Ganache', premium: 0 },
  { value: 'Fondant', label: 'Fondant (+₹100)', premium: 100 },
  { value: 'Cream Cheese', label: 'Cream Cheese (+₹100)', premium: 100 },
];

const CustomOrder = () => {
  const navigate = useNavigate();

  // Tomorrow's date string in YYYY-MM-DD
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [formData, setFormData] = useState({
    cakeType: 'Birthday Cake',
    size: '8-inch',
    flavor: 'Vanilla',
    frosting: 'Buttercream',
    theme: '',
    message: '',
    quantity: 1,
    deliveryDate: tomorrowStr,
    deliveryTime: 'Morning (9am-12pm)',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    specialInstructions: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Price calculations
  const selectedSizeObj = SIZES.find((s) => s.id === formData.size) || SIZES[1];
  const selectedFlavorObj = FLAVORS.find((f) => f.value === formData.flavor) || FLAVORS[0];
  const selectedFrostingObj = FROSTINGS.find((fr) => fr.value === formData.frosting) || FROSTINGS[0];

  const basePrice = selectedSizeObj.price;
  const flavorPremium = selectedFlavorObj.premium;
  const frostingPremium = selectedFrostingObj.premium;
  const messageFee = formData.message.trim() ? 50 : 0;
  const subtotalPerCake = basePrice + flavorPremium + frostingPremium + messageFee;
  const totalEstimatedPrice = subtotalPerCake * Math.max(1, Number(formData.quantity) || 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.cakeType) newErrors.cakeType = 'Please select cake type';
    if (!formData.size) newErrors.size = 'Please choose a cake size';
    if (!formData.flavor) newErrors.flavor = 'Please select a flavor';
    if (!formData.frosting) newErrors.frosting = 'Please select frosting';

    const qty = Number(formData.quantity);
    if (!qty || qty < 1 || qty > 10) {
      newErrors.quantity = 'Quantity must be between 1 and 10';
    }

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Delivery date is required';
    } else if (formData.deliveryDate < tomorrowStr) {
      newErrors.deliveryDate = 'Delivery date must be at least tomorrow';
    }

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Full name is required';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.customerPhone.trim())) {
      newErrors.customerPhone = 'Must be a valid 10-digit Indian phone number (starting with 6-9)';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail.trim())) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
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
      const cakeDetailsObj = {
        cakeType: formData.cakeType,
        size: formData.size,
        flavor: formData.flavor,
        frosting: formData.frosting,
        theme: formData.theme,
        message: formData.message,
        quantity: Number(formData.quantity),
      };

      const payload = {
        customDetails: cakeDetailsObj,
        cakeDetails: cakeDetailsObj,
        customer: {
          name: formData.customerName.trim(),
          phone: formData.customerPhone.trim(),
          email: formData.customerEmail.trim(),
          address: formData.deliveryAddress.trim(),
        },
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime,
        instructions: formData.specialInstructions,
        estimatedPrice: totalEstimatedPrice,
      };

      const res = await api.post('/orders/custom', payload);
      const resData = res.data?.data || res.data?.order || res.data;
      const orderId = resData.orderId || resData._id || resData.id || 'BKR' + Date.now().toString().slice(-6);

      toast.success('Custom order submitted successfully!');
      navigate(`/order-confirmation/${orderId}`, {
        state: {
          orderId,
          customer: payload.customer,
          cakeDetails: payload.cakeDetails,
          customDetails: payload.customDetails,
          deliveryDate: payload.deliveryDate,
          deliveryTime: payload.deliveryTime,
          estimatedPrice: totalEstimatedPrice,
          total: resData.total || totalEstimatedPrice,
          isCustom: true,
        },
      });
    } catch (err) {
      console.error('Error submitting custom cake order:', err);
      const msg = err.response?.data?.message || 'Failed to place custom order. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .custom-order-layout {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 40px;
          align-items: start;
        }
        .form-section-card {
          background: var(--white);
          border-radius: var(--radius);
          padding: 32px;
          box-shadow: var(--shadow);
          margin-bottom: 24px;
        }
        .form-section-card h3 {
          font-family: var(--font-heading);
          color: var(--chocolate);
          font-size: 1.4rem;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid var(--cream-dark);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .size-radio-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .size-radio-label {
          display: flex;
          flex-direction: column;
          padding: 14px 16px;
          border: 2px solid var(--cream-dark);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition);
          background: var(--cream);
        }
        .size-radio-label:hover {
          border-color: var(--pink-dark);
          background: var(--white);
        }
        .size-radio-label.selected {
          border-color: var(--brown);
          background: #fff9f4;
          box-shadow: 0 0 0 2px rgba(139, 94, 60, 0.2);
        }
        .size-radio-name {
          font-weight: 600;
          color: var(--text);
          font-size: 0.95rem;
        }
        .size-radio-price {
          color: var(--brown);
          font-weight: 700;
          font-size: 1.05rem;
          margin-top: 4px;
        }
        /* Sticky Price Estimator Sidebar */
        .price-estimator-sidebar {
          position: sticky;
          top: 100px;
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: var(--shadow-lg);
          padding: 32px;
          border: 1px solid var(--cream-dark);
        }
        .estimator-title {
          font-family: var(--font-heading);
          color: var(--chocolate);
          font-size: 1.5rem;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid var(--cream-dark);
        }
        .price-breakdown-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }
        .price-breakdown-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          color: var(--text-light);
        }
        .price-breakdown-item.bold {
          font-weight: 600;
          color: var(--text);
          border-top: 1px dashed var(--cream-dark);
          padding-top: 12px;
        }
        .price-total-box {
          background: var(--cream);
          padding: 18px;
          border-radius: var(--radius-sm);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border: 1px solid var(--cream-dark);
        }
        .price-total-label {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--chocolate);
        }
        .price-total-amount {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--brown);
          font-family: var(--font-heading);
        }
        .estimator-note {
          font-size: 0.82rem;
          color: var(--gray-500);
          line-height: 1.4;
          margin-bottom: 16px;
        }
        .payment-pill {
          background: #e8f5e9;
          color: #2e7d32;
          font-weight: 600;
          font-size: 0.88rem;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          text-align: center;
        }
        @media (max-width: 900px) {
          .custom-order-layout {
            grid-template-columns: 1fr;
          }
          .price-estimator-sidebar {
            position: static;
            margin-top: 24px;
          }
        }
      `}</style>

      <div className="page-header">
        <div className="container">
          <h1>Custom Cake Designer</h1>
          <p>Handcraft your dream cake with personalized sizes, flavors, and artisanal themes</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '80px' }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="custom-order-layout">
            {/* Left Column: Form Fields */}
            <div>
              {/* Section 1: Cake Details */}
              <div className="form-section-card">
                <h3>🎂 1. Cake Details</h3>

                {/* Cake Type */}
                <div className="form-group">
                  <label htmlFor="cakeType">
                    Occasion / Cake Type <span className="required">*</span>
                  </label>
                  <select
                    id="cakeType"
                    name="cakeType"
                    className={`form-control ${errors.cakeType ? 'error' : ''}`}
                    value={formData.cakeType}
                    onChange={handleChange}
                  >
                    <option value="Birthday Cake">Birthday Cake</option>
                    <option value="Wedding Cake">Wedding Cake</option>
                    <option value="Anniversary Cake">Anniversary Cake</option>
                    <option value="Baby Shower Cake">Baby Shower Cake</option>
                    <option value="Graduation Cake">Graduation Cake</option>
                    <option value="Other">Other Custom Cake</option>
                  </select>
                  {errors.cakeType && <div className="form-error">{errors.cakeType}</div>}
                </div>

                {/* Cake Size */}
                <div className="form-group">
                  <label>
                    Size <span className="required">*</span>
                  </label>
                  <div className="size-radio-grid">
                    {SIZES.map((size) => (
                      <label
                        key={size.id}
                        className={`size-radio-label ${
                          formData.size === size.id ? 'selected' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="size"
                          value={size.id}
                          checked={formData.size === size.id}
                          onChange={handleChange}
                          style={{ display: 'none' }}
                        />
                        <span className="size-radio-name">{size.label}</span>
                        <span className="size-radio-price">₹{size.price.toLocaleString('en-IN')}</span>
                      </label>
                    ))}
                  </div>
                  {errors.size && <div className="form-error">{errors.size}</div>}
                </div>

                {/* Flavor & Frosting */}
                <div className="grid-2">
                  <div className="form-group">
                    <label htmlFor="flavor">
                      Flavor <span className="required">*</span>
                    </label>
                    <select
                      id="flavor"
                      name="flavor"
                      className={`form-control ${errors.flavor ? 'error' : ''}`}
                      value={formData.flavor}
                      onChange={handleChange}
                    >
                      {FLAVORS.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                    {errors.flavor && <div className="form-error">{errors.flavor}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="frosting">
                      Frosting <span className="required">*</span>
                    </label>
                    <select
                      id="frosting"
                      name="frosting"
                      className={`form-control ${errors.frosting ? 'error' : ''}`}
                      value={formData.frosting}
                      onChange={handleChange}
                    >
                      {FROSTINGS.map((fr) => (
                        <option key={fr.value} value={fr.value}>
                          {fr.label}
                        </option>
                      ))}
                    </select>
                    {errors.frosting && <div className="form-error">{errors.frosting}</div>}
                  </div>
                </div>

                {/* Theme Description */}
                <div className="form-group">
                  <label htmlFor="theme">Theme & Design Description</label>
                  <textarea
                    id="theme"
                    name="theme"
                    className="form-control"
                    placeholder="Describe the theme, colors, decorations, toppers, or references..."
                    value={formData.theme}
                    onChange={handleChange}
                  />
                </div>

                {/* Message on Cake */}
                <div className="form-group">
                  <label htmlFor="message">Message on Cake (+₹50 for custom hand lettering)</label>
                  <input
                    type="text"
                    id="message"
                    name="message"
                    className="form-control"
                    placeholder="e.g., Happy Birthday Sarah!"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                {/* Quantity & Delivery Slot */}
                <div className="grid-3">
                  <div className="form-group">
                    <label htmlFor="quantity">
                      Quantity <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      max="10"
                      className={`form-control ${errors.quantity ? 'error' : ''}`}
                      value={formData.quantity}
                      onChange={handleChange}
                    />
                    {errors.quantity && <div className="form-error">{errors.quantity}</div>}
                  </div>

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
              </div>

              {/* Section 2: Customer Details */}
              <div className="form-section-card">
                <h3>👤 2. Delivery & Contact Details</h3>

                <div className="grid-2">
                  <div className="form-group">
                    <label htmlFor="customerName">
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      placeholder="e.g., Ananya Sharma"
                      className={`form-control ${errors.customerName ? 'error' : ''}`}
                      value={formData.customerName}
                      onChange={handleChange}
                    />
                    {errors.customerName && <div className="form-error">{errors.customerName}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="customerPhone">
                      Phone Number <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="customerPhone"
                      name="customerPhone"
                      placeholder="10-digit mobile number"
                      className={`form-control ${errors.customerPhone ? 'error' : ''}`}
                      value={formData.customerPhone}
                      onChange={handleChange}
                    />
                    {errors.customerPhone && <div className="form-error">{errors.customerPhone}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="customerEmail">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    placeholder="e.g., ananya@example.com"
                    className={`form-control ${errors.customerEmail ? 'error' : ''}`}
                    value={formData.customerEmail}
                    onChange={handleChange}
                  />
                  {errors.customerEmail && <div className="form-error">{errors.customerEmail}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="deliveryAddress">
                    Delivery Address <span className="required">*</span>
                  </label>
                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    rows="3"
                    placeholder="Flat/House No, Building, Street, Area, Pincode"
                    className={`form-control ${errors.deliveryAddress ? 'error' : ''}`}
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                  />
                  {errors.deliveryAddress && (
                    <div className="form-error">{errors.deliveryAddress}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="specialInstructions">Special Instructions (Optional)</label>
                  <textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    rows="2"
                    placeholder="Dietary requests (eggless, less sugar), delivery gate code, etc."
                    className="form-control"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Price Estimator */}
            <aside>
              <div className="price-estimator-sidebar">
                <h3 className="estimator-title">Estimated Price</h3>

                <ul className="price-breakdown-list">
                  <li className="price-breakdown-item">
                    <span>Base ({selectedSizeObj.label.split(' ')[0]}):</span>
                    <span>₹{basePrice.toLocaleString('en-IN')}</span>
                  </li>

                  {flavorPremium > 0 && (
                    <li className="price-breakdown-item">
                      <span>Flavor Premium ({formData.flavor}):</span>
                      <span>+₹{flavorPremium}</span>
                    </li>
                  )}

                  {frostingPremium > 0 && (
                    <li className="price-breakdown-item">
                      <span>Frosting Premium ({formData.frosting}):</span>
                      <span>+₹{frostingPremium}</span>
                    </li>
                  )}

                  {messageFee > 0 && (
                    <li className="price-breakdown-item">
                      <span>Custom Message Piping:</span>
                      <span>+₹{messageFee}</span>
                    </li>
                  )}

                  <li className="price-breakdown-item bold">
                    <span>Subtotal per cake:</span>
                    <span>₹{subtotalPerCake.toLocaleString('en-IN')}</span>
                  </li>

                  <li className="price-breakdown-item">
                    <span>Quantity:</span>
                    <span>× {Math.max(1, Number(formData.quantity) || 1)}</span>
                  </li>
                </ul>

                <div className="price-total-box">
                  <span className="price-total-label">TOTAL:</span>
                  <span className="price-total-amount">
                    ₹{totalEstimatedPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="estimator-note">
                  * Final price is calculated and confirmed by our bakery specialists based on intricate design complexity.
                </p>

                <div className="payment-pill" style={{ marginBottom: '20px' }}>
                  💵 Cash on Delivery / Pickup Only
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  disabled={submitting}
                >
                  {submitting ? 'Placing Order...' : 'Submit Custom Order 🎂'}
                </button>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </>
  );
};

export default CustomOrder;
