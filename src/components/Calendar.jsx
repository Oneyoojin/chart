import React, { useState } from 'react';

const Calendar = ({ tasks, onTaskClick, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 해당 월의 첫날과 마지막날 구하기
  const getMonthData = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const firstDayOfWeek = firstDay.getDay(); // 0 (일요일) ~ 6 (토요일)
    const daysInMonth = lastDay.getDate();
    
    return { year, month, firstDayOfWeek, daysInMonth };
  };

  const { year, month, firstDayOfWeek, daysInMonth } = getMonthData(currentDate);

  // 이전/다음 달로 이동
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 특정 날짜의 할일들 가져오기
  const getTasksForDate = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(task => task.dueDate === dateStr && !task.completed);
  };

  // 완료된 할일 포함 여부
  const hasCompletedTasksForDate = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.some(task => task.dueDate === dateStr && task.completed);
  };

  // 오늘인지 확인
  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };

  // 과거 날짜인지 확인
  const isPast = (day) => {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // 캘린더 그리드 생성
  const renderCalendarDays = () => {
    const days = [];
    
    // 이전 달의 빈 칸들
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const dayTasks = getTasksForDate(day);
      const hasCompleted = hasCompletedTasksForDate(day);
      const today = isToday(day);
      const past = isPast(day);
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${today ? 'today' : ''} ${past ? 'past' : ''} ${dayTasks.length > 0 ? 'has-tasks' : ''}`}
          onClick={() => onDateClick && onDateClick(year, month, day)}
        >
          <div className="day-number">{day}</div>
          {dayTasks.length > 0 && (
            <div className="day-tasks">
              {dayTasks.slice(0, 3).map(task => (
                <div
                  key={task.id}
                  className="calendar-task"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskClick && onTaskClick(task);
                  }}
                  style={{ borderLeftColor: task.listColor || '#1a73e8' }}
                >
                  <span className="task-title-mini">{task.title}</span>
                </div>
              ))}
              {dayTasks.length > 3 && (
                <div className="more-tasks">+{dayTasks.length - 3} 더보기</div>
              )}
            </div>
          )}
          {hasCompleted && dayTasks.length === 0 && (
            <div className="completed-indicator">
              <i className="fas fa-check-circle"></i>
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="calendar-view">
      {/* 캘린더 헤더 */}
      <div className="calendar-header">
        <div className="calendar-title">
          <h2>{year}년 {monthNames[month]}</h2>
        </div>
        <div className="calendar-controls">
          <button onClick={goToToday} className="today-btn">
            오늘
          </button>
          <button onClick={goToPreviousMonth} className="nav-btn">
            <i className="fas fa-chevron-left"></i>
          </button>
          <button onClick={goToNextMonth} className="nav-btn">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="calendar-weekdays">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`weekday-label ${index === 0 ? 'sunday' : ''} ${index === 6 ? 'saturday' : ''}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 캘린더 그리드 */}
      <div className="calendar-grid">
        {renderCalendarDays()}
      </div>

      {/* 범례 */}
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color today-legend"></div>
          <span>오늘</span>
        </div>
        <div className="legend-item">
          <div className="legend-color has-tasks-legend"></div>
          <span>할일 있음</span>
        </div>
        <div className="legend-item">
          <div className="legend-color completed-legend">
            <i className="fas fa-check-circle"></i>
          </div>
          <span>완료됨</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;



