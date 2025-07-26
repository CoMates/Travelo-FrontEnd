import { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance, { axiosInstanceTour } from '../utils/axiosInstance';
import { fetchBookmarks } from '../services/bookmarkService';
import * as hangul from 'hangul-js';

const tourAPIKey = import.meta.env.VITE_API_TOUR_API_KEY;

const PlaceContext = createContext();

const PlaceProvider = ({ children }) => {
  const [places, setPlaces] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownTitle, setDropdownTitle] = useState('인기순');

  // 필터
  const [filters, setFilters] = useState({
    numOfRows: 15,
    pageNo: 0,
    MobileOS: 'WEB',
    MobileApp: 'travelo',
    arrange: 'A',
    // sorts: 'popular',
    // content: '',
    // area: '',
    // keyword: '',
  });

  const placeContentTypes = [12, 14, 15, 25, 28, 32, 38, 39];
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchPlaces = async (additionalParams = {}) => {
    const params = {
      ...filters,
      ...additionalParams,
      serviceKey: tourAPIKey,
      _type: 'json',
    };

    console.log('params:', params);
    setLoading(true);
    try {
      console.log('params2:', params);

      //api 요청 분기에 따른... 문제가 있는 것으로 예상
      let response;
      //완성된 한글인지 판단

      //아무것도 없음: false, ㄱ: false, 가: true

      // if (additionalParams.keyword?.trim() && additionalParams.keyword !== '') {
      //   response = await axiosInstanceTour.get('searchKeyword2', {
      //     params,
      //   });
      //   console.log('이거 실행?');
      // } else {
      //   response = await axiosInstanceTour.get('areaBasedList2', {
      //     params,
      //   });
      //   console.log('키워드없음');
      // }

      // react.memo를 사용하는 게 좋아보임.
      console.log('typeofkeyword', typeof additionalParams.keyword);

      if (!additionalParams.keyword || additionalParams.keyword.trim() === '') {
        additionalParams.keyword = '가';
      }

      const isComplete = hangul.isComplete(additionalParams.keyword);
      console.log('keyword내용', additionalParams.keyword);
      console.log('iscomplete', isComplete);

      if (!isComplete) {
        return;
      }
      response = await axiosInstanceTour.get('searchKeyword2', {
        params,
      });

      const responseData = response.data.response;

      console.log('response', responseData);
      console.log('responsessss', response);

      if (responseData == undefined) {
        return;
      }

      setPlaces(responseData.body.items.item);
      console.log(responseData.body.items.item);
      const totalCount = responseData.body.totalCount;
      const calculatedTotalPages = Math.ceil(totalCount / filters.numOfRows);
      setTotalPages(calculatedTotalPages);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

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
    fetchPlaces({ pageNo: currentPage + 1 });
  }, [currentPage + 1]);

  const handleDropdownClick = (title) => {
    setDropdownTitle(title);
    fetchPlaces({ sorts: title === '인기순' ? 'popular' : '' });
  };

  const updateFilters = (newFilters) => {
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        ...newFilters,
      };
      fetchPlaces(updatedFilters);
      return updatedFilters;
    });
    setCurrentPage(0); // 페이지 필터링 시 첫 페이지로 이동
  };

  const resetFilters = () => {
    const initialFilters = {
      numOfRows: 15,
      pageNo: 1,
      MobileOS: 'WEB',
      MobileApp: 'travelo',
      arrange: 'A',
      areaCode: '',
      contentTypeId: '',
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
