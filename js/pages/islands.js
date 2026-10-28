/**
 * PAGE 03: 實戰二・3D 探索群島開發實戰
 * 深度整合 02_製作指南與技術說明.pdf
 */
export function renderIslandsPage() {
  return `
    <div class="page-header-box">
      <div class="page-badge-row">
        <span class="toy-pill toy-pill-yellow">實戰案例 02</span>
        <span class="toy-pill toy-pill-teal">React Three Fiber</span>
        <span class="toy-pill toy-pill-blue">微縮模型城市</span>
      </div>
      <h1 class="page-title">3D 互動學程群島</h1>
      <div style="margin-top: 16px;">
        <a href="https://tntcshisland.vercel.app/" target="_blank" class="toy-btn toy-btn-secondary">
          🏝️ 開啟實作成果：南大附中探索群島 ↗
        </a>
      </div>
    </div>

    <!-- 網站核心架構與亮點 -->
    <div class="toy-card toy-card-accent" style="margin-bottom: 28px;">
      <h3 style="font-size: 1.3rem; margin-bottom: 14px;">🌟 群島是怎麼運作的？</h3>
      <div class="grid-3" style="margin: 0;">
        <div style="background: var(--bg-card-alt); padding: 16px; border-radius: 14px; border: 1.5px solid #EADBCC;">
          <strong style="color: var(--toy-yellow-dark); display: block; margin-bottom: 4px;">🏝️ 認識專門學程</strong>
          每座島有該科大樓、特色介紹、代表數據、近三年升學榜單（姓名遮蔽如「李OO」）與官網即時公告。
        </div>
        <div style="background: var(--bg-card-alt); padding: 16px; border-radius: 14px; border: 1.5px solid #EADBCC;">
          <strong style="color: var(--toy-teal-dark); display: block; margin-bottom: 4px;">🎮 遊戲化體驗</strong>
          九題適性測驗推薦最合適的三座島、自動全景環島導覽輪播、校園樹上藏著 12 隻小松鼠尋寶小遊戲。
        </div>
        <div style="background: var(--bg-card-alt); padding: 16px; border-radius: 14px; border: 1.5px solid #EADBCC;">
          <strong style="color: var(--toy-blue-dark); display: block; margin-bottom: 4px;">🕒 即時連動與真實生活</strong>
          依台灣時間切換白天、夕陽、黑夜；夜晚放學小人回家、機器靜止；串接 Open-Meteo 免費天氣，雨天真下雨！
        </div>
      </div>
    </div>

    <!-- 關鍵技術亮點解密 -->
    <h2 style="font-size: 1.6rem; margin: 32px 0 16px;">🔧 關鍵技術解密：為什麼能兼顧美感與極速？</h2>
    <div class="grid-2">
      <!-- 程式幾何建模 -->
      <div class="toy-card toy-card-alt" style="border-top: 6px solid var(--toy-yellow);">
        <div class="toy-pill toy-pill-yellow">核心架構</div>
        <h3 style="margin: 8px 0; font-size: 1.2rem;">磚塊幾何建模：不使用任何外部 3D 模型檔！</h3>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7;">
          <strong>顛覆常識：</strong>大部分 3D 專案會去找現成 GLTF/FBX 模型，造成網頁動輒幾十 MB、載入極慢，且風格不一。<br>
          <strong>我們的做法：</strong>所有建築、小人、乳牛、機具<strong>全是用程式碼中的基本幾何（Box、Cylinder、Sphere）拼裝而成</strong>！<br>
          整個網站幾十 KB 秒開，修改造型只要改程式碼參數，而且全場玩具低多邊形風格完美統一。
        </p>
      </div>

      <!-- 移軸微縮後製 -->
      <div class="toy-card toy-card-alt" style="border-top: 6px solid var(--toy-red);">
        <div class="toy-pill toy-pill-red">視覺魔法</div>
        <h3 style="margin: 8px 0; font-size: 1.2rem;">移軸微縮後製 (Tilt-Shift Postprocessing)</h3>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7;">
          <strong>視覺秘密：</strong>畫面上下兩端加入柔和的景深模糊，中央焦點清晰，再調高一點點色彩飽和度。<br>
          人類大腦會立刻把它認知為<strong>「擺在客廳木桌上的精緻微縮模型」</strong>！<br>
          兼顧效能：在手機端檢測到行動裝置時，自動關閉後製移軸以維持流暢省電。
        </p>
      </div>

      <!-- 效能最佳化合併物件 -->
      <div class="toy-card toy-card-alt" style="border-top: 6px solid var(--toy-teal);">
        <div class="toy-pill toy-pill-teal">效能大作戰</div>
        <h3 style="margin: 8px 0; font-size: 1.2rem;">3,600 個零件合併：保住 43+ FPS！</h3>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7;">
          <strong>效能瓶頸：</strong>十座島零件總數超過 3,600 個，在一般電腦或筆電顯卡上會掉幀。<br>
          <strong>解決方案：</strong>請 AI 將不會移動的靜態零件（島嶼八角底座、大樓外牆、屋頂、木橋）依照同種材質進行<strong>幾何合併 (BufferGeometryUtils.mergeGeometries)</strong>。<br>
          繪圖次數 (Draw Calls) 減少超過 75%，獨立顯卡幀率穩定飆上 43~60 FPS！
        </p>
      </div>

      <!-- 個資與 Big5 -->
      <div class="toy-card toy-card-alt" style="border-top: 6px solid var(--toy-blue);">
        <div class="toy-pill toy-pill-blue">法規與防線</div>
        <h3 style="margin: 8px 0; font-size: 1.2rem;">官網 Big5 解碼 ＆ 學生「李OO」個資遮蔽</h3>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7;">
          <strong>老舊官網 Big5：</strong>學校公告伺服器常使用 Big5 編碼，直接抓取會全部變亂碼。我們在 Vercel Serverless Function 引入 <code>iconv-lite</code> 轉為 UTF-8。<br>
          <strong>個資安全：</strong>升學榜單以 Python 解析時自動以正規表達式遮蔽姓名（只留姓氏）；公告標題學生全名一律遮蔽，原始未遮蔽 PDF 絕不上傳公開儲存庫。
        </p>
      </div>
    </div>

    <!-- 和 AI 合作的五大訣竅 -->
    <div class="toy-card toy-card-alt" style="margin-top: 32px; border: 2.5px solid #3C332A;">
      <h3 style="font-size: 1.3rem; margin-bottom: 12px; color: var(--toy-yellow-dark);">
        🤝 和 AI 程式助手合作的五大實戰訣竅
      </h3>
      <div class="grid-2">
        <div style="background: #FFF; padding: 16px; border-radius: 12px; border: 1.5px solid #DFCFC0;">
          <strong style="color: var(--toy-teal);">✅ 建議這樣做：</strong>
          <ul style="padding-left: 20px; line-height: 1.7; font-size: 0.9rem; color: var(--ink-primary); margin-top: 6px;">
            <li>一次只提一到兩件事，條列明確。</li>
            <li>看到問題就直接截圖，圈出畫面位置說明。</li>
            <li>明確說出「不要」什麼（例如：不要顯示學生全名、不要顯示信箱）。</li>
            <li>要求 AI 修改完自己用瀏覽器截圖、跑自動測試驗證後再回報。</li>
          </ul>
        </div>
        <div style="background: #FFF; padding: 16px; border-radius: 12px; border: 1.5px solid #DFCFC0;">
          <strong style="color: var(--toy-red);">⚠️ 容易踩坑的地方：</strong>
          <ul style="padding-left: 20px; line-height: 1.7; font-size: 0.9rem; color: var(--ink-primary); margin-top: 6px;">
            <li>物件加太多導致手機延遲不順：務必隨時要求合併靜態物件。</li>
            <li>小人走路穿牆、動物疊羅漢：明確要求設定步道航點與排斥半徑。</li>
            <li>免費雲端方案：注意看清楚是否要綁信用卡，全部選 Free 方案！</li>
            <li>重大決定（命名、配色、用語）由老師拍板，AI 負責實作。</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}
