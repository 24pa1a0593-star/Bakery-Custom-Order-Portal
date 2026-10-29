import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', {
        email: email.trim(),
        password,
      });

      const token = res.data?.token || res.data?.adminToken;
      const user = res.data?.admin || res.data?.user || { email: email.trim(), username: 'Admin' };

      if (!token) {
        throw new Error('Token not returned by server');
      }

      login(token, user);
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (err) {
      console.error('Login failed:', err);
      const msg = err.response?.data?.message || 'Invalid email or password';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .admin-login-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--cream) 0%, var(--cream-dark) 50%, var(--pink) 100%);
          padding: 20px;
        }
        .admin-login-card {
          width: 100%;
          max-width: 420px;
          background: var(--white);
          border-radius: var(--radius-lg);
          padding: 40px 32px;
          box-shadow: var(--shadow-lg);
          border: 1px solid rgba(139, 94, 60, 0.1);
          text-align: center;
        }
        .admin-login-logo {
          font-size: 3rem;
          margin-bottom: 8px;
        }
        .admin-login-title {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          color: var(--chocolate);
          margin-bottom: 6px;
        }
        .admin-login-subtitle {
          font-size: 0.95rem;
          color: var(--text-light);
          margin-bottom: 28px;
        }
        .admin-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .admin-input-icon {
          position: absolute;
          left: 14px;
          color: var(--gray-500);
          font-size: 1rem;
        }
        .admin-input-field {
          padding-left: 42px;
          padding-right: 42px;
        }
        .password-toggle-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          color: var(--gray-500);
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
        }
        .admin-login-note {
          margin-top: 24px;
          font-size: 0.8rem;
          color: var(--gray-500);
          line-height: 1.4;
        }
      `}</style>

      <div className="admin-login-screen">
        <div className="admin-login-card">
          <div className="admin-login-logo">🎂</div>
          <h1 className="admin-login-title">Sweet Bliss Bakery</h1>
          <p className="admin-login-subtitle">Admin Management Portal</p>

          {errorMessage && (
            <div
              style={{
                background: '#ffebee',
                color: '#c62828',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '20px',
                fontSize: '0.88rem',
              }}
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} noValidate>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label htmlFor="adminEmail">Email Address</label>
              <div className="admin-input-wrapper">
                <FaEnvelope className="admin-input-icon" />
                <input
                  type="email"
                  id="adminEmail"
                  className="form-control admin-input-field"
                  placeholder="admin@sweetbliss.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ textAlign: 'left' }}>
              <label htmlFor="adminPassword">Password</label>
              <div className="admin-input-wrapper">
                <FaLock className="admin-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="adminPassword"
                  className="form-control admin-input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '12px' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Login to Admin Portal'}
            </button>
          </form>

          <p className="admin-login-note">
            🔒 Protected admin area. Unauthorized access prohibited.
          </p>

          <div style={{ marginTop: '16px' }}>
            <Link to="/" style={{ color: 'var(--brown)', fontSize: '0.85rem' }}>
              ← Return to Sweet Bliss Store
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
