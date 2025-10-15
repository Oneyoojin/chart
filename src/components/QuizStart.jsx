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
      {/* 배경 */}
      <div className="background">
        <div className="bg-pattern"></div>
        <div className="bg-gradient"></div>
      </div>

      {/* 메인 컨테이너 */}
      <div className="quiz-start-container">
        {/* 헤더 */}
        <header className="quiz-header">
          <div className="header-icon">
            <i className="fas fa-user-md"></i>
          </div>
          <h1 className="header-title">의료 데이터 분석 및 학습 자동화</h1>
          <p className="header-subtitle">소아 복부 X-ray 판독 능력 향상</p>
        </header>

        {/* 메인 카드 */}
        <div className="main-card">
          <h2 className="card-title">소아 복부 X-ray 퀴즈</h2>
          <p className="card-subtitle">실전 판독 능력을 키워보세요</p>

          {/* 정보 카드들 */}
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon-wrapper">
                <i className="fas fa-x-ray"></i>
              </div>
              <div className="info-content">
                <h3>5개의 문제</h3>
                <p>소아 복부 X-ray 판독 문제를 풀어보세요</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon-wrapper">
                <i className="fas fa-clock"></i>
              </div>
              <div className="info-content">
                <h3>자유로운 시간</h3>
                <p>시간 제한 없이 천천히 학습하세요</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon-wrapper">
                <i className="fas fa-bars"></i>
              </div>
              <div className="info-content">
                <h3>AI 피드백</h3>
                <p>오답 시 AI가 상세한 해설을 제공합니다</p>
              </div>
            </div>
          </div>

          {/* 시작 버튼 */}
          <button className="start-quiz-btn" onClick={onStartQuiz}>
            퀴즈 시작하기
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>

        {/* 하단 텍스트 */}
        <p className="footer-text">준비가 되셨나요? 실전 판독 훈련을 시작하세요!</p>
      </div>
    </div>
  );
};

export default QuizStart;
