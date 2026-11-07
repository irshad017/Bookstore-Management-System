import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { error } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect') || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      error('Passwords do not match. Please verify and try again.');
      return;
    }

    if (formData.password.length < 6) {
      error('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      await register(formData.name, formData.email, formData.password, 'customer');
      navigate(redirect);
    } catch (err) {
      // Error handled by context
    } finally {
      setSubmitting(false);
    }
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
          maxWidth: '480px',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-logo" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>
            <BookOpen size={32} />
            <span>SkyBrisk<span style={{ color: 'var(--text-main)' }}>Books</span></span>
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Create Your Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Join thousands of avid readers and manage your book collection
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="name"
                className="form-input"
                required
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
              />
              <User
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
            <label className="form-label">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                className="form-input"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
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
            <label className="form-label">Phone Number (Optional)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Phone
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
            <label className="form-label">Password * (Min. 6 chars)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                name="password"
                className="form-input"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
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

          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
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
            <span>{submitting ? 'Creating Account...' : 'Sign Up'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link
            to={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            style={{ color: 'var(--primary)', fontWeight: 600 }}
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
