import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  BookOpen,
  ArrowLeft,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import api from '../../api/axiosClient';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import BookFormModal from '../../components/admin/BookFormModal';
import { useNotification } from '../../context/NotificationContext';

const AdminBooksPage = () => {
  const { success, error } = useNotification();

  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      params.append('page', page);
      params.append('limit', 10);

      const { data } = await api.get(`/books?${params.toString()}`);
      setBooks(data.books || []);
      setPages(data.pages || 1);
      setTotalBooks(data.totalBooks || 0);
    } catch (err) {
      error(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, page, error]);

  const fetchGenres = async () => {
    try {
      const { data } = await api.get('/books/genres');
      setGenres(data.genres || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleOpenAdd = () => {
    setSelectedBook(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (book) => {
    setSelectedBook(book);
    setFormModalOpen(true);
  };

  const handleOpenDelete = (book) => {
    setBookToDelete(book);
    setDeleteModalOpen(true);
  };

  const handleSaveBook = async (bookData) => {
    try {
      if (selectedBook) {
        await api.put(`/books/${selectedBook._id}`, bookData);
        success(`"${bookData.title}" updated successfully!`);
      } else {
        await api.post('/books', bookData);
        success(`"${bookData.title}" added to inventory!`);
      }
      fetchBooks();
      fetchGenres();
    } catch (err) {
      error(err.message);
      throw err;
    }
  };

  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    try {
      await api.delete(`/books/${bookToDelete._id}`);
      success(`Book "${bookToDelete.title}" deleted.`);
      fetchBooks();
    } catch (err) {
      error(err.message);
    } finally {
      setBookToDelete(null);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.25rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <Link to="/admin/dashboard" className="btn btn-secondary btn-sm" style={{ marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2.25rem' }}>Book Inventory Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage {totalBooks} book listings, pricing, and stock levels
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Add New Book
        </button>
      </div>

      {/* Search Input */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', maxWidth: '420px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by title, author, or ISBN..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
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
        </div>
      </div>

      {/* Books Table */}
      {loading ? (
        <Spinner message="Loading inventory..." />
      ) : books.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <p>No books found matching your query.</p>
        </div>
      ) : (
        <div className="table-responsive card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title & Author</th>
                <th>Genre</th>
                <th>Price</th>
                <th>Stock</th>
                <th>ISBN</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b._id}>
                  <td style={{ width: '60px' }}>
                    <img
                      src={b.imageUrl}
                      alt={b.title}
                      style={{ width: '42px', height: '58px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </td>
                  <td>
                    <Link to={`/books/${b._id}`} target="_blank" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>{b.title}</span>
                      <ExternalLink size={12} style={{ color: 'var(--text-light)' }} />
                    </Link>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'block' }}>
                      by {b.author}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-secondary">{b.genre}</span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--primary)' }}>₹{b.price}</strong>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        b.stock === 0
                          ? 'badge-danger'
                          : b.stock <= 5
                          ? 'badge-warning'
                          : 'badge-success'
                      }`}
                    >
                      {b.stock} units
                    </span>
                  </td>
                  <td>
                    <code style={{ fontSize: '0.8125rem' }}>{b.isbn}</code>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenEdit(b)}
                        title="Edit Book"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleOpenDelete(b)}
                        title="Delete Book"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} pages={pages} onPageChange={(p) => setPage(p)} />

      {/* Add / Edit Modal */}
      <BookFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSaveBook}
        book={selectedBook}
        genres={genres}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteBook}
        title="Confirm Book Deletion"
        message={`Are you sure you want to permanently delete "${bookToDelete?.title}" from the store catalog? This action cannot be undone.`}
        confirmText="Delete Book"
        type="danger"
      />
    </div>
  );
};

export default AdminBooksPage;
