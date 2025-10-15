import React from 'react';
import QuizStart from '../components/QuizStart';
import '../styles/quizStart.css';

export default {
  title: 'Pages/QuizStart',
  component: QuizStart,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export const Default = {
  args: {
    onStartQuiz: () => console.log('퀴즈 시작'),
    onBackToMain: () => console.log('메인으로 돌아가기'),
  },
  parameters: {
    docs: {
      description: {
        story: '퀴즈 시작 전 안내 페이지입니다. 퀴즈 정보와 시작 버튼이 표시됩니다.',
      },
    },
  },
};

