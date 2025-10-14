import React from 'react';
import Login from '../components/Login';

export default {
  title: 'Pages/Login',
  component: Login,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  args: {
    onLogin: () => console.log('Login clicked'),
    onSignupClick: () => console.log('Signup clicked'),
  },
};

