// src/components/Dashboard.jsx
import React, { useEffect, useRef, useState } from 'react';
import '../styles/dashboard.css';
import { getSummary, getAttempts, getDaily, getDistribution } from '../api/stats';
import { fetchCategories } from '../api/categories';

const Dashboard = ({ onBackToMain }) => {
  // 상단 요약 + 최근 풀이
  const [summary, setSummary] = useState(null);
  const [attempts, setAttempts] = useState([]);

  // 카테고리 드롭다운(‘의료 이미지’의 직계 자식만 노출)
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // null=전체

  // 차트 데이터
  const [pieData, setPieData] = useState({ labels: [], data: [] });
  const [dailyData, setDailyData] = useState({ labels: [], data: [] });

  // 차트 인스턴스
  const productPieRef = useRef(null);
  const regionBarRef = useRef(null);
  const productPieInstance = useRef(null);
  const regionBarInstance = useRef(null);

  // ---------- helpers ----------
  // '2025-01-20' -> '01/20'
  const formatDateLabel = (iso) => {
    const d = new Date(`${iso}T00:00:00`);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${mm}/${dd}`;
  };

  // 최신 날짜가 오른쪽이 되도록 오름차순 정렬 + 날짜 라벨 적용
  const normalizeDaily = (daily) => {
    const pairs = (daily.labels || []).map((iso, i) => ({ iso, value: daily.data?.[i] ?? 0 }));
    pairs.sort((a, b) => (a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : 0));
    return {
      labels: pairs.map(p => formatDateLabel(p.iso)),
      data: pairs.map(p => p.value),
    };
  };

  // 차트 인스턴스 정리 (누락되었던 부분)
  const destroyCharts = () => {
    if (productPieInstance.current) {
      productPieInstance.current.destroy();
      productPieInstance.current = null;
    }
    if (regionBarInstance.current) {
      regionBarInstance.current.destroy();
      regionBarInstance.current = null;
    }
  };

  // 분포/일일 한 번에 새로고침
  const refreshCharts = async (categoryId) => {
    const [dist, daily] = await Promise.all([
      getDistribution(categoryId).catch(() => ({ labels: [], data: [] })),
      getDaily(7, categoryId).catch(() => ({ labels: [], data: [] })),
    ]);
    setPieData(dist || { labels: [], data: [] });
    setDailyData(normalizeDaily(daily || { labels: [], data: [] }));
  };

  // ---------- 초기 로딩 ----------
  useEffect(() => {
    (async () => {
      // 요약/최근
      try { setSummary(await getSummary()); }
      catch { setSummary({ totalAnswered: 15, correctCount: 12, accuracy: 0.8 }); }

      try { setAttempts(await getAttempts(20)); }
      catch {
        const now = new Date().toISOString();
        setAttempts([
          { id: 1, quiz_title: '샘플 문제 1', correct: true, answered_at: now },
          { id: 2, quiz_title: '샘플 문제 2', correct: false, answered_at: now },
          { id: 3, quiz_title: '샘플 문제 3', correct: true, answered_at: now },
        ]);
      }

      // 카테고리: ‘의료 이미지’ 루트의 자식만 노출
      let all = [];
      try { all = await fetchCategories(); } catch {}
      const roots = all.filter(c => c.parent_id == null);
      const medicalRoot = roots.find(r => r.category_name === '의료 이미지') || roots[0] || null;
      const children = medicalRoot ? all.filter(c => c.parent_id === medicalRoot.category_id) : [];
      setCategories(children);

      // 기본 선택: X-ray 우선, 없으면 첫 항목, 없으면 전체(null)
      const defaultCat = children.find(c => c.category_name === 'X-ray') || children[0] || null;
      const cid = defaultCat?.category_id ?? null;
      setSelectedCategory(cid);

      await refreshCharts(cid);
    })();

    // 네비게이션 숨김 효과
    let lastScrollTop = 0;
    const onScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (!navbar) return;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      navbar.style.transform = scrollTop > lastScrollTop && scrollTop > 100 ? 'translateY(-100%)' : 'translateY(0)';
      lastScrollTop = scrollTop;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ---------- 카테고리 변경 시 재조회 ----------
  useEffect(() => { refreshCharts(selectedCategory); }, [selectedCategory]);

  // ---------- 차트 렌더링 ----------
  useEffect(() => {
    const Chart = window.Chart;
    if (!Chart) return;

    const hasPie = pieData.labels?.length && pieData.labels.length === pieData.data?.length;
    const hasDaily = dailyData.labels?.length && dailyData.labels.length === dailyData.data?.length;

    // 도넛
    if (productPieRef.current) {
      if (productPieInstance.current) productPieInstance.current.destroy();
      productPieInstance.current = new Chart(productPieRef.current, {
        type: 'doughnut',
        data: {
          labels: hasPie ? pieData.labels : [],
          datasets: [{
            data: hasPie ? pieData.data : [],
            backgroundColor: ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#5856D6', '#AF52DE'],
            borderWidth: 0, hoverBorderWidth: 2, hoverBorderColor: '#fff'
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: true, aspectRatio: 16/9, cutout: '60%',
          plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, color: '#1D1D1F' } } }
        }
      });
    }

    // 막대
    if (regionBarRef.current) {
      if (regionBarInstance.current) regionBarInstance.current.destroy();
      regionBarInstance.current = new Chart(regionBarRef.current, {
        type: 'bar',
        data: {
          labels: hasDaily ? dailyData.labels : [],
          datasets: [{
            label: '문제수',
            data: hasDaily ? dailyData.data : [],
            backgroundColor: '#007AFF', borderRadius: 7, borderSkipped: false
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: true, aspectRatio: 16/9,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#86868B' } },
            y: { beginAtZero: true, grid: { color: 'rgba(134,134,139,0.2)' }, ticks: { color: '#86868B' } }
          }
        }
      });
    }

    // cleanup
    return () => destroyCharts();
  }, [pieData, dailyData]);

  return (
    <>
      {/* 네비게이션 바 */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <div className="nav-logo">
              <i className="fas fa-chart-line"></i>
              <span className="nav-title">의료 데이터 분석 및 학습 자동화</span>
            </div>
            <div className="nav-links">
              <a href="#dashboard" className="nav-link active">대시보드</a>
              <a href="#charts" className="nav-link">차트</a>
            </div>
          </div>
          <div className="nav-right">
            <button className="nav-home-btn" onClick={onBackToMain} aria-label="메인으로">
              <i className="fas fa-home"></i>
              <span>메인으로</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="main-content">
        {/* 히어로 */}
        <section className="hero-section">
          <div className="hero-container">
            <h1 className="hero-title">결과 분석</h1>
            <p className="hero-subtitle">학습자의 풀이패턴과 정답률을 알아보세요!</p>
          </div>
        </section>

        {/* 요약 카드 */}
        <section className="stats-section">
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon"><i className="fas fa-list-ol"></i></div>
              <div className="stat-info">
                <h3 className="stat-value">{summary ? summary.totalAnswered : 0}</h3>
                <p className="stat-label">총 풀이수</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
              <div className="stat-info">
                <h3 className="stat-value">{summary ? summary.correctCount : 0}</h3>
                <p className="stat-label">정답수</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="fas fa-chart-pie"></i></div>
              <div className="stat-info">
                <h3 className="stat-value">{summary ? `${(summary.accuracy * 100).toFixed(1)}%` : '0%'}</h3>
                <p className="stat-label">정확도</p>
              </div>
            </div>
          </div>
        </section>

        {/* 최근 풀이 테이블 */}
        <section className="data-section">
          <div className="data-container">
            <div className="section-header"><h2>최근 풀이</h2></div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr><th>시간</th><th>문제</th><th>결과</th></tr>
                </thead>
                <tbody>
                  {attempts.map((a, idx) => (
                    <tr key={a.id || idx}>
                      <td>{String(a.answered_at).replace('T', ' ').slice(0, 16)}</td>
                      <td>{a.quiz_title}</td>
                      <td>{a.correct ? 'O' : 'X'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 차트 섹션 */}
        <section className="charts-section" id="charts">
          <div className="charts-container">
            <div className="section-header" style={{ gap: 16 }}>
              <h2>문제풀이 및 학습량 분석 차트</h2>
              <p>본인의 문제 풀이경향과 약점을 파악하세요!</p>

              {/* 카테고리 드롭다운 */}
              <div style={{ marginLeft: 'auto' }}>
                <label style={{ fontSize: 14, color: '#666', marginRight: 8 }}>카테고리</label>
                <select
                  value={selectedCategory ?? ''}
                  onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                  style={{ padding: '6px 10px', borderRadius: 8 }}
                >
                  <option value="">전체</option>
                  {categories.map(c => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.category_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="charts-grid">
              {/* 문제풀이 비율 */}
              <div className="chart-card">
                <div className="chart-header"><h3>문제풀이 비율</h3></div>
                <div className="chart-content"><canvas ref={productPieRef} /></div>
              </div>

              {/* 일일 학습량 */}
              <div className="chart-card">
                <div className="chart-header"><h3>일일 학습량</h3></div>
                <div className="chart-content"><canvas ref={regionBarRef} /></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Dashboard;
