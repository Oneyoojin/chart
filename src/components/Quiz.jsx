// src/components/Quiz.jsx
import React, { useEffect, useState } from 'react';
import '../styles/quiz.css';
import { getRandomQuiz } from '../api/quiz';
import { submitAnswer } from '../api/answer';

const Quiz = ({ onComplete }) => {
  const [quiz, setQuiz] = useState(null);
  const [picked, setPicked] = useState(null);
  const [result, setResult] = useState(null); // { correct, correct_choice_id, explanation? }
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  // 페이지 전용 body 스타일
  useEffect(() => {
    document.body.classList.add('quiz-body');
    return () => document.body.classList.remove('quiz-body');
  }, []);

  // 첫 문제 로드
  useEffect(() => {
    loadRandom();
  }, []);

  const loadRandom = async () => {
    const q = await getRandomQuiz();
    setQuiz(q);
  };

  // 보기 선택 -> 채점(백엔드) -> LLM 해설 포함
  const handleSelectAnswer = async (choice_id) => {
    if (!quiz || isAnswered) return;
    setPicked(choice_id);
    setIsAnswered(true);

    const r = await submitAnswer({ quiz_id: quiz.quiz_id, choice_id });
    // r.explanation: 오답일 때 백엔드가 생성. (OPENAI_API_KEY 없으면 fallback 문구)
    setResult(r);
    setShowFeedback(true);
  };

  // 다음 문제
  const handleNextQuestion = async () => {
    setShowFeedback(false);
    setShowHint(false);
    setIsAnswered(false);
    setPicked(null);
    setResult(null);
    await loadRandom();
  };

  if (!quiz) return <div className="quiz-container">문제를 불러오는 중...</div>;

  const imgSrc = quiz.image_url
    ? (quiz.image_url.startsWith('http')
        ? quiz.image_url
        : `${process.env.REACT_APP_API_BASE}${quiz.image_url.startsWith('/') ? '' : '/'}${quiz.image_url}`)
    : null;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>데이터 분석 퀴즈</h1>
        <p>데이터 분석에 대한 지식을 테스트해보세요!</p>
      </div>

      <div className="quiz-content">
        <div className="question-card">
          <div className="question-header">
            <h2>{quiz.quiz_title}</h2>
            <button
              className="hint-btn"
              onClick={() => setShowHint(v => !v)}
              disabled={isAnswered}
              type="button"
            >
              <i className="fas fa-lightbulb"></i> 힌트 보기
            </button>
          </div>

          {showHint && (
            <div className="hint-box">
              <i className="fas fa-info-circle"></i>
              {/* DB의 quiz_text를 힌트처럼 노출 */}
              <p>{quiz.quiz_text}</p>
            </div>
          )}

          <div className="question-layout">
            <div className="question-image">
              {imgSrc && <img src={imgSrc} alt="문제 이미지" />}
            </div>

            <div className="options">
              {quiz.choices.map((c) => {
                const isSelected = picked === c.choice_id;
                const isCorrect = result?.correct_choice_id === c.choice_id;
                const showResult = showFeedback && (isSelected || isCorrect);
                return (
                  <button
                    key={c.choice_id}
                    className={`option-btn ${isSelected ? 'selected' : ''} ${
                      showResult ? (isCorrect ? 'correct' : 'incorrect') : ''
                    }`}
                    onClick={() => handleSelectAnswer(c.choice_id)}
                    disabled={isAnswered}
                    type="button"
                  >
                    <span className="option-text">{c.content}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {showFeedback && (
            <div className="feedback-message">
              {result?.correct ? (
                <div className="feedback correct">
                  <i className="fas fa-check-circle"></i>
                  <span>정답입니다! 🎉</span>
                </div>
              ) : (
                <div className="feedback incorrect">
                  <i className="fas fa-times-circle"></i>
                  <span>틀렸습니다.</span>
                </div>
              )}

              {/* ⬇️ 오답 해설: 백엔드 LLM 또는 fallback 문구 */}
              {!result?.correct && result?.explanation && (
                <div className="explanation-box">
                  <div className="explanation-header">
                    <i className="fas fa-lightbulb"></i>
                    <span>해설</span>
                  </div>
                  <p className="explanation-text">{result.explanation}</p>
                </div>
              )}
            </div>
          )}

          <div className="quiz-navigation">
            <button className="nav-btn prev-btn" onClick={onComplete} type="button">
              대시보드로
            </button>
            <button className="nav-btn next-btn" onClick={handleNextQuestion} type="button">
              다음 문제 <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
