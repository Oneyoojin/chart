import React, { useEffect } from 'react';
import '../styles/startPage.css';

const StartPage = ({ onStart }) => {
  // StartPage 전용 body 스타일 적용
  useEffect(() => {
    document.body.classList.add('startpage-body');
    return () => {
      document.body.classList.remove('startpage-body');
    };
  }, []);
  return (
    <div className="start-page">
      {/* 배경 */}
      <div className="background">
        <div className="bg-pattern"></div>
        <div className="bg-gradient"></div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="start-container">
        {/* 로고 섹션 */}
        <div className="logo-section">
          <div className="logo">
            <div className="logo-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h1>Dashboard</h1>
          </div>
          <p className="tagline">데이터 분석의 새로운 시작</p>
        </div>

        {/* 시작 카드 */}
        <div className="start-card">
          <div className="card-header">
            <h2>데이터 분석 퀴즈</h2>
            <p>당신의 데이터 분석 지식을 테스트해보세요</p>
          </div>

          <div className="quiz-info">
            <div className="info-item">
              <i className="fas fa-question-circle"></i>
              <div className="info-text">
                <h3>5개의 문제</h3>
                <p>다양한 데이터 분석 주제를 다룹니다</p>
              </div>
            </div>
            
            <div className="info-item">
              <i className="fas fa-clock"></i>
              <div className="info-text">
                <h3>자유로운 시간</h3>
                <p>시간 제한 없이 천천히 풀어보세요</p>
              </div>
            </div>
            
            <div className="info-item">
              <i className="fas fa-chart-bar"></i>
              <div className="info-text">
                <h3>실무 중심</h3>
                <p>실제 업무에서 활용할 수 있는 내용입니다</p>
              </div>
            </div>
          </div>

          <button className="start-btn" onClick={onStart}>
            <span>퀴즈 시작하기</span>
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>

        {/* 푸터 */}
        <div className="start-footer">
          <p>준비가 되셨나요? 지금 바로 시작해보세요!</p>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
