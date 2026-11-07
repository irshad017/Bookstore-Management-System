import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, AlertCircle } from 'lucide-react';
import Rating from '../common/Rating';
import { useCart } from '../../context/CartContext';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const isOutOfStock = book.stock <= 0;

  return (
    <div
      className="card card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '1.25rem',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Featured badge */}
      {book.isFeatured && (
        <span
          className="badge badge-warning"
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.25rem',
            zIndex: 2,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          Featured
        </span>
      )}

      {/* Book cover image */}
      <Link
        to={`/books/${book._id}`}
        style={{
          display: 'block',
          width: '100%',
          height: '240px',
          overflow: 'hidden',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#e2e8f0',
          position: 'relative',
          marginBottom: '1rem',
        }}
      >
        <img
          src={book.imageUrl}
          alt={book.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
          }}
        />
      </Link>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <span className="badge badge-primary">{book.genre}</span>
          <span
            className={`badge ${
              isOutOfStock
                ? 'badge-danger'
                : book.stock <= 5
                ? 'badge-warning'
                : 'badge-success'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : `${book.stock} in stock`}
          </span>
        </div>

        <Link to={`/books/${book._id}`}>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: '0.25rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.7rem',
            }}
            title={book.title}
          >
            {book.title}
          </h3>
        </Link>

        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            marginBottom: '0.625rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          by {book.author}
        </p>

        {/* Rating */}
        <div style={{ marginBottom: '1rem' }}>
          <Rating value={book.rating} numReviews={book.numReviews} size={15} />
        </div>

        {/* Price & Action */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.875rem',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Price</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
              ₹{book.price}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-primary"
            disabled={isOutOfStock}
            onClick={() => addToCart(book, 1)}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <ShoppingCart size={15} />
            <span>{isOutOfStock ? 'Sold Out' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
