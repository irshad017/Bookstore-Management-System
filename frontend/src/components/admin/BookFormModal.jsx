import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';

const BookFormModal = ({ isOpen, onClose, onSave, book = null, genres = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    genre: '',
    stock: '',
    isbn: '',
    description: '',
    imageUrl: '',
    isFeatured: false,
    publishedYear: new Date().getFullYear(),
    pages: 300,
    publisher: 'SkyBrisk Publishing',
  });

  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        price: book.price || '',
        genre: book.genre || (genres[0] || 'Technology'),
        stock: book.stock !== undefined ? book.stock : '',
        isbn: book.isbn || '',
        description: book.description || '',
        imageUrl: book.imageUrl || '',
        isFeatured: Boolean(book.isFeatured),
        publishedYear: book.publishedYear || new Date().getFullYear(),
        pages: book.pages || 300,
        publisher: book.publisher || 'SkyBrisk Publishing',
      });
    } else {
      setFormData({
        title: '',
        author: '',
        price: '',
        genre: genres[0] || 'Technology',
        stock: 10,
        isbn: '',
        description: '',
        imageUrl:
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
        isFeatured: false,
        publishedYear: new Date().getFullYear(),
        pages: 300,
        publisher: 'SkyBrisk Publishing',
      });
    }
    setImageError(false);
  }, [book, genres, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (name === 'imageUrl') setImageError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        publishedYear: Number(formData.publishedYear),
        pages: Number(formData.pages),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px' }}
      >
        <div className="modal-header">
          <h3 style={{ fontSize: '1.25rem' }}>
            {book ? 'Edit Book Details' : 'Add New Book to Inventory'}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Book Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Designing Data-Intensive Applications"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Author Name *</label>
              <input
                type="text"
                name="author"
                className="form-input"
                required
                value={formData.author}
                onChange={handleChange}
                placeholder="e.g. Martin Kleppmann"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Genre / Category *</label>
              <input
                type="text"
                name="genre"
                className="form-input"
                required
                value={formData.genre}
                onChange={handleChange}
                placeholder="e.g. Technology, Sci-Fi, Fiction"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                className="form-input"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 599"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock Units *</label>
              <input
                type="number"
                name="stock"
                min="0"
                className="form-input"
                required
                value={formData.stock}
                onChange={handleChange}
                placeholder="e.g. 25"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">ISBN Number *</label>
              <input
                type="text"
                name="isbn"
                className="form-input"
                required
                value={formData.isbn}
                onChange={handleChange}
                placeholder="e.g. 978-0132350884"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Cover Image URL</label>
              <input
                type="url"
                name="imageUrl"
                className="form-input"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
              />
              {formData.imageUrl && (
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    style={{ width: '48px', height: '64px', objectFit: 'cover', borderRadius: '4px' }}
                    onError={() => setImageError(true)}
                  />
                  <span style={{ fontSize: '0.8125rem', color: imageError ? 'var(--danger)' : 'var(--text-muted)' }}>
                    {imageError ? 'Unable to load image from URL' : 'Image preview loaded'}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                className="form-textarea"
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief synopsis, key takeaways, and summary..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Published Year</label>
              <input
                type="number"
                name="publishedYear"
                className="form-input"
                value={formData.publishedYear}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Page Count</label>
              <input
                type="number"
                name="pages"
                className="form-input"
                value={formData.pages}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  style={{ width: '1.1rem', height: '1.1rem', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Feature this book on Homepage</span>
              </label>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1.5rem',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1rem',
            }}
          >
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              <span>{loading ? 'Saving...' : book ? 'Update Book' : 'Add Book'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormModal;
