import { useParams, useLocation, useNavigate } from 'react-router-dom';
import usePlaceDetails from '../../hooks/usePlaceDetails';
import LoadingError from '../../components/common/LoadingError';
import PlaceDetailInfo from '../../components/PlaceDetailInfo';
import MapComponent from '../../components/common/MapComponent';
import styles from '../../styles/pages/place/PlaceDetail.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

const typeMap = {
  12: '관광지',
  14: '문화시설',
  28: '레저 스포츠',
  32: '숙박',
  38: '쇼핑',
  39: '음식점',
};

const PlacesDetailPage = () => {
  const { placeSeq } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    type,
    contentId,
    image,
    title,
    address,
    views,
    likes,
    bookmarks,
    longitude,
    latitude,
  } = location.state || {};

  const typeText = typeMap[type] || '기타';

  const { placeDetails, loading, error } = usePlaceDetails(
    contentId,
    type,
    placeSeq
  );

  return (
    <div className="grid-container">
      {/* <button onClick={() => navigate(-1)} style={{ marginBottom: '10px' }}>
        뒤로가기
      </button> */}
      <div className={styles['place-detail']}>
        <section className={styles['image-map-section']}>
          <div className={styles['map-container']}>
            <MapComponent latitude={latitude} longitude={longitude} />
          </div>
          <div className={styles['image-container']}>
            {image ? (
              <img src={image} alt={title} className={styles.image} />
            ) : (
              <div className={styles['image-placeholder']}>
                <FontAwesomeIcon icon={faImage} size="6x" color="#ccc" />
              </div>
            )}
          </div>
        </section>
        {/* 제목, 주소, 유형 */}
        <section className={styles['header-section']}>
          <span>{typeText}</span>
          <h1>{title}</h1>
          <p>{address}</p>
        </section>
        <LoadingError loading={loading} error={error} />
        {placeDetails && <PlaceDetailInfo type={type} details={placeDetails} />}
      </div>
    </div>
  );
};

export default PlacesDetailPage;
