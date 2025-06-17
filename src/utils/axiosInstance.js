import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const axiosInstanceTour = axios.create({
  baseURL: 'http://apis.data.go.kr/B551011/KorService2/',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const excludedUrls = [
      '/travelo/main',
      '/travelo/place/list',
      '/travelo/join',
      '/travelo/mailConfirm',
      '/travelo/verifyCode',
      '/travelo/login',
      '/travelo/kakaoCallback',
      '/travelo/googleCallback',
      '/travelo/naverCallback',
      '/travelo/resetPassword',
      '/travelo/check',
    ];

    if (excludedUrls.includes(config.url)) {
      return config;
    }

    let accessToken = sessionStorage.getItem('accessToken');
    const refreshToken = sessionStorage.getItem('refreshToken');

    if (isTokenExpired(accessToken)) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await axiosInstance.post(
            '/user/refreshToken',
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );
          accessToken = response.data.accessToken;
          sessionStorage.setItem('accessToken', accessToken);

          isRefreshing = false;
          onRefreshed(accessToken);
        } catch (error) {
          console.log('Fail to refresh token', error);
          isRefreshing = false;
          useAuth.logout();
          return Promise.reject(error);
        }
      }

      const retryOriginalRequest = new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          config.headers.Authorization = `Bearer ${token}`;
          resolve(config);
        });
      });
      return retryOriginalRequest;
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);

    return exp < now;
  } catch (error) {
    console.error('Error decoding token: ', error);
    return true;
  }
};

export default axiosInstance;

export { axiosInstanceTour };
