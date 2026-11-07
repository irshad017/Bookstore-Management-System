import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, ShieldCheck, Truck, RefreshCw, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-color)',
        marginTop: '4rem',
        paddingTop: '3rem',
        paddingBottom: '2rem',
      }}
    >
      <div className="container">
        {/* Value props banner */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '2.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Truck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Express Delivery</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Free shipping on orders above ₹999</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>100% Genuine Books</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Direct from verified publishers</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <RefreshCw size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Easy Returns</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Hassle-free 7-day replacement</p>
            </div>
          </div>
        </div>

        {/* Links section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '2.5rem',
          }}
        >
          <div>
            <div className="brand-logo" style={{ marginBottom: '1rem' }}>
              <BookOpen size={26} />
              <span>SkyBrisk<span style={{ color: 'var(--text-main)' }}>Books</span></span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              A modern, full-stack bookstore platform designed to empower readers, streamline book distribution, and simplify inventory operations.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9375rem', marginBottom: '1rem', fontWeight: 700 }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li><Link to="/books" style={{ transition: 'var(--transition)' }}>Browse Catalog</Link></li>
              <li><Link to="/books?genre=Technology">Technology & Engineering</Link></li>
              <li><Link to="/books?genre=Self-Help">Self Improvement</Link></li>
              <li><Link to="/books?genre=Sci-Fi">Sci-Fi & Fantasy</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9375rem', marginBottom: '1rem', fontWeight: 700 }}>Account & Support</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/my-orders">Track Orders</Link></li>
              <li><Link to="/login">Customer Login</Link></li>
              <li><a href="http://localhost:5000/api/docs" target="_blank" rel="noopener noreferrer">Swagger API Docs</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9375rem', marginBottom: '1rem', fontWeight: 700 }}>Tech Stack</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Built with React 18, Vite, Node.js, Express.js, MongoDB & Mongoose. Engineered with role-based access control, JWT security, and responsive UI.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} SkyBrisk Bookstore Management System. Developed by <strong>Irshad Hussain</strong>.
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>MERN Stack Application</span>
            <span>•</span>
            <span>REST API v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
