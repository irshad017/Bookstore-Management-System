import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Lock, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { error } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    password: '',
    confirmPassword: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        postalCode: user.address?.postalCode || '',
        country: user.address?.country || 'India',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      error('New passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const updatePayload = {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
      };

      if (formData.password) {
        updatePayload.password = formData.password;
      }

      await updateProfile(updatePayload);
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      // Handled in context
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.25rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>Account Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage your personal information, address, and password
        </p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>{user?.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user?.email}</p>
              <span className={`badge ${user?.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`} style={{ marginTop: '0.25rem' }}>
                Role: {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>

          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>Personal Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                className="form-input"
                value={formData.email}
                style={{ backgroundColor: 'var(--bg-subtle)', cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>Default Delivery Address</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Street Address</label>
              <input
                type="text"
                name="street"
                className="form-input"
                placeholder="House / Flat / Street"
                value={formData.street}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                className="form-input"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                name="state"
                className="form-input"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Postal / PIN Code</label>
              <input
                type="text"
                name="postalCode"
                className="form-input"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <input
                type="text"
                name="country"
                className="form-input"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>

          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>Change Password (Optional)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Leave blank to keep current"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            <Save size={18} />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
