import axiosInstance from '../utils/axiosInstance';

export const addBookmark = async (contentId, accessToken) => {
  try {
    const response = await axiosInstance.post(
      `/user/placebookmarks/add?contentId=${contentId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('북마크 추가 실패', error);
    throw error;
  }
};

export const removeBookmark = async (contentId, accessToken) => {
  try {
    const response = await axiosInstance.delete(
      `/user/placebookmarks/remove?contentId=${contentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('북마크 삭제 실패', error);
    throw error;
  }
};

export const fetchBookmarks = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/user/placebookmarks/all', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('북마크 목록 가져오기 실패', error);
    throw error;
  }
};

export const addCourseBookmark = async (courseSeq, accessToken) => {
  try {
    const response = await axiosInstance.post(
      `/user/course/bookmark/${courseSeq}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('코스 북마크 추가 실패', error);
    throw error;
  }
};

export const removeCourseBookmark = async (courseBookmarkSeq, accessToken) => {
  try {
    const response = await axiosInstance.post(
      `/user/course/removeBookmark/${courseBookmarkSeq}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('코스 북마크 삭제 실패', error);
    throw error;
  }
};

export const fetchCourseBookmarks = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/user/courseBookmarks', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('코스 북마크 목록 가져오기 실패', error);
    throw error;
  }
};
