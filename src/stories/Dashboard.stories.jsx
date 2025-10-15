import React from 'react';
import Dashboard from '../components/Dashboard';
import '../styles/dashboard.css';

export default {
  title: 'Pages/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export const Default = {
  args: {
    onBackToMain: () => console.log('메인으로 돌아가기'),
  },
  parameters: {
    docs: {
      description: {
        story: '대시보드 페이지입니다. 학습 통계, 최근 풀이 기록, 차트가 표시됩니다.',
      },
    },
  },
};

export const WithHighAccuracy = {
  args: {
    ...Default.args,
  },
  decorators: [
    (Story) => {
      // 높은 정확도 데이터 시뮬레이션
      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: '정확도가 높은 경우의 대시보드입니다.',
      },
    },
  },
};

export const WithLowAccuracy = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: '정확도가 낮은 경우의 대시보드입니다.',
      },
    },
  },
};

