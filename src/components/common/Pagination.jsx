import { useContext } from 'react';
import styles from '../../styles/components/Pagination.module.css';
import { PlaceContext } from '../../contexts/PlaceContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const Pagination = () => {
  const { totalPages, currentPage, setCurrentPage } = useContext(PlaceContext);

  const handlePageClick = (pageNo) => {
    setCurrentPage(pageNo);
  };

  const handlePrevClick = () => {
    const startPage = Math.floor(currentPage / 5) * 5;
    if (startPage > 0) {
      setCurrentPage(startPage - 1);
    }
  };

  const handleNextClick = () => {
    const startPage = Math.floor(currentPage / 5) * 5;
    if (startPage + 5 < totalPages) {
      setCurrentPage(startPage + 5);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const startPage = Math.floor(currentPage / maxPagesToShow) * maxPagesToShow;
    const endPage = Math.min(startPage + maxPagesToShow, totalPages);

    for (let i = startPage; i < endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className={styles.pagination}>
      <button
        className={currentPage === 0 ? styles.disabled : ''}
        onClick={handlePrevClick}
        disabled={currentPage === 0}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      {getPageNumbers().map((pageNo) => (
        <button
          key={pageNo}
          className={currentPage === pageNo ? styles.active : ''}
          onClick={() => handlePageClick(pageNo)}
        >
          {pageNo + 1}
        </button>
      ))}
      <button
        className={currentPage >= totalPages - 1 ? styles.disabled : ''}
        onClick={handleNextClick}
        disabled={currentPage >= totalPages - 1}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

export default Pagination;
