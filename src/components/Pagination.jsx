export default function Pagination({currentPage, totalPages, onPrev, onNext}) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination" id="pagination">
      <button onClick={onPrev} disabled={currentPage === 1}>
        <span className="material-icons">chevron_left</span>
      </button>
      <span className="page-info">
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={onNext} disabled={currentPage === totalPages}>
        <span className="material-icons">chevron_right</span>
      </button>
    </div>
  );
}
