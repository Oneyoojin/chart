import React from 'react';
import StartPage from '../components/StartPage';

export default {
  title: 'Pages/StartPage',
  component: StartPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  args: {
    onStart: () => console.log('Quiz started'),
  },
};

