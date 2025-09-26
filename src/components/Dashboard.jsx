import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/dashboard.css';

const Dashboard = () => {
  // 상태
  const [salesData, setSalesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 폼 상태
  const [formData, setFormData] = useState({
    product_name: '',
    category: '',
    price: '',
    quantity: '',
    sale_date: '',
    region: ''
  });

  // 통계 애니메이션용 상태
  const [displayTotalSales, setDisplayTotalSales] = useState(0);
  const [displayTotalOrders, setDisplayTotalOrders] = useState(0);
  const [displayTotalProducts, setDisplayTotalProducts] = useState(0);
  const [displayTotalCustomers, setDisplayTotalCustomers] = useState(0);

  // 차트 refs
  const salesTrendRef = useRef(null);
  const productPieRef = useRef(null);
  const regionBarRef = useRef(null);
  const salesTrendInstance = useRef(null);
  const productPieInstance = useRef(null);
  const regionBarInstance = useRef(null);

  // 데이터 로드
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadSalesData();
      } catch (error) {
        console.error('앱 초기화 중 오류 발생:', error);
        showNotification('데이터 로딩 중 오류가 발생했습니다.', 'error');
      }
    };
    initializeApp();
  }, []);

  // 통계 계산 및 애니메이션
  const statistics = useMemo(() => {
    const totalSales = salesData.reduce((sum, item) => sum + (item.total_amount || 0), 0);
    const totalOrders = salesData.length;
    const uniqueProducts = new Set(salesData.map(item => item.product_name)).size;
    const uniqueCustomers = Math.floor(totalOrders * 0.7);
    return { totalSales, totalOrders, uniqueProducts, uniqueCustomers };
  }, [salesData]);

  useEffect(() => {
    animateValue(0, statistics.totalSales, 1500, v => setDisplayTotalSales(v));
    animateValue(0, statistics.totalOrders, 1200, v => setDisplayTotalOrders(v));
    animateValue(0, statistics.uniqueProducts, 1000, v => setDisplayTotalProducts(v));
    animateValue(0, statistics.uniqueCustomers, 1800, v => setDisplayTotalCustomers(v));
  }, [statistics]);

  // 차트 초기화/업데이트
  useEffect(() => {
    if (!salesData || salesData.length === 0) {
      destroyCharts();
      return;
    }
    const ChartGlobal = window.Chart;
    if (!ChartGlobal) {
      // Chart.js가 전역으로 로드되지 않은 경우 무시
      return;
    }

    // 월별 데이터
    const monthly = aggregateMonthlyData(salesData);
    if (salesTrendRef.current) {
      if (salesTrendInstance.current) salesTrendInstance.current.destroy();
      salesTrendInstance.current = new ChartGlobal(salesTrendRef.current, {
        type: 'line',
        data: {
          labels: monthly.labels,
          datasets: [{
            label: '매출 (원)',
            data: monthly.data,
            borderColor: '#007AFF',
            backgroundColor: 'rgba(0, 122, 255, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#007AFF',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 16/9,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#86868B' } },
            y: {
              grid: { color: 'rgba(134, 134, 139, 0.2)' },
              ticks: {
                color: '#86868B',
                callback: value => '₩' + (Number(value) / 1000000).toFixed(0) + 'M'
              }
            }
          }
        }
      });
    }

    // 제품별 데이터
    const product = aggregateProductData(salesData);
    if (productPieRef.current) {
      if (productPieInstance.current) productPieInstance.current.destroy();
      productPieInstance.current = new ChartGlobal(productPieRef.current, {
        type: 'doughnut',
        data: {
          labels: product.labels,
          datasets: [{
            data: product.data,
            backgroundColor: ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#5856D6', '#AF52DE'],
            borderWidth: 0,
            hoverBorderWidth: 2,
            hoverBorderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 16/9,
          cutout: '60%',
          plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, color: '#1D1D1F' } } }
        }
      });
    }

    // 지역별 데이터
    const region = aggregateRegionData(salesData);
    if (regionBarRef.current) {
      if (regionBarInstance.current) regionBarInstance.current.destroy();
      regionBarInstance.current = new ChartGlobal(regionBarRef.current, {
        type: 'bar',
        data: {
          labels: region.labels,
          datasets: [{
            label: '판매량',
            data: region.data,
            backgroundColor: '#007AFF',
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 16/9,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#86868B' } },
            y: { grid: { color: 'rgba(134,134,139,0.2)' }, ticks: { color: '#86868B' } }
          }
        }
      });
    }

    return destroyCharts;
  }, [salesData]);

  const destroyCharts = () => {
    if (salesTrendInstance.current) { salesTrendInstance.current.destroy(); salesTrendInstance.current = null; }
    if (productPieInstance.current) { productPieInstance.current.destroy(); productPieInstance.current = null; }
    if (regionBarInstance.current) { regionBarInstance.current.destroy(); regionBarInstance.current = null; }
  };

  // 외부 스타일(알림, 배지 애니메이션) 주입
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInFromRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      @keyframes slideOutToRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
      .category-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; color: white; }
      .category-iphone { background: #007AFF; }
      .category-ipad { background: #34C759; }
      .category-mac { background: #FF9500; }
      .category-applewatch { background: #FF3B30; }
      .category-airpods { background: #5856D6; }
      .category-accessories { background: #AF52DE; }
      .navbar { transition: transform 0.3s ease; }
    `;
    document.head.appendChild(style);
    return () => { if (style.parentNode) style.parentNode.removeChild(style); };
  }, []);

  // 네비게이션 스크롤 효과
  useEffect(() => {
    let lastScrollTop = 0;
    const onScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (!navbar) return;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
      lastScrollTop = scrollTop;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 데이터 로드 함수 (백엔드 연결 전: 더미데이터 사용)
  const loadSalesData = async () => {
    const categories = ['iPhone', 'iPad', 'Mac', 'Apple Watch', 'AirPods', 'Accessories'];
    const regions = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종'];
    const mock = Array.from({ length: 48 }).map((_, i) => {
      const category = categories[i % categories.length];
      const quantity = Math.floor(Math.random() * 9) + 1;
      const price = [990000, 1290000, 1990000, 459000, 199000][i % 5];
      const date = new Date();
      date.setMonth(date.getMonth() - (i % 12));
      return {
        id: `mock-${i + 1}`,
        product_name: `${category} ${i + 1}`,
        category,
        price,
        quantity,
        sale_date: date.toISOString().split('T')[0],
        region: regions[i % regions.length],
        total_amount: price * quantity
      };
    });
    setSalesData(mock);
    setCurrentPage(1);
  };

  // 페이지 데이터
  const pageData = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    // 간단한 클라이언트 필터링 데모
    const filtered = searchTerm
      ? salesData.filter(item =>
          [item.product_name, item.category, item.region]
            .filter(Boolean)
            .some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : salesData;
    const slice = filtered.slice(startIndex, endIndex);
    return { slice, filteredTotal: filtered.length };
  }, [salesData, currentPage, searchTerm]);

  // 페이지네이션 버튼
  const paginationButtons = useMemo(() => {
    const maxVisiblePages = 5;
    const pages = Math.max(1, Math.ceil(pageData.filteredTotal / 10));
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pages, startPage + maxVisiblePages - 1);
    return { startPage, endPage, pages };
  }, [currentPage, pageData.filteredTotal]);

  // 모달 열기/닫기
  const openModal = (id = null) => {
    const editMode = !!id;
    setIsEditMode(editMode);
    setEditingId(id);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
    if (editMode && id) {
      const item = salesData.find(x => x.id === id);
      if (item) {
        setFormData({
          product_name: item.product_name || '',
          category: item.category || '',
          price: item.price ?? '',
          quantity: item.quantity ?? '',
          sale_date: item.sale_date || new Date().toISOString().split('T')[0],
          region: item.region || ''
        });
      }
    } else {
      setFormData({
        product_name: '',
        category: '',
        price: '',
        quantity: '',
        sale_date: new Date().toISOString().split('T')[0],
        region: ''
      });
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = '';
    setIsEditMode(false);
    setEditingId(null);
  };

  // 폼 제출
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      product_name: formData.product_name,
      category: formData.category,
      price: parseInt(String(formData.price)) || 0,
      quantity: parseInt(String(formData.quantity)) || 0,
      sale_date: formData.sale_date,
      region: formData.region,
      total_amount: (parseInt(String(formData.price)) || 0) * (parseInt(String(formData.quantity)) || 0)
    };
    try {
      let response;
      if (isEditMode && editingId) {
        response = await fetch(`tables/sales/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch('tables/sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      if (response.ok) {
        closeModal();
        await loadSalesData();
        showNotification(isEditMode ? '데이터가 수정되었습니다.' : '데이터가 추가되었습니다.');
      } else {
        throw new Error('서버 응답 오류');
      }
    } catch (error) {
      console.error('데이터 저장 실패:', error);
      showNotification('데이터 저장 중 오류가 발생했습니다.', 'error');
    }
  };

  const editData = (id) => openModal(id);

  const deleteData = async (id) => {
    // 간단 확인
    if (!window.confirm('정말로 이 데이터를 삭제하시겠습니까?')) return;
    try {
      const response = await fetch(`tables/sales/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await loadSalesData();
        showNotification('데이터가 삭제되었습니다.');
      } else {
        throw new Error('서버 응답 오류');
      }
    } catch (error) {
      console.error('데이터 삭제 실패:', error);
      showNotification('데이터 삭제 중 오류가 발생했습니다.', 'error');
    }
  };

  // 검색
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // 페이지 변경
  const changePage = (newPage) => {
    setCurrentPage(p => {
      const pages = paginationButtons.pages;
      if (newPage >= 1 && newPage <= pages) return newPage;
      return p;
    });
  };

  // 유틸
  const animateValue = (start, end, duration, setter) => {
    const startTime = performance.now();
    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeOut);
      setter(current);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  // 집계 함수들
  const aggregateMonthlyData = (data) => {
    const monthlyTotals = {};
    (data || []).forEach(item => {
      if (item && item.sale_date) {
        const date = new Date(item.sale_date);
        if (!isNaN(date)) {
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthlyTotals[key] = (monthlyTotals[key] || 0) + (item.total_amount || 0);
        }
      }
    });
    const sorted = Object.entries(monthlyTotals).sort(([a], [b]) => a.localeCompare(b));
    return {
      labels: sorted.map(([month]) => {
        const [year, monthNum] = month.split('-');
        return `${year}년 ${monthNum}월`;
      }),
      data: sorted.map(([, total]) => total)
    };
  };

  const aggregateProductData = (data) => {
    const categoryTotals = {};
    (data || []).forEach(item => {
      if (item && item.category) {
        categoryTotals[item.category] = (categoryTotals[item.category] || 0) + (item.quantity || 0);
      }
    });
    return { labels: Object.keys(categoryTotals), data: Object.values(categoryTotals) };
  };

  const aggregateRegionData = (data) => {
    const regionTotals = {};
    (data || []).forEach(item => {
      if (item && item.region) {
        regionTotals[item.region] = (regionTotals[item.region] || 0) + (item.quantity || 0);
      }
    });
    return { labels: Object.keys(regionTotals), data: Object.values(regionTotals) };
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; padding: 15px 20px; border-radius: 8px; color: white;
      background: ${type === 'error' ? '#FF3B30' : '#34C759'}; z-index: 3000;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2); animation: slideInFromRight 0.3s ease;`;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = 'slideOutToRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  return (
    <>
      {/* 네비게이션 바 */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <div className="nav-logo">
              <i className="fas fa-chart-line"></i>
              <span className="nav-title">Dashboard</span>
            </div>
            <div className="nav-links">
              <a href="#dashboard" className="nav-link active">대시보드</a>
              <a href="#data" className="nav-link">데이터</a>
              <a href="#charts" className="nav-link">차트</a>
              <a href="#analytics" className="nav-link">분석</a>
            </div>
          </div>
          <div className="nav-right">
            <button className="nav-search-btn" aria-label="검색">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="main-content">
        {/* 히어로 섹션 */}
        <section className="hero-section">
          <div className="hero-container">
            <h1 className="hero-title">데이터 분석 대시보드</h1>
            <p className="hero-subtitle">실시간 판매 데이터와 비즈니스 인사이트를 한눈에 확인하세요</p>
          </div>
        </section>

        {/* 통계 카드 섹션 */}
        <section className="stats-section">
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="stat-info">
                <h3 className="stat-value" id="total-sales">{`₩${displayTotalSales.toLocaleString()}`}</h3>
                <p className="stat-label">총 매출</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="stat-info">
                <h3 className="stat-value" id="total-orders">{displayTotalOrders.toLocaleString()}</h3>
                <p className="stat-label">총 주문</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-box"></i>
              </div>
              <div className="stat-info">
                <h3 className="stat-value" id="total-products">{displayTotalProducts}</h3>
                <p className="stat-label">상품 수</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info">
                <h3 className="stat-value" id="total-customers">{displayTotalCustomers.toLocaleString()}</h3>
                <p className="stat-label">고객 수</p>
              </div>
            </div>
          </div>
        </section>

        {/* 차트 섹션 */}
        <section className="charts-section" id="charts">
          <div className="charts-container">
            <div className="section-header">
              <h2>비즈니스 분석 차트</h2>
              <p>다양한 차트로 데이터를 시각화하여 비즈니스 트렌드를 파악하세요</p>
            </div>

            <div className="charts-grid">
              {/* 매출 트렌드 차트 */}
              <div className="chart-card large">
                <div className="chart-header">
                  <h3>월별 매출 트렌드</h3>
                  <div className="chart-controls">
                    <button className="chart-btn active" type="button">12개월</button>
                    <button className="chart-btn" type="button">6개월</button>
                    <button className="chart-btn" type="button">3개월</button>
                  </div>
                </div>
                <div className="chart-content">
                  <canvas id="salesTrendChart" ref={salesTrendRef}></canvas>
                </div>
              </div>

              {/* 제품별 판매 비율 */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>제품별 판매 비율</h3>
                </div>
                <div className="chart-content">
                  <canvas id="productPieChart" ref={productPieRef}></canvas>
                </div>
              </div>

              {/* 지역별 판매 현황 */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>지역별 판매 현황</h3>
                </div>
                <div className="chart-content">
                  <canvas id="regionBarChart" ref={regionBarRef}></canvas>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 데이터 테이블 섹션 */}
        <section className="data-section" id="data">
          <div className="data-container">
            <div className="section-header">
              <h2>판매 데이터</h2>
              <p>최근 판매 데이터를 테이블 형태로 확인하고 관리하세요</p>
            </div>

            {/* 테이블 컨트롤 */}
            <div className="table-controls">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  id="search-input"
                  placeholder="검색..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <button className="add-btn" id="add-data-btn" onClick={() => openModal()}>
                <i className="fas fa-plus"></i>
                데이터 추가
              </button>
            </div>

            {/* 데이터 테이블 */}
            <div className="table-wrapper">
              <table className="data-table" id="sales-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>제품명</th>
                    <th>카테고리</th>
                    <th>가격</th>
                    <th>수량</th>
                    <th>총 금액</th>
                    <th>판매일</th>
                    <th>지역</th>
                    <th>액션</th>
                  </tr>
                </thead>
                <tbody id="sales-table-body">
                  {pageData.slice.map(item => (
                    <tr key={item.id}>
                      <td>{item.id ? `${String(item.id).substring(0, 8)}...` : 'N/A'}</td>
                      <td><strong>{item.product_name}</strong></td>
                      <td>
                        <span className={`category-badge category-${(item.category || '').replace(/\s+/g, '').toLowerCase()}`}>
                          {item.category}
                        </span>
                      </td>
                      <td>{`₩${(item.price || 0).toLocaleString()}`}</td>
                      <td>{item.quantity || 0}</td>
                      <td><strong>{`₩${(item.total_amount || 0).toLocaleString()}`}</strong></td>
                      <td>{formatDate(item.sale_date)}</td>
                      <td>{item.region || 'N/A'}</td>
                      <td>
                        <button className="action-btn edit" onClick={() => editData(item.id)}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="action-btn delete" onClick={() => deleteData(item.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            <div className="pagination">
              <button className="pagination-btn" id="prev-btn" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <div className="pagination-numbers" id="pagination-numbers">
                {Array.from({ length: paginationButtons.endPage - paginationButtons.startPage + 1 }, (_, idx) => {
                  const page = paginationButtons.startPage + idx;
                  return (
                    <button
                      key={page}
                      className={`page-number ${page === currentPage ? 'active' : ''}`}
                      onClick={() => changePage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button className="pagination-btn" id="next-btn" disabled={currentPage === paginationButtons.pages} onClick={() => changePage(currentPage + 1)}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 모달 창 - 데이터 추가/편집 */}
      <div
        className={`modal ${modalOpen ? 'active' : ''}`}
        id="data-modal"
        onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h3 id="modal-title">{isEditMode ? '데이터 수정' : '데이터 추가'}</h3>
            <button className="modal-close" id="modal-close" onClick={closeModal} aria-label="모달 닫기">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <form className="modal-form" id="data-form" onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="product-name">제품명</label>
              <input
                type="text"
                id="product-name"
                name="product_name"
                required
                value={formData.product_name}
                onChange={e => setFormData({ ...formData, product_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">카테고리</label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">선택하세요</option>
                <option value="iPhone">iPhone</option>
                <option value="iPad">iPad</option>
                <option value="Mac">Mac</option>
                <option value="Apple Watch">Apple Watch</option>
                <option value="AirPods">AirPods</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">가격 (₩)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="quantity">수량</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  required
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="sale-date">판매일</label>
              <input
                type="date"
                id="sale-date"
                name="sale_date"
                required
                value={formData.sale_date}
                onChange={e => setFormData({ ...formData, sale_date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="region">지역</label>
              <select
                id="region"
                name="region"
                required
                value={formData.region}
                onChange={e => setFormData({ ...formData, region: e.target.value })}
              >
                <option value="">선택하세요</option>
                <option value="서울">서울</option>
                <option value="부산">부산</option>
                <option value="대구">대구</option>
                <option value="인천">인천</option>
                <option value="광주">광주</option>
                <option value="대전">대전</option>
                <option value="울산">울산</option>
                <option value="세종">세종</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" id="cancel-btn" onClick={closeModal}>취소</button>
              <button type="submit" className="btn-primary">저장</button>
            </div>
          </form>
        </div>
      </div>

    </>
  );
};

export default Dashboard;


