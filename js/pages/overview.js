/**
 * PAGE 00: 總覽與首頁 (Overview & Keynote Hub)
 * 移除主標題下方小標題，保留日期，加入分享人資訊與作品網站介紹
 */
export function renderOverviewPage() {
  return `
    <!-- 頂部 Hero 區塊 -->
    <div class="toy-card toy-card-accent" style="padding: 40px; margin-bottom: 28px; border: 3px solid #3C332A;">
      <div style="display: flex; gap: 36px; align-items: center; flex-wrap: wrap;">
        <div style="flex: 1.2; min-width: 320px;">
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;">
            <span class="toy-pill toy-pill-yellow">📅 2026 年 10 月 28 日（三）</span>
            <span class="toy-pill toy-pill-teal">🕗 晚上 8:00～9:30</span>
            <span class="toy-pill toy-pill-red">線上分享會</span>
          </div>
          <h1 style="font-size: 2.5rem; font-weight: 900; line-height: 1.25; margin-bottom: 0; color: var(--ink-primary);">
            用 AI 打造 3D 互動校園與教育應用
          </h1>
        </div>
        <div style="flex: 0.9; min-width: 280px; text-align: center;">
          <img src="assets/shot_islands.png" alt="南大附中探索群島 3D 實景" style="width: 100%; border-radius: 20px; border: 3px solid #3C332A; box-shadow: 0 10px 0 #3C332A; max-height: 340px; object-fit: cover;">
          <div style="margin-top: 10px; font-size: 0.88rem; font-weight: 700; color: var(--ink-secondary);">
            南大附中探索群島 3D 實景畫面
          </div>
        </div>
      </div>
    </div>

    <!-- 分享人與作品網站卡片 -->
    <div class="toy-card toy-card-teal" style="margin-bottom: 32px; border: 2.5px solid #3C332A; padding: 22px 28px;">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 52px; height: 52px; border-radius: 14px; background: var(--toy-teal); color: #FFF; font-weight: 900; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; border: 2px solid #3C332A; box-shadow: 0 3px 0 #3C332A;">
            👨‍🏫
          </div>
          <div>
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--ink-primary);">
              分享人：李佳恩老師 ｜ Studio0808 智造實驗室
            </div>
            <div style="font-size: 0.95rem; color: var(--ink-secondary); margin-top: 3px;">
              作品網站：<a href="https://begin0808.github.io/studio0808/" target="_blank" style="font-weight: 800; color: var(--toy-teal-dark); text-decoration: underline;">Studio0808 智造實驗室</a>
            </div>
          </div>
        </div>
        <div>
          <a href="https://begin0808.github.io/studio0808/" target="_blank" class="toy-btn toy-btn-teal" style="font-size: 0.92rem; padding: 8px 18px;">
            參觀作品網站 ↗
          </a>
        </div>
      </div>
    </div>

    <!-- 三大實戰作品卡片 (使用真實截圖) -->
    <div style="margin-bottom: 20px;">
      <span class="toy-pill toy-pill-teal">現場成果</span>
      <h2 style="font-size: 1.8rem; margin-top: 6px;">三大實作網站成果巡禮</h2>
      <p style="color: var(--ink-secondary); font-size: 1rem; margin-top: 4px;">
        所有專案皆在電腦與手機瀏覽器直接開啟，純前端無後端架構，可免費託管於 GitHub Pages 或 Vercel。
      </p>
    </div>

    <div class="showcase-grid">
      <!-- 作品 1: 南大附中 3D 校園導覽 -->
      <div class="project-card">
        <div class="project-thumb">
          <img src="assets/shot_campus.png" alt="南大附中 3D 校園導覽真實截圖">
          <span class="project-badge-tag" style="color: var(--toy-red-dark);">真實網站畫面</span>
        </div>
        <div class="project-content">
          <div class="project-title">南大附中 3D 校園導覽</div>
          <div class="project-desc">
            只用一張平面圖與一張 115 教室配置表做成！支援鳥瞰、樓層切換剖切、A* 步道路徑規劃與第一人稱漫遊防碰撞。
          </div>
          <div class="project-tags">
            <span class="project-tag">Three.js</span>
            <span class="project-tag">A* 演算法</span>
            <span class="project-tag">ExtrudeGeometry</span>
            <span class="project-tag">Google 試算表 CSV</span>
          </div>
          <div class="project-actions">
            <a href="https://begin0808.github.io/3Dtntcsh/" target="_blank" class="toy-btn toy-btn-primary" style="flex: 1;">
              實機開啟 ↗
            </a>
            <a href="#/campus-tour" class="toy-btn toy-btn-ghost">
              閱讀實戰筆記
            </a>
          </div>
        </div>
      </div>

      <!-- 作品 2: 南大附中探索群島 -->
      <div class="project-card">
        <div class="project-thumb">
          <img src="assets/shot_islands.png" alt="南大附中探索群島真實截圖">
          <span class="project-badge-tag" style="color: var(--toy-yellow-dark);">真實網站畫面</span>
        </div>
        <div class="project-content">
          <div class="project-title">南大附中探索群島</div>
          <div class="project-desc">
            十座八角形浮空小島以木拱橋相連！移軸微縮後製、真實日夜光影與即時天氣、官網 Big5 爬蟲與李OO個資遮蔽、找松鼠小遊戲。
          </div>
          <div class="project-tags">
            <span class="project-tag">React Three Fiber</span>
            <span class="project-tag">移軸微縮</span>
            <span class="project-tag">Open-Meteo 天氣</span>
            <span class="project-tag">Upstash Redis</span>
          </div>
          <div class="project-actions">
            <a href="https://tntcshisland.vercel.app/" target="_blank" class="toy-btn toy-btn-secondary" style="flex: 1;">
              登島探索 ↗
            </a>
            <a href="#/islands" class="toy-btn toy-btn-ghost">
              閱讀實戰筆記
            </a>
          </div>
        </div>
      </div>

      <!-- 作品 3: 全球動物現場 -->
      <div class="project-card">
        <div class="project-thumb">
          <img src="assets/shot_animalia.png" alt="全球動物現場真實截圖">
          <span class="project-badge-tag" style="color: var(--toy-teal-dark);">真實網站畫面</span>
        </div>
        <div class="project-content">
          <div class="project-title">全球動物現場 (Animalia Live)</div>
          <div class="project-desc">
            將地球上的野生動物生態結合 3D 空間視角，打造身歷其境的動物即時觀察與跨領域地理科學教育體驗。
          </div>
          <div class="project-tags">
            <span class="project-tag">環境生態</span>
            <span class="project-tag">即時視角</span>
            <span class="project-tag">地理空間</span>
            <span class="project-tag">跨域教育</span>
          </div>
          <div class="project-actions">
            <a href="https://animalia-live.vercel.app/" target="_blank" class="toy-btn toy-btn-teal" style="flex: 1;">
              實機開啟 ↗
            </a>
            <a href="#/creative-extensions" class="toy-btn toy-btn-ghost">
              延伸發想
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 研習架構地圖 -->
    <div class="toy-card toy-card-alt" style="margin-top: 36px; border: 2.5px solid #3C332A;">
      <h3 style="font-size: 1.35rem; margin-bottom: 12px; color: var(--ink-primary);">
        🗺️ 今晚分享會的五大核心章節
      </h3>
      <div class="grid-3" style="margin: 0; font-size: 0.95rem;">
        <div style="background: #FFF; padding: 16px; border-radius: 12px; border: 1.5px solid #E8DAC8;">
          <strong style="color: var(--toy-red-dark); display: block; margin-bottom: 4px;">01. 前言思維</strong>
          從「全球動物現場」4 萬人造訪談起！爆紅背後的原因分析、AI 時代的真實感反差與 IG 社群擴散心法。
        </div>
        <div style="background: #FFF; padding: 16px; border-radius: 12px; border: 1.5px solid #E8DAC8;">
          <strong style="color: var(--toy-yellow-dark); display: block; margin-bottom: 4px;">02. 實戰一：校園導覽</strong>
          兩張圖啟動專案！180° 方向旋轉大坑、Python 自動樹木偵測與 Google 試算表維護。
        </div>
        <div style="background: #FFF; padding: 16px; border-radius: 12px; border: 1.5px solid #E8DAC8;">
          <strong style="color: var(--toy-teal-dark); display: block; margin-bottom: 4px;">03. 實戰二：探索群島</strong>
          純程式低多邊形建模、移軸微縮感、3,600 個物件效能最佳化與學生姓名遮蔽。
        </div>
        <div style="background: #FFF; padding: 16px; border-radius: 12px; border: 1.5px solid #E8DAC8;">
          <strong style="color: var(--toy-blue-dark); display: block; margin-bottom: 4px;">04. 延伸發想</strong>
          12 種畫面風格與關鍵字、14 種空間比喻主題，以及各學科跨領域教育應用。
        </div>
        <div style="background: #FFF; padding: 16px; border-radius: 12px; border: 1.5px solid #E8DAC8;">
          <strong style="color: var(--toy-purple); display: block; margin-bottom: 4px;">05. 零主機費部署方案</strong>
          GitHub Pages、Vercel、Upstash 與 Open-Meteo 免費方案，讓學校與個人作品 0 元永久託管。
        </div>
        <div style="background: #FFF; padding: 16px; border-radius: 12px; border: 1.5px solid #E8DAC8;">
          <strong style="color: #4A3E34; display: block; margin-bottom: 4px;">06. 提示詞與檢核表</strong>
          完整提示詞一鍵複製器，以及上線前必跑的 10 項安全驗收檢核表。
        </div>
      </div>
    </div>
  `;
}
