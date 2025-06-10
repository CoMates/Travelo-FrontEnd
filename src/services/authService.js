// authService : axios, 토큰 처리

import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const register = async (username, password, passwordCheck, tel) => {
  if (localStorage.getItem('verifyCodeCheck')) {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('passwordCheck', passwordCheck);
      formData.append('tel', tel);

      const response = await axiosInstance.post('/travelo/join', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log('회원가입 성공');
      console.log(response.data); //회원가입 시도: '가입 되었습니다' 출력
      if (response.data === '가입 되었습니다') {
        console.log('if문 true');
        return {
          success: true,
          status: response.status,
          data: response.data,
          message: '회원가입 성공',
        };
      }
      console.log('if문 외');
      return {
        success: false,
        status: response.status,
        data: response.data,
        message: '회원가입 실패',
      };
    } catch (error) {
      console.error('회원가입 실패 : ', error);
      return {
        success: false,
        status: response.status,
        data: response.data,
        message: '회원가입 오류',
      };
    }
  } else {
    console.error('인증 실패 :  verifyCodeCheck 실패', error);
    return {
      success: false,
      status: 400,
      message: '인증 실패',
    };
  }
};

const login = async (username, password) => {
  try {
    const response = await axiosInstance.post('/travelo/login', {
      username: username,
      password: password,
    });

    const token = response.data;

    sessionStorage.setItem('token', token);
    sessionStorage.setItem('accessToken', token.accessToken);
    sessionStorage.setItem('refreshToken', token.refreshToken);

    console.log(sessionStorage.getItem('accessToken'));
    if (sessionStorage.getItem('token')) {
      console.log('로그인 성공');
      return response;
    } else {
      console.log('로그인 실패');
      return null;
    }
  } catch (error) {
    console.error('로그인 실패: ', error);
    throw error;
  }
};

const logout = async () => {
  const accessToken = sessionStorage.getItem('accessToken');

  if (accessToken) {
    try {
      const response = await axiosInstance.post(
        '/user/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      localStorage.removeItem('token');
      sessionStorage.removeItem('token');

      console.log('로그아웃 시도');
      if (response) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('로그아웃 실패: ', error);
    }
  } else {
    console.log('액세스 토큰이 존재하지 않습니다.');
  }
};

const isAuthenticated = () => {
  const token = sessionStorage.getItem('accessToken');
  return token !== null;
};

const onCheckUser = async (username) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);

    const checkUserResponse = await axiosInstance.post(
      '/travelo/check',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    console.log('응답:', checkUserResponse.data);
    if (checkUserResponse.data === '유효한 이메일입니다') {
      return true;
    } else if (checkUserResponse.data === '해당하는 정보가 없습니다.') {
      return false;
    }
  } catch (error) {
    console.error('check error 발생: ', error);
    return false;
  }
};

const resetPassword = async (newPassword, confirmPassword, username) => {
  sessionStorage.setItem('username', username);
  console.log('이번엔 또 걸리네');
  try {
    const resetPasswordResponse = await axiosInstance.post(
      '/travelo/resetPassword',
      null,
      {
        params: {
          password: newPassword,
          passwordCheck: confirmPassword,
        },
      }
    );
    console.log('비밀번호 재설정 응답: ', resetPasswordResponse.data);
    return resetPasswordResponse;
  } catch (error) {
    console.error('resetPassword Error', error);
    throw error;
  }
};

export default {
  register,
  login,
  logout,
  isAuthenticated,
  resetPassword,
  onCheckUser,
};
