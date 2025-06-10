import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faSignsPost,
  faLightbulb,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';

function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    console.log(
      'Header re-rendered with isAuthenticated:',
      isAuthenticated,
      user
    );
  }, [isAuthenticated, user]);

  return (
    <header className={styles['header']}>
      <nav className={`navbar ${styles['navbar-custom']}`}>
        <Link className={`navbar-brand ${styles['navbar-brand']}`} to="/">
          travelo
        </Link>
        <div className={styles['navbar-nav']}>
          <ul className={`navbar-nav ${styles['navbar-ul']}`}>
            <li className={`nav-item ${styles['nav-item']}`}>
              <Link
                className={`nav-link ${styles['nav-link']} ${styles['nav-link-icon']}`}
                to="/places"
              >
                <FontAwesomeIcon icon={faLocationDot} /> 장소 검색
              </Link>
            </li>
            <li className={`nav-item ${styles['nav-item']}`}>
              <Link
                className={`nav-link ${styles['nav-link']} ${styles['nav-link-icon']}`}
                to="/course-custom"
              >
                <FontAwesomeIcon icon={faSignsPost} /> 코스 커스텀
              </Link>
            </li>
            <li className={`nav-item ${styles['nav-item']}`}>
              <Link
                className={`nav-link ${styles['nav-link']} ${styles['nav-link-icon']}`}
                to="/browse-courses"
              >
                <FontAwesomeIcon icon={faLightbulb} /> 코스 둘러보기
              </Link>
            </li>
          </ul>
        </div>
        {isAuthenticated && user ? (
          <div className={styles['btn-custom-wrap']}>
            {user.role === 'ADMIN' ? (
              <>
                <Link to="/admin" className={styles['btn-custom']}>
                  어드민 페이지
                </Link>
                <button onClick={logout} className={styles['btn-custom']}>
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  to={
                    user.oauthType === 'google'
                      ? '/mypage/modifyprofileGoogle'
                      : user.oauthType === 'kakao'
                        ? '/mypage/modifyprofileKakao'
                        : user.oauthType === 'naver'
                          ? '/mypage/modifyprofileNaver'
                          : '/mypage/modifyprofile'
                  }
                  className={styles['btn-custom']}
                >
                  마이 페이지
                </Link>
                <button onClick={logout} className={styles['btn-custom']}>
                  로그아웃
                </button>
              </>
            )}
          </div>
        ) : (
          <button type="button" className={styles['btn-custom']}>
            <Link to="/users/login">로그인 / 회원가입</Link>
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
