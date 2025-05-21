import React, { useEffect, useState, useRef } from 'react';
import {
  getAllReviews,
  deleteReview,
  deleteReviews,
} from '../../services/adminService';
import { formatDate } from '../common/FormatDate';
import '../../css/admin/AdminReview.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const AdminReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('latest');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('최신순');
  const dropdownRef = useRef(null);

  const fetchReviews = async (page, sortOrder) => {
    try {
      const data = await getAllReviews(page, sortOrder);
      setReviews(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page, sortBy);
  }, [page, sortBy]);

  const handleFilterChange = (filter) => {
    setFilter(filter);
  };

  const handleDropdownClick = (option) => {
    setSelectedOption(option);
    setSortBy(option === '최신순' ? 'latest' : 'oldest');
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredReviews = reviews.filter((item) => {
    if (filter === 'all') return true;
    return filter === 'blind'
      ? item.review.blindYn === 'Y'
      : item.review.blindYn === 'N';
  });

  const allCount = reviews.length;
  const blindCount = reviews.filter(
    (item) => item.review.blindYn === 'Y'
  ).length;
  const visibleCount = reviews.filter(
    (item) => item.review.blindYn === 'N'
  ).length;

  const reviewDeleteBtn = async (reviewSeq) => {
    if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      try {
        await deleteReview(reviewSeq);
        setReviews(
          reviews.filter((review) => review.review.reviewSeq !== reviewSeq)
        );
        alert('리뷰가 성공적으로 삭제되었습니다.');
      } catch (err) {
        setError(err);
        alert('리뷰 삭제에 실패했습니다.');
      }
    }
  };

  const deleteSelectedReviews = async () => {
    if (selectedReviews.length === 0) {
      alert('삭제할 리뷰를 선택하세요.');
      return;
    }
    if (window.confirm('선택한 리뷰를 삭제하시겠습니까?')) {
      try {
        await deleteReviews(selectedReviews);
        setReviews(
          reviews.filter(
            (review) => !selectedReviews.includes(review.review.reviewSeq)
          )
        );
        setSelectedReviews([]);
        alert('선택한 리뷰가 성공적으로 삭제되었습니다.');
      } catch (err) {
        setError(err);
        alert('선택한 리뷰 삭제에 실패했습니다.');
      }
    }
  };

  const toggleSelectReview = (reviewSeq) => {
    setSelectedReviews((prevSelected) =>
      prevSelected.includes(reviewSeq)
        ? prevSelected.filter((seq) => seq !== reviewSeq)
        : [...prevSelected, reviewSeq]
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="adminReviewList adminUserList">
      <h1>전체 리뷰</h1>
      <div className="filtering">
        <div className="filter">
          <button
            onClick={() => handleFilterChange('all')}
            className={filter === 'all' ? 'active' : ''}
          >
            전체 ({allCount})
          </button>
          <button
            onClick={() => handleFilterChange('blind')}
            className={filter === 'blind' ? 'active' : ''}
          >
            블라인드된 리뷰 ({blindCount})
          </button>
          <button
            onClick={() => handleFilterChange('visible')}
            className={filter === 'visible' ? 'active' : ''}
          >
            보이는 리뷰 ({visibleCount})
          </button>
        </div>
        <div className="sort" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="dropDownBtn">
            <div className="text">{selectedOption}</div>
            <FontAwesomeIcon
              icon={dropdownOpen ? faChevronUp : faChevronDown}
            />
          </button>
          {dropdownOpen && (
            <div className={`dropdownContent ${dropdownOpen ? 'show' : ''}`}>
              <a onClick={() => handleDropdownClick('최신순')}>최신순</a>
              <a onClick={() => handleDropdownClick('오래된순')}>오래된순</a>
            </div>
          )}
        </div>
      </div>
      <div className="userSelect">
        <button onClick={deleteSelectedReviews}>선택한 리뷰 삭제</button>
        <p>선택된 리뷰: {selectedReviews.length}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th style={{ width: '8%' }}>선택</th>
            <th style={{ width: '8%' }}>리뷰 번호</th>
            <th style={{ width: '15%' }}>코스 제목</th>
            <th style={{ width: '15%' }}>작성자</th>
            <th style={{ width: '15%' }}>댓글</th>
            <th style={{ width: '12%' }}>작성 일자</th>
            <th style={{ width: '8%' }}>신고 수</th>
            <th style={{ width: '10%' }}>삭제</th>
          </tr>
        </thead>
        <tbody>
          {filteredReviews.map((item, index) => (
            <tr key={`${item.review.reviewSeq}-${index}`}>
              <td>
                <input
                  type="checkbox"
                  className="styled-checkbox"
                  id={`checkbox-${item.review.reviewSeq}`}
                  onChange={() => toggleSelectReview(item.review.reviewSeq)}
                  checked={selectedReviews.includes(item.review.reviewSeq)}
                />
                <label htmlFor={`checkbox-${item.review.reviewSeq}`}></label>
              </td>
              <td>{item.review.reviewSeq}</td>
              <td>{item.courseTitle}</td>
              <td>{item.review.user?.username || 'Unknown'}</td>
              <td className="reviewContent">{item.review.content}</td>
              <td>{item.review.reportCount}</td>
              <td>
                {item.review.createDate
                  ? formatDate(item.review.createDate)
                  : '알 수 없음'}
              </td>
              <td>
                <button
                  className="delBtn btn_type_1"
                  onClick={() => reviewDeleteBtn(item.review.reviewSeq)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page <= 0}>
          이전
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages - 1}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default AdminReviewList;
