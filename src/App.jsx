import { useContext, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import LoginPage from './pages/users/LoginPage.jsx';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/users/RegisterPage.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import CheckUserPage from './pages/users/CheckUserPage.jsx';
import ResetPasswordPage from './pages/users/ResetPasswordPage.jsx';
import Header from './components/common/Header';
import PlacesListPage from './pages/place/PlacesListPage.jsx';
import PlaceDetailPage from './pages/place/PlaceDetailPage.jsx';
import GoogleCallback from './components/socialAuth/GoogleCallback.jsx';
import MyReviewPage from './pages/MyReviewPage';
import CourseDetail from './course/CourseDetail';
import MyCoursePage from './pages/MyCoursePage';
import MyCourseEditPage from './pages/MyCourseEditPage';
import AdminMainPage from './pages/admin/AdminMainPage.jsx';
import AdminUserPage from './pages/admin/AdminUserPage.jsx';
import AdminGroupPage from './pages/admin/AdminGroupPage.jsx';
import AdminCoursePage from './pages/admin/AdminCoursePage.jsx';
import AdminReviewPage from './pages/admin/AdminReviewPage.jsx';
import AdminBlindReviewPage from './pages/admin/AdminBlindReviewPage.jsx';
import AccountIntergrationPage from './pages/users/AccountIntegrationPage.jsx';
import KakaoCallback from './components/socialAuth/KakaoCallback.jsx';
import NaverCallback from './components/socialAuth/NaverCallback.jsx';
import AccountIntergration from './components/socialAuth/AccountIntegration.jsx';
import AccountIntergrationKakao from './components/socialAuth/AccountIntegrationKakao.jsx';
import ModifyUserPage from './pages/users/ModifyUserPage.jsx';
import ModifyUserGooglePage from './pages/users/ModifyUserGooglePage.jsx';
import AccountIntergrationGoogle from './components/socialAuth/AccountIntegrationGoogle.jsx';
import AccountIntergrationNaver from './components/socialAuth/AccountIntegrationNaver.jsx';
import ModifyUserNaverPage from './pages/users/ModifyUserNaverPage.jsx';
import ModifyUserKakaoPage from './pages/users/ModifyUserKakaoPage.jsx';
import CourseGroupListPage from './pages/courseGroup/CourseGroupListPage.jsx';
import AdminUserDetail from './components/admin/AdminUserDetail.jsx';
import CourseGroupDetailPage from './pages/courseGroup/CourseGroupDetailPage.jsx';
import CourseGroupCreatePage from './pages/courseGroup/CourseGroupCreatePage.jsx';
import CourseGroupModifyPage from './pages/courseGroup/CourseGroupCreateModalPage.jsx';
import CourseCustomPage from './pages/courseCustom/CourseCustomPage.jsx';
import BrowseCoursesPage from './pages/browseCourses/BrowseCoursesPage.jsx';
import BrowseCourseDetailPage from './pages/browseCourses/BrowseCourseDetailPage.jsx';
import { useAuth } from './contexts/AuthContext';
import MyPlaceBookmarkPage from './pages/bookmarks/MyPlaceBookmarkPage.jsx';
import MyCourseBookmarkPage from './pages/bookmarks/MyCourseBookmarkPage.jsx';
import Footer from './components/common/Footer.jsx';
import TopButton from './components/common/TopButton.jsx';

const App = () => {
  const { isAuthenticated, checkAuth, loading, login } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogin = (token) => {
    sessionStorage.setItem('accessToken', token);
    login();
  };

  if (loading) {
    return <div>Loading...</div>; // 로딩 중일 때 로딩 메시지 표시
  }
  return (
    <>
      <Header />
      <TopButton />
      <div className="container">
        <Routes>
          {/* 비로그인 사용자 접근 가능 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/places" element={<PlacesListPage />} />
          <Route path="/places/:placeSeq" element={<PlaceDetailPage />} />

          {/* 로그인 관련 페이지 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/users/login" element={<LoginPage />} />
          <Route path="/users/register" element={<RegisterPage />} />

          {/* 소셜 로그인 */}
          <Route
            path="/travelo/naverCallback"
            element={<NaverCallback onLogin={handleLogin} />}
          />
          <Route
            path="/travelo/googleCallback"
            element={<GoogleCallback onLogin={handleLogin} />}
          />
          <Route
            path="/travelo/kakaoCallback"
            element={<KakaoCallback onLogin={handleLogin} />}
          />

          {/* 비밀번호 찾기 */}
          <Route path="/users/checkUser" element={<CheckUserPage />} />
          <Route path="/users/resetPassword" element={<ResetPasswordPage />} />

          {/* 소셜 통합 */}
          <Route
            path="/travelo/integratedKakao"
            element={<AccountIntergrationKakao />}
          />
          <Route
            path="/travelo/integratedGoogle"
            element={<AccountIntergrationGoogle />}
          />
          <Route
            path="/travelo/integratedNaver"
            element={<AccountIntergrationNaver />}
          />
          <Route
            path="/social/integrate"
            element={<AccountIntergrationPage />}
          />
          <Route
            path="/social/integratedComplete"
            element={<AccountIntergration />}
          />

          {/* 로그인 사용자 */}
          <Route element={<ProtectedRoute />}>
            {/* 마이페이지 - 코스 */}
            <Route path="mypage/myCourses" element={<MyCoursePage />} />
            <Route
              path="/courseEdit/:courseSeq"
              element={<MyCourseEditPage />}
            />
            {/* 마이페이지 - 리뷰 */}
            <Route path="mypage/myReviews" element={<MyReviewPage />} />
            {/* 마이페이지 - 유저 에딧 */}
            <Route path="mypage/modifyprofile" element={<ModifyUserPage />} />
            <Route
              path="mypage/modifyprofileGoogle"
              element={<ModifyUserGooglePage />}
            />
            <Route
              path="mypage/modifyprofileNaver"
              element={<ModifyUserNaverPage />}
            />
            <Route
              path="mypage/modifyprofileKakao"
              element={<ModifyUserKakaoPage />}
            />

            <Route
              path="mypage/placeBookmark"
              element={<MyPlaceBookmarkPage />}
            />
            <Route
              path="mypage/courseBookmark"
              element={<MyCourseBookmarkPage />}
            />

            {/* 코스 */}
            {/* <Route path="/course/:courseSeq" element={<CourseDetail />} /> */}
            <Route path="/course-custom" element={<CourseCustomPage />} />
            <Route path="/browse-courses" element={<BrowseCoursesPage />} />
            <Route
              path="/course/:courseSeq"
              element={<BrowseCourseDetailPage />}
            />

            {/* 코스 그룹 */}
            <Route
              path="mypage/courseGroup"
              element={<CourseGroupListPage />}
            />
            <Route
              path="mypage/courseGroupDetail/:id"
              element={<CourseGroupDetailPage />}
            />
            <Route
              path="courseGroup/create"
              element={<CourseGroupCreatePage />}
            />
            <Route
              path="courseGroup/modify/:id"
              element={<CourseGroupModifyPage />}
            />

            {/* 관리자 페이지 */}
            <Route path="/admin" element={<AdminMainPage />} />
            <Route path="admin/users" element={<AdminUserPage />} />
            <Route
              path="/admin/userDetail/:userSeq"
              element={<AdminUserDetail />}
            />
            <Route path="/admin/groups" element={<AdminGroupPage />} />
            <Route path="/admin/courses" element={<AdminCoursePage />} />
            <Route path="/admin/reviews" element={<AdminReviewPage />} />
            <Route
              path="/admin/blindReviews"
              element={<AdminBlindReviewPage />}
            />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default App;
