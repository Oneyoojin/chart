import React, { useState } from 'react';
import '../styles/quiz.css';

const Quiz = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

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
      hint: "데이터 분석의 마지막 단계로, 수집된 데이터를 바탕으로 의미 있는 인사이트를 도출하는 과정입니다.",
      explanation: "결과 해석은 데이터 분석의 핵심입니다. 아무리 정확한 데이터와 분석이 있어도, 그 결과를 올바르게 해석하고 비즈니스 인사이트로 전환하지 못하면 의미가 없습니다. 결과 해석을 통해 의사결정에 필요한 가치 있는 정보를 도출할 수 있습니다.",
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
      hint: "빅데이터의 전통적인 3V는 Volume, Velocity, Variety입니다. Veracity는 나중에 추가된 4번째 V입니다.",
      explanation: "빅데이터의 전통적인 3V는 Volume(용량), Velocity(속도), Variety(다양성)입니다. Veracity(정확성)는 나중에 추가된 4번째 V로, 데이터의 신뢰성과 정확성을 의미합니다. 따라서 Veracity는 원래 3V에 포함되지 않습니다.",
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
      hint: "지도학습은 정답(라벨)이 있는 데이터로 학습하고, 비지도학습은 라벨이 없는 데이터로 패턴을 찾습니다.",
      explanation: "지도학습(Supervised Learning)은 정답(라벨)이 있는 훈련 데이터를 사용하여 모델을 학습시키는 방법입니다. 반면 비지도학습(Unsupervised Learning)은 라벨이 없는 데이터에서 숨겨진 패턴이나 구조를 찾는 방법입니다. 이는 두 학습 방식의 가장 근본적인 차이점입니다.",
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
      hint: "데이터의 특성, 목적, 대상에 따라 가장 적합한 차트가 달라집니다. 범용적으로 사용할 수 있는 차트는 없습니다.",
      explanation: "데이터 시각화에서 가장 효과적인 차트는 데이터의 특성, 분석 목적, 대상 독자에 따라 달라집니다. 예를 들어, 시간에 따른 변화는 선형 차트가, 카테고리별 비교는 막대 차트가, 비율 표현은 원형 차트가 적합합니다. 상황에 맞는 차트 선택이 중요합니다.",
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
      hint: "데이터 품질 향상을 위해서는 중복 제거, 누락값 처리, 이상값 탐지 등 모든 방법을 종합적으로 적용해야 합니다.",
      explanation: "데이터 품질 향상은 단일 방법으로는 달성할 수 없습니다. 중복 제거, 누락값 처리, 이상값 탐지, 데이터 검증, 정규화 등 다양한 방법을 종합적으로 적용해야 합니다. 각 방법은 서로 다른 데이터 품질 문제를 해결하므로 모두 필요합니다.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
    }
  ];


  const handleSelectAnswer = (answerIndex) => {
    if (isAnswered) return; // 이미 답변한 경우 무시
    
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex
    });
    
    setShowFeedback(true);
    setIsAnswered(true);
    
    // 2초 후 자동으로 다음 문제로 이동
    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };

  const handleNextQuestion = () => {
    // 상태 초기화
    setShowFeedback(false);
    setShowHint(false);
    setIsAnswered(false);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      // 상태 초기화
      setShowFeedback(false);
      setShowHint(false);
      setIsAnswered(false);
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // 퀴즈 완료 시 바로 대시보드로 이동
    onComplete();
  };

  const toggleHint = () => {
    setShowHint(!showHint);
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
            <button 
              className="hint-btn" 
              onClick={toggleHint}
              disabled={isAnswered}
            >
              <i className="fas fa-lightbulb"></i>
              힌트 보기
            </button>
          </div>
          
          {showHint && (
            <div className="hint-box">
              <i className="fas fa-info-circle"></i>
              <p>{questions[currentQuestion].hint}</p>
            </div>
          )}
          
          <div className="quiz-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <p className="progress-text">문제 {currentQuestion + 1} / {questions.length}</p>
          </div>
          
          {!showFeedback || selectedAnswers[currentQuestion] === questions[currentQuestion].correct ? (
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
                {questions[currentQuestion].options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestion] === index;
                  const isCorrect = index === questions[currentQuestion].correct;
                  const showResult = showFeedback && isSelected;
                  
                  return (
                    <button
                      key={index}
                      className={`option-btn ${isSelected ? 'selected' : ''} ${showResult ? (isCorrect ? 'correct' : 'incorrect') : ''} ${showFeedback && isCorrect ? 'show-correct' : ''}`}
                      onClick={() => handleSelectAnswer(index)}
                      disabled={isAnswered}
                    >
                      <span className="option-text">{option}</span>
                      {showResult && (
                        <span className="feedback-icon">
                          {isCorrect ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i>}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
          
          {showFeedback && (
            <div className="feedback-message">
              {selectedAnswers[currentQuestion] === questions[currentQuestion].correct ? (
                <div className="feedback correct">
                  <i className="fas fa-check-circle"></i>
                  <span>정답입니다! 🎉</span>
                </div>
              ) : (
                <div className="feedback incorrect">
                  <i className="fas fa-times-circle"></i>
                  <span>틀렸습니다. 정답은 "{questions[currentQuestion].options[questions[currentQuestion].correct]}"입니다.</span>
                </div>
              )}
              <div className="explanation-box">
                <div className="explanation-header">
                  <i className="fas fa-lightbulb"></i>
                  <span>해석</span>
                </div>
                <p className="explanation-text">
                  {questions[currentQuestion].explanation}
                </p>
              </div>
            </div>
          )}
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
            disabled={!isAnswered}
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