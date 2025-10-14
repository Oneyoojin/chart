import React, { useState, useEffect } from 'react';
import '../styles/tasks.css';
import Calendar from './Calendar';

const Tasks = ({ onNavigateToDashboard }) => {
  // 상태 관리
  const [taskLists, setTaskLists] = useState([
    { id: '1', name: '내 할 일', color: '#1a73e8' }
  ]);
  const [selectedListId, setSelectedListId] = useState('1');
  const [tasks, setTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [showListMenu, setShowListMenu] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' 또는 'calendar'
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickAddDate, setQuickAddDate] = useState(null);
  const [quickAddTitle, setQuickAddTitle] = useState('');
  const [showTaskOptionsMenu, setShowTaskOptionsMenu] = useState(false);

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const savedLists = localStorage.getItem('taskLists');
    const savedTasks = localStorage.getItem('tasks');
    
    if (savedLists) {
      setTaskLists(JSON.parse(savedLists));
    }
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // 데이터 저장
  useEffect(() => {
    localStorage.setItem('taskLists', JSON.stringify(taskLists));
  }, [taskLists]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // 현재 선택된 목록의 할일들
  const currentTasks = tasks.filter(task => task.listId === selectedListId);
  const pendingTasks = currentTasks.filter(task => !task.completed);
  const completedTasks = currentTasks.filter(task => task.completed);

  // 캘린더용 할일 데이터 (목록 색상 포함)
  const tasksWithColors = currentTasks.map(task => ({
    ...task,
    listColor: taskLists.find(list => list.id === task.listId)?.color
  }));

  // 새 할일 추가
  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim() === '') return;

    // 오늘 날짜를 기본 마감일로 설정
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const newTask = {
      id: Date.now().toString(),
      listId: selectedListId,
      title: newTaskTitle,
      details: '',
      dueDate: todayStr, // 오늘 날짜를 기본 마감일로 설정
      completed: false,
      createdAt: new Date().toISOString(),
      subtasks: []
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  // 빠른 할일 추가 (캘린더에서 날짜 클릭 시)
  const handleQuickAddTask = (e) => {
    e.preventDefault();
    if (quickAddTitle.trim() === '') return;

    const newTask = {
      id: Date.now().toString(),
      listId: selectedListId,
      title: quickAddTitle,
      details: '',
      dueDate: quickAddDate,
      completed: false,
      createdAt: new Date().toISOString(),
      subtasks: []
    };

    setTasks([...tasks, newTask]);
    setQuickAddTitle('');
    setShowQuickAddModal(false);
    setQuickAddDate(null);
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setQuickAddDate(dateStr);
    setShowQuickAddModal(true);
  };

  // 할일 완료/미완료 토글
  const toggleTaskComplete = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  // 할일 삭제
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    if (editingTask?.id === taskId) {
      setEditingTask(null);
    }
  };

  // 할일 편집
  const handleTaskClick = (task) => {
    setEditingTask(task);
  };

  // 할일 상세 정보 업데이트
  const updateTaskDetails = (field, value) => {
    setTasks(tasks.map(task =>
      task.id === editingTask.id
        ? { ...task, [field]: value }
        : task
    ));
    setEditingTask({ ...editingTask, [field]: value });
  };

  // 새 목록 추가
  const handleAddList = () => {
    if (newListName.trim() === '') return;

    const colors = ['#1a73e8', '#d93025', '#f9ab00', '#0f9d58', '#9334e6'];
    const newList = {
      id: Date.now().toString(),
      name: newListName,
      color: colors[Math.floor(Math.random() * colors.length)]
    };

    setTaskLists([...taskLists, newList]);
    setNewListName('');
    setShowListMenu(false);
  };

  // 목록 삭제
  const deleteList = (listId) => {
    if (taskLists.length === 1) {
      alert('마지막 목록은 삭제할 수 없습니다.');
      return;
    }
    if (window.confirm('이 목록과 모든 할 일을 삭제하시겠습니까?')) {
      setTaskLists(taskLists.filter(list => list.id !== listId));
      setTasks(tasks.filter(task => task.listId !== listId));
      if (selectedListId === listId) {
        setSelectedListId(taskLists[0].id);
      }
    }
  };

  // 날짜 포맷
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return '오늘';
    if (isTomorrow) return '내일';
    
    return date.toLocaleDateString('ko-KR', { 
      month: 'long', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  // 마감일이 지났는지 확인
  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const selectedList = taskLists.find(list => list.id === selectedListId);

  return (
    <>
      {/* 상단 네비게이션 */}
      <nav className="tasks-navbar">
        <div className="tasks-nav-content">
          <button className="back-to-dashboard" onClick={onNavigateToDashboard}>
            <i className="fas fa-arrow-left"></i>
            <span>Dashboard로 돌아가기</span>
          </button>
          <div className="tasks-nav-title">
            <i className="fas fa-tasks"></i>
            <span>Tasks</span>
          </div>
        </div>
      </nav>

      <div className="tasks-container">
        {/* 사이드바 - 할일 목록들 */}
        <aside className="tasks-sidebar">
          <div className="sidebar-header">
            <h2>Tasks</h2>
            <button 
              className="add-list-btn"
              onClick={() => setShowListMenu(!showListMenu)}
              title="새 목록"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>

        {showListMenu && (
          <div className="new-list-form">
            <input
              type="text"
              placeholder="새 목록 이름"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddList()}
              autoFocus
            />
            <div className="new-list-actions">
              <button onClick={handleAddList} className="btn-save">
                <i className="fas fa-check"></i>
              </button>
              <button onClick={() => { setShowListMenu(false); setNewListName(''); }} className="btn-cancel">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}

        <div className="task-lists">
          {taskLists.map(list => (
            <div
              key={list.id}
              className={`task-list-item ${selectedListId === list.id ? 'active' : ''}`}
              onClick={() => setSelectedListId(list.id)}
            >
              <div className="list-info">
                <i className="fas fa-list" style={{ color: list.color }}></i>
                <span className="list-name">{list.name}</span>
                <span className="task-count">
                  {tasks.filter(t => t.listId === list.id && !t.completed).length}
                </span>
              </div>
              {taskLists.length > 1 && (
                <button
                  className="delete-list-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteList(list.id);
                  }}
                  title="목록 삭제"
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* 메인 영역 - 할일들 */}
      <main className="tasks-main">
        <div className="tasks-header">
          <h1 style={{ color: selectedList?.color }}>{selectedList?.name}</h1>
          <div className="tasks-actions">
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="리스트 뷰"
              >
                <i className="fas fa-list"></i>
              </button>
              <button
                className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                onClick={() => setViewMode('calendar')}
                title="캘린더 뷰"
              >
                <i className="fas fa-calendar-alt"></i>
              </button>
            </div>
            {viewMode === 'list' && (
              <button
                className={`toggle-completed-btn ${showCompleted ? 'active' : ''}`}
                onClick={() => setShowCompleted(!showCompleted)}
                title={showCompleted ? '완료된 할일 숨기기' : '완료된 할일 보기'}
              >
                <i className="fas fa-check-circle"></i>
              </button>
            )}
          </div>
        </div>

        {/* 새 할일 추가 - 리스트 뷰에서만 표시 */}
        {viewMode === 'list' && (
          <form className="add-task-form" onSubmit={handleAddTask}>
            <button type="submit" className="add-task-icon" disabled={!newTaskTitle.trim()}>
              <i className="fas fa-plus"></i>
            </button>
            <input
              type="text"
              placeholder="작업 추가"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="add-task-input"
            />
          </form>
        )}

        {/* 리스트 뷰 */}
        {viewMode === 'list' && (
          <div className="tasks-list">
          {/* 미완료 할일 */}
          {pendingTasks.map(task => (
            <div
              key={task.id}
              className={`task-item ${editingTask?.id === task.id ? 'editing' : ''}`}
              onClick={() => handleTaskClick(task)}
            >
              <button
                className="task-checkbox"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTaskComplete(task.id);
                }}
              >
                <i className="far fa-circle"></i>
              </button>
              <div className="task-content">
                <div className="task-title">{task.title}</div>
                {task.dueDate && (
                  <div className={`task-due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                    <i className="far fa-calendar"></i>
                    {formatDate(task.dueDate)}
                  </div>
                )}
                {task.details && (
                  <div className="task-details-preview">
                    <i className="far fa-file-alt"></i>
                    {task.details.substring(0, 50)}...
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* 완료된 할일 */}
          {showCompleted && completedTasks.length > 0 && (
            <div className="completed-section">
              <div className="completed-header">
                <span>완료됨 ({completedTasks.length})</span>
              </div>
              {completedTasks.map(task => (
                <div
                  key={task.id}
                  className={`task-item completed ${editingTask?.id === task.id ? 'editing' : ''}`}
                  onClick={() => handleTaskClick(task)}
                >
                  <button
                    className="task-checkbox"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskComplete(task.id);
                    }}
                  >
                    <i className="fas fa-check-circle"></i>
                  </button>
                  <div className="task-content">
                    <div className="task-title">{task.title}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 빈 상태 */}
          {pendingTasks.length === 0 && completedTasks.length === 0 && (
            <div className="empty-state">
              <i className="fas fa-tasks"></i>
              <p>할 일이 없습니다</p>
              <span>위의 입력란에서 작업을 추가하세요</span>
            </div>
          )}
          </div>
        )}

        {/* 캘린더 뷰 */}
        {viewMode === 'calendar' && (
          <div className="calendar-container">
            <Calendar
              tasks={tasksWithColors}
              onTaskClick={handleTaskClick}
              onDateClick={handleDateClick}
            />
          </div>
        )}
      </main>

      {/* 상세 패널 */}
      {editingTask && (
        <aside className="task-detail-panel">
          <div className="detail-panel-header">
            <div className="options-menu-wrapper">
              <button
                className="task-options-btn"
                onClick={() => setShowTaskOptionsMenu(!showTaskOptionsMenu)}
              >
                <i className="fas fa-ellipsis-v"></i>
              </button>
              
              {/* 옵션 메뉴 */}
              {showTaskOptionsMenu && (
                <>
                  <div 
                    className="options-menu-overlay"
                    onClick={() => setShowTaskOptionsMenu(false)}
                  />
                  <div className="task-options-menu">
                <div className="options-menu-header">정렬 기준</div>
                <button className="options-menu-item">
                  <i className="fas fa-sort"></i>
                  <span>내가 정렬한 대로</span>
                </button>
                <button className="options-menu-item active">
                  <i className="fas fa-check"></i>
                  <span>날짜</span>
                </button>
                <button className="options-menu-item">
                  <span>최근 별표표시한 항목</span>
                </button>
                <button className="options-menu-item">
                  <span>제목</span>
                </button>
                
                <div className="options-menu-divider"></div>
                
                <div className="options-menu-header">목록 이름 변경</div>
                <button 
                  className="options-menu-item"
                  onClick={() => {
                    setShowTaskOptionsMenu(false);
                    const newName = prompt('새 목록 이름을 입력하세요:', selectedList?.name);
                    if (newName && newName.trim()) {
                      setTaskLists(taskLists.map(list => 
                        list.id === selectedListId 
                          ? { ...list, name: newName.trim() }
                          : list
                      ));
                    }
                  }}
                >
                  <span>목록 이름 변경</span>
                </button>
                
                <div className="options-menu-divider"></div>
                
                <div className="options-menu-header">목록 삭제</div>
                <button 
                  className="options-menu-item text-danger"
                  onClick={() => {
                    setShowTaskOptionsMenu(false);
                    deleteList(selectedListId);
                  }}
                >
                  <span>목록 삭제</span>
                </button>
                
                <div className="options-menu-divider"></div>
                
                <div className="options-menu-header">목록 인쇄</div>
                <button 
                  className="options-menu-item"
                  onClick={() => {
                    setShowTaskOptionsMenu(false);
                    window.print();
                  }}
                >
                  <span>목록 인쇄</span>
                </button>
                
                <div className="options-menu-divider"></div>
                
                <button 
                  className="options-menu-item"
                  onClick={() => {
                    setShowTaskOptionsMenu(false);
                    const completed = tasks.filter(t => t.listId === selectedListId && t.completed);
                    if (completed.length === 0) {
                      alert('완료된 할일이 없습니다.');
                      return;
                    }
                    if (window.confirm(`완료된 ${completed.length}개의 할일을 모두 삭제하시겠습니까?`)) {
                      setTasks(tasks.filter(t => !(t.listId === selectedListId && t.completed)));
                    }
                  }}
                >
                  <span>완료된 할 일 모두 삭제</span>
                </button>
                
                <button 
                  className="options-menu-item"
                  onClick={() => {
                    setShowTaskOptionsMenu(false);
                    alert('오래된 할일 정리 기능은 준비 중입니다.');
                  }}
                >
                  <span>오래된 할 일 정리</span>
                </button>
              </div>
                </>
              )}
            </div>
            
            <button
              className="close-detail-btn"
              onClick={() => setEditingTask(null)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="detail-panel-content">
            {/* 체크박스와 제목 */}
            <div className="detail-task-header">
              <button
                className={`detail-checkbox ${editingTask.completed ? 'completed' : ''}`}
                onClick={() => {
                  toggleTaskComplete(editingTask.id);
                  setEditingTask({ ...editingTask, completed: !editingTask.completed });
                }}
              >
                {editingTask.completed ? (
                  <i className="fas fa-check-circle"></i>
                ) : (
                  <i className="far fa-circle"></i>
                )}
              </button>
              <input
                type="text"
                className="detail-title-input"
                value={editingTask.title}
                onChange={(e) => updateTaskDetails('title', e.target.value)}
                placeholder="작업 제목"
              />
            </div>

            {/* 세부정보 */}
            <div className="detail-section">
              <div className="detail-item">
                <i className="far fa-file-alt"></i>
                <textarea
                  placeholder="세부정보 추가"
                  value={editingTask.details}
                  onChange={(e) => updateTaskDetails('details', e.target.value)}
                  className="detail-textarea"
                  rows="4"
                />
              </div>

              <div className="detail-item">
                <i className="far fa-calendar"></i>
                <input
                  type="date"
                  value={editingTask.dueDate || ''}
                  onChange={(e) => updateTaskDetails('dueDate', e.target.value)}
                  className="detail-date-input"
                />
              </div>
            </div>

            {/* 삭제 버튼 */}
            <div className="detail-actions">
              <button
                className="delete-task-btn"
                onClick={() => deleteTask(editingTask.id)}
              >
                <i className="far fa-trash-alt"></i>
                작업 삭제
              </button>
            </div>

            {/* 작성 시간 */}
            <div className="detail-footer">
              <small>
                생성일: {new Date(editingTask.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </small>
            </div>
          </div>
        </aside>
      )}

      {/* 빠른 할일 추가 모달 */}
      {showQuickAddModal && (
        <div className="quick-add-modal-overlay" onClick={() => setShowQuickAddModal(false)}>
          <div className="quick-add-modal" onClick={(e) => e.stopPropagation()}>
            <div className="quick-add-header">
              <h3>할일 추가</h3>
              <button 
                className="quick-add-close"
                onClick={() => setShowQuickAddModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="quick-add-content">
              <div className="quick-add-date">
                <i className="far fa-calendar"></i>
                <span>{quickAddDate ? new Date(quickAddDate + 'T00:00:00').toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short'
                }) : ''}</span>
              </div>
              <form onSubmit={handleQuickAddTask}>
                <input
                  type="text"
                  placeholder="할일을 입력하세요"
                  value={quickAddTitle}
                  onChange={(e) => setQuickAddTitle(e.target.value)}
                  className="quick-add-input"
                  autoFocus
                />
                <div className="quick-add-actions">
                  <button 
                    type="button" 
                    className="btn-cancel-quick"
                    onClick={() => setShowQuickAddModal(false)}
                  >
                    취소
                  </button>
                  <button 
                    type="submit" 
                    className="btn-submit-quick"
                    disabled={!quickAddTitle.trim()}
                  >
                    추가
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default Tasks;

