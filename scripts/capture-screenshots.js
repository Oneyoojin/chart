const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 스크린샷 저장 폴더
const screenshotsDir = path.join(__dirname, '../screenshots');

// 폴더가 없으면 생성
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Storybook 스토리 목록
const stories = [
  { id: 'pages-login--default', name: 'login' },
  { id: 'pages-signup--default', name: 'signup' },
  { id: 'pages-startpage--default', name: 'start-page' },
  { id: 'pages-quiz--default', name: 'quiz' },
  { id: 'pages-dashboard--default', name: 'dashboard' },
  { id: 'pages-tasks--default', name: 'tasks' },
];

async function captureScreenshots() {
  console.log('🚀 Starting screenshot capture...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  
  // 뷰포트 설정 (데스크톱 크기)
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  for (const story of stories) {
    try {
      console.log(`📸 Capturing ${story.name}...`);
      
      // Storybook iframe URL로 이동
      const url = `http://localhost:6006/iframe.html?id=${story.id}&viewMode=story`;
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // 페이지 로딩 대기 (애니메이션 등)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 대시보드의 경우 스크롤하여 표가 보이도록 함
      if (story.name === 'dashboard') {
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await page.evaluate(() => {
          window.scrollTo(0, 0);
        });
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // 전체 페이지 스크린샷
      const screenshotPath = path.join(screenshotsDir, `${story.name}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });
      
      console.log(`   ✅ Saved: ${screenshotPath}\n`);
    } catch (error) {
      console.error(`   ❌ Error capturing ${story.name}:`, error.message, '\n');
    }
  }

  await browser.close();
  console.log('🎉 Screenshot capture complete!');
  console.log(`📁 Screenshots saved in: ${screenshotsDir}`);
}

// 스크립트 실행
captureScreenshots().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

