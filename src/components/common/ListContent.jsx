import { useContext } from 'react';
import styles from '../../styles/components/place/ListContent.module.css';
import PlaceCard from '../PlaceCard';
import Pagination from './Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { PlaceContext } from '../../contexts/PlaceContext';

const ListContent = () => {
  const { places, loading, error, dropdownTitle, handleDropdownClick } =
    // Context사용하여 데이터 뿌려줌
    useContext(PlaceContext);

  if (loading) return <span className="loader"></span>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={styles['list-content']}>
      <div className={styles['dropdown-wrap']}>
        <div className={styles['dropdown']}>
          <div className={styles['dropdown-btn']}>
            {dropdownTitle} <FontAwesomeIcon icon={faChevronDown} />
          </div>
          <div className={styles['dropdown-content']}>
            <a onClick={() => handleDropdownClick('인기순')}>인기순</a>
            <a onClick={() => handleDropdownClick('최신순')}>최신순</a>
          </div>
        </div>
      </div>
      {places.map((place) => (
        <PlaceCard
          key={place.contentid}
          placeSeq={place.contentid}
          contentId={place.contentid}
          image={place.firstimage || place.firstimage2 || ''}
          type={place.contenttypeid}
          title={place.title}
          address={place.addr1}
          views={place.viewCount}
          likes={place.likeCount}
          bookmarks={place.bookmarks || 0}
          latitude={place.mapx}
          longitude={place.mapy}
        />
      ))}
      <Pagination />
    </div>
  );
};

export default ListContent;
