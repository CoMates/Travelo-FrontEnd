import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/components/place/PlaceCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faHeart,
  faBookmark,
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import { PlaceContext } from '../contexts/PlaceContext';
import { likePlace } from '../services/likeService';
import { addBookmark, removeBookmark } from '../services/bookmarkService';

const typeMap = {
  12: '관광지',
  14: '문화시설',
  28: '레저 스포츠',
  32: '숙박',
  38: '쇼핑',
  39: '음식점',
};

const PlaceCard = ({
  placeSeq,
  image,
  type,
  title,
  address,
  views,
  likes,
  bookmarks,
  contentId,
  longitude,
  latitude,
}) => {
  const [currentLikes, setCurrentLikes] = useState(Number(likes) || 0);
  useEffect(() => {
    setCurrentLikes(Number(likes) || 0);
  }, [likes]);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();
  const {
    updatePlaceLikes,
    bookmarks: userBookmarks,
    fetchUserBookmarks,
  } = useContext(PlaceContext);

  // 1. 최초 마운트 시 북마크 불러오기 1회만
  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');

    if (accessToken) {
      fetchUserBookmarks(accessToken);
    }
  }, []);

  // 2. userBookmarks가 빈 배열일 땐 setBookmarked 무시
  useEffect(() => {
    if (!userBookmarks || userBookmarks.length === 0) return;

    const isBookmarked = userBookmarks.some(
      (bookmark) => String(bookmark.contentId) === String(contentId)
    );
    setBookmarked(isBookmarked);
  }, [userBookmarks, contentId]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // 이벤트 전파 막기
    const accessToken = sessionStorage.getItem('accessToken');

    if (!accessToken) {
      navigate('/users/login');
      return;
    }

    try {
      console.log('Current Likes:', currentLikes, typeof currentLikes);
      const updatedLikeYn = await likePlace(contentId, accessToken);

      if (updatedLikeYn === 'Y') {
        setCurrentLikes((prevLikes) => prevLikes + 1);
        setLiked(true);
        updatePlaceLikes(contentId, true);
      } else if (updatedLikeYn === 'N') {
        setCurrentLikes((prevLikes) => prevLikes - 1);
        setLiked(false);
        updatePlaceLikes(contentId, false);
      }

      setAnimate(true);
      setTimeout(() => setAnimate(false), 200);
    } catch (error) {
      console.error('Error updating like status: ', error);
    }
  };

  // 3. handleBookmark 함수 내에서 UI 즉시 변경 + 서버 호출 + 실패 시 롤백
  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/users/login');
      return;
    }

    const nextBookmarked = !bookmarked;
    setBookmarked(nextBookmarked); // UI 즉시 토글

    try {
      if (nextBookmarked) {
        await addBookmark(contentId, accessToken);
      } else {
        await removeBookmark(contentId, accessToken);
      }
      // 서버 상태 반영 필요 시 호출
      // await fetchUserBookmarks(accessToken);
    } catch (error) {
      console.error('Error updating bookmark status:', error);
      setBookmarked(!nextBookmarked); // 실패 시 롤백
    }
  };

  const typeText = typeMap[type] || '기타';

  return (
    <Link
      to={`/places/${placeSeq}`}
      className={styles.card}
      state={{
        placeSeq,
        type,
        contentId,
        image,
        title,
        address,
        views,
        likes,
        bookmarks,
        typeText,
        typeMap,
        longitude,
        latitude,
      }}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className={styles['image-container']}>
        {image ? (
          <img src={image} alt={title} className={styles.image} />
        ) : (
          <div className={styles['image-placeholder']}>
            <FontAwesomeIcon icon={faImage} size="6x" color="#ccc" />
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div>
          <div className={styles.tag}>{typeText}</div>
          <div className={styles.details}>
            <h3>{title}</h3>
            <p>{address}</p>
          </div>
        </div>
        <div className={styles.icons}>
          <div className={styles.wrap}>
            <span
              onClick={handleLike}
              className={`${styles['heart-icon']} ${
                animate ? styles.active : styles.inactive
              }`}
              style={{ cursor: 'pointer' }}
            >
              <FontAwesomeIcon
                icon={faHeart}
                className={styles['heart-icon']}
              />{' '}
              {currentLikes}
            </span>
            <span
              onClick={handleBookmark}
              className={`${styles['bookmark-icon']} ${
                bookmarked ? styles.active : ''
              }`}
              style={{ cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faBookmark} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;
