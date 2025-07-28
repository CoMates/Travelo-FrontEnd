import { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance, { axiosInstanceTour } from '../utils/axiosInstance';
import { fetchBookmarks } from '../services/bookmarkService';
import * as hangul from 'hangul-js';

const tourAPIKey = import.meta.env.VITE_API_TOUR_API_KEY;

const PlaceContext = createContext();

const PlaceProvider = ({ children }) => {
  const getStoredState = (key, defaultValue) => {
    try {
      const stored = sessionStorage.getItem(`placeContext_${key}`);
      const parsed = stored ? JSON.parse(stored) : defaultValue;
      console.log(`🔍 Restored ${key}:`, parsed); // 디버깅용
      return parsed;
    } catch {
      console.warn(`⚠️ Failed to restore ${key}:`, error);
      return defaultValue;
    }
  };

  const [places, setPlaces] = useState(() => getStoredState('places', []));
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownTitle, setDropdownTitle] = useState(() =>
    getStoredState('dropdownTitle', '인기순')
  );

  // 필터
  const [filters, setFilters] = useState(() =>
    getStoredState('filters', {
      numOfRows: 15,
      pageNo: 0,
      MobileOS: 'WEB',
      MobileApp: 'travelo',
      arrange: 'A',
    })
  );

  const placeContentTypes = [12, 14, 15, 25, 28, 32, 38, 39];
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastSearchKeyword, setLastSearchKeyword] = useState(() =>
    getStoredState('lastSearchKeyword', '')
  );

  console.log('🚀 PlaceProvider mounted with states:', {
    placesCount: places.length,
    currentPage,
    lastSearchKeyword,
    dropdownTitle,
    filters,
  });

  const saveToStorage = (key, value) => {
    try {
      sessionStorage.setItem(`placeContext_${key}`, JSON.stringify(value));
      console.log(`💾 Saved ${key}:`, value); // 디버깅용
    } catch (error) {
      console.warn('Failed to save to sessionStorage:', error);
    }
  };

  useEffect(() => {
    saveToStorage('filters', filters);
  }, [filters]);

  useEffect(() => {
    saveToStorage('dropdownTitle', dropdownTitle);
  }, [dropdownTitle]);

  useEffect(() => {
    saveToStorage('totalPages', totalPages);
  }, [totalPages]);

  useEffect(() => {
    saveToStorage('currentPage', currentPage);
  }, [currentPage]);

  useEffect(() => {
    saveToStorage('lastSearchKeyword', lastSearchKeyword);
  }, [lastSearchKeyword]);

  const fetchPlaces = async (additionalParams = {}) => {
    const params = {
      ...filters,
      ...additionalParams,
      serviceKey: tourAPIKey,
      _type: 'json',
    };

    console.log('🔄 fetchPlaces called with params:', params);
    setLoading(true);
    try {
      let response;

      if (!additionalParams.keyword || additionalParams.keyword.trim() === '') {
        additionalParams.keyword = '가';
      }

      //완성된 한글인지 판단
      const isComplete = hangul.isCompleteAll(additionalParams.keyword);
      console.log(
        '✅ Keyword complete check:',
        additionalParams.keyword,
        isComplete
      );

      if (!isComplete) {
        console.log('❌ Incomplete keyword, skipping API call');
        setLoading(false);
        return;
      }

      params.keyword = additionalParams.keyword;

      response = await axiosInstanceTour.get('searchKeyword2', {
        params,
      });

      const responseData = response.data.response;

      console.log('📡 API Response:', responseData);

      if (responseData == undefined) {
        setPlaces([]);
        setTotalPages(1);
        return;
      }

      if (
        responseData.body &&
        responseData.body.items &&
        responseData.body.items.item
      ) {
        console.log(
          '✅ Setting places:',
          responseData.body.items.item.length,
          'items'
        );
        setPlaces(responseData.body.items.item);
        const totalCount = responseData.body.totalCount;
        const calculatedTotalPages = Math.ceil(totalCount / filters.numOfRows);
        setTotalPages(calculatedTotalPages);
      } else {
        console.log('📭 No items found, setting empty array');
        setPlaces([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('❌ API Error:', error);
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
    console.log('🎯 Initial useEffect - checking stored data');
    const storedPlaces = getStoredState('places', []);
    const storedKeyword = getStoredState('lastSearchKeyword', '');

    console.log('📊 Stored data check:', {
      storedPlacesCount: storedPlaces.length,
      storedKeyword,
    });

    if (storedPlaces.length > 0) {
      console.log('✅ Using stored data, skipping API call');
      setLoading(false);
    } else {
      console.log(
        '🔄 No stored data, fetching with keyword:',
        storedKeyword || '가'
      );
      fetchPlaces({ keyword: storedKeyword || '가' });
    }

    // fetchPlaces(filters);
  }, []);

  useEffect(() => {
    console.log('📄 Page changed to:', currentPage);
    if (currentPage > 0) {
      const keyword = lastSearchKeyword || '가';
      console.log(
        '🔄 Fetching page',
        currentPage + 1,
        'with keyword:',
        keyword
      );
      fetchPlaces({
        pageNo: currentPage + 1,
        keyword: keyword,
      });
    }

    // fetchPlaces({ pageNo: currentPage + 1 });
  }, [currentPage]);

  const handleDropdownClick = (title) => {
    console.log('📋 Dropdown clicked:', title);
    setDropdownTitle(title);
    const keyword = lastSearchKeyword || '가';
    fetchPlaces({
      sorts: title === '인기순' ? 'popular' : '',
      keyword: keyword,
    });
  };

  const updateFilters = (newFilters) => {
    console.log('🔧 Updating filters:', newFilters);
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
    console.log('🔄 Resetting filters');
    const initialFilters = {
      numOfRows: 15,
      pageNo: 0,
      MobileOS: 'WEB',
      MobileApp: 'travelo',
      arrange: 'A',
      areaCode: '',
      contentTypeId: '',
    };

    setFilters(initialFilters);
    setDropdownTitle('인기순');
    setCurrentPage(0);
    setLastSearchKeyword('');

    [
      'places',
      'filters',
      'dropdownTitle',
      'totalPages',
      'currentPage',
      'lastSearchKeyword',
    ].forEach((key) => {
      sessionStorage.removeItem(`placeContext_${key}`);
    });

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

  const clearStoredState = () => {
    console.log('🧹 Clearing stored state');
    [
      'places',
      'filters',
      'dropdownTitle',
      'totalPages',
      'currentPage',
      'lastSearchKeyword',
    ].forEach((key) => {
      sessionStorage.removeItem(`placeContext_${key}`);
    });
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
        clearStoredState,
        lastSearchKeyword,
      }}
    >
      {children}
    </PlaceContext.Provider>
  );
};

export { PlaceContext, PlaceProvider };
