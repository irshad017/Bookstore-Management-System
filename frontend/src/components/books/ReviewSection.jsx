import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, User, Send } from 'lucide-react';
import Rating from '../common/Rating';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import api from '../../api/axiosClient';

const ReviewSection = ({ bookId, reviews = [], onReviewAdded }) => {
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      error('Please write a review comment.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post(`/books/${bookId}/reviews`, {
        rating,
        comment,
      });
      success('Review submitted successfully!');
      setComment('');
      setRating(5);
      if (onReviewAdded) onReviewAdded(data);
    } catch (err) {
      error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const hasUserReviewed = user && reviews.some((r) => r.user === user._id);

  return (
    <div style={{ marginTop: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.5rem' }}>
        <MessageSquare size={24} style={{ color: 'var(--primary)' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          Customer Reviews ({reviews.length})
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Review list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <p>No reviews yet. Be the first to share your thoughts on this book!</p>
            </div>
          ) : (
            reviews.map((rev, index) => (
              <div key={rev._id || index} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                      }}
                    >
                      {rev.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{rev.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(rev.createdAt || Date.now()).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <Rating value={rev.rating} size={15} />
                </div>
                <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6 }}>
                  {rev.comment}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Submit review form */}
        <div className="card" style={{ height: 'fit-content', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Write a Review</h3>

          {user ? (
            hasUserReviewed ? (
              <div className="badge badge-success" style={{ padding: '0.75rem 1rem', width: '100%' }}>
                You have already reviewed this book. Thank you for your feedback!
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Rating</label>
                  <Rating
                    value={rating}
                    interactive={true}
                    onRatingChange={(newVal) => setRating(newVal)}
                    size={22}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Review Comments</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Share what you liked about the plot, characters, or actionable insights..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={submitting}
                >
                  <Send size={16} />
                  <span>{submitting ? 'Submitting...' : 'Post Review'}</span>
                </button>
              </form>
            )
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Please sign in to share your review and rating.
              </p>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Sign In to Review
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
