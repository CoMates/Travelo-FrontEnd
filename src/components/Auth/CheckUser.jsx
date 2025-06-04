import React, { useState } from 'react';
import styles from '../../styles/Auth.module.css';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import useValidation from '../../hooks/useValidation';

const { onCheckUser } = authService;

const CheckUser = () => {
  const [username, setUsername] = useState('');

  const navigate = useNavigate();

  const { usernameError, correctEmail } = useValidation();

  const [userCheckError, setUserCheckError] = useState('');

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setUsername(value);
    correctEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await onCheckUser(username);
    console.log(success);
    if (correctEmail(username) === false) {
      return;
    }
    if (success) {
      navigate('/users/resetPassword', { state: { username } });
    } else {
      console.log('유저 체크 실패');
      setUserCheckError('사용자 정보가 존재하지 않습니다.');
      return;
    }
  };

  const goToLogin = (e) => {
    e.preventDefault();
    navigate('/users/login');
  };

  return (
    <div className={styles['auth-content']}>
      <form onSubmit={handleSubmit} className={styles['form-content-short']}>
        <button
          onClick={(e) => {
            goToLogin(e);
          }}
          className={styles['btn-back-text']}
        >
          로그인 화면으로 돌아가기
        </button>
        <div className={styles['logo-wrap']}>
          <p className={styles['brand-logo']}> travelo</p>
        </div>
        <div className={styles['input-area']}>
          <div className={styles['input-wrap-password']}>
            <label
              htmlFor="username"
              className={styles['input-label-required']}
            >
              이메일
            </label>
            {(usernameError && (
              <span className={styles['error-message']}>{usernameError}</span>
            )) ||
              (userCheckError && (
                <span className={styles['error-message']}>
                  {userCheckError}
                </span>
              ))}
            <input
              type="email"
              id="username"
              value={username}
              onChange={(e) => handleEmailChange(e)}
              required
              className={styles['input-box']}
              placeholder="이메일을 입력해 주세요."
            />
          </div>
          <div className={styles['btn-wrap']}>
            <button type="submit" className={styles['btn-point']}>
              본인 확인 하기
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckUser;
