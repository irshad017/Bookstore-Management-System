import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page = 1, pages = 1, onPageChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = [];
  const maxButtons = 5;

  let start = Math.max(1, page - Math.floor(maxButtons / 2));
  let end = Math.min(pages, start + maxButtons - 1);

  if (end - start + 1 < maxButtons) {
    start = Math.max(1, end - maxButtons + 1);
  }

  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.375rem',
        marginTop: '2.5rem',
        marginBottom: '1.5rem',
      }}
    >
      <button
        className="btn btn-secondary btn-sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous Page"
      >
        <ChevronLeft size={16} />
        <span>Prev</span>
      </button>

      {start > 1 && (
        <>
          <button
            className={`btn btn-sm ${page === 1 ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          {start > 2 && <span style={{ padding: '0 0.25rem', color: 'var(--text-muted)' }}>...</span>}
        </>
      )}

      {pageNumbers.map((num) => (
        <button
          key={num}
          className={`btn btn-sm ${page === num ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))}

      {end < pages && (
        <>
          {end < pages - 1 && <span style={{ padding: '0 0.25rem', color: 'var(--text-muted)' }}>...</span>}
          <button
            className={`btn btn-sm ${page === pages ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => onPageChange(pages)}
          >
            {pages}
          </button>
        </>
      )}

      <button
        className="btn btn-secondary btn-sm"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next Page"
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
