export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="pagination">
      <button
        className="page-btn"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        ‹
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
        .reduce((acc, p, idx, arr) => {
          if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
          acc.push(p);
          return acc;
        }, [])
        .map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="page-dots">…</span>
          ) : (
            <button
              key={p}
              className={`page-btn${p === page ? " active" : ""}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ),
        )}
      <button
        className="page-btn"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        ›
      </button>
    </div>
  );
}