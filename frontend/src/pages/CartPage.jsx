import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <div
          className="card"
          style={{ maxWidth: '520px', margin: '0 auto', padding: '3rem 2rem' }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
            }}
          >
            <ShoppingBag size={36} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9375rem' }}>
            Looks like you haven't added any books to your cart yet. Explore our bestsellers and start reading today!
          </p>
          <Link to="/books" className="btn btn-primary btn-lg">
            Explore Book Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>Shopping Cart</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Review your selected titles before proceeding to checkout
          </p>
        </div>

        <button
          onClick={clearCart}
          className="btn btn-secondary btn-sm"
          style={{ color: 'var(--danger)', borderColor: 'var(--border-color)' }}
        >
          <Trash2 size={15} /> Clear All
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Cart items list */}
        <div className="card" style={{ padding: '1.5rem', flex: 2 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cartItems.map((item) => (
              <div
                key={item.book}
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'center',
                  paddingBottom: '1.5rem',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                {/* Book cover */}
                <Link to={`/books/${item.book}`}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{
                      width: '70px',
                      height: '95px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                </Link>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <Link to={`/books/${item.book}`}>
                    <h4
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        lineHeight: 1.3,
                        marginBottom: '0.25rem',
                      }}
                    >
                      {item.title}
                    </h4>
                  </Link>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    by {item.author}
                  </p>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>
                    ₹{item.price} each
                  </span>
                </div>

                {/* Quantity Controls */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.book, item.qty - 1)}
                    style={{
                      padding: '0.4rem 0.6rem',
                      border: 'none',
                      background: 'var(--bg-subtle)',
                      cursor: 'pointer',
                    }}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span
                    style={{
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      minWidth: '36px',
                      textAlign: 'center',
                    }}
                  >
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.book, item.qty + 1)}
                    disabled={item.qty >= item.stock}
                    style={{
                      padding: '0.4rem 0.6rem',
                      border: 'none',
                      background: 'var(--bg-subtle)',
                      cursor: item.qty >= item.stock ? 'not-allowed' : 'pointer',
                      opacity: item.qty >= item.stock ? 0.5 : 1,
                    }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Line Total */}
                <div style={{ textAlign: 'right', minWidth: '85px' }}>
                  <span style={{ fontSize: '1.125rem', fontWeight: 800 }}>
                    ₹{item.price * item.qty}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.book)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--danger)',
                    cursor: 'pointer',
                    padding: '0.5rem',
                  }}
                  title="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/books" className="btn btn-secondary">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary sidebar */}
        <div className="card" style={{ padding: '1.75rem', flex: 1, backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Order Summary</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.9375rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Items Total ({cartItems.reduce((acc, i) => acc + i.qty, 0)} units)</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>₹{itemsPrice}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Standard Delivery</span>
              <span style={{ color: shippingPrice === 0 ? 'var(--success)' : 'var(--text-main)', fontWeight: 600 }}>
                {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Estimated GST (5%)</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>₹{taxPrice}</span>
            </div>

            {shippingPrice > 0 && (
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary-light)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                Add ₹{999 - itemsPrice} more to your cart for FREE delivery!
              </div>
            )}

            <div
              style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1rem',
                marginTop: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>Final Total</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                ₹{totalPrice}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1.75rem' }}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '1.25rem',
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
            }}
          >
            <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
            <span>Guaranteed Safe & Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
