import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from './Spinner';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner message="Authenticating session..." />;
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--danger)', marginBottom: '1rem' }}>
          403 - Access Denied
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          You do not have administrative privileges to access this page.
        </p>
        <a href="/" className="btn btn-primary">
          Return to Homepage
        </a>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
