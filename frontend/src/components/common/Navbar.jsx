import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  Layers,
  Menu,
  X,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/books?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Brand */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <BookOpen size={28} />
          <span>SkyBrisk<span style={{ color: 'var(--text-main)' }}>Books</span></span>
        </Link>

        {/* Global Search Bar (Desktop) */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            position: 'relative',
            maxWidth: '380px',
            width: '100%',
            display: 'none',
          }}
          className="desktop-search-form"
        >
          <input
            type="text"
            className="form-input"
            placeholder="Search books, authors, ISBN..."
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            style={{
              paddingLeft: '2.5rem',
              paddingRight: '1rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-subtle)',
            }}
          />
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
        </form>

        <style>{`
          @media (min-width: 820px) {
            .desktop-search-form { display: block !important; }
          }
        `}</style>

        {/* Desktop Links */}
        <div className="nav-links" style={{ display: 'none' }} id="desktop-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/books" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Explore Books
          </NavLink>

          {/* Cart Icon */}
          <Link to="/cart" className="cart-icon-btn" title="View Cart">
            <ShoppingCart size={22} />
            {totalItemsCount > 0 && <span className="cart-badge">{totalItemsCount}</span>}
          </Link>

          {/* User / Auth Menu */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {isAdmin ? (
                <Link to="/admin/dashboard" className="btn btn-sm btn-secondary" title="Admin Dashboard">
                  <LayoutDashboard size={16} />
                  <span>Admin Hub</span>
                </Link>
              ) : (
                <Link to="/my-orders" className="nav-link" title="My Orders">
                  <Package size={18} />
                  <span>Orders</span>
                </Link>
              )}

              <Link to="/profile" className="btn btn-sm btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={16} />
                <span>{user.name.split(' ')[0]}</span>
              </Link>

              <button
                onClick={logout}
                className="btn btn-sm btn-outline-danger"
                title="Logout"
                style={{ padding: '0.4rem 0.6rem' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-sm btn-secondary">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>

        <style>{`
          @media (min-width: 768px) {
            #desktop-nav { display: flex !important; }
            #mobile-toggle { display: none !important; }
          }
        `}</style>

        {/* Mobile menu toggle & cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} id="mobile-toggle">
          <Link to="/cart" className="cart-icon-btn">
            <ShoppingCart size={22} />
            {totalItemsCount > 0 && <span className="cart-badge">{totalItemsCount}</span>}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary"
            style={{ padding: '0.4rem' }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--border-color)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search books, authors..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
          </form>

          <Link
            to="/"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem 0' }}
          >
            Home
          </Link>
          <Link
            to="/books"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem 0' }}
          >
            Explore Books Catalog
          </Link>

          {user ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ color: 'var(--primary)', fontWeight: 700 }}
                >
                  <LayoutDashboard size={18} /> Admin Dashboard
                </Link>
              )}
              <Link
                to="/my-orders"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Package size={18} /> My Orders
              </Link>
              <Link
                to="/profile"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={18} /> My Profile ({user.name})
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="btn btn-outline-danger"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link
                to="/login"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
