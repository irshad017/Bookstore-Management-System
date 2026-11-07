import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value = 0, numReviews, interactive = false, onRatingChange, size = 16 }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = value >= star;
          const half = !filled && value >= star - 0.5;

          return (
            <span
              key={star}
              onClick={() => interactive && onRatingChange && onRatingChange(star)}
              style={{
                cursor: interactive ? 'pointer' : 'default',
                display: 'inline-flex',
                color: filled ? '#f59e0b' : half ? '#fbbf24' : '#d1d5db',
                transition: 'transform 0.1s ease',
              }}
              onMouseEnter={(e) => {
                if (interactive) e.currentTarget.style.transform = 'scale(1.2)';
              }}
              onMouseLeave={(e) => {
                if (interactive) e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Star
                size={size}
                fill={filled ? '#f59e0b' : half ? '#f59e0b' : 'none'}
                strokeWidth={1.5}
              />
            </span>
          );
        })}
      </div>
      {numReviews !== undefined && (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          ({numReviews})
        </span>
      )}
    </div>
  );
};

export default Rating;
