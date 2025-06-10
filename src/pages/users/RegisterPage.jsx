import React from 'react';
import Register from '../../components/auth/Register';
import authService from '../../services/authService';
import mailCheckService from '../../services/mailCheckService';

const RegisterPage = () => {
  const register = async (username, password, rePassword, tel) => {
    try {
      const response = await authService.register(
        username,
        password,
        rePassword,
        tel
      );
      console.log('register: ', register);
      console.log('reponse:', response);
      console.log('response.status', response.status);
      console.log('response.username:', response.valueOf(username));
      return response;
    } catch (error) {
      console.error('Register error:', error); // 오류 로그
      return false;
    }
  };

  const mailcheck = async (username) => {
    try {
      console.log('mailcheck called with username:', username); // 디버깅용 로그
      const response = await mailCheckService.mailConfirm(username);
      console.log('Mail check response:', response); // 디버깅용 로그
      return response;
    } catch (error) {
      console.error('Mail check error:', error); // 오류 로그
      return { success: false };
    }
  };

  const verifycodecheck = async (username, verifyCode) => {
    try {
      console.log(
        'verifycodecheck called with username:',
        username,
        'and verifyCode:',
        verifyCode
      ); // 디버깅용 로그
      const response = await mailCheckService.verifyCode(username, verifyCode);
      console.log('Verify code check response:', response); // 디버깅용 로그
      return response;
    } catch (error) {
      console.error('Verify code check error:', error); // 오류 로그
      return false;
    }
  };

  return (
    <div className="grid-container">
      <Register
        onRegister={register}
        onMailCheck={mailcheck}
        onVerifyCodeCheck={verifycodecheck}
      />
    </div>
  );
};

export default RegisterPage;
