import React, { useEffect, useState, useRef } from 'react';
import {
  resetReportCount,
  blindReview,
  getAllReviews,
} from '../../services/adminService';
import { formatDate } from '../common/FormatDate';
import '../../css/admin/AdminReview.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const AdminBlindReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [totalReportedCount, setTotalReportedCount] = useState(0);
  const [blindCount, setBlindCount] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('최신순');
  const dropdownRef = useRef(null);
  const [filter, setFilter] = useState('all');

  const fetchReviews = async () => {
    try {
      const allReviews = await getAllReviews();
      const blindReviewsData = allReviews.filter(
        (reviewData) =>
          reviewData.review.reportCount >= 5 &&
          reviewData.review.blindYn !== 'Y'
      );
      setReviews(blindReviewsData);
      const blindReviews = allReviews.filter(
        (reviewData) => reviewData.review.blindYn === 'Y'
      );
      setBlindCount(blindReviews.length);
      const reportedReviews = allReviews.filter(
        (reviewData) => reviewData.review.reportCount >= 5
      );
      setTotalReportedCount(reportedReviews.length);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, selectedOption]);

  const handleFilterChange = (filter) => {
    setFilter(filter);
  };

  const handleDropdownClick = (option) => {
    setSelectedOption(option);
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

  const resetBtn = async (reviewSeq) => {
    const confirmReset = window.confirm('신고 수를 초기화하시겠습니까?');
    if (confirmReset) {
      try {
        await resetReportCount(reviewSeq);
        fetchReviews();
      } catch (error) {
        setError(error);
      }
    }
  };

  const blindBtn = async (reviewSeq) => {
    const confirmBlind = window.confirm('이 리뷰를 블라인드 처리하시겠습니까?');
    if (confirmBlind) {
      try {
        await blindReview(reviewSeq);
        fetchReviews();
      } catch (error) {
        setError(error);
      }
    }
  };

  return (
    <div className="adminReviewList adminBlindReviewList">
      <h1>신고된 리뷰 목록</h1>
      <div className="filtering">
        <p>
          전체 신고 댓글 : {totalReportedCount}개 | 블라인드 댓글 : {blindCount}
          개
        </p>
        <div className="blindSort" ref={dropdownRef}>
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
      <table>
        <thead>
          <tr>
            <th style={{ width: '15%' }}>코스 제목</th>
            <th style={{ width: '15%' }}>작성자</th>
            <th style={{ width: '40%' }}>작성 내용</th>
            <th style={{ width: '10%' }}>작성 일자</th>
            <th style={{ width: '10%' }}>신고 수</th>
            <th style={{ width: '10%' }}>초기화</th>
            <th style={{ width: '10%' }}>블라인드</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map(
            (reviewData) =>
              reviewData.review.blindYn !== 'Y' && (
                <tr key={reviewData.review.reviewSeq}>
                  <td>{reviewData.courseTitle}</td>
                  <td>{reviewData.review.user.username}</td>
                  <td className="reviewContent">{reviewData.review.content}</td>
                  <td>{formatDate(reviewData.review.createDate)}</td>
                  <td>{reviewData.review.reportCount}</td>
                  <td>
                    <button
                      onClick={() => resetBtn(reviewData.review.reviewSeq)}
                    >
                      초기화
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => blindBtn(reviewData.review.reviewSeq)}
                    >
                      블라인드
                    </button>
                  </td>
                </tr>
              )
          )}
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

export default AdminBlindReviewList;
