import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Package,
  BookOpen,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileText,
  ExternalLink,
} from 'lucide-react';
import api from '../../api/axiosClient';
import Spinner from '../../components/common/Spinner';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data.data);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Spinner message="Loading Admin Intelligence Dashboard..." />;

  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalBooks = 0,
    totalUsers = 0,
    ordersByStatus = {},
    lowStockBooks = [],
    recentOrders = [],
    genreStats = [],
  } = stats || {};

  return (
    <div className="container" style={{ padding: '3rem 1.25rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
            Staff Administration Hub
          </span>
          <h1 style={{ fontSize: '2.25rem' }}>Store Executive Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Real-time telemetry, revenue analytics, and inventory management
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/books" className="btn btn-secondary">
            <BookOpen size={16} /> Manage Books
          </Link>
          <Link to="/admin/orders" className="btn btn-primary">
            <Package size={16} /> Manage Orders
          </Link>
          <a
            href="http://localhost:5000/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            title="Interactive Swagger OpenAPI Docs"
          >
            <FileText size={16} /> Swagger API <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Revenue</span>
            <div style={{ padding: '0.5rem', borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800 }}>₹{totalRevenue}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>From paid completed orders</span>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #4f46e5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders</span>
            <div style={{ padding: '0.5rem', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Package size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800 }}>{totalOrders}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Customer order records</span>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #0ea5e9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Books in Catalog</span>
            <div style={{ padding: '0.5rem', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7' }}>
              <BookOpen size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800 }}>{totalBooks}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active SKU listings</span>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Customers</span>
            <div style={{ padding: '0.5rem', borderRadius: '50%', background: 'var(--warning-light)', color: 'var(--warning)' }}>
              <Users size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800 }}>{totalUsers}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered book lovers</span>
        </div>
      </div>

      {/* Status Breakdown Bar */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Order Pipeline Status</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', textAlign: 'center' }}>
          <div style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Pending</span>
            <strong style={{ fontSize: '1.5rem', color: '#475569' }}>{ordersByStatus.pending || 0}</strong>
          </div>
          <div style={{ padding: '1rem', background: 'var(--warning-light)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', color: '#92400e', display: 'block', fontWeight: 600 }}>Processing</span>
            <strong style={{ fontSize: '1.5rem', color: '#b45309' }}>{ordersByStatus.processing || 0}</strong>
          </div>
          <div style={{ padding: '1rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', display: 'block', fontWeight: 600 }}>Shipped</span>
            <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{ordersByStatus.shipped || 0}</strong>
          </div>
          <div style={{ padding: '1rem', background: 'var(--success-light)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', color: '#065f46', display: 'block', fontWeight: 600 }}>Delivered</span>
            <strong style={{ fontSize: '1.5rem', color: '#059669' }}>{ordersByStatus.delivered || 0}</strong>
          </div>
          <div style={{ padding: '1rem', background: 'var(--danger-light)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', color: '#991b1b', display: 'block', fontWeight: 600 }}>Cancelled</span>
            <strong style={{ fontSize: '1.5rem', color: '#dc2626' }}>{ordersByStatus.cancelled || 0}</strong>
          </div>
        </div>
      </div>

      {/* Grid: Low Stock Alert & Recent Orders */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Low Stock Alerts */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
              <h3 style={{ fontSize: '1.125rem' }}>Low Stock Inventory ({lowStockBooks.length})</h3>
            </div>
            <Link to="/admin/books" className="btn btn-secondary btn-sm">
              View All Books
            </Link>
          </div>

          {lowStockBooks.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              All inventory levels are healthy! No books currently low on stock.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {lowStockBooks.map((b) => (
                <div
                  key={b._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    paddingBottom: '0.875rem',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    style={{ width: '38px', height: '52px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h5 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.15rem' }}>{b.title}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>by {b.author}</span>
                  </div>
                  <span className={`badge ${b.stock === 0 ? 'badge-danger' : 'badge-warning'}`}>
                    {b.stock === 0 ? 'Sold Out' : `${b.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Recent Orders</h3>
            <Link to="/admin/orders" className="btn btn-secondary btn-sm">
              View All Orders
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {recentOrders.map((ord) => (
              <div
                key={ord._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '0.875rem',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <div>
                  <h5 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{ord.user?.name || 'Customer'}</h5>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    #{ord._id.substring(0, 8)} • {new Date(ord.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '0.9375rem', color: 'var(--primary)', display: 'block' }}>
                    ₹{ord.totalPrice}
                  </strong>
                  <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
