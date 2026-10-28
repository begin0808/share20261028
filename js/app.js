/**
 * ANTIGRAVITY APPLICATION CONTROLLER
 * 3D 互動校園研習分享會 (雙模式：演講簡報 + 專題手冊)
 */
import { slidesData } from './slides-data.js';
import { renderOverviewPage } from './pages/overview.js';
import { renderPrefacePage } from './pages/preface.js';
import { renderCampusTourPage } from './pages/campus-tour.js';
import { renderIslandsPage } from './pages/islands.js';
import { renderCreativePage } from './pages/creative.js';
import { renderPitfallsPage } from './pages/pitfalls.js';
import { renderToolboxPage } from './pages/toolbox.js';

import { initPresenterTimer } from './widgets/presenter-timer.js';
import { initMetaphorLab } from './widgets/metaphor-lab.js';
import { renderStyleExplorer } from './widgets/style-explorer.js';

// Application State
const state = {
  mode: 'reader', // 'slides' or 'reader'
  currentRoute: 'overview',
  currentSlideIndex: 0,
  isNotesOpen: false,
  soundEnabled: true
};

// Web Audio Soft Wooden Click
let audioCtx = null;
function playWoodClick() {
  if (!state.soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.045);
  } catch (e) {
    // Ignore audio context error
  }
}

// Router & Page Rendering
const routes = {
  'overview': renderOverviewPage,
  'preface': renderPrefacePage,
  'campus-tour': renderCampusTourPage,
  'islands': renderIslandsPage,
  'creative-extensions': renderCreativePage,
  'pitfalls-costs': renderPitfallsPage,
  'toolbox': renderToolboxPage
};

function handleRoute() {
  const hash = window.location.hash.replace('#/', '') || 'overview';
  state.currentRoute = routes[hash] ? hash : 'overview';

  // Update Navigation Tab Active State
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-route') === state.currentRoute);
  });

  // Render Page Content
  const mainView = document.getElementById('mainPageView');
  if (mainView && routes[state.currentRoute]) {
    mainView.innerHTML = routes[state.currentRoute]();

    // Re-init special widgets if needed on specific pages
    if (state.currentRoute === 'creative-extensions') {
      initMetaphorLab();
      renderStyleExplorer('styleExplorerContainer');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Slide Mode Controller
function updateSlideView() {
  const slide = slidesData[state.currentSlideIndex];
  if (!slide) return;

  const frame = document.getElementById('slideFrame');
  const catPill = document.getElementById('slideCatPill');
  const counterBadge = document.getElementById('slideCounterBadge');
  const titleEl = document.getElementById('slideTitle');
  const subTitleEl = document.getElementById('slideSubtitle');
  const bodyEl = document.getElementById('slideBody');
  const notesText = document.getElementById('slideNotesText');
  const progressFill = document.getElementById('slideProgressFill');

  if (catPill) catPill.innerText = slide.category;
  if (counterBadge) counterBadge.innerText = `Slide ${slide.id} / ${slidesData.length}`;
  if (titleEl) titleEl.innerText = slide.title;
  if (subTitleEl) {
    subTitleEl.innerText = slide.subtitle || "";
    subTitleEl.style.display = slide.subtitle ? "block" : "none";
  }
  if (bodyEl) bodyEl.innerHTML = slide.contentHtml;
  if (notesText) notesText.innerText = slide.speakerNotes || "（本頁無特別備忘錄）";

  // Update progress bar
  if (progressFill) {
    const pct = ((state.currentSlideIndex + 1) / slidesData.length) * 100;
    progressFill.style.width = `${pct}%`;
  }

  // Update thumb cards in drawer
  document.querySelectorAll('.slide-thumb-card').forEach((card, idx) => {
    card.classList.toggle('active', idx === state.currentSlideIndex);
  });

  // Re-animate frame
  if (frame) {
    frame.classList.remove('toy-pop');
    void frame.offsetWidth;
    frame.classList.add('toy-pop');
  }
}

function nextSlide() {
  if (state.currentSlideIndex < slidesData.length - 1) {
    state.currentSlideIndex++;
    updateSlideView();
    playWoodClick();
  }
}

function prevSlide() {
  if (state.currentSlideIndex > 0) {
    state.currentSlideIndex--;
    updateSlideView();
    playWoodClick();
  }
}

function firstSlide() {
  if (state.currentSlideIndex !== 0) {
    state.currentSlideIndex = 0;
    updateSlideView();
    playWoodClick();
  }
}

function lastSlide() {
  if (state.currentSlideIndex !== slidesData.length - 1) {
    state.currentSlideIndex = slidesData.length - 1;
    updateSlideView();
    playWoodClick();
  }
}

function jumpToSlide(index) {
  if (index >= 0 && index < slidesData.length) {
    state.currentSlideIndex = index;
    updateSlideView();
    closeSlideDrawer();
    playWoodClick();
  }
}

// Mode Switcher
function setMode(newMode) {
  state.mode = newMode;
  playWoodClick();

  document.body.classList.toggle('mode-slides', state.mode === 'slides');
  document.getElementById('btnModeReader')?.classList.toggle('active', state.mode === 'reader');
  document.getElementById('btnModeSlides')?.classList.toggle('active', state.mode === 'slides');

  if (state.mode === 'slides') {
    updateSlideView();
    window.scrollTo({ top: 0 });
  } else {
    handleRoute();
  }
}

// Drawer Controls
function openSlideDrawer() {
  const overlay = document.getElementById('slideDrawerOverlay');
  if (overlay) overlay.classList.add('open');
}

function closeSlideDrawer() {
  const overlay = document.getElementById('slideDrawerOverlay');
  if (overlay) overlay.classList.remove('open');
}

function toggleNotesDrawer() {
  state.isNotesOpen = !state.isNotesOpen;
  document.getElementById('slideNotesDrawer')?.classList.toggle('open', state.isNotesOpen);
  playWoodClick();
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
  playWoodClick();
}

// Prompt Tabs on Toolbox Page
window.switchPromptTab = function(tabName) {
  const contentMap = {
    'prompt-stage': `
      <div class="prompt-box">
        <div class="prompt-box-header">
          <span class="prompt-box-title">🪜 分階段推進版提示詞：階段 0～4（循序推進架構）</span>
          <button class="prompt-copy-btn" onclick="navigator.clipboard.writeText(this.closest('.prompt-box').querySelector('.prompt-box-content').innerText); this.innerText='已複製！'; setTimeout(()=>this.innerText='複製提示詞', 2000);">複製提示詞</button>
        </div>
        <div class="prompt-box-content">【階段 0｜讀資料、先不寫程式】
資料夾 D:\\School3D 裡有我們學校的校園平面圖 campus-map.jpg 和教室配置表 classrooms.png。
我想做一個 3D 校園導覽網站。請先不要寫程式，只要：
1. 列出平面圖上所有建物、運動場地與它們的大概位置；
2. 把配置表整理成「建物 → 樓層 → 教室（依順序）」的清單；
3. 比對兩張圖的方向，說明配置表每一列的左右各對應實際的哪個方位；
4. 列出你不確定、需要我補充的資料。

【階段 1｜可旋轉的 3D 鳥瞰校園（MVP）】
請用 three.js 做第一版：純前端靜態網站，直接雙擊 index.html 就能開（three.js 用 import map 從 CDN 載入，平面圖轉成 base64 貼圖）。
- 平面圖鋪成地面，依平面圖描繪各建物並擠出成 3D 量體，樓高每層 3.6 公尺；比例尺用 400 公尺田徑場推算。
- 建物名稱標籤；點建物顯示名稱與介紹；可旋轉、縮放、平移；手機也能用。
- 建物資料（名稱、位置、樓層數、介紹）放在獨立的資料檔 js/data/campus-data.js。
完成後請用瀏覽器截圖給我確認。

【階段 2｜樓層與教室】
請把教室配置表做成獨立的資料檔 js/data/rooms-data.js（每學年只改這個檔）：
- 點建物時，右側面板顯示樓層配置表，顏色比照原配置圖（高一綠、高二藍綠、高三黃……）。
- 樓層切換（全棟／各樓層／地下室）：隱藏上方樓層，依資料自動產生該層每間教室的彩色方塊與名稱，寬度照配置表格子比例，並保留走廊。
- 教室排列方向：配置圖上方是南方，所以正德樓由左到右是由東往西。

【階段 3｜搜尋、路線與漫遊】
請加入：
1. 搜尋框：可搜尋班級號碼、處室、建物，選擇後鏡頭飛過去，切到該樓層並標示教室。
2. 路線規劃：依平面圖上的道路建立步行路網，用 A* 演算法找最短路線，畫出動態箭頭，顯示距離、步行時間（每秒 1.3 公尺）、轉彎指示。
3. 第一人稱漫遊：WASD、滑鼠拖曳轉頭、點地面走過去、手機虛擬搖桿，建物要有碰撞；可沿規劃好的路線自動行走。
4. 小地圖：顯示目前位置與視角，點擊可移動。

【階段 4｜導覽、美化與驗證】
請加入：
1. 精選導覽路線：新生報到（校門→行政大樓→教務處→班級教室→健康中心→操場），逐站飛行並顯示解說，可自動播放。
2. 依平面圖上的樹冠位置自動產生 3D 樹木（用 InstancedMesh）；校外加上淡色街廓當背景。
3. 白天／黃昏／夜晚（夜晚窗戶亮燈）、省電模式（給舊電腦與手機）。
4. 用無頭瀏覽器在桌機與手機尺寸各截圖檢查，修正所有報錯。</div>
      </div>
    `,
    'prompt-campus': `
      <!-- 範例一：全新 3D 校園導覽提示詞 -->
      <div class="prompt-box">
        <div class="prompt-box-header">
          <span class="prompt-box-title">🏫 【範例一】3D 校園導覽專用提示詞（OO國中小版）</span>
          <button class="prompt-copy-btn" onclick="navigator.clipboard.writeText(this.closest('.prompt-box').querySelector('.prompt-box-content').innerText); this.innerText='已複製！'; setTimeout(()=>this.innerText='複製提示詞', 2000);">複製提示詞</button>
        </div>
        <div class="prompt-box-content">請研究並參考「南大附中3D校園導覽」（https://begin0808.github.io/3Dtntcsh/）的設計概念與互動架構，為我製作一個全新的「OO國中小 3D 校園導覽網站」。
資料來源：
OO國中小網站：https://www.OOO.edu.tw/
校園平面圖：campus-map.jpg（方位：上方為北）
班級教室配置表：classrooms-115.png（115學年度）
建模與配置校正補充說明：
方位校對： classrooms-115.png 配置圖上方為南方，請注意與平面圖的方向轉換對齊。
建物樓層： 圖書館為 4 層樓、學生宿舍名稱改為書庫，書庫為 5 層樓。
尺度參照： 400 公尺田徑場可作為整體校園空間與建物的比例尺依據。</div>
      </div>

      <!-- 範例二：通用版 3D 校園導覽全功能一次完成提示詞 -->
      <div class="prompt-box" style="margin-top: 24px;">
        <div class="prompt-box-header">
          <span class="prompt-box-title">⚡ 【範例二】通用版 3D 校園導覽一次完成提示詞（全功能規範）</span>
          <button class="prompt-copy-btn" onclick="navigator.clipboard.writeText(this.closest('.prompt-box').querySelector('.prompt-box-content').innerText); this.innerText='已複製！'; setTimeout(()=>this.innerText='複製提示詞', 2000);">複製提示詞</button>
        </div>
        <div class="prompt-box-content">請幫我製作「○○高中 3D 校園導覽網站」。
【資料】都在資料夾 D:\\School3D ：
- 校園平面圖：campus-map.jpg （上方為北）
- 班級教室配置表：classrooms-115.png （115 學年度）
- 補充：配置圖上方是南方；圖書館 4 層、宿舍 5 層；「畜牧館」＝「畜產館」，以後者為準；400 公尺田徑場可當比例尺
所有開發檔案都放在這個資料夾，不要動到其他檔案。
【技術要求】
1. 使用 three.js，做成純前端靜態網站，不需要後端與資料庫。
2. 直接雙擊 index.html 就要能開啟：three.js 用 import map 從 CDN 載入，平面圖轉成 base64 內嵌當貼圖。
3. 資料與程式分開：建物位置、教室配置、步行路網、導覽路線各自獨立成資料檔；每學年只需修改教室配置檔。
【功能】
A. 鳥瞰：平面圖鋪成地面，依平面圖描繪各建物位置並擠出成 3D 量體（每層樓高 3.6 公尺），顯示建物名稱標籤，可旋轉縮放。標籤太擠時要自動避讓。
B. 點選建物：右側面板顯示介紹、樓層數、教室數，以及和原配置圖同顏色的樓層配置表。
C. 樓層切換：全棟／各樓層／地下室；選某層時隱藏上方樓層，依配置表自動產生該層教室方塊與名稱。
D. 搜尋：可搜尋班級號碼、處室、建物名稱，鏡頭飛過去並標示該教室。
E. 路線規劃：建立校園步道路網，用 A* 演算法找路線，顯示距離、步行時間與轉彎指示，並可沿路線第一人稱行走。
F. 第一人稱漫遊：WASD／方向鍵、滑鼠拖曳轉頭、點地面走過去、手機虛擬搖桿，建物要有碰撞。
G. 精選導覽路線、小地圖、白天／夜晚、省電模式、手機版介面。
H. 依平面圖上的樹冠自動產生 3D 樹木。
I. 學生宿舍等敏感區域只呈現外觀。
【工作方式】
1. 先閱讀圖片與文件，列出建物、樓層與方向判斷。
2. 完成後請用無頭瀏覽器實際開啟測試，截圖檢查並修正錯誤後交付。</div>
      </div>
    `,
    'prompt-island': `
      <!-- 範例一：OO高中社團群島（天空之城主題） -->
      <div class="prompt-box">
        <div class="prompt-box-header">
          <span class="prompt-box-title">🏝️ 【範例一】社團群島提示詞（OO高中天空之城主題、6 大類 50 個社團、微縮模型）</span>
          <button class="prompt-copy-btn" onclick="navigator.clipboard.writeText(this.closest('.prompt-box').querySelector('.prompt-box-content').innerText); this.innerText='已複製！'; setTimeout(()=>this.innerText='複製提示詞', 2000);">複製提示詞</button>
        </div>
        <div class="prompt-box-content">請研究與參考「南大附中探索群島」（https://tntcshisland.vercel.app/）的網站設計概念，
為【OO高中】製作學生社團即時資訊互動網站：「OO高中社團群島」。
整體視覺採用「天空之城」主題，由多座漂浮於雲海中的 3D 浮空島所構成，呈現溫暖且具手作質感的微縮模型風格。網站需整合資料夾中的115社團檔案： 6 大類 50 個社團資料，提供流暢的 3D 互動探索與即時動態展示體驗。</div>
      </div>

      <!-- 範例二：通用學程探索群島提示詞 -->
      <div class="prompt-box" style="margin-top: 24px;">
        <div class="prompt-box-header">
          <span class="prompt-box-title">🏰 【範例二】通用學程探索群島提示詞（Vite + React + Three.js + R3F）</span>
          <button class="prompt-copy-btn" onclick="navigator.clipboard.writeText(this.closest('.prompt-box').querySelector('.prompt-box-content').innerText); this.innerText='已複製！'; setTimeout(()=>this.innerText='複製提示詞', 2000);">複製提示詞</button>
        </div>
        <div class="prompt-box-content">請幫我做一個學校的 3D 互動介紹網站，名稱是「○○高中探索群島」。
【樣子】由 10 座八角形小島組成的 3D 校園，中央是行政島，其餘每座島代表一個學程／科別，島和島之間用木拱橋相連。風格是溫暖的玩具模型城市（微縮模型感），所有建築、人物、動物都用程式畫的低多邊形造型，不使用外部 3D 模型檔。
【每座島】要有該科的學程大樓（三層樓以內，屋頂掛招牌）和正在上課的小人與道具（例如畜產科有乳牛綿羊、餐飲科有平底鍋、資訊科有電腦）。
【點選小島】鏡頭飛過去，面板顯示該科的介紹、特色、數據與近三年升學榜單。榜單姓名一律遮蔽，例如「李OO，國立臺灣科技大學」。
【資料來源】學校官網公開資料；三年榜單 PDF 放在 docs 資料夾。
【技術】Vite＋React＋Three.js（React Three Fiber），電腦和手機都要能用。
請先規劃網站架構、島嶼配置、開發步驟與 2～3 個網站名稱建議，確認後再動工。</div>
      </div>
    `,
    'prompt-maintain': `
      <div class="prompt-box">
        <div class="prompt-box-header">
          <span class="prompt-box-title">🔄 新學年維護與 Google 試算表串接提示詞</span>
          <button class="prompt-copy-btn" onclick="navigator.clipboard.writeText(this.closest('.prompt-box').querySelector('.prompt-box-content').innerText); this.innerText='已複製！'; setTimeout(()=>this.innerText='複製提示詞', 2000);">複製提示詞</button>
        </div>
        <div class="prompt-box-content">【交給行政同仁用試算表維護】
請讓教室資料也可以從 Google 試算表讀取：
1. 試算表「發布到網路」成 CSV，欄位為：building, floor, order, name, width。
2. 網站載入時若能連線讀到試算表 CSV，就優先使用試算表的最新教室資料；讀取失敗或離線時，則自動退回沿用原本的本地資料檔 rooms-data.js。
3. 請在 README.PDF 寫出給行政同仁看的繁體中文操作步驟，讓非資訊背景的教務同仁每年也能自主維護更新。</div>
      </div>
    `
  };

  const container = document.getElementById('promptTabContent');
  if (container && contentMap[tabName]) {
    container.innerHTML = contentMap[tabName];
  }
};

// Global Exposure for HTML bindings
window.enterSlideMode = () => setMode('slides');
window.enterReaderMode = () => setMode('reader');
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.firstSlide = firstSlide;
window.lastSlide = lastSlide;
window.jumpToSlide = jumpToSlide;
window.openSlideDrawer = openSlideDrawer;
window.closeSlideDrawer = closeSlideDrawer;
window.toggleNotesDrawer = toggleNotesDrawer;
window.toggleFullScreen = toggleFullScreen;

// Init Application
document.addEventListener('DOMContentLoaded', () => {
  // Navigation clicks
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const route = e.currentTarget.getAttribute('data-route');
      window.location.hash = `#/${route}`;
      if (state.mode === 'slides') setMode('reader');
      playWoodClick();
    });
  });

  // Mode toggles
  document.getElementById('btnModeReader')?.addEventListener('click', () => setMode('reader'));
  document.getElementById('btnModeSlides')?.addEventListener('click', () => setMode('slides'));

  // Slide Drawer population
  const drawerGrid = document.getElementById('slideDrawerGrid');
  if (drawerGrid) {
    drawerGrid.innerHTML = slidesData.map((s, idx) => `
      <div class="slide-thumb-card" onclick="window.jumpToSlide(${idx})">
        <span class="slide-thumb-num">#${s.id} ${s.category}</span>
        <div class="slide-thumb-title">${s.title}</div>
      </div>
    `).join('');
  }

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (state.mode === 'slides') {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        firstSlide();
      } else if (e.key === 'End') {
        e.preventDefault();
        lastSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullScreen();
      } else if (e.key === 'n' || e.key === 'N') {
        toggleNotesDrawer();
      } else if (e.key === 'Escape') {
        closeSlideDrawer();
        if (state.isNotesOpen) toggleNotesDrawer();
      }
    }
  });

  // Listen for hash change
  window.addEventListener('hashchange', handleRoute);

  // Presenter Clock
  initPresenterTimer();

  // Initial Route Check
  handleRoute();
});
