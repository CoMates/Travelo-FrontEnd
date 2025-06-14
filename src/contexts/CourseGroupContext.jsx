import { createContext, useCallback, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useParams } from 'react-router-dom';

const CourseGroupContext = createContext();

const CourseGroupProvider = ({ children }) => {
  const [courseGroups, setCourseGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;

  const fetchCourseGroups = async () => {
    try {
      const response = await axiosInstance.get('/user/group/list');
      const allCourseGroups = response.data.courseGroup;
      // 데이터 정렬
      const sortedGroups = [...allCourseGroups].sort(
        (a, b) => new Date(b.createDate) - new Date(a.createDate)
      );

      setCourseGroups(sortedGroups);
      setLoading(false);
      setTotalPages(Math.ceil(sortedGroups.length / pageSize));
    } catch (error) {
      setError(error.response.data);
      setLoading(false);
    }
  };

  const [courseGroup, setCourseGroup] = useState(null);

  const fetchCourseGroupDetail = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/user/group/detail/${id}`);

      setCourseGroup(response.data.courseGroup);
      setLoading(false);
    } catch (error) {
      setError(error.response.data);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourseGroups();
  }, []);

  const getCurrentPageData = () => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return courseGroups.slice(startIndex, endIndex);
  };

  return (
    <CourseGroupContext.Provider
      value={{
        courseGroups: getCurrentPageData(),
        loading,
        error,
        totalPages,
        currentPage,
        setCurrentPage,
        courseGroup,
        fetchCourseGroupDetail,
        fetchCourseGroups,
      }}
    >
      {children}
    </CourseGroupContext.Provider>
  );
};

export { CourseGroupContext, CourseGroupProvider };
