// ModifyCourseCard.jsx
import React from 'react';
import styles from '../../styles/pages/courseGroup/CourseGroupCard.module.css';

const ModifyCourseCard = ({ course }) => {
  const defaultImage = '/free-sticker-van-13719277.png'; // 대체 이미지 경로 설정

  const renderImages = () => {
    if (!course || !course.courseList || course.courseList.length === 0) {
      return (
        <img
          src={defaultImage}
          alt="default"
          className={styles['full-image']}
        />
      );
    }

    let images = course.courseList
      .map((item) => item.place.imageFile1 || defaultImage)
      .slice(0, 4); // 각 장소의 이미지 가져옴

    if (images.length === 3) {
      images = images.slice(0, 2); // 이미지가 3개인 경우 앞의 2개만 사용
    }

    const imageCount = images.length;

    if (imageCount === 1) {
      return (
        <img src={images[0]} alt="place" className={styles['full-image']} />
      );
    }

    if (imageCount === 2) {
      return (
        <div className={styles['half-images']}>
          <img src={images[0]} alt="place" className={styles['half-image']} />
          <img src={images[1]} alt="place" className={styles['half-image']} />
        </div>
      );
    }

    if (imageCount === 4) {
      return (
        <div className={styles['quarter-images']}>
          {images.map((image, i) => (
            <img
              key={i}
              src={image}
              alt="place"
              className={styles['quarter-image']}
            />
          ))}
        </div>
      );
    }

    // If no images or other cases, return the default image
    return (
      <img src={defaultImage} alt="default" className={styles['full-image']} />
    );
  };

  const renderPlaceTitles = () => {
    if (!course || !course.courseList || course.courseList.length === 0) {
      return '';
    }

    return course.courseList.map((item, index) => (
      <li key={index}>{item.place.title}</li>
    ));
  };

  return (
    <div>
      <div>
        {course ? (
          <div className={styles['filled']}>
            <div className={styles['card-image-wrap']}>{renderImages()}</div>
            <div className={styles['filled-text-wrap']}>
              <h3>{course.title}</h3>
              <ul>{renderPlaceTitles()}</ul>
            </div>
          </div>
        ) : (
          <div className={styles['unfilled']}>
            <p>No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModifyCourseCard;
