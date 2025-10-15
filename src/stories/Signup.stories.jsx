import React from 'react';
import Signup from '../components/Signup';
import '../styles/signup.css';

export default {
  title: 'Pages/Signup',
  component: Signup,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export const Default = {
  args: {
    onSignup: () => console.log('회원가입 성공'),
    onBackToLogin: () => console.log('로그인으로 돌아가기'),
    onBackToMain: () => console.log('메인으로 돌아가기'),
  },
};

export const WithValidationErrors = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: '입력 유효성 검사 오류가 표시된 상태입니다.',
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
        story: '회원가입 요청 중인 상태입니다.',
      },
    },
  },
};

