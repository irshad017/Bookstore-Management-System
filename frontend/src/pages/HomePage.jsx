import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Truck,
  Star,
  Search,
} from 'lucide-react';
import api from '../api/axiosClient';
import BookCard from '../components/books/BookCard';
import Spinner from '../components/common/Spinner';

const categories = [
  { name: 'Technology', icon: '💻', count: '120+ Books' },
  { name: 'Self-Help', icon: '🌱', count: '85+ Books' },
  { name: 'Finance', icon: '📈', count: '60+ Books' },
  { name: 'Sci-Fi', icon: '🚀', count: '95+ Books' },
  { name: 'Mystery', icon: '🔍', count: '70+ Books' },
  { name: 'History', icon: '🏛️', count: '50+ Books' },
];

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/books/featured');
        setFeaturedBooks(data.books || []);
      } catch (err) {
        console.error('Failed to load featured books:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/books?search=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          color: '#ffffff',
          padding: '5rem 0 6rem 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative background circles */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '1.5rem',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Sparkles size={16} style={{ color: '#fbbf24' }} />
              <span>Discover Your Next Favorite Masterpiece</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#ffffff',
                marginBottom: '1.25rem',
                letterSpacing: '-0.03em',
              }}
            >
              Books That Inspire, Teach, and Elevate Your Mind
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: '#c7d2fe',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
              }}
            >
              Explore our curated library of top-rated engineering, business, self-help, and fiction titles. Direct to your doorstep with instant digital tracking.
            </p>

            {/* Hero Search Box */}
            <form
              onSubmit={handleHeroSearch}
              style={{
                maxWidth: '560px',
                margin: '0 auto 2.5rem auto',
                display: 'flex',
                backgroundColor: '#ffffff',
                padding: '0.4rem',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, paddingLeft: '1rem' }}>
                <Search size={20} style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }} />
                <input
                  type="text"
                  placeholder="Search by title, author, or ISBN..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.9375rem',
                    color: 'var(--text-main)',
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ borderRadius: 'var(--radius-full)', padding: '0.75rem 1.75rem' }}
              >
                Search
              </button>
            </form>

            {/* Quick Metrics */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2.5rem',
                flexWrap: 'wrap',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <div>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', display: 'block' }}>1,500+</span>
                <span style={{ fontSize: '0.8125rem', color: '#c7d2fe' }}>Curated Titles</span>
              </div>
              <div>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', display: 'block' }}>24/7</span>
                <span style={{ fontSize: '0.8125rem', color: '#c7d2fe' }}>Order Dispatch</span>
              </div>
              <div>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', display: 'block' }}>4.9 ★</span>
                <span style={{ fontSize: '0.8125rem', color: '#c7d2fe' }}>Reader Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="container" style={{ padding: '4rem 1.25rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <TrendingUp size={20} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Handpicked Collection
              </span>
            </div>
            <h2 style={{ fontSize: '2rem' }}>Featured & Best Selling Books</h2>
          </div>

          <Link to="/books" className="btn btn-secondary">
            <span>View Full Catalog</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <Spinner message="Loading featured books..." />
        ) : (
          <div className="grid-cols-4">
            {featuredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* Explore by Category */}
      <section style={{ backgroundColor: 'var(--bg-subtle)', padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Explore by Popular Categories</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Find exactly what you love across technology, mind growth, speculative fiction, and business strategy.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/books?genre=${encodeURIComponent(cat.name)}`}
                className="card card-hover"
                style={{
                  textAlign: 'center',
                  padding: '1.75rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                }}
              >
                <span style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{cat.icon}</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{cat.name}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits / Trust Banner */}
      <section className="container" style={{ padding: '4rem 1.25rem' }}>
        <div
          className="card"
          style={{
            backgroundColor: 'var(--primary-light)',
            borderColor: '#c7d2fe',
            padding: '3rem 2rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.875rem', color: 'var(--primary)', marginBottom: '1rem' }}>
              Are you an author or publisher?
            </h2>
            <p style={{ color: '#4338ca', marginBottom: '2rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Partner with SkyBrisk Bookstore to distribute your titles directly to thousands of passionate readers nationwide. Manage inventory, view order analytics, and grow with us.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/books" className="btn btn-primary btn-lg">
                Start Reading Today
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Admin & Staff Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
