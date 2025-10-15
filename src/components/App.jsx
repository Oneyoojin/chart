import React, { useState } from 'react';
import '../styles/App.css';
import Login from './Login';
import Signup from './Signup';
import MainPage from './MainPage';
import QuizStart from './QuizStart';
import Quiz from './Quiz';
import Dashboard from './Dashboard';
import { setSelectedCategoryId } from '../api/quiz';

function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [selectedCategoryId, _setSelectedCategoryId] = useState(null);

  const goMain = () => {
    setCurrentPage('main');
    // 필요하면 선택 초기화
    // setSelectedCategoryId(null);
  };

  const handleLogin = () => setCurrentPage('main');
  const handleSignupClick = () => setCurrentPage('signup');
  const handleSignupComplete = () => setCurrentPage('login');
  const handleBackToLogin = () => setCurrentPage('login');

  // 카테고리 카드 클릭 → 선택 ID 저장 → 시작 화면
  const handleQuizClick = (categoryId) => {
    _setSelectedCategoryId(categoryId);
    setSelectedCategoryId(categoryId);   // localStorage 갱신
    setCurrentPage('quizStart');
  };

  const handleStartQuiz = () => setCurrentPage('quiz');
  const handleQuizComplete = () => setCurrentPage('dashboard');

  return (
    <div className="App">
      {currentPage === 'main' && (
        <MainPage
          onLoginClick={() => setCurrentPage('login')}
          onSignupClick={handleSignupClick}
          onQuizClick={handleQuizClick}
        />
      )}
      {currentPage === 'login' && (
        <Login onLogin={handleLogin} onSignupClick={handleSignupClick} />
      )}
      {currentPage === 'signup' && (
        <Signup onSignup={handleSignupComplete} onBackToLogin={handleBackToLogin} />
      )}
      {currentPage === 'quizStart' && (
        <QuizStart onStartQuiz={handleStartQuiz} onBackToMain={goMain} />
      )}
      {currentPage === 'quiz' && <Quiz onComplete={handleQuizComplete} />}
      {currentPage === 'dashboard' && <Dashboard onBackToMain={goMain} />}
    </div>
  );
}

export default App;
