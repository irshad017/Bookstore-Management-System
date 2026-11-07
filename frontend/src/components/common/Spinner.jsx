import React from 'react';

const Spinner = ({ size = 'medium', message = 'Loading...' }) => {
  const dimension = size === 'small' ? '1.25rem' : size === 'large' ? '3rem' : '2rem';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        gap: '1rem',
      }}
    >
      <div
        className="spinner"
        style={{ width: dimension, height: dimension }}
      />
      {message && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Spinner;
