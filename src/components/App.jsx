import React, { useState } from 'react';
import '../styles/App.css';
import MainPage from './MainPage';
import Login from './Login';
import Signup from './Signup';
import StartPage from './StartPage';
import QuizStart from './QuizStart';
import Quiz from './Quiz';
import Dashboard from './Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('main'); // main -> login -> signup -> start -> quiz -> dashboard

  const handleMainToLogin = () => {
    setCurrentPage('login');
  };

  const handleMainToSignup = () => {
    setCurrentPage('signup');
  };

  const handleMainToQuiz = () => {
    setCurrentPage('quizstart');
  };

  const handleQuizStartToQuiz = () => {
    setCurrentPage('quiz');
  };

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

  const handleBackToMain = () => {
    setCurrentPage('main');
  };

  return (
    <div className="App">
      {currentPage === 'main' && <MainPage onLoginClick={handleMainToLogin} onSignupClick={handleMainToSignup} onQuizClick={handleMainToQuiz} />}
      {currentPage === 'login' && <Login onLogin={handleLogin} onSignupClick={handleSignupClick} onBackToMain={() => setCurrentPage('main')} />}
      {currentPage === 'signup' && <Signup onSignup={handleSignupComplete} onBackToLogin={handleBackToLogin} onBackToMain={() => setCurrentPage('main')} />}
      {currentPage === 'start' && <StartPage onStart={handleStartQuiz} />}
      {currentPage === 'quizstart' && <QuizStart onStartQuiz={handleQuizStartToQuiz} onBackToMain={() => setCurrentPage('main')} />}
      {currentPage === 'quiz' && <Quiz onComplete={handleQuizComplete} onBackToMain={() => setCurrentPage('main')} />}
      {currentPage === 'dashboard' && <Dashboard onBackToMain={handleBackToMain} />}
    </div>
  );
}

export default App;