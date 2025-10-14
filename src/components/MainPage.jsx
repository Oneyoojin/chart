import React, { useState, useEffect } from 'react';
import '../styles/mainPage.css';

const MainPage = ({ onLoginClick, onSignupClick, onQuizClick }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const email = localStorage.getItem('user_email');
    if (token) {
      setIsLoggedIn(true);
      setUserEmail(email || '사용자');
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    setIsLoggedIn(false);
    setUserEmail('');
  };

  const handleXrayClick = () => {
    // 로그인 상태 확인
    const token = localStorage.getItem('access_token');
    if (token) {
      // 로그인되어 있으면 퀴즈로 이동
      onQuizClick();
    } else {
      // 로그인되어 있지 않으면 로그인 페이지로 이동
      onLoginClick();
    }
  };
  return (
    <div className="main-page">
      {/* 배경 */}
      <div className="background">
        <div className="bg-pattern"></div>
        <div className="bg-gradient"></div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="main-container">
        {/* 헤더 */}
        <header className="main-header">
          <div className="header-logo">
            <div className="logo-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <span className="logo-title">의료 데이터 분석 및 학습 자동화</span>
          </div>
          <nav className="header-nav">
            {isLoggedIn ? (
              <div className="user-info">
                <span className="welcome-text">환영합니다 {userEmail}님</span>
                <button className="nav-btn logout" onClick={handleLogout}>로그아웃</button>
              </div>
            ) : (
              <>
                <button className="nav-btn" onClick={onLoginClick}>로그인</button>
                <button className="nav-btn primary" onClick={onSignupClick}>회원가입</button>
              </>
            )}
          </nav>
        </header>

        {/* 히어로 섹션 */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">의료 데이터 분석 및 학습 자동화</h1>
            <p className="hero-subtitle">AI 기반 의료 데이터 분석으로 더 정확한 진단과 치료를 제공합니다</p>
          </div>
        </section>

        {/* 기능 카드 섹션 */}
        <section className="features-section">
          <div className="features-container">
            <h2 className="section-title">주요 기능</h2>
            <div className="features-grid">
              <div className="feature-card" onClick={handleXrayClick}>
                <div className="feature-icon">
                  <i className="fas fa-x-ray"></i>
                </div>
                <h3>X-ray 분석</h3>
                <p>머신러닝을 활용한 의료 데이터 자동 분석</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-user-md"></i>
                </div>
                <h3>피부암</h3>
                <p>피부암 진단을 위한 AI 기반 이미지 분석</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3>보안 강화</h3>
                <p>의료 데이터 보안을 위한 최고 수준의 암호화</p>
              </div>
            </div>
          </div>
        </section>

        {/* 푸터 */}
        <footer className="main-footer">
          <div className="footer-content">
            <p>&copy; 2024 의료 데이터 분석 및 학습 자동화. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainPage;
