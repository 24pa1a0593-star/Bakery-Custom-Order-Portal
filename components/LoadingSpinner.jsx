import React from 'react';

const LoadingSpinner = ({ size = 40, message = '' }) => (
  <div className="spinner-center" style={{ flexDirection: 'column', gap: '16px' }}>
    <div className="spinner" style={{ width: size, height: size }} />
    {message && <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{message}</p>}
  </div>
);

export default LoadingSpinner;
