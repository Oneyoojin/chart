import React from 'react';
import MainPage from '../components/MainPage';
import '../styles/mainPage.css';

export default {
  title: 'Pages/MainPage',
  component: MainPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export const LoggedOut = {
  args: {
    onLoginClick: () => console.log('로그인 클릭'),
    onSignupClick: () => console.log('회원가입 클릭'),
    onQuizClick: () => console.log('퀴즈 시작 클릭'),
  },
  parameters: {
    docs: {
      description: {
        story: '로그아웃 상태의 메인 페이지입니다.',
      },
    },
  },
};

export const LoggedIn = {
  args: {
    ...LoggedOut.args,
  },
  decorators: [
    (Story) => {
      // 로그인 상태 시뮬레이션
      localStorage.setItem('access_token', 'test_token');
      localStorage.setItem('user_email', 'test@example.com');
      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: '로그인 상태의 메인 페이지입니다. 사용자 정보가 표시됩니다.',
      },
    },
  },
};

