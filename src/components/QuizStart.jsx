import React, { useEffect } from 'react';
import '../styles/quizStart.css';

const QuizStart = ({ onStartQuiz, onBackToMain }) => {
  // 브라우저 뒤로가기 감지
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      onBackToMain();
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onBackToMain]);

  return (
    <div className="quiz-start-page">
      <div className="background">
        <div className="bg-pattern"></div>
        <div className="bg-gradient"></div>
      </div>
      <div className="quiz-start-container">
        {/* 뒤로가기 버튼 (아이콘만) */}
        <div className="back-button-container">
          <button className="back-button" onClick={onBackToMain}>
            <i className="fas fa-arrow-left"></i>
          </button>
        </div>

        <section className="quiz-intro-section">
          <div className="intro-content">
            <div className="quiz-icon">
              <i className="fas fa-brain"></i>
            </div>
            <h1 className="quiz-title">데이터 분석 퀴즈</h1>
            <p className="quiz-subtitle">당신의 데이터 분석 지식을 테스트해보세요</p>
          </div>
        </section>

        <section className="quiz-info-section">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-list-ol"></i>
              </div>
              <h3>5개의 문제</h3>
              <p>다양한 데이터 분석 주제를 다룹니다</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>자유로운 시간</h3>
              <p>시간 제한 없이 천천히 풀어보세요</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-briefcase"></i>
              </div>
              <h3>실무 중심</h3>
              <p>실제 업무에서 활용할 수 있는 내용입니다</p>
            </div>
          </div>
        </section>

        <section className="quiz-start-section">
          <div className="start-content">
            <h2>퀴즈 시작하기</h2>
            <p>준비가 되셨나요? 지금 바로 시작해보세요!</p>
            <button className="start-quiz-btn" onClick={onStartQuiz}>
              <i className="fas fa-play"></i>
              퀴즈 시작하기
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default QuizStart;
