import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin' && redirect === '/') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirect);
      }
    } catch (err) {
      // error toast handled in context
    } finally {
      setSubmitting(false);
    }
  };

  const fillAdmin = () => {
    setEmail('admin@example.com');
    setPassword('admin123Password!');
  };

  const fillCustomer = () => {
    setEmail('john@example.com');
    setPassword('password123');
  };

  return (
    <div
      className="container"
      style={{
        padding: '4rem 1.25rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '75vh',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-logo" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>
            <BookOpen size={32} />
            <span>SkyBrisk<span style={{ color: 'var(--text-main)' }}>Books</span></span>
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Sign In to Your Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Manage your orders, book reviews, and reading library
          </p>
        </div>

        {/* Demo Account Quick-Fill Buttons */}
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            ⚡ 1-Click Demo Accounts:
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.75rem' }}
              onClick={fillAdmin}
            >
              <ShieldCheck size={14} style={{ color: 'var(--primary)' }} /> Admin Demo
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.75rem' }}
              onClick={fillCustomer}
            >
              <UserCheck size={14} style={{ color: 'var(--success)' }} /> Customer Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={submitting}
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account yet?{' '}
          <Link
            to={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            style={{ color: 'var(--primary)', fontWeight: 600 }}
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
