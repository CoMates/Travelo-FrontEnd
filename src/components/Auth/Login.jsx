import React, { useState } from 'react';
import styles from '../../styles/auth.module.css';
import { useNavigate } from 'react-router-dom';
import KakaoLoginButton from '../socialAuth/KakaoLoginButton';
import GoogleLoginButton from '../socialAuth/GoogleLoginButton';
import NaverLoginButton from '../socialAuth/NaverLoginButton';
import { useAuth } from '../../contexts/AuthContext';
import LoginWorseUserModal from '../../pages/users/LoginWorseUserModal';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [failLogin, setFailLogin] = useState('');
  const [showWorseModal, setShowWorseModal] = useState(false);

  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const success = await login(username, password);
      console.log('로그인 성공:', success);

      if (success.status === 200) {
        if (onLogin) {
          onLogin(success.data);
        }
        navigate('/home');
      } else {
        handleLoginError(success);
      }
    } catch (error) {
      handleLoginError(error.response);
    }
  };

  const handleLoginError = (response) => {
    if (response && response.data) {
      const errorMessage = response.data;

      if (errorMessage.includes('탈퇴한')) {
        setFailLogin('탈퇴한 회원입니다.');
      } else if (errorMessage.includes('악성')) {
        setShowWorseModal(true);
      } else {
        setFailLogin('이메일 혹은 비밀번호가 일치하지 않습니다.');
      }
    } else {
      setFailLogin('탈퇴한 회원이거나 로그인 중 문제가 발생했습니다.');
    }
  };

  const goToRegister = (e) => {
    e.preventDefault();
    navigate('/users/register');
  };

  const goToCheckUser = (e) => {
    e.preventDefault();
    navigate('/users/checkUser');
  };

  return (
    <div className={styles['auth-content']}>
      <form onSubmit={handleSubmit} className={styles['form-content']}>
        <div className={styles['logo-wrap']}>
          <p className={styles['brand-logo']}> travelo</p>
        </div>
        <div className={styles['input-area']}>
          <div className={styles['input-wrap']}>
            <div className={styles['input-wrap-inline']}>
              <label
                htmlFor="username"
                className={styles['input-label-required']}
              >
                이메일
              </label>
              {failLogin ? (
                <span className={styles['error-message']}>{failLogin}</span>
              ) : (
                <span></span>
              )}
            </div>
            <input
              type="email"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={[styles['input-box'], styles['input-box-inline']].join(
                ' '
              )}
              placeholder="이메일을 입력해 주세요."
            />
          </div>
          <div className={styles['input-wrap']}>
            <label
              htmlFor="password"
              className={styles['input-label-required']}
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles['input-box']}
              placeholder="비밀번호를 입력해주세요."
            />
          </div>
        </div>
        <div className={styles['btn-wrap']}>
          <button type="submit" className={styles['btn-point']}>
            로그인
          </button>
        </div>
        <div className={styles['btn-wrap']}>
          <button
            type="button"
            className={styles['btn-line']}
            onClick={goToRegister}
          >
            회원가입
          </button>
        </div>
        <div>
          <button
            type="button"
            className={styles['btn-text']}
            onClick={goToCheckUser}
          >
            비밀번호를 잊어버리셨나요?
          </button>
        </div>
        <div className={styles['line-wrap']}>소셜 로그인</div>
        <div className={styles['social-wrap']}>
          <KakaoLoginButton
            type="button"
            onClick={(e) => {
              handleSocialLogin('kakao');
              e.preventDefault();
            }}
          />
          <GoogleLoginButton
            type="button"
            onClick={(e) => {
              handleSocialLogin('google');
              e.preventDefault();
            }}
          />
          <NaverLoginButton
            type="button"
            onClick={(e) => {
              handleSocialLogin('naver');
              e.preventDefault();
            }}
          />
        </div>
      </form>
      <LoginWorseUserModal
        onShow={showWorseModal}
        onClose={() => setShowWorseModal(false)}
        username={username}
      />
    </div>
  );
};

export default Login;
