import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, RefreshCw } from 'lucide-react';
import api from '../api/axiosClient';
import BookCard from '../components/books/BookCard';
import BookFilter from '../components/books/BookFilter';
import Pagination from '../components/common/Pagination';
import Spinner from '../components/common/Spinner';

const BookListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [pages, setPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const { data } = await api.get('/books/genres');
        setGenres(data.genres || []);
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch books
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (selectedGenre && selectedGenre !== 'All') params.append('genre', selectedGenre);
      if (sort) params.append('sort', sort);
      if (inStockOnly) params.append('inStock', 'true');
      params.append('page', page);
      params.append('limit', 8);

      // Keep URL search params in sync
      setSearchParams(params);

      const { data } = await api.get(`/books?${params.toString()}`);
      setBooks(data.books || []);
      setPages(data.pages || 1);
      setTotalBooks(data.totalBooks || 0);
    } catch (err) {
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedGenre, sort, inStockOnly, page, setSearchParams]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedGenre('All');
    setSort('newest');
    setInStockOnly(false);
    setPage(1);
  };

  return (
    <div className="container" style={{ padding: '3rem 1.25rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
          Explore Our Book Catalog
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Showing {totalBooks} books available in stock
        </p>
      </div>

      {/* Filter Component */}
      <BookFilter
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        selectedGenre={selectedGenre}
        setSelectedGenre={(val) => {
          setSelectedGenre(val);
          setPage(1);
        }}
        genres={genres}
        sort={sort}
        setSort={(val) => {
          setSort(val);
          setPage(1);
        }}
        inStockOnly={inStockOnly}
        setInStockOnly={(val) => {
          setInStockOnly(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Content */}
      {loading ? (
        <Spinner message="Searching catalog..." />
      ) : books.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            maxWidth: '500px',
            margin: '2rem auto',
          }}
        >
          <BookOpen size={48} style={{ color: 'var(--text-light)', margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No books matched your criteria</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Try adjusting your search keywords, clearing genre filters, or toggling out-of-stock items.
          </p>
          <button className="btn btn-primary" onClick={handleResetFilters}>
            <RefreshCw size={16} /> Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid-cols-4">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>

          <Pagination
            page={page}
            pages={pages}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}
    </div>
  );
};

export default BookListPage;
