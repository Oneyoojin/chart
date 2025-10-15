import React from 'react';
import Login from '../components/Login';
import '../styles/login.css';

export default {
  title: 'Pages/Login',
  component: Login,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export const Default = {
  args: {
    onLogin: () => console.log('로그인 성공'),
    onSignupClick: () => console.log('회원가입 클릭'),
    onBackToMain: () => console.log('메인으로 돌아가기'),
  },
};

export const WithError = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: '잘못된 이메일이나 비밀번호를 입력했을 때의 상태입니다.',
      },
    },
  },
};

export const Loading = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: '로그인 요청 중인 상태입니다.',
      },
    },
  },
};

