import { useState, useContext } from 'react';
import styles from '../../styles/components/Sidebar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRotateRight,
  faChevronDown,
  faChevronUp,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { PlaceContext } from '../../contexts/PlaceContext';

const Sidebar = () => {
  const [isRegionExpanded, setIsRegionExpanded] = useState(true);
  const [isProvinceExpanded, setIsProvinceExpanded] = useState(false);
  const {
    handleKeywordChange,
    handleRegionChange,
    handleTypeChange,
    resetFilters,
    updateFilters,
  } = useContext(PlaceContext);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [keyword, setKeyword] = useState([]);

  const toggleRegion = () => {
    setIsRegionExpanded(!isRegionExpanded);
  };

  const toggleProvince = () => {
    setIsProvinceExpanded(!isProvinceExpanded);
  };

  const handleKeywordInputChange = (e) => {
    setKeyword(e.target.value);
    updateFilters({ keyword: e.target.value }); // 필터 업데이트
  };

  const handleRegionRadioChange = (e) => {
    setSelectedRegion(e.target.value);
    updateFilters({ areaCode: e.target.value }); // 필터 업데이트
  };

  const handleTypeRadioChange = (e) => {
    setSelectedType(e.target.value);
    updateFilters({ contentTypeId: e.target.value }); // 필터 업데이트
  };

  const handleReset = () => {
    setSelectedRegion('');
    setSelectedType('');
    setKeyword('');
    resetFilters(); // 필터 초기화
  };

  return (
    <div className={styles['sidebar']}>
      <div className={styles['search-field']}>
        <input
          type="text"
          placeholder="키워드를 입력해주세요"
          className={styles['search-input']}
          value={keyword}
          defaultValue={[]}
          onChange={handleKeywordInputChange}
        />
        <FontAwesomeIcon icon={faSearch} className={styles['search-icon']} />
      </div>
      <div className={styles['heading']}>
        <h3>장소 검색</h3>
        <button onClick={handleReset}>
          <FontAwesomeIcon icon={faRotateRight} />
          초기화
        </button>
      </div>
      <div className={styles['section']}>
        <h4>지역</h4>
        <div className={styles['section-content']}>
          <label>
            <input
              type="radio"
              name="region"
              value=""
              checked={selectedRegion === ''}
              onChange={handleRegionRadioChange}
            />
            <span></span> 전체
          </label>
        </div>
        <div className={styles['section-header']} onClick={toggleRegion}>
          <span>서울특별시,광역시,특별자치시</span>
          <FontAwesomeIcon
            icon={isRegionExpanded ? faChevronUp : faChevronDown}
          />
        </div>
        {isRegionExpanded && (
          <div className={styles['section-content']}>
            <label>
              <input
                type="radio"
                name="region"
                value="1"
                checked={selectedRegion === '1'}
                onChange={handleRegionRadioChange}
              />
              <span></span> 서울특별시
            </label>
            <label>
              <input
                type="radio"
                name="region"
                value="6"
                checked={selectedRegion === '6'}
                onChange={handleRegionRadioChange}
              />
              <span></span> 부산광역시
            </label>
            <label>
              <input
                type="radio"
                name="region"
                value="4"
                checked={selectedRegion === '4'}
                onChange={handleRegionRadioChange}
              />
              <span></span> 대구광역시
            </label>
            <label>
              <input
                type="radio"
                name="region"
                value="2"
                checked={selectedRegion === '2'}
                onChange={handleRegionRadioChange}
              />
              <span></span> 인천광역시
            </label>
            <label>
              <input
                type="radio"
                name="region"
                value="5"
                checked={selectedRegion === '5'}
                onChange={handleRegionRadioChange}
              />
              <span></span> 광주광역시
            </label>
            <label>
              <input
                type="radio"
                name="region"
                value="3"
                checked={selectedRegion === '3'}
                onChange={handleRegionRadioChange}
              />
              <span></span> 대전광역시
            </label>
            <label>
              <input
                type="radio"
                name="region"
                value="7"
                checked={selectedRegion === '7'}
                onChange={handleRegionRadioChange}
              />
              <span></span> 울산광역시
            </label>
            <label>
              <input
                type="radio"
                name="region"
                value="8"
                checked={selectedRegion === '8'}
                onChange={handleRegionRadioChange}
              />
              <span></span> 세종특별자치시
            </label>
          </div>
        )}
        <div className={styles['section-header']} onClick={toggleProvince}>
          <span>특별자치도, 도</span>
          <FontAwesomeIcon
            icon={isProvinceExpanded ? faChevronUp : faChevronDown}
          />
        </div>
        {isProvinceExpanded && (
          <div className={styles['section-content']}>
            <label>
              <input
                type="radio"
                name="region"
                value="31"
                checked={selectedRegion === '31'}
                onChange={handleRegionRadioChange}
              />
              <span></span> 경기도
            </label>
            <label>
              <input
                type="radio"
                name="region"
                value="32"
                checked={selectedRegion === '32'}
                onChange={handleRegionRadioChange}
              />
              <span></span> 강원특별자치도
            </label>
            <label>
              <input
                type="radio"
                name="region"
                value="33"
                checked={selectedRegion === '33'}
                onChange={handleRegionRadioChange}
              />
              <span></span> 충청북도
            </label>
            <label>
              <input
                type="radio"
                name="region"
                value="34"
                checked={selectedRegion === '34'}
                onChange={handleRegionRadioChange}
              />
              <span></span> 충청남도
            </label>
            <label>
              <input
                type="radio"
                name="region"
                value="37"
                checked={selectedRegion === '37'}
                onChange={handleRegionRadioChange}
              />
              <span></span> 전북특별자치도
            </label>
            <label>
              <input
                type="radio"
                name="region"
                value="38"
                checked={selectedRegion === '38'}
                onChange={handleRegionRadioChange}
              />
              <span></span> 전라남도
            </label>
            <label>
              <input
                type="radio"
                name="region"
                value="35"
                checked={selectedRegion === '35'}
                onChange={handleRegionRadioChange}
              />
              <span></span> 경상북도
            </label>
            <label>
              <input
                type="radio"
                name="region"
                value="36"
                checked={selectedRegion === '36'}
                onChange={handleRegionRadioChange}
              />
              <span></span> 경상남도
            </label>
            <label>
              <input
                type="radio"
                name="region"
                value="39"
                checked={selectedRegion === '39'}
                onChange={handleRegionRadioChange}
              />
              <span></span> 제주특별자치도
            </label>
          </div>
        )}
      </div>
      <div className={styles['section']}>
        <div className={styles['section-header']}>
          <span>유형</span>
        </div>
        <div className={styles['section-content']}>
          <label>
            <input
              type="radio"
              name="type"
              value=""
              checked={selectedType === ''}
              onChange={handleTypeRadioChange}
            />
            <span></span> 전체
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="12"
              checked={selectedType === '12'}
              onChange={handleTypeRadioChange}
            />
            <span></span> 관광지
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="14"
              checked={selectedType === '14'}
              onChange={handleTypeRadioChange}
            />
            <span></span> 문화시설
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="15"
              checked={selectedType === '15'}
              onChange={handleTypeRadioChange}
            />
            <span></span> 축제공연행사
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="25"
              checked={selectedType === '25'}
              onChange={handleTypeRadioChange}
            />
            <span></span> 여행코스
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="28"
              checked={selectedType === '28'}
              onChange={handleTypeRadioChange}
            />
            <span></span> 레저 스포츠
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="32"
              checked={selectedType === '32'}
              onChange={handleTypeRadioChange}
            />
            <span></span> 숙박
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="38"
              checked={selectedType === '38'}
              onChange={handleTypeRadioChange}
            />
            <span></span> 쇼핑
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="39"
              checked={selectedType === '39'}
              onChange={handleTypeRadioChange}
            />
            <span></span> 음식점
          </label>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
