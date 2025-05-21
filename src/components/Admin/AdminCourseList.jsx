import React, { useEffect, useState, useRef } from 'react';
import {
  getCourseList,
  getVisibleCourseList,
  deleteCourse,
  deleteCourses,
} from '../../services/adminService';
import { formatDate } from '../common/FormatDate';
import '../../css/admin/AdminCourse.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const AdminCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('latest');
  const [filter, setFilter] = useState('all');
  const [totalPages, setTotalPages] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('최신순');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let data;
        if (filter === 'all') {
          data = await getCourseList(page, sortBy);
        } else {
          data = await getVisibleCourseList(page, sortBy, filter);
        }
        setCourses(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err);
      }
    };
    fetchCourses();
  }, [page, sortBy, filter]);

  const deleteCourseBtn = async (courseSeq) => {
    if (window.confirm('정말로 이 코스를 삭제하시겠습니까?')) {
      try {
        await deleteCourse(courseSeq);
        setCourses(courses.filter((course) => course.courseSeq !== courseSeq));
        alert('코스가 성공적으로 삭제되었습니다.');
      } catch (err) {
        console.error('Error deleting course:', err);
        setError(err);
        alert('코스 삭제에 실패했습니다.');
      }
    }
  };

  const deleteSelectedCourses = async () => {
    if (selectedCourses.length === 0) {
      alert('삭제할 코스를 선택하세요.');
      return;
    }
    if (window.confirm('선택한 코스를 삭제하시겠습니까?')) {
      try {
        await deleteCourses(selectedCourses);
        setCourses(
          courses.filter(
            (course) => !selectedCourses.includes(course.courseSeq)
          )
        );
        setSelectedCourses([]);
        alert('선택한 코스가 성공적으로 삭제되었습니다.');
      } catch (err) {
        setError(err);
        alert('선택한 코스 삭제에 실패했습니다.');
      }
    }
  };

  const toggleSelectCourse = (courseSeq) => {
    setSelectedCourses((prevSelected) =>
      prevSelected.includes(courseSeq)
        ? prevSelected.filter((seq) => seq !== courseSeq)
        : [...prevSelected, courseSeq]
    );
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDropdownClick = (option) => {
    setSelectedOption(option);
    setSortBy(option === '최신순' ? 'latest' : 'oldest');
    setDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="adminCourseList adminUserList">
      <h1>전체 코스 목록</h1>
      <div className="filtering">
        <div className="filter">
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'active' : ''}
          >
            전체 보기
          </button>
          <button
            onClick={() => setFilter('N')}
            className={filter === 'N' ? 'active' : ''}
          >
            공개
          </button>
          <button
            onClick={() => setFilter('Y')}
            className={filter === 'Y' ? 'active' : ''}
          >
            비공개
          </button>
        </div>

        <div className="sort" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="dropDownBtn">
            <div className="text">{selectedOption}</div>
            <FontAwesomeIcon
              icon={dropdownOpen ? faChevronUp : faChevronDown}
            />
          </button>
          {dropdownOpen && (
            <div className={`dropdownContent ${dropdownOpen ? 'show' : ''}`}>
              <a onClick={() => handleDropdownClick('최신순')}>최신순</a>
              <a onClick={() => handleDropdownClick('오래된순')}>오래된순</a>
            </div>
          )}
        </div>
      </div>
      <div className="userSelect">
        <button onClick={deleteSelectedCourses}>선택한 코스 삭제</button>
        <p>선택된 코스: {selectedCourses.length}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th style={{ width: '8%' }}>선택</th>
            <th style={{ width: '10%' }}>코스 번호</th>
            <th style={{ width: '22%' }}>제목</th>
            <th style={{ width: '15%' }}>생성 일자</th>
            <th style={{ width: '18%' }}>수정 일자</th>
            <th style={{ width: '12%' }}>공개 여부</th>
            <th style={{ width: '10%' }}>삭제</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.courseSeq}>
              <td>
                <input
                  type="checkbox"
                  className="styled-checkbox"
                  id={`checkbox-${course.courseSeq}`}
                  onChange={() => toggleSelectCourse(course.courseSeq)}
                  checked={selectedCourses.includes(course.courseSeq)}
                />
                <label htmlFor={`checkbox-${course.courseSeq}`}></label>
              </td>
              <td>{course.courseSeq}</td>
              <td>{course.title}</td>
              <td>{formatDate(course.createDate)}</td>
              <td>
                {course.modifyDate
                  ? formatDate(course.modifyDate)
                  : '수정된 적 없음'}
              </td>
              <td>{course.privateYn === 'Y' ? '비공개' : '공개'}</td>
              <td>
                <button
                  className="delBtn btn_type_1"
                  onClick={() => deleteCourseBtn(course.courseSeq)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page <= 0}>
          이전
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages - 1}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default AdminCourseList;
