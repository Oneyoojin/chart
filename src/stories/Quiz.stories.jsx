import React from 'react';
import Quiz from '../components/Quiz';

export default {
  title: 'Pages/Quiz',
  component: Quiz,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  args: {
    onComplete: () => console.log('Quiz completed'),
  },
};

