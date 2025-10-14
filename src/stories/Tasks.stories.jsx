import React from 'react';
import Tasks from '../components/Tasks';

export default {
  title: 'Pages/Tasks',
  component: Tasks,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  args: {
    onNavigateToDashboard: () => console.log('Navigate to dashboard'),
  },
};

