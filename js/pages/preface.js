/**
 * PAGE 01: 前言・從「全球動物現場」4 萬人造訪談起
 * 核心案例：Animalia Live (https://animalia-live.vercel.app/)
 * 探討：
 * - 為什麼一個多月創下 41,000+ 造訪人次？
 * - 動物很可愛、在家免買門票看野生非洲動物、雙語與地理教學
 * - AI 時代最稀缺珍貴的「真實感」反差
 * - IG 短影音剪輯與行銷帶來的社群擴散
 * - 創意思維的本質：把想法變成「有意思且有意義」的作品
 */
export function renderPrefacePage() {
  return `
    <div class="page-header-box">
      <div class="page-badge-row">
        <span class="toy-pill toy-pill-teal">真實爆紅案例</span>
        <span class="toy-pill toy-pill-yellow">41,000+ 造訪人次</span>
        <span class="toy-pill toy-pill-red">創意思維篇</span>
      </div>
      <h1 class="page-title">前言思維：從「全球動物現場」談起</h1>
    </div>

    <!-- 核心引言區塊 -->
    <div class="toy-callout toy-callout-warning" style="margin-bottom: 28px;">
      <span class="toy-callout-icon">💡</span>
      <div>
        <h4 style="font-size: 1.15rem; margin-bottom: 6px; color: #734305;">今晚分享會的核心初心</h4>
        <p style="font-size: 1rem; line-height: 1.8;">
          「有了 AI 工具的協助，3D 作品的製作門檻已經降低不少。但真正困難的，往往不是技術怎麼實作，而是<strong>創意從哪裡來、內容怎麼規劃，以及如何把想法變成有意思且有意義的作品</strong>，或是它能夠幫你解決怎樣的問題與需求？」
        </p>
      </div>
    </div>

    <!-- 主角登場：全球動物現場 (Animalia Live) 成果卡片 -->
    <div class="toy-card toy-card-accent" style="margin-bottom: 32px; border: 2.5px solid #3C332A;">
      <div style="display: flex; gap: 28px; align-items: center; flex-wrap: wrap;">
        <div style="flex: 1.1; min-width: 320px;">
          <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 10px;">
            <span class="toy-pill toy-pill-teal" style="font-size: 0.82rem;">🦁 即時野生動物直播</span>
            <span class="toy-pill toy-pill-yellow" style="font-size: 0.82rem;">🌍 3D 旋轉地球視角</span>
          </div>
          <h2 style="font-size: 1.7rem; color: var(--ink-primary); margin-bottom: 12px; line-height: 1.3;">
            全球動物現場 <span style="font-size: 1.1rem; color: var(--toy-teal); font-weight: 700;">Animalia Live</span>
          </h2>
          <p style="font-size: 1rem; color: var(--ink-secondary); line-height: 1.8; margin-bottom: 16px;">
            將分佈在地球各地的野生動物即時攝影機，標註在可互動旋轉的 3D 地球上。串接 Open-Meteo 即時氣候與當地時間，讓所有人隨時隨地漫步於非洲肯亞水塘、南極冰原與阿拉斯加森林。
          </p>

          <!-- 亮眼數據戰績 -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
            <div style="background: #FFF; padding: 12px; border-radius: 12px; border: 1.5px solid #E8DAC8; text-align: center;">
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--toy-red-dark);">41,000+</div>
              <div style="font-size: 0.8rem; color: var(--ink-secondary); font-weight: 700;">上線一個多月造訪</div>
            </div>
            <div style="background: #FFF; padding: 12px; border-radius: 12px; border: 1.5px solid #E8DAC8; text-align: center;">
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--toy-teal-dark);">85+</div>
              <div style="font-size: 0.8rem; color: var(--ink-secondary); font-weight: 700;">全球即時動物鏡頭</div>
            </div>
            <div style="background: #FFF; padding: 12px; border-radius: 12px; border: 1.5px solid #E8DAC8; text-align: center;">
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--toy-yellow-dark);">$0 元</div>
              <div style="font-size: 0.8rem; color: var(--ink-secondary); font-weight: 700;">永久零主機雲端費用</div>
            </div>
          </div>

          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <a href="https://animalia-live.vercel.app/" target="_blank" class="toy-btn toy-btn-primary" style="padding: 10px 22px;">
              開啟全球動物現場 ↗
            </a>
            <a href="https://www.instagram.com/reels/DebXS5UPDng/" target="_blank" class="toy-btn toy-btn-secondary" style="padding: 10px 22px;">
              觀看 IG 推薦短影音 ↗
            </a>
          </div>
        </div>

        <div style="flex: 1; min-width: 300px; text-align: center;">
          <img src="assets/shot_animalia.png" alt="全球動物現場真實網站畫面" style="width: 100%; border-radius: 16px; border: 2.5px solid #3C332A; box-shadow: 0 8px 0 #3C332A; object-fit: cover;">
          <div style="margin-top: 8px; font-size: 0.85rem; color: var(--ink-secondary); font-weight: 700;">
            肯亞奧多尼奧旅館水塘現場・斑馬低頭喝水實況
          </div>
        </div>
      </div>
    </div>

    <!-- 深入解析：為什麼這個專題會紅？四大動人魅力 -->
    <div class="toy-card toy-card-alt" style="margin-bottom: 32px; border: 2.5px solid #3C332A;">
      <h2 style="font-size: 1.45rem; margin-bottom: 8px; color: var(--ink-primary);">
        🔍 為什麼這個專題會紅？四大爆紅關鍵深度拆解
      </h2>
      <p style="font-size: 0.95rem; color: var(--ink-secondary); margin-bottom: 20px;">
        做出一個網站不難，但要讓四萬多人願意造訪、停留甚至轉發推薦，背後有著深刻的「心理共鳴」與「生活價值」：
      </p>

      <div class="grid-2">
        <!-- 魅力 1: 超萌動物 -->
        <div style="background: #FFF; padding: 20px; border-radius: 14px; border: 1.5px solid #E8DAC8; border-top: 6px solid var(--toy-yellow);">
          <div style="font-size: 1.8rem; margin-bottom: 8px;">🐧 🦓 🐻</div>
          <h3 style="font-size: 1.25rem; color: var(--toy-yellow-dark); margin-bottom: 8px;">
            1. 動物很可愛：全世界共通的療癒語言
          </h3>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7;">
            搖搖擺擺的企鵝、在水塘邊成群喝水的斑馬、泡在水裡的悠閒水豚、在溪流抓魚的棕熊。<strong>「可愛」具備跨越年齡、文化與語言的天然吸引力</strong>，小朋友看一眼就被吸引，大人上班累了看五分鐘也能獲得巨大的心理治癒。
          </p>
        </div>

        <!-- 魅力 2: 免門票看真實世界 -->
        <div style="background: #FFF; padding: 20px; border-radius: 14px; border: 1.5px solid #E8DAC8; border-top: 6px solid var(--toy-red);">
          <div style="font-size: 1.8rem; margin-bottom: 8px;">🎟️ 🛋️ 👨‍👩‍👧‍👦</div>
          <h3 style="font-size: 1.25rem; color: var(--toy-red); margin-bottom: 8px;">
            2. 解決生活真痛點：不用出門、免買門票看非洲動物
          </h3>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7;">
            帶孩子去動物園，往往要排隊買門票、舟車勞頓、曬太陽人擠人；更別提飛往東非大草原動輒十幾萬旅費。<strong>這個網站讓家長在家客廳吹冷氣、投影在電視上，就能帶孩子看見野生非洲動物</strong>，親子陪伴輕鬆無負擔，解決了真切的生活痛點！
          </p>
        </div>

        <!-- 魅力 3: 絕佳跨學科教育載體 -->
        <div style="background: #FFF; padding: 20px; border-radius: 14px; border: 1.5px solid #E8DAC8; border-top: 6px solid var(--toy-teal);">
          <div style="font-size: 1.8rem; margin-bottom: 8px;">🌍 📖 🌤️</div>
          <h3 style="font-size: 1.25rem; color: var(--toy-teal-dark); margin-bottom: 8px;">
            3. 超棒的教育現場：雙語 × 世界地理 × 國際教育
          </h3>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7;">
            <strong>世界地理與時區：</strong>轉動地球，肯亞當地時間 12:27 正下著雨、氣溫 23°C，而阿拉斯加還是深夜。經緯度、時差、氣候帶不再是考卷上的死背硬記，而是眼前真實發生的景象！<br>
            <strong>雙語與國際教育：</strong>中英對照的物種名、國家公園地名，在最自然的情境中拓展孩子的世界觀。
          </p>
        </div>

        <!-- 魅力 4: 空間感與專注陪伴 -->
        <div style="background: #FFF; padding: 20px; border-radius: 14px; border: 1.5px solid #E8DAC8; border-top: 6px solid var(--toy-blue);">
          <div style="font-size: 1.8rem; margin-bottom: 8px;">🌐 ⏱️ 🎧</div>
          <h3 style="font-size: 1.25rem; color: var(--toy-blue-dark); margin-bottom: 8px;">
            4. 3D 空間立體感 ＋ 專注陪伴工作神器
          </h3>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7;">
            捨棄傳統枯燥的 YouTube 直播影片列表，採用<strong>直覺旋轉的 3D 地球儀</strong>，用手指撥動就像轉動小時候書房裡的地球儀。<br>
            更貼心內建<strong>「專注計時番茄鐘」與大自然背景環境音</strong>，許多上班族與學生把畫面放著當背景音樂，看著斑馬低頭喝水專注讀書工作。
          </p>
        </div>
      </div>
    </div>

    <!-- 命題深化：AI 時代的「真實感」反差 -->
    <div class="toy-card toy-card-accent" style="margin-bottom: 32px; border-left: 8px solid var(--toy-red);">
      <h2 style="font-size: 1.4rem; color: var(--ink-primary); margin-bottom: 12px;">
        💎 AI 時代最稀缺珍貴的資產：「無可取代的真實感」
      </h2>
      <p style="font-size: 1rem; color: var(--ink-secondary); line-height: 1.8; margin-bottom: 16px;">
        現在是生成式 AI 大爆發的時代。Midjourney 隨手能算出一張逼真的獅子圖，Sora 能生成幾秒鐘的奔跑長頸鹿。但看多了之後，人們心中往往會浮現一種<strong>「審美疲勞與真實感焦慮」</strong>—— 因為大家都知道，那是假的、是算出來的。
      </p>
      <div style="background: #FFF; padding: 18px; border-radius: 12px; border: 1.5px solid #E8DAC8; line-height: 1.8; font-size: 0.95rem;">
        <strong>為什麼「全球動物現場」能觸動四萬多人的心？</strong><br>
        因為它帶大家看的<strong>不是 AI 虛擬合成的動物</strong>，而是地球彼端此時此刻、正在呼吸、喝水、打瞌睡、迎風搖晃尾巴的<strong>真實生命</strong>！<br>
        在虛擬氾濫的世界裡，「連結真實世界」成為最高貴的情感體驗。科技的終極價值，不是建造一座封閉的假世界，而是化作一扇窗，帶孩子看見真實星球的美好。
      </div>
    </div>

    <!-- 社群擴散力量：IG 短影音推手 -->
    <div class="toy-card toy-card-teal" style="margin-bottom: 32px;">
      <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
        <div style="font-size: 3rem; flex-shrink: 0;">📱</div>
        <div style="flex: 1; min-width: 280px;">
          <h2 style="font-size: 1.35rem; color: var(--toy-teal-dark); margin-bottom: 8px;">
            🚀 社群擴散的推手：IG 短影音帶來的流量與人氣
          </h2>
          <p style="font-size: 0.95rem; color: var(--ink-secondary); line-height: 1.8; margin-bottom: 12px;">
            一個好專案除了內容本身，更需要懂它的伯樂。非常感謝在 Instagram 上有熱心創作者幫忙剪輯並發布了介紹短影音（<a href="https://www.instagram.com/reels/DebXS5UPDng/" target="_blank" style="color: var(--toy-teal-dark); text-decoration: underline; font-weight: 700;">查看 IG Reels 推薦影片</a>）。
          </p>
          <div style="background: #FFF; padding: 14px 18px; border-radius: 10px; border: 1px solid #C5E3DC; font-size: 0.92rem; line-height: 1.7;">
            <strong>短影音剪輯與行銷帶來的啟發：</strong>
            <ul style="padding-left: 20px; margin-top: 6px;">
              <li><strong>開頭 3 秒抓痛點：</strong>開門見山點出「免買門票、在家帶孩子看野生動物」，瞬間擊中家長與熱愛自然的朋友。</li>
              <li><strong>乾淨明快的畫面節奏：</strong>直接錄製點擊旋轉地球與斑馬喝水的真實動態，視覺說服力十足。</li>
              <li><strong>社群語言連結：</strong>技術是冷靜的，但社群行銷賦予了它溫暖的分享動力，成為爆紅傳播的關鍵催化劑！</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}
