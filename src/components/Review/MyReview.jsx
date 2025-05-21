import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  reviewsList,
  updateReview,
  deleteReview,
} from '../../services/myReviewService.js';
import MyPageSidebar from '../common/MyPageSidebar.jsx';
import { formatDate } from '../common/FormatDate.jsx';
import '../../css/MyReviewList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbsUp,
  faAngleDown,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import Dropdown from './Dropdown.jsx';
import MyCoursePagination from '../common/pagenation/MyCoursePagination.jsx';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('latest'); // 기본값을 'latest'로 설정
  const [editReviewId, setEditReviewId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [expandedReviews, setExpandedReviews] = useState([]); // 내용 더보기
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // 페이지 당 항목 수

  // useCallback: 중복 호출 방지
  const loadReviews = useCallback(async () => {
    try {
      const data = await reviewsList(page, sortBy);
      setReviews(data.paging.content || []);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, [page, sortBy]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews, sortBy]);

  // username ** 처리
  const maskUsername = (username) => {
    return username.substring(0, 3) + '****';
  };

  // 리뷰 수정
  const reviewEdit = (reviewSeq) => {
    setEditReviewId(reviewSeq);
    const reviewToEdit = reviews.find(
      (item) => item.review.reviewSeq === reviewSeq
    );
    setEditContent(reviewToEdit.review.content);
  };

  // 리뷰 수정사항 저장
  const editSave = async (reviewSeq) => {
    const originalReview = reviews.find(
      (item) => item.review.reviewSeq === reviewSeq
    ).review.content;

    if (editContent === originalReview) {
      alert('변동 사항이 없습니다.');
      return;
    }
    try {
      const updatedReview = await updateReview(reviewSeq, editContent);
      setReviews((prevReviews) =>
        prevReviews.map((item) =>
          item.review.reviewSeq === reviewSeq
            ? {
                ...item,
                review: {
                  ...item.review,
                  content: editContent,
                  modified: true,
                },
              }
            : item
        )
      );
      setEditReviewId(null);
    } catch (err) {
      console.error('수정 오류 :', err);
    }
  };

  // 리뷰 삭제
  const deleteItem = async (reviewSeq) => {
    if (window.confirm('정말 리뷰를 삭제하시겠습니까?')) {
      try {
        await deleteReview(reviewSeq);
        loadReviews();
      } catch (err) {
        console.error('삭제 오류 :', err);
      }
    }
  };

  // 리뷰 내용 더보기
  const showMore = (reviewSeq) => {
    setExpandedReviews((prevExpandedReviews) => [
      ...prevExpandedReviews,
      reviewSeq,
    ]);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading reviews: {error.message}</p>;

  return (
    <div className="container">
      <div className="grid-container">
        <MyPageSidebar />
        <div className="myReviews">
          <h1>나의 후기</h1>
          <Dropdown sortBy={sortBy} setSortBy={setSortBy} />
          {reviews.length === 0 ? (
            <p>리뷰가 없습니다.</p>
          ) : (
            <ul className="myReviewList">
              {reviews.map((item) => (
                <li key={item.review.reviewSeq} className="listItem">
                  <div className="userInfo">
                    <div className="left">
                      <p className="name">
                        {maskUsername(item.review.user.username)}
                      </p>
                      <p className="date">
                        {formatDate(item.review.createDate)}
                      </p>
                      {item.review.modified && <p>(수정됨)</p>}
                    </div>
                    <div className="right">
                      <FontAwesomeIcon icon={faThumbsUp} />
                      <p className="recommend">{item.review.recommendCount}</p>
                    </div>
                  </div>
                  <h2>
                    <Link to={`/course/${item.courseSeq}`}>
                      {item.courseTitle}
                    </Link>
                  </h2>
                  {editReviewId === item.review.reviewSeq ? (
                    <div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <div className="btn_wrap">
                        <button
                          className="cancleBtn btn_type_2"
                          onClick={() => setEditReviewId(null)}
                        >
                          취소
                        </button>
                        <button
                          className="reviewSave btn_type_2"
                          onClick={() => editSave(item.review.reviewSeq)}
                        >
                          저장
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="content">
                        {expandedReviews.includes(item.review.reviewSeq) ? (
                          item.review.content
                        ) : (
                          <>
                            {item.review.content.length > 360
                              ? item.review.content.substring(0, 360) + '...'
                              : item.review.content}
                            {item.review.content.length > 360 && (
                              <button
                                className="show_btn"
                                onClick={() => showMore(item.review.reviewSeq)}
                              >
                                <span>더보기</span>
                                <FontAwesomeIcon icon={faAngleDown} />
                              </button>
                            )}
                          </>
                        )}
                      </p>
                      <div className="btn_wrap">
                        <button
                          className="reviewEdit btn_type_1"
                          onClick={() => reviewEdit(item.review.reviewSeq)}
                        >
                          수정
                        </button>
                        <button
                          className="reviewDelete btn_type_1"
                          onClick={() => deleteItem(item.review.reviewSeq)}
                        >
                          삭제
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
          <MyCoursePagination
            totalPages={Math.ceil(reviews.length / itemsPerPage)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
