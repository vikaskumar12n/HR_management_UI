


// eslint-disable-next-line react/prop-types
const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <nav>
      <ul className="pagination">
        {[...Array(totalPages)].map((_, index) => (
          <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(index + 1)}>
              {index + 1}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
