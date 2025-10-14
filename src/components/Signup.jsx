import React, { useState, useEffect } from 'react';
import '../styles/signup.css';

const Signup = ({ onSignup, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // 폼 데이터 변경
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 실시간 유효성 검사
    if (errors[name]) {
      validateField(name, type === 'checkbox' ? checked : value);
    }
  };

  // 필드 유효성 검사
  const validateField = (fieldName, value) => {
    let error = '';
    
    switch (fieldName) {
      case 'nickname':
        const nicknameRegex = /^[a-zA-Z0-9가-힣]+$/;
        if (!value) {
          error = '닉네임을 입력해주세요.';
        } else if (value.length < 3) {
          error = '닉네임은 최소 3자 이상이어야 합니다.';
        } else if (!nicknameRegex.test(value)) {
          error = '닉네임은 한글, 영문, 숫자만 사용 가능합니다.';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          error = '이메일을 입력해주세요.';
        } else if (!emailRegex.test(value)) {
          error = '올바른 이메일 형식이 아닙니다.';
        }
        break;
      case 'password':
        if (!value) {
          error = '비밀번호를 입력해주세요.';
        } else if (value.length < 8) {
          error = '비밀번호는 최소 8자 이상이어야 합니다.';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = '대문자, 소문자, 숫자를 모두 포함해야 합니다.';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = '비밀번호 확인을 입력해주세요.';
        } else if (value !== formData.password) {
          error = '비밀번호가 일치하지 않습니다.';
        }
        break;
      case 'agreeTerms':
        if (!value) {
          error = '약관에 동의해주세요.';
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
    const isNicknameValid = validateField('nickname', formData.nickname);
    const isEmailValid = validateField('email', formData.email);
    const isPasswordValid = validateField('password', formData.password);
    const isConfirmPasswordValid = validateField('confirmPassword', formData.confirmPassword);
    const isAgreeTermsValid = validateField('agreeTerms', formData.agreeTerms);
    
    if (!isNicknameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isAgreeTermsValid) {
      showNotification('error', '입력 정보를 확인해주세요.', '❌');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 회원가입 시뮬레이션
      await simulateSignup();
      showNotification('success', '회원가입 성공! 환영합니다.', '🎉');
      
      // 1.5초 후 로그인 페이지로 이동
      setTimeout(() => {
        onSignup();
      }, 1500);
      
    } catch (error) {
      showNotification('error', error.message || '회원가입에 실패했습니다.', '❌');
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입 시뮬레이션
  const simulateSignup = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 이메일 중복 체크 시뮬레이션
        if (formData.email === 'demo@dashboard.com') {
          reject(new Error('이미 사용 중인 이메일입니다.'));
        } else {
          resolve({ success: true });
        }
      }, 1600);
    });
  };

  // 비밀번호 표시 토글
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // 알림 표시
  const showNotification = (type, message, icon = '') => {
    setNotification({ show: true, message, type, icon });
    
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  return (
    <div className="signup-page">
      {/* 배경 */}
      <div className="background">
        <div className="bg-pattern"></div>
        <div className="bg-gradient"></div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="signup-container">
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

        {/* 회원가입 카드 */}
        <div className="signup-card">
          <div className="card-header">
            <h2>회원가입</h2>
            <p>새로운 계정을 만들어 Dashboard를 시작하세요</p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper">
                {!formData.nickname && <i className="fas fa-user input-icon"></i>}
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  placeholder="닉네임을 입력하세요"
                  required
                />
              </div>
              {errors.nickname && <span className="error-text">{errors.nickname}</span>}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                {!formData.email && <i className="fas fa-envelope input-icon"></i>}
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="이메일을 입력하세요"
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

            <div className="form-group">
              <div className="input-wrapper">
                {!formData.confirmPassword && <i className="fas fa-lock input-icon"></i>}
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-wrapper">
                <input 
                  type="checkbox" 
                  id="agreeTerms" 
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">이용약관 및 개인정보처리방침에 동의합니다.</span>
              </label>
            </div>
            {errors.agreeTerms && (
              <div className="error-container">
                <span className="error-text">{errors.agreeTerms}</span>
              </div>
            )}

            <button
              type="submit"
              className="signup-btn"
              disabled={isLoading}
            >
              회원가입
            </button>
          </form>

          <div className="divider">
            <span>또는</span>
          </div>

          <div className="social-signup">
            <button className="social-btn google">
              <i className="fab fa-google"></i>
              <span>Google로 가입하기</span>
            </button>
            <button className="social-btn github">
              <i className="fab fa-github"></i>
              <span>GitHub로 가입하기</span>
            </button>
          </div>
        </div>

        {/* 푸터 */}
        <div className="signup-footer">
          <p>이미 계정이 있으신가요? <button type="button" className="login-link" onClick={onBackToLogin}>로그인</button></p>
        </div>
      </div>

      {/* 알림 */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <i className="notification-icon">{notification.icon}</i>
            <span className="notification-message">
              {notification.message}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;

