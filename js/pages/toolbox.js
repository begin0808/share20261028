/**
 * PAGE 06: 提示詞工具箱與資源中心
 * 提供可一鍵複製的完整提示詞範本、互動檢核表與作品連結
 */
export function renderToolboxPage() {
  return `
    <div class="page-header-box">
      <div class="page-badge-row">
        <span class="toy-pill toy-pill-yellow">武器庫</span>
        <span class="toy-pill toy-pill-teal">提示詞範本</span>
        <span class="toy-pill toy-pill-red">一鍵複製</span>
      </div>
      <h1 class="page-title">提示詞工具箱與上線檢核表</h1>
    </div>

    <!-- 提示詞選單標籤 -->
    <div style="margin: 24px 0 12px; display: flex; gap: 8px; flex-wrap: wrap;">
      <button class="toy-btn toy-btn-primary" onclick="window.switchPromptTab('prompt-stage')">🪜 分階段推進版提示詞</button>
      <button class="toy-btn toy-btn-ghost" onclick="window.switchPromptTab('prompt-campus')">🏫 3D 校園導覽專用提示詞</button>
      <button class="toy-btn toy-btn-ghost" onclick="window.switchPromptTab('prompt-island')">🏝️ 探索群島專用提示詞</button>
      <button class="toy-btn toy-btn-ghost" onclick="window.switchPromptTab('prompt-maintain')">🔄 新學年維護與試算表</button>
    </div>

    <!-- 提示詞展示區 -->
    <div id="promptTabContent">
      <!-- 預設為分階段版 -->
      <div id="tab-prompt-stage" class="prompt-tab-pane">
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
      </div>
    </div>

    <!-- 互動式上線前檢核表 -->
    <div style="margin: 40px 0 20px;">
      <span class="toy-pill toy-pill-teal">驗收工具</span>
      <h2 style="font-size: 1.6rem; margin-top: 8px;">互動檢核表：上線前必跑的 10 項安全驗收</h2>
      <p style="color: var(--ink-secondary); font-size: 0.95rem; margin-top: 4px;">
        點擊即可打勾記錄，全部完成代表你的作品已具備對外公開的品質！
      </p>
    </div>

    <div class="checklist-container" id="toolboxChecklist">
      <div class="check-item" onclick="this.classList.toggle('checked');">
        <div class="check-box">✓</div>
        <div class="check-text">
          <div class="check-text-title">1. 方位校對實地確認</div>
          <div class="check-text-desc">由熟悉校園的老師或學生實地站在校門確認：教室排列左右方向未顛倒。</div>
        </div>
      </div>

      <div class="check-item" onclick="this.classList.toggle('checked');">
        <div class="check-box">✓</div>
        <div class="check-text">
          <div class="check-text-title">2. 推估資料明確標示</div>
          <div class="check-text-desc">非教學建物（如圖書館、宿舍）樓層數若未有正式圖資，網站上需明確標注「推估」。</div>
        </div>
      </div>

      <div class="check-item" onclick="this.classList.toggle('checked');">
        <div class="check-box">✓</div>
        <div class="check-text">
          <div class="check-text-title">3. 常用搜尋跳轉測試</div>
          <div class="check-text-desc">實測搜尋「教務處」、「健康中心」、「某班教室」，鏡頭能平滑飛航並特寫該樓層。</div>
        </div>
      </div>

      <div class="check-item" onclick="this.classList.toggle('checked');">
        <div class="check-box">✓</div>
        <div class="check-text">
          <div class="check-text-title">4. 步行路線合理性驗證</div>
          <div class="check-text-desc">從校門到主要場館的 A* 路線不穿透未開放建築，主要穿堂與玄關設定為可通行。</div>
        </div>
      </div>

      <div class="check-item" onclick="this.classList.toggle('checked');">
        <div class="check-box">✓</div>
        <div class="check-text">
          <div class="check-text-title">5. 行動端直式操作體驗</div>
          <div class="check-text-desc">在 iPhone / Android 手機上測試直式畫面，抽屜面板滑動順暢，按鈕不被遮擋。</div>
        </div>
      </div>

      <div class="check-item" onclick="this.classList.toggle('checked');">
        <div class="check-box">✓</div>
        <div class="check-text">
          <div class="check-text-title">6. 舊電腦效能與省電模式</div>
          <div class="check-text-desc">在學校電腦教室（內建顯卡）開啟順暢，提供一鍵關閉陰影與樹木的省電開關。</div>
        </div>
      </div>

      <div class="check-item" onclick="this.classList.toggle('checked');">
        <div class="check-box">✓</div>
        <div class="check-text">
          <div class="check-text-title">7. 敏感區域隱私防護</div>
          <div class="check-text-desc">宿舍、地下室、總務機房僅呈現外觀量體，絕不公開不宜之內部格局。</div>
        </div>
      </div>

      <div class="check-item" onclick="this.classList.toggle('checked');">
        <div class="check-box">✓</div>
        <div class="check-text">
          <div class="check-text-title">8. 學生個資全面遮蔽</div>
          <div class="check-text-desc">榜單與公告姓名一律遮蔽為「李OO」，原始含有全名之名冊不上傳至公開儲存庫。</div>
        </div>
      </div>

      <div class="check-item" onclick="this.classList.toggle('checked');">
        <div class="check-box">✓</div>
        <div class="check-text">
          <div class="check-text-title">9. 校徽與圖資授權</div>
          <div class="check-text-desc">校園平面圖與校徽圖片使用前已向學校行政主管單位取得口頭或書面同意。</div>
        </div>
      </div>

      <div class="check-item" onclick="this.classList.toggle('checked');">
        <div class="check-box">✓</div>
        <div class="check-text">
          <div class="check-text-title">10. 零費用靜態部署完成</div>
          <div class="check-text-desc">推送至 GitHub Pages 或 Vercel，取得正式分享網址並生成 QR Code。</div>
        </div>
      </div>
    </div>

    <!-- 研習 Q&A 與講者心聲 -->
    <div class="toy-card toy-card-accent" style="margin-top: 36px; text-align: center; padding: 36px 24px;">
      <h3 style="font-size: 1.4rem; margin-bottom: 10px;">💬 歡迎與我們一起交流</h3>
      <p style="font-size: 1rem; color: var(--ink-secondary); max-width: 680px; margin: 0 auto 20px; line-height: 1.8;">
        今晚的分享只是一個起點。如果你在自己學校或個人專案製作時遇到方位轉向、效能延遲或不知道提示詞怎麼下的問題，隨時歡迎一起討論！
      </p>
      <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
        <a href="https://begin0808.github.io/3Dtntcsh/" target="_blank" class="toy-btn toy-btn-primary">南大附中 3D 校園導覽 ↗</a>
        <a href="https://tntcshisland.vercel.app/" target="_blank" class="toy-btn toy-btn-secondary">南大附中探索群島 ↗</a>
        <a href="https://animalia-live.vercel.app/" target="_blank" class="toy-btn toy-btn-teal">全球動物現場 ↗</a>
      </div>
    </div>
  `;
}
