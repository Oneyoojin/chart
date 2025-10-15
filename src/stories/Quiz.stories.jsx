import React from 'react';
import Quiz from '../components/Quiz';
import '../styles/quiz.css';

export default {
  title: 'Pages/Quiz',
  component: Quiz,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export const Default = {
  args: {
    onComplete: () => console.log('퀴즈 완료'),
    onBackToMain: () => console.log('메인으로 돌아가기'),
  },
  parameters: {
    docs: {
      description: {
        story: '퀴즈 페이지입니다. 문제와 선택지가 표시되며 답안을 선택할 수 있습니다.',
      },
    },
  },
};

export const WithCorrectAnswer = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: '정답을 선택한 후의 피드백 상태입니다.',
      },
    },
  },
};

export const WithWrongAnswer = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: '오답을 선택한 후의 피드백 및 AI 해설이 표시됩니다.',
      },
    },
  },
};

