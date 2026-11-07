import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ShoppingCart,
  Check,
  AlertCircle,
  BookOpen,
  Calendar,
  Layers,
  Building,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import api from '../api/axiosClient';
import Rating from '../components/common/Rating';
import Spinner from '../components/common/Spinner';
import ReviewSection from '../components/books/ReviewSection';
import { useCart } from '../context/CartContext';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/books/${id}`);
      setBook(data.book);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  if (loading) return <Spinner message="Loading book details..." />;

  if (error || !book) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Book Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          {error || 'The book you are looking for does not exist or has been removed.'}
        </p>
        <Link to="/books" className="btn btn-primary">
          Back to Book Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = book.stock <= 0;

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '2rem' }}
      >
        <ChevronLeft size={16} /> Back
      </button>

      {/* Main Book Detail Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'start',
        }}
      >
        {/* Book Cover Image */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          <img
            src={book.imageUrl}
            alt={book.title}
            style={{
              maxHeight: '480px',
              width: 'auto',
              maxWidth: '100%',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              objectFit: 'contain',
            }}
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </div>

        {/* Book Info & Purchase Card */}
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-primary">{book.genre}</span>
            {book.isFeatured && <span className="badge badge-warning">Featured Title</span>}
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '0.5rem' }}>
            {book.title}
          </h1>

          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            by <strong style={{ color: 'var(--text-main)' }}>{book.author}</strong>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Rating value={book.rating} numReviews={book.numReviews} size={20} />
            <span style={{ color: 'var(--text-light)' }}>|</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              ISBN: <code>{book.isbn}</code>
            </span>
          </div>

          <div
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--primary)',
              marginBottom: '1.5rem',
            }}
          >
            ₹{book.price}
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
              (Inclusive of all taxes)
            </span>
          </div>

          {/* Action Box */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-subtle)',
              marginBottom: '2rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontWeight: 600 }}>Stock Availability:</span>
              <span
                className={`badge ${
                  isOutOfStock
                    ? 'badge-danger'
                    : book.stock <= 5
                    ? 'badge-warning'
                    : 'badge-success'
                }`}
                style={{ fontSize: '0.875rem', padding: '0.35rem 0.75rem' }}
              >
                {isOutOfStock ? 'Currently Out of Stock' : `${book.stock} Copies in Stock`}
              </span>
            </div>

            {!isOutOfStock && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Quantity:</span>
                <select
                  className="form-select"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  style={{ width: '90px' }}
                >
                  {[...Array(Math.min(book.stock, 10)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={isOutOfStock}
              onClick={() => addToCart(book, qty)}
            >
              <ShoppingCart size={20} />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add to Shopping Cart'}</span>
            </button>
          </div>

          {/* Specification details */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={18} style={{ color: 'var(--primary)' }} />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Publisher</span>
                <strong style={{ fontSize: '0.875rem' }}>{book.publisher || 'SkyBrisk'}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} style={{ color: 'var(--primary)' }} />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Published</span>
                <strong style={{ fontSize: '0.875rem' }}>{book.publishedYear || 'Recent'}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} style={{ color: 'var(--primary)' }} />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Pages</span>
                <strong style={{ fontSize: '0.875rem' }}>{book.pages || 320} Pages</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={18} style={{ color: 'var(--primary)' }} />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Dispatch</span>
                <strong style={{ fontSize: '0.875rem' }}>Within 24 Hours</strong>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Overview & Synopsis</h3>
            <p style={{ color: '#334155', lineHeight: 1.8, fontSize: '0.9375rem', whiteSpace: 'pre-line' }}>
              {book.description}
            </p>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <ReviewSection
        bookId={book._id}
        reviews={book.reviews || []}
        onReviewAdded={fetchBookDetails}
      />
    </div>
  );
};

export default BookDetailPage;
