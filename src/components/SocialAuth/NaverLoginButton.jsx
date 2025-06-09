import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import styles from '../../styles/auth.module.css';

const NaverLoginButton = () => {
  const naverClientId = import.meta.env.VITE_API_NAVER_CLIENT_ID;
  const [username, setUsername] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [provider, setProvider] = useState(false);

  const handleLogin = () => {
    const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverClientId}&state=STATE_STRING&redirect_uri=http://localhost:5173/travelo/naverCallback`;
    console.log('naverLoginUrl', naverLoginUrl);
    window.location.href = naverLoginUrl;
  };

  const getQueryParam = (param) => {
    const query = new URLSearchParams(window.location.search);
    return query.get(param);
  };

  const extractProvider = (message) => {
    if (message.includes('카카오')) return 'Kakao';
    if (message.includes('구글')) return 'Google';
    if (message.includes('네이버')) return 'Naver';
    return '찾을 수 없습니다.';
  };

  const transProvider = (provider) => {
    if (provider === 'Kakao') return '카카오';
    if (provider === 'Google') return '구글';
    if (provider === 'Naver') return '네이버';
    return '문제가 발생했습니다.';
  };

  useEffect(() => {
    const code = getQueryParam('code');

    if (code) {
      const userInfo = async () => {
        try {
          const response = await axiosInstance.post(
            '/travelo/check',
            { code },
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }
          );
          const { error, username } = response.data;

          if (error) {
            const provider = extractProvider(error);
            setProvider(provider);
            setUsername(username);
            setShowForm(true);
          } else {
            sessionStorage.setItem('accessToken', accessToken);
            sessionStorage.setItem('refreshToken', refreshToken);
            window.location.href = '/home';
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };
      userInfo;
    }
  }, []);

  return (
    <div>
      <button
        onClick={handleLogin}
        className={styles['naver-login-btn']}
      ></button>
    </div>
  );
};

export default NaverLoginButton;
