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
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();
  const {
    updatePlaceLikes,
    bookmarks: userBookmarks,
    fetchUserBookmarks,
  } = useContext(PlaceContext);

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');

    if (accessToken) {
      fetchUserBookmarks(accessToken);
    }
  }, [fetchUserBookmarks]);

  useEffect(() => {
    const isBookmarked = userBookmarks.some(
      (bookmark) => bookmark.place.placeSeq === placeSeq
    );
    setBookmarked(isBookmarked);
  }, [userBookmarks, placeSeq]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // 이벤트 전파 막기
    const accessToken = sessionStorage.getItem('accessToken');

    if (!accessToken) {
      navigate('/users/login');
      return;
    }

    try {
      const updatedLikeYn = await likePlace(placeSeq, accessToken);

      if (updatedLikeYn === 'Y') {
        setCurrentLikes((prevLikes) => prevLikes + 1);
        setLiked(true);
        updatePlaceLikes(placeSeq, true);
      } else if (updatedLikeYn === 'N') {
        setCurrentLikes((prevLikes) => prevLikes - 1);
        setLiked(false);
        updatePlaceLikes(placeSeq, false);
      }

      setAnimate(true);
      setTimeout(() => setAnimate(false), 200);
    } catch (error) {
      console.error('Error updating like status: ', error);
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // 이벤트 전파 막기
    const accessToken = sessionStorage.getItem('accessToken');

    if (!accessToken) {
      navigate('/users/login');
      return;
    }

    try {
      if (bookmarked) {
        await removeBookmark(placeSeq, accessToken);
        setBookmarked(false);
      } else {
        await addBookmark(placeSeq, accessToken);
        setBookmarked(true);
      }
      // 북마크 상태 변경 후 새로고침을 통해 최신 상태를 반영
      fetchUserBookmarks(accessToken);
    } catch (error) {
      console.error('Error updating bookmark status: ', error);
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
