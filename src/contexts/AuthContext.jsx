import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import axiosInstance from '../utils/axiosInstance';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  // const [accessToken, setAccessToken] = useState('');
  // const [refreshToken, setRefreshToken] = useState('');

  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    console.log('Stored accessToken: ', accessToken);

    if (!accessToken) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get('/user/mypage', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('User data: ', response.data);
      setIsAuthenticated(true);
      setUser(response.data);
    } catch (error) {
      console.error('사용자 정보를 가져오는 중 오류 발생 : ', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const token = response.data;

      console.log('token', token);

      if (response.status === 200) {
        sessionStorage.setItem('accessToken', token.accessToken);
        sessionStorage.setItem('refreshToken', token.refreshToken);

        const LoginUser = authService.loginUserCheck(
          sessionStorage.accessToken
        );

        setUser(LoginUser);

        setIsAuthenticated(true);
      }

      console.log('엑토', sessionStorage.getItem('accessToken'));
      // setAccessToken(token.accessToken);
      // setRefreshToken(token.refreshToken);

      return response;
    } catch (error) {
      console.error('로그인 요청 중 오류 발생: ', error);
      return { status: error.response?.status, data: error.response?.data };
    }
  };

  const logout = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      await axiosInstance.post(
        '/user/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    }
    console.log(sessionStorage.getItem('accessToken'));
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    // setAccessToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, checkAuth, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
