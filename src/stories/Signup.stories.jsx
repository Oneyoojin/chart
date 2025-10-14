import React from 'react';
import Signup from '../components/Signup';

export default {
  title: 'Pages/Signup',
  component: Signup,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  args: {
    onSignup: () => console.log('Signup clicked'),
    onBackToLogin: () => console.log('Back to login clicked'),
  },
};

