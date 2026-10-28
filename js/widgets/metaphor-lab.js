/**
 * 創意發想實驗室 (Interactive Metaphor & Prompt Generator)
 * 讓現場研習老師自由組合「領域場景 + 空間比喻 + 畫面風格」，即時生成專案藍圖與提示詞！
 */

const DOMAINS = [
  { id: "campus-programs", name: "🏫 專門學程與科別介紹", desc: "展示各學程大樓、特色課程、實習作品與升學榜單" },
  { id: "earth-science", name: "🌍 地球科學・板塊與天體", desc: "板塊運動、太陽系比例、颱風路徑與家鄉等高線模擬" },
  { id: "orientation", name: "🧭 新生報到與校園導覽", desc: "新生尋找教室、行政處室導航與無障礙安全動線" },
  { id: "machinery", name: "⚙️ 機械與工程專業實作", desc: "零件爆炸拆解、組裝順序、工具機安全操作虛擬示範" },
  { id: "disaster", name: "🚨 校園防災與逃生演練", desc: "地震避難動線、火災集合點與夜間安全照明檢驗" },
  { id: "biology", name: "🌱 生物細胞與生態系", desc: "細胞器構造、食物鏈微縮沙盒、植物生長時光快轉" }
];

const METAPHORS = [
  { id: "islands", name: "🏝️ 浮空群島與木拱橋", hook: "中央為核心支援島，各單元為獨立小島，以木橋相連象徵跨域連通" },
  { id: "solar", name: "🪐 繞日行星與星系", hook: "核心是發光恆星，各單元如行星繞行，社團為衛星，搭火箭登陸探索" },
  { id: "balloons", name: "🎈 熱氣球升空嘉年華", hook: "每個單元是一顆彩色熱氣球，吊籃中微縮上課實景，隨人氣緩緩升降" },
  { id: "train", name: "🚂 鐵道列車與站點路網", hook: "每一站是一個學習單元，轉乘站是跨域選修，小火車動態進站開門" },
  { id: "tree", name: "🌳 一棵長青知識大樹", hook: "粗壯樹幹是學校精神，主要枝幹是學群，果實是專門科別，松鼠穿梭其間" },
  { id: "amusement", name: "🎡 夢想主題遊樂園", hook: "各設施代表不同專長，入口門票是適性測驗，搭摩天輪鳥瞰全區" },
  { id: "monopoly", name: "🎲 互動大富翁棋盤桌遊", hook: "棋盤每一格是校園地標或知識點，擲骰子前進，觸發機會命運小考驗" }
];

const STYLES = [
  { id: "toy-mini", name: "🧸 溫暖玩具微縮模型", promptKeyword: "低多邊形 low-poly、微縮模型 diorama、移軸模糊 tilt-shift、暖色調溫馨光影" },
  { id: "clay-stop", name: "🟠 黏土動畫圓角風", promptKeyword: "手捏黏土質感 claymation、圓滾滾圓角、柔和接觸陰影、微彈跳微縮動畫" },
  { id: "paper-craft", name: "📖 紙雕立體翻頁書", promptKeyword: "紙片分層疊加 pop-up book、紙張纖維紋理、翻頁立起動畫、優雅人文色調" },
  { id: "lego-brick", name: "🧱 顆粒積木拼裝風", promptKeyword: "顆粒積木體素、InstancedMesh 批量零件、點擊觸發爆炸拆解與內部構造透視" },
  { id: "blueprint-line", name: "📐 藍圖工程線框風", promptKeyword: "深藍網格底色、發光純白建築線稿、從線框 wireframe 長出立體實體" },
  { id: "watercolor-art", name: "🖌️ 水彩繪本手繪風", promptKeyword: "水彩暈染筆觸、低飽和紙張紋理、柔和自然色調、邊緣留白手繪感" }
];

export function initMetaphorLab() {
  const container = document.getElementById('metaphorLabContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="metaphor-lab">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
        <div>
          <span class="toy-pill toy-pill-yellow">🧪 創意發想實驗室</span>
          <h3 style="font-size: 1.4rem; font-weight: 800; margin-top: 6px;">自由調配你的 3D 專案概念配方</h3>
        </div>
        <button id="randomIdeaBtn" class="toy-btn toy-btn-ghost" style="font-size: 0.85rem;">🎲 隨機搖一個點子</button>
      </div>

      <div class="metaphor-controls">
        <div class="metaphor-select-group">
          <label class="metaphor-label"><span>🎯</span> 步驟 1：選擇應用主題 / 痛點</label>
          <select id="selectDomain" class="toy-select">
            ${DOMAINS.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
          </select>
        </div>

        <div class="metaphor-select-group">
          <label class="metaphor-label"><span>✨</span> 步驟 2：選擇空間隱喻比喻</label>
          <select id="selectMetaphor" class="toy-select">
            ${METAPHORS.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}
          </select>
        </div>

        <div class="metaphor-select-group">
          <label class="metaphor-label"><span>🎨</span> 步驟 3：選擇視覺藝術風格</label>
          <select id="selectStyle" class="toy-select">
            ${STYLES.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <div id="metaphorResultArea"></div>
    </div>
  `;

  const selDomain = document.getElementById('selectDomain');
  const selMetaphor = document.getElementById('selectMetaphor');
  const selStyle = document.getElementById('selectStyle');
  const randomBtn = document.getElementById('randomIdeaBtn');

  function updateResult() {
    const d = DOMAINS.find(item => item.id === selDomain.value) || DOMAINS[0];
    const m = METAPHORS.find(item => item.id === selMetaphor.value) || METAPHORS[0];
    const s = STYLES.find(item => item.id === selStyle.value) || STYLES[0];

    const projectTitle = `《${d.name.split(' ')[1]}之${m.name.split(' ')[1]}》`;
    const promptText = `請幫我製作一個 3D 互動教育網站：${projectTitle}。
【主題與內容】
- 應用領域：${d.name}（${d.desc}）
- 空間隱喻：${m.name}。架構設計為：${m.hook}。
【畫面風格與技術】
- 視覺風格：${s.name}。請使用關鍵字：${s.promptKeyword}。
- 技術棧：純前端靜態（Vite + React + Three.js 或純 Three.js），所有幾何皆以程式化幾何（低多邊形方塊、圓柱）組合，不使用外部大模型檔。
- 電腦與手機皆需順暢操作，文字與資料集中在獨立資料檔，並提供純文字備用模式。
請先閱讀這份架構，列出你辨識到的場景配置、鏡頭軌跡與開發階段清單，確認後再開始寫程式。`;

    const resultArea = document.getElementById('metaphorResultArea');
    resultArea.innerHTML = `
      <div class="metaphor-result-card toy-pop">
        <div class="metaphor-result-title">
          <span>🚀 誕生企劃：</span> ${projectTitle}
        </div>
        <div class="metaphor-result-body">
          <strong>💡 核心情境構想：</strong><br>
          把原本平面傳統的「${d.name}」，重新轉譯成「${m.hook}」。透過「${s.name}」的精緻視覺質感，讓學習者或家長在瀏覽器中一眼愛上！
        </div>

        <div class="prompt-box" style="margin: 12px 0 0;">
          <div class="prompt-box-header">
            <span class="prompt-box-title">📋 專案 AI 提示詞範本（直接複製給 Claude Code / Cursor）</span>
            <button class="prompt-copy-btn" onclick="navigator.clipboard.writeText(this.closest('.prompt-box').querySelector('.prompt-box-content').innerText); this.innerText='已複製！'; setTimeout(()=>this.innerText='複製提示詞', 2000);">複製提示詞</button>
          </div>
          <div class="prompt-box-content">${promptText}</div>
        </div>
      </div>
    `;
  }

  selDomain.addEventListener('change', updateResult);
  selMetaphor.addEventListener('change', updateResult);
  selStyle.addEventListener('change', updateResult);

  randomBtn.addEventListener('click', () => {
    selDomain.selectedIndex = Math.floor(Math.random() * DOMAINS.length);
    selMetaphor.selectedIndex = Math.floor(Math.random() * METAPHORS.length);
    selStyle.selectedIndex = Math.floor(Math.random() * STYLES.length);
    updateResult();
  });

  updateResult();
}
