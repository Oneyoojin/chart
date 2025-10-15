import React, { useState, useEffect, useMemo } from 'react';
import '../styles/mainPage.css';
import { fetchCategories } from '../api/categories';

const MainPage = ({ onLoginClick, onSignupClick, onQuizClick }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const email = localStorage.getItem('user_email');
    setIsLoggedIn(!!token);
    setUserEmail(email || '');

    fetchCategories()
      .then((res) => setCategories(Array.isArray(res) ? res : []))
      .catch(() => setCategories([]));
  }, []);

  // 안전 가드
  const safeCats = Array.isArray(categories) ? categories : [];

  // 루트/자식 분리
  const { roots, byParent } = useMemo(() => {
    const roots = safeCats.filter((c) => c.parent_id == null);
    const byParent = safeCats.reduce((acc, c) => {
      const pid = c.parent_id == null ? 'root' : String(c.parent_id);
      (acc[pid] ||= []).push(c);
      return acc;
    }, {});
    return { roots, byParent };
  }, [safeCats]);

  // 아이콘 매핑(선택)
  const iconOf = (name = '') => {
    if (/x-?ray/i.test(name) || /X-ray|Xray|엑스레이/.test(name)) return 'fa-x-ray';
    if (/피부|skin/i.test(name)) return 'fa-user-md';
    return 'fa-list';
  };

  // 카드: 루트가 있으면 첫 루트의 "자식"에서, 없으면 전체에서 3개
  const featureCards = useMemo(() => {
    const firstRoot = roots[0] || null;
    const pickFrom = firstRoot
      ? (byParent[String(firstRoot.category_id)] || [])
      : safeCats;

    return pickFrom.slice(0, 3).map((c) => ({
      id: c.category_id,
      icon: iconOf(c.category_name),
      title: c.category_name ?? `카테고리 ${c.category_id}`,
      desc: c.description || '해당 카테고리 퀴즈',
    }));
  }, [roots, byParent, safeCats]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    setIsLoggedIn(false);
    setUserEmail('');
  };

  const handleFeatureClick = (categoryId) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      onQuizClick(categoryId); // ← 클릭한 카드의 id가 그대로 전달됨
    } else {
      onLoginClick();
    }
  };

  return (
    <div className="main-page">
      <div className="background">
        <div className="bg-pattern"></div>
        <div className="bg-gradient"></div>
      </div>

      <div className="main-container">
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
                <span className="welcome-text">환영합니다 {userEmail || '사용자'}님</span>
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

        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">의료 데이터 분석 및 학습 자동화</h1>
            <p className="hero-subtitle">AI 기반 의료 데이터 분석으로 더 정확한 진단과 치료를 제공합니다</p>
          </div>
        </section>

        <section className="features-section">
          <div className="features-container">
            <h2 className="section-title">Quiz</h2>

            {featureCards.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6b7280' }}>
                표시할 카테고리가 없습니다.
              </p>
            ) : (
              <div className="features-grid">
                {featureCards.map((card) => (
                  <div
                    key={card.id}
                    className="feature-card"
                    onClick={() => handleFeatureClick(card.id)}
                    role="button"
                  >
                    <div className="feature-icon">
                      <i className={`fas ${card.icon}`}></i>
                    </div>
                    <h3>{card.title}</h3>
                    <p>{card.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

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
