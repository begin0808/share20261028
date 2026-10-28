/**
 * 12 種 3D 視覺風格探索器 (Interactive Style Explorer)
 * 參考 03創意發想.pdf
 */
export const stylesData = [
  {
    id: "toy-model",
    icon: "🧸",
    name: "溫暖玩具模型",
    desc: "低多邊形造型、暖色光、移軸模糊，像在看桌上的模型城市。各年齡層皆感到親切治癒。",
    suitable: "學校介紹、招生宣傳、生活地圖",
    keywords: "低多邊形、微縮模型、移軸模糊、暖色調、玩具模型城市、diorama tilt-shift"
  },
  {
    id: "clay",
    icon: "🟠",
    name: "黏土動畫風",
    desc: "圓滾滾、手捏的不完美感，表面帶有指紋般質地，微小動作帶有一點停格彈跳感。",
    suitable: "國小、親子活動、繪本故事",
    keywords: "黏土質感、圓角、柔和陰影、彈跳動畫、claymation stop-motion"
  },
  {
    id: "paper-book",
    icon: "📖",
    name: "紙雕立體書",
    desc: "一層層紙片疊出場景，翻頁或視角轉動時建築從紙張裡立起來，極具人文故事感。",
    suitable: "語文、校史故事、閱讀推廣",
    keywords: "紙片分層、紙紋材質、翻頁立起動畫、pop-up book paper craft"
  },
  {
    id: "lego-blocks",
    icon: "🧱",
    name: "積木拼裝風",
    desc: "所有物件均由標準顆粒積木組成，點一下能觸發零件爆炸拆解，窺探內部構造。",
    suitable: "STEAM 教育、工程、機械科",
    keywords: "顆粒積木、大量相同零件 (InstancedMesh)、拆解動畫、lego bricks voxel"
  },
  {
    id: "voxel",
    icon: "⛏️",
    name: "方塊像素世界",
    desc: "像方塊沙盒遊戲的世界，學生族群共鳴最高，親切感滿分，更可開放大家一起搭建。",
    suitable: "資訊科、資訊社團、共創活動",
    keywords: "體素 voxel、方塊地形、像素貼圖、sandbox blocks"
  },
  {
    id: "toon",
    icon: "🎨",
    name: "卡通描邊動畫風",
    desc: "平塗純粹色塊加上俐落的黑色外框邊線，宛如走入日本動漫或漫畫的定格場景。",
    suitable: "青少年、社團展演、動漫社",
    keywords: "卡通著色 toon shading、外框線 outline、色階光影、anime cel shaded"
  },
  {
    id: "watercolor",
    icon: "🖌️",
    name: "水彩繪本風",
    desc: "柔和筆觸與水彩紙張纖維紋理，邊緣自然暈染，色彩清淡脫俗，充滿溫度。",
    suitable: "美術教育、文學課堂、生命教育",
    keywords: "水彩後製、紙張紋理、低飽和配色、邊緣暈染、watercolor illustrated"
  },
  {
    id: "blueprint",
    icon: "📐",
    name: "藍圖工程線稿",
    desc: "深藍網格底色與發光白線條，點選後從平面工程線稿『長出』立體 3D 結構。",
    suitable: "機械科、土木營建、工程製圖",
    keywords: "線框 wireframe、邊線、藍圖網格、由線到實體、architectural blueprint"
  },
  {
    id: "cyberpunk",
    icon: "🌃",
    name: "霓虹賽博夜城",
    desc: "夜景基底、發光霓虹招牌、雨後地面光影倒影，充滿前衛科技與電競張力。",
    suitable: "資訊電競、科技展覽、夜間成果展",
    keywords: "霓虹發光 bloom、夜景、倒影反射、暗黑科技、cyberpunk synthwave"
  },
  {
    id: "retro-pixel",
    icon: "👾",
    name: "復古像素遊戲",
    desc: "固定 45 度角的等距 (Isometric) 視角加上復古像素化後製，懷舊電玩風十足。",
    suitable: "懷舊校慶、校園解謎、遊戲化學習",
    keywords: "等距視角 isometric、正交相機、像素化後製、retro 16-bit arcade"
  },
  {
    id: "crystal",
    icon: "💎",
    name: "水晶玻璃折射",
    desc: "半透明折射晶體建築，柔和光線穿透，搭配白色極簡背景，乾淨現代又極富未來感。",
    suitable: "科學展覽、榮譽頒獎、專題發表",
    keywords: "透明折射材質 transmission、焦散光、白色極簡背景、frosted glass"
  },
  {
    id: "shadow-play",
    icon: "🏮",
    name: "剪影光影皮影戲",
    desc: "以剪影與背光對比說故事，類似皮影戲或剪紙藝術，古樸而具有強烈意境。",
    suitable: "人文社科、傳統在地文化、歷史故事",
    keywords: "剪影 silhouette、強烈背光、剪紙鏤空、傳統東方配色"
  }
];

export function renderStyleExplorer(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const html = stylesData.map(style => `
    <div class="style-card" data-style-id="${style.id}">
      <div class="style-card-header">
        <span style="font-size: 1.8rem;">${style.icon}</span>
        <span class="style-card-tag">${style.suitable.split('、')[0]}</span>
      </div>
      <div class="style-card-title">${style.name}</div>
      <div class="style-card-desc">${style.desc}</div>
      <div style="font-size: 0.8rem; font-weight: 700; color: var(--toy-teal); margin-bottom: 6px;">
        🎯 適合：${style.suitable}
      </div>
      <div class="style-card-keywords">
        🔑 提示詞關鍵字：${style.keywords}
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
}
