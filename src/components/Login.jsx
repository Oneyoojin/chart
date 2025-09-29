import React, { useState } from 'react';
import '../styles/login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // 폼 데이터 변경
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 실시간 유효성 검사
    if (errors[name]) {
      validateField(name, value);
    }
  };

  // 필드 유효성 검사
  const validateField = (fieldName, value) => {
    let error = '';
    
    switch (fieldName) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
        if (!value) {
          error = '이메일 또는 전화번호를 입력해주세요.';
        } else if (!emailRegex.test(value) && !phoneRegex.test(value)) {
          error = '올바른 이메일 또는 전화번호 형식이 아닙니다.';
        }
        break;
      case 'password':
        if (!value) {
          error = '비밀번호를 입력해주세요.';
        } else if (value.length < 8) {
          error = '비밀번호는 최소 8자 이상이어야 합니다.';
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    
    return !error;
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 모든 필드 유효성 검사
    const isEmailValid = validateField('email', formData.email);
    const isPasswordValid = validateField('password', formData.password);
    
    if (!isEmailValid || !isPasswordValid) {
      showNotification('error', '입력 정보를 확인해주세요.', '❌');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 로그인 시뮬레이션
      await simulateLogin();
      showNotification('success', '로그인 성공! 환영합니다.');
      
      // 1.5초 후 퀴즈로 이동
      setTimeout(() => {
        onLogin();
      }, 1500);
      
    } catch (error) {
      showNotification('error', error.message || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 시뮬레이션
  const simulateLogin = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 데모 계정: demo@dashboard.com / password
        if (formData.email === 'demo@dashboard.com' && formData.password === 'password') {
          resolve({ success: true });
        } else {
          reject(new Error('이메일 또는 비밀번호가 올바르지 않습니다.'));
        }
      }, 2000);
    });
  };

  // 비밀번호 표시 토글
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 알림 표시
  const showNotification = (type, message, icon = '') => {
    setNotification({ show: true, message, type, icon });
    
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  return (
    <div className="login-page">
      {/* 배경 */}
      <div className="background">
        <div className="bg-pattern"></div>
        <div className="bg-gradient"></div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="login-container">
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

        {/* 로그인 카드 */}
        <div className="login-card">
          <div className="card-header">
            <h2>환영합니다</h2>
            <p>계정에 로그인하여 Dashboard를 시작하세요</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper">
                {!formData.email && <i className="fas fa-user input-icon"></i>}
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="이메일 또는 전화번호를 입력하세요"
                  required
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                {!formData.password && <i className="fas fa-lock input-icon"></i>}
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 입력하세요"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-wrapper">
                <input type="checkbox" id="rememberMe" />
                <span className="checkmark"></span>
                <span className="checkbox-label">로그인 상태 유지</span>
              </label>
              <button type="button" className="forgot-link">비밀번호를 잊으셨나요?</button>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={isLoading}
            >
              <span>로그인</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </form>

          <div className="divider">
            <span>또는</span>
          </div>

          <div className="social-login">
            <button className="social-btn google">
              <i className="fab fa-google"></i>
              <span>Google로 계속하기</span>
            </button>
            <button className="social-btn github">
              <i className="fab fa-github"></i>
              <span>GitHub로 계속하기</span>
            </button>
          </div>
        </div>

        {/* 푸터 */}
        <div className="login-footer">
          <p>계정이 없으신가요? <button type="button" className="signup-link">회원가입</button></p>
        </div>
      </div>

      {/* 알림 */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <i className="notification-icon">{notification.icon}</i>
            <span className="notification-message">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;