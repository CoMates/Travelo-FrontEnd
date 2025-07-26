import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import styles from '../styles/HomePage.module.css';
import axiosInstance, { axiosInstanceTour } from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const tourAPIKey = import.meta.env.VITE_API_TOUR_KEY;

const HomePage = () => {
  const [data, setData] = useState({
    courses: [],
    places: [],
  });

  const [place, setPlace] = useState(null);

  const [imageUrl, setImageUrl] = useState('');

  const navigate = useNavigate();

  const typeMap = {
    12: '관광지',
    14: '문화시설',
    15: '축제공연행사',
    25: '여행코스',
    28: '레포츠',
    32: '숙박',
    38: '쇼핑',
    39: '음식점',
  };

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://apis.data.go.kr/B551011/KorService1/searchKeyword1?serviceKey=${tourAPIKey}&MobileApp=AppTest&MobileOS=ETC&pageNo=1&numOfRows=10&listYN=Y&arrange=A&contentTypeId=12&keyword=%EA%B0%95%EC%9B%90&_type=json`;

      try {
        const response = await axios.get(url);
        console.log('response', response.data);
        const item = response.data.response.body.items.item[0];
        setPlace(item);

        const courseResponse = await axiosInstance.get('/travelo/main');
        console.log(courseResponse);
        console.log('courseResponse', courseResponse.data.courses);
        setData(() => ({
          places: response.data.response.body.items.item,
        }));
        setData((prevData) => ({
          ...prevData,
          courses: courseResponse.data.courses,
        }));
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const courseImage = async () => {
      const contentId = data.courses?.courseList?.contentId;
      const params = {
        serviceKey: tourAPIKey,
        contentId: contentId,
        pageNo: 0,
        MobileOS: 'WEB',
        MobileApp: 'travelo',
        arrange: 'A',
      };
      try {
        const courseImageResponse = await axiosInstanceTour.get(
          'detailCommon2',
          {
            params,
          }
        );
        const courseImageUrl =
          courseImageResponse.data.response.items.item[0].firstimage;
        if (courseImageUrl) setImageUrl(courseImageUrl);
      } catch (error) {
        console.error('Error fetching data', error);
      }
      if (contentId) {
        courseImage(contentId);
      }
    };
  }, [data.courses?.courseList?.contentId]);

  const handlePlaceClick = (place) => {
    navigate(`/places/${place.placeSeq}`, {
      state: {
        type: place.type,
        contentId: place.contentId,
        image: place.firstimage,
        title: place.title,
        address: place.address,
        views: place.viewCount,
        likes: place.likeCount,
        bookmarks: place.bookmarks || 0,
        latitude: place.latitude,
        longitude: place.longitude,
      },
    });
  };

  const handleCourseClick = (course) => {
    navigate(`/course/${course.courseSeq}`, {
      state: {
        courseSeq: course.courseSeq,
        title: course.title,
        description: course.description,
        viewCount: course.viewCount,
        likeCount: course.likeCount,
        createDate: course.createDate,
        areaCode: course.areaCode,
        images: course.courseList
          .map((item) => item.place.firstimage)
          .filter(Boolean),
      },
    });
  };

  return (
    <div className={styles['grid-container']}>
      <main className={styles.wrap}>
        {/* 메인 비주얼 슬라이드 */}
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          effect="fade"
          autoplay={{ delay: 8000 }}
          modules={[Autoplay, EffectFade]}
          className={styles.swiper}
        >
          <SwiperSlide>
            <div
              className={`${styles.mainVisualSlide} ${styles.mainVisualSlideBlue}`}
            >
              <h1 className={styles.mainTitle}>Travelo</h1>
              <p className={styles.subTitle}>편리한 국내여행을 위한 선택!</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className={`${styles.mainVisualSlide} ${styles.mainVisualSlideRed}`}
            >
              <h1 className={styles.mainTitle}>Travelo</h1>
              <p className={styles.subTitle}>트래블로로 쉽게 여행가자!</p>
            </div>
          </SwiperSlide>
        </Swiper>

        {/* 인기 장소 */}
        {/* 임시로 제일 처음 나오는 장소 띄워놓은 상태 */}
        <h2>
          <p>&#x2728;</p> 지금 주목받는 인기 장소
        </h2>
        <Swiper
          spaceBetween={10}
          slidesPerView={3}
          autoplay={{ delay: 5000 }}
          modules={[Autoplay]}
          className={styles.swiper}
        >
          {data.places.slice(0, 6).map((place, index) => (
            <SwiperSlide key={index} onClick={() => handlePlaceClick(place)}>
              <div className={styles.placeSlide}>
                <div className={styles.placeImageContainer}>
                  {place.firstimage ? (
                    <img
                      src={place.firstimage}
                      alt={place.title}
                      className={styles.placeImage}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <FontAwesomeIcon icon={faImage} size="3x" color="#ccc" />
                    </div>
                  )}
                  <div className={styles.placeOverlay}>
                    <span className={styles.info}>
                      <span className={styles.placeType}>
                        {typeMap[place.type] || '기타'}
                      </span>
                      <h3 className={styles.placeTitle}>{place.title}</h3>
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* 인기 코스 */}
        <div className={styles.hc}>
          <h2>
            <p>&#x2B50;</p> 유저들이 선정한 인기코스
          </h2>
          <Swiper
            spaceBetween={10}
            slidesPerView={3}
            autoplay={{ delay: 3000 }}
            modules={[Autoplay]}
            className={styles.swiper}
          >
            {data.courses.slice(0, 6).map((course, index) => (
              <SwiperSlide
                key={index}
                onClick={() => handleCourseClick(course)}
              >
                <div className={styles.courseSlide}>
                  <div className={styles['image-container']}>
                    {course.courseList.length > 0 ? (
                      <div className={styles['image-grid']}>
                        {course.courseList.slice(0, 4).map((item, imgIndex) => (
                          <div key={imgIndex} className={styles['image-item']}>
                            {item.courseList ? (
                              <img
                                src={imageUrl}
                                alt={`course-img-${imgIndex}`}
                                className={styles.image}
                              />
                            ) : (
                              <div className={styles['image-placeholder']}>
                                <FontAwesomeIcon
                                  icon={faImage}
                                  size="1x"
                                  color="#ccc"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles['image-placeholder']}>
                        <FontAwesomeIcon
                          icon={faImage}
                          size="3x"
                          color="#ccc"
                        />
                      </div>
                    )}
                  </div>
                  <div className={styles.content}>
                    <div>
                      <div className={styles.details}>
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
