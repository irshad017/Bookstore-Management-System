import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

const BookFilter = ({
  search,
  setSearch,
  selectedGenre,
  setSelectedGenre,
  genres = [],
  sort,
  setSort,
  inStockOnly,
  setInStockOnly,
  onReset,
}) => {
  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        marginBottom: '2rem',
        backgroundColor: '#ffffff',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          alignItems: 'flex-end',
        }}
      >
        {/* Search input */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Search size={15} /> Search Books
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Search by title, author, ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Genre Selector */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={15} /> Category / Genre
          </label>
          <select
            className="form-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="All">All Categories ({genres.length})</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Sort selector */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Sort By</label>
          <select
            className="form-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
            <option value="title-asc">Title: A to Z</option>
          </select>
        </div>

        {/* In-Stock Toggle & Reset */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            height: '42px',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              userSelect: 'none',
              fontWeight: 500,
            }}
          >
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              style={{ width: '1rem', height: '1rem', accentColor: 'var(--primary)' }}
            />
            <span>In Stock Only</span>
          </label>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onReset}
            title="Reset Filters"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookFilter;
