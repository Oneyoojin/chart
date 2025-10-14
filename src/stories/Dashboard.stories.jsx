import React from 'react';
import Dashboard from '../components/Dashboard';

export default {
  title: 'Pages/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  args: {
    onNavigateToTasks: () => console.log('Navigate to tasks'),
  },
};

