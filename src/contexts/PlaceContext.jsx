import { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance, { axiosInstanceTour } from '../utils/axiosInstance';
import { fetchBookmarks } from '../services/bookmarkService';

const tourAPIKey = import.meta.env.VITE_API_TOUR_API_KEY;

const PlaceContext = createContext();

const PlaceProvider = ({ children }) => {
  const [places, setPlaces] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownTitle, setDropdownTitle] = useState('인기순');
  const [filters, setFilters] = useState({
    item: 15,
    page: 0,
    keyword: '',
    sorts: 'popular',
    content: '',
    area: '',
  });
  const [placeRequires, setPlaceRequires] = useState({
    numOfRows: 15,
    pageNo: 0,
    MobileOS: 'WEB',
    MobileApp: 'travelo',
    arrange: 'A',
  });
  const placeContentTypes = [12, 14, 32, 38, 39];
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchPlaces = async (updatedFilters) => {
    console.log('serviceKey:', tourAPIKey);

    const params = {
      ...placeRequires,
      serviceKey: tourAPIKey,
      _type: 'json',
    };

    console.log('params:', params);
    setLoading(true);
    try {
      const response = await axiosInstanceTour.get('areaBasedList2', {
        params,
      });
      setPlaces(response.data.response.body.items.item);
      setTotalPages(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchPlaces = async (updatedFilters) => {
  //   setLoading(true);
  //   try {
  //     const response = await axiosInstance.get('/travelo/place/list', {
  //       params: {
  //         ...filters,
  //         ...updatedFilters,
  //       },
  //     });
  //     setPlaces(response.data.paging.content);
  //     setTotalPages(response.data.paging.totalPages);
  //   } catch (error) {
  //     setError(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchUserBookmarks = useCallback(async (accessToken) => {
    try {
      const bookmarks = await fetchBookmarks(accessToken);
      setBookmarks(bookmarks);
    } catch (error) {
      console.error('북마크 목록 가져오기 실패', error);
    }
  }, []);

  useEffect(() => {
    fetchPlaces(filters);
  }, []);

  useEffect(() => {
    fetchPlaces({ page: currentPage });
  }, [currentPage]);

  const handleDropdownClick = (title) => {
    setDropdownTitle(title);
    fetchPlaces({ sorts: title === '인기순' ? 'popular' : '' });
  };

  const updateFilters = (newFilters) => {
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        ...newFilters,
        page: 0,
      };
      fetchPlaces(updatedFilters);
      return updatedFilters;
    });
    setCurrentPage(0); // 페이지 필터링 시 첫 페이지로 이동
  };

  const resetFilters = () => {
    const initialFilters = {
      item: 15,
      page: 0,
      keyword: '',
      sorts: 'popular',
      content: '',
      area: '',
    };
    setFilters(initialFilters);
    setDropdownTitle('인기순');
    setCurrentPage(0);
    fetchPlaces(initialFilters);
  };

  const updatePlaceLikes = (placeSeq, liked) => {
    setPlaces((prevPlaces) =>
      prevPlaces.map((place) =>
        place.placeSeq === placeSeq
          ? { ...place, likeCount: place.likeCount + (liked ? 1 : -1) }
          : place
      )
    );
  };

  return (
    <PlaceContext.Provider
      value={{
        places,
        bookmarks,
        loading,
        error,
        dropdownTitle,
        handleDropdownClick,
        updateFilters,
        resetFilters,
        totalPages,
        currentPage,
        setCurrentPage,
        updatePlaceLikes,
        fetchUserBookmarks, // 북마크를 불러오는 함수 추가
      }}
    >
      {children}
    </PlaceContext.Provider>
  );
};

export { PlaceContext, PlaceProvider };
