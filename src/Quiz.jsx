import React, { useState, useEffect } from 'react';
import './quiz.css';

const Quiz = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const questions = [
    {
      id: 1,
      question: "데이터 분석에서 가장 중요한 단계는 무엇인가요?",
      options: [
        "데이터 수집",
        "데이터 정제",
        "데이터 시각화",
        "결과 해석"
      ],
      correct: 3,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      question: "다음 중 빅데이터의 3V 특성이 아닌 것은?",
      options: [
        "Volume (용량)",
        "Velocity (속도)",
        "Variety (다양성)",
        "Veracity (정확성)"
      ],
      correct: 3,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      question: "머신러닝에서 지도학습과 비지도학습의 차이점은?",
      options: [
        "데이터 크기",
        "라벨의 유무",
        "알고리즘 종류",
        "처리 속도"
      ],
      correct: 1,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      question: "데이터 시각화에서 가장 효과적인 차트는?",
      options: [
        "원형 차트",
        "막대 차트",
        "상황에 따라 다름",
        "선형 차트"
      ],
      correct: 2,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      question: "데이터 품질을 높이기 위한 방법은?",
      options: [
        "데이터 중복 제거",
        "누락값 처리",
        "이상값 탐지",
        "모든 것"
      ],
      correct: 3,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
    }
  ];


  const handleSelectAnswer = (answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // 퀴즈 완료 시 바로 대시보드로 이동
    onComplete();
  };


  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>데이터 분석 퀴즈</h1>
        <p>데이터 분석에 대한 지식을 테스트해보세요!</p>
      </div>

      <div className="quiz-content">
        <div className="question-card">
          <div className="question-header">
            <h2>{questions[currentQuestion].question}</h2>
          </div>
          
          <div className="quiz-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <p className="progress-text">문제 {currentQuestion + 1} / {questions.length}</p>
          </div>
          
          <div className="question-layout">
            <div className="question-image">
              <img 
                src={questions[currentQuestion].image} 
                alt="문제 이미지"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            <div className="options">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`option-btn ${selectedAnswers[currentQuestion] === index ? 'selected' : ''}`}
                  onClick={() => handleSelectAnswer(index)}
                >
                  <span className="option-text">{option}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="quiz-navigation">
          <button 
            className="nav-btn prev-btn" 
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
          >
            <i className="fas fa-chevron-left"></i>
            이전 문제
          </button>
          
          <div className="question-dots">
            {questions.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentQuestion ? 'active' : ''} ${selectedAnswers[index] !== undefined ? 'answered' : ''}`}
                onClick={() => setCurrentQuestion(index)}
              >
              </button>
            ))}
          </div>

          <button 
            className="nav-btn next-btn" 
            onClick={handleNextQuestion}
            disabled={selectedAnswers[currentQuestion] === undefined}
          >
            {currentQuestion === questions.length - 1 ? '완료' : '다음 문제'}
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;