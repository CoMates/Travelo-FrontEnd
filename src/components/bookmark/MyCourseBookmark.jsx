import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/components/bookmarks/MyPlaceBookmark.module.css'; // 스타일 파일을 별도로 생성하여 관리
import axiosInstance from '../../utils/axiosInstance';
import style from '../../styles/components/place/PlaceCard.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faImage,
  faEye,
  faHeart,
  faBookmark,
} from '@fortawesome/free-solid-svg-icons';
import MyCoursePagination from '../common/pagenation/MyCoursePagination';

const MyCourseBookmark = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12; // 페이지 당 항목 수
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axiosInstance.get('/user/courseBookmarks'); // API 엔드포인트를 확인하세요
        console.log(response);
        setBookmarks(response.data.bookmarks);
        setLoading(false);
      } catch (error) {
        setError('북마크를 가져오는 중 오류가 발생했습니다.');
        console.error(error);
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!bookmarks.length) return <div>북마크된 코스가 없습니다.</div>;

  return (
    <div className={styles.bookmarkContainer}>
      <ul className={styles.bookmarkList}>
        {bookmarks.map((bookmark) => {
          const { courseSeq, title, description, courseList } = bookmark.course;

          return (
            <li
              key={bookmark.courseBookmarkSeq}
              className={styles.bookmarkItem}
            >
              <Link
                to={`/course/${courseSeq}`}
                className={styles.card}
                state={{
                  courseSeq,
                  title,
                  description,
                }}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className={styles['image-container']}>
                  {courseList.slice(0, 4).map((item, index) => (
                    <div key={index} className={styles['image-item']}>
                      {/* 이미지 불러오는 코드로 place 오류 */}
                      {/* {item.place.imageFile1 ? (
                        <img
                          src={item.place.imageFile1}
                          alt={item.place.title}
                          className={styles.image}
                        />
                      ) : (
                        <div className={styles['image-placeholder']}>
                          <img src="/free-sticker-van-13719277.png" />
                        </div>
                      )} */}
                    </div>
                  ))}
                </div>
                <div className={styles.content}>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <MyCoursePagination
        totalPages={Math.ceil(bookmarks.length / itemsPerPage)}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default MyCourseBookmark;
