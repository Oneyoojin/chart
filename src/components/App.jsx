import React, { useState } from 'react';
import '../styles/App.css';
import Login from './Login';
import Signup from './Signup';
import StartPage from './StartPage';
import Quiz from './Quiz';
import Dashboard from './Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('login'); // login -> signup -> start -> quiz -> dashboard

  const handleLogin = () => {
    setCurrentPage('start');
  };

  const handleSignupClick = () => {
    setCurrentPage('signup');
  };

  const handleSignupComplete = () => {
    setCurrentPage('login');
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
  };

  const handleStartQuiz = () => {
    setCurrentPage('quiz');
  };

  const handleQuizComplete = () => {
    setCurrentPage('dashboard');
  };

  return (
    <div className="App">
      {currentPage === 'login' && <Login onLogin={handleLogin} onSignupClick={handleSignupClick} />}
      {currentPage === 'signup' && <Signup onSignup={handleSignupComplete} onBackToLogin={handleBackToLogin} />}
      {currentPage === 'start' && <StartPage onStart={handleStartQuiz} />}
      {currentPage === 'quiz' && <Quiz onComplete={handleQuizComplete} />}
      {currentPage === 'dashboard' && <Dashboard />}
    </div>
  );
}

export default App;