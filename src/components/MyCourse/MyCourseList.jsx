import React, { useEffect, useState } from 'react';
import { myCourses, deleteCourse } from '../../services/myCourseService';
import { useNavigate } from 'react-router-dom';
import { RiDeleteBin6Line, RiEdit2Line } from 'react-icons/ri';
import { formatDate } from '../common/FormatDate';
import '../../css/MyCourseList.css';
import MyPageSidebar from '../common/MyPageSidebar';
import CourseGroupTapBar from '../common/CourseGroupTapBar';
import MyCoursePagination from '../common/pagenation/MyCoursePagination';

const MyCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12; // 페이지 당 항목 수
  const navigate = useNavigate();

  useEffect(() => {
    const getCourses = async () => {
      try {
        const data = await myCourses();
        setCourses(data);
      } catch (err) {
        setError(err);
      }
    };

    getCourses();
  }, []);

  // 코스 삭제
  const deleteBtn = async (courseSeq) => {
    const confirmDelete = window.confirm('정말 코스를 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        const response = await deleteCourse(courseSeq);
        alert(response.message); // 성공 메시지 출력
        setCourses(courses.filter((course) => course.courseSeq !== courseSeq));
      } catch (err) {
        setError(err);
      }
    }
  };

  // 코스 수정 페이지로 이동
  const editBtn = (courseSeq) => {
    navigate(`/courseEdit/${courseSeq}`);
  };

  // 제목 말줄임 처리 함수
  const titleLength = (title, maxLength = 12) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + '...';
    }
    return title;
  };

  if (error)
    return <div>코스를 불러오는 중 오류가 발생했습니다: {error.message}</div>;

  return (
    <div className="grid-container">
      <MyPageSidebar />
      <div className="courselist">
        <CourseGroupTapBar />
        <ul className="courseItem">
          {courses.map((course) => {
            const placeCount = course.courseList.length;
            let placeClass = '';
            if (placeCount === 1) placeClass = 'one';
            else if (placeCount === 2) placeClass = 'two';
            else if (placeCount === 3) placeClass = 'three';
            else if (placeCount >= 4) placeClass = 'four';

            return (
              <div key={course.courseSeq} className={`course ${placeClass}`}>
                <ul className="image">
                  {course.courseList.slice(0, 4).map(
                    (
                      item,
                      index // 최대 4개의 이미지까지만 표시
                    ) => (
                      <li
                        key={item.courseListSeq}
                        className={`image-item image-item-${index + 1}`}
                      >
                        <img
                          src={`${
                            item.place.imageFile1 !== null &&
                            (item.place.imageFile1 ||
                              '/free-sticker-van-13719277.png')
                          }`}
                          alt={item.place.title}
                        />
                      </li>
                    )
                  )}
                </ul>
                <p className="courseTitle" title={course.title}>
                  {titleLength(course.title)}
                </p>
                <p className="courseDate">{formatDate(course.createDate)}</p>
                <button
                  className="editBtn"
                  onClick={() => editBtn(course.courseSeq)}
                >
                  <RiEdit2Line />
                </button>
                <button
                  className="deleteBtn"
                  onClick={() => deleteBtn(course.courseSeq)}
                >
                  <RiDeleteBin6Line />
                </button>
              </div>
            );
          })}
        </ul>
        <MyCoursePagination
          totalPages={Math.ceil(courses.length / itemsPerPage)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default MyCourseList;
