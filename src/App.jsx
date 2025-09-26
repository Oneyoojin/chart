import React, { useState } from 'react';
import './App.css';
import Login from './Login';
import Quiz from './Quiz';
import Dashboard from './Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('login'); // login -> quiz -> dashboard

  const handleLogin = () => {
    setCurrentPage('quiz');
  };

  const handleQuizComplete = () => {
    setCurrentPage('dashboard');
  };

  return (
    <div className="App">
      {currentPage === 'login' && <Login onLogin={handleLogin} />}
      {currentPage === 'quiz' && <Quiz onComplete={handleQuizComplete} />}
      {currentPage === 'dashboard' && <Dashboard />}
    </div>
  );
}

export default App;