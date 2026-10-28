/**
 * 25 頁全套線上分享會簡報資料庫 (取代傳統 PPT / 研習簡報)
 * 2026/10/28 線上分享會專用
 */
export const slidesData = [
  {
    id: 1,
    category: "開場總覽",
    title: "用 AI 打造 3D 互動校園與教育應用",
    subtitle: "",
    contentHtml: `
      <div style="display: flex; gap: 32px; align-items: center; margin-top: 10px;">
        <div style="flex: 1.2;">
          <div class="toy-pill toy-pill-yellow" style="margin-bottom: 10px;">📅 2026 年 10 月 28 日（三） 20:00～21:30 線上分享會</div>
          <div style="font-size: 0.95rem; color: var(--ink-secondary); font-weight: 700; margin-bottom: 14px;">主講人：李佳恩老師 ｜ Studio0808 智造實驗室</div>
          <p style="font-size: 1.15rem; line-height: 1.8; color: var(--ink-primary); margin-bottom: 18px;">
            歡迎各位老師與朋友來到今晚的線上分享會！這不是一場枯燥的手把手寫程式教學，而是<strong>真實創作現場的經驗開箱</strong>。
          </p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div class="slide-bullet-item">
              <span class="bullet-icon">🎨</span>
              <div class="bullet-text">
                <strong>核心信念</strong>
                AI 工具降低了 3D 門檻，但真正的價值在於「創意發想、內容規劃與解決實質問題」。
              </div>
            </div>
            <div class="slide-bullet-item">
              <span class="bullet-icon">💡</span>
              <div class="bullet-text">
                <strong>今晚重點</strong>
                純前端無後端架構、真實校園踩坑（方位、樹木、效能、個資）、提示詞工程與延伸跨界玩法。
              </div>
            </div>
          </div>
        </div>
        <div style="flex: 0.9; text-align: center;">
          <img src="assets/shot_islands.png" alt="南大附中探索群島 3D 實景" style="width: 100%; max-height: 320px; object-fit: cover; border-radius: 20px; border: 3px solid #3C332A; box-shadow: 0 8px 0 #3C332A;">
          <div style="margin-top: 10px; font-size: 0.85rem; color: var(--ink-secondary); font-weight: 700;">南大附中探索群島 3D 實景畫面</div>
        </div>
      </div>
    `,
    speakerNotes: "開場歡迎大家。說明今晚研習的核心主軸：不是手把手程式碼教學，而是站在教育者與創作者角度，聊聊 AI 工具如何協助我們把原本龐大複雜的 3D 專案落地，並探討創意從何而來。"
  },
  {
    id: 2,
    category: "開場總覽",
    title: "為什麼今晚「不」做手把手實作教學？",
    subtitle: "做一個滿意的 3D 作品，需要一點「時間」和「Token」",
    contentHtml: `
      <div class="grid-2" style="margin-top: 15px;">
        <div class="toy-card toy-card-accent">
          <div class="toy-pill toy-pill-red" style="margin-bottom: 12px;">⚡ 現實挑戰 1</div>
          <h3 style="font-size: 1.3rem; margin-bottom: 10px;">Token 與上下文成本</h3>
          <p style="color: var(--ink-secondary); line-height: 1.7;">
            3D 互動網頁牽涉 <strong>Three.js 場景、鏡頭控制、路網演算法、HTML 標籤避讓、響應式 CSS</strong>。短短幾小時內現場生成，AI 會反覆讀取大量程式碼，消耗大量 Token，且容易因網路延遲中斷。
          </p>
        </div>
        <div class="toy-card toy-card-teal">
          <div class="toy-pill toy-pill-teal" style="margin-bottom: 12px;">⏳ 現實挑戰 2</div>
          <h3 style="font-size: 1.3rem; margin-bottom: 10px;">「滿意」來自反覆校對與微調</h3>
          <p style="color: var(--ink-secondary); line-height: 1.7;">
            第一版生成通常只需幾小時，但「教室方向左右顛倒」、「大樓比例微調」、「3,600 個物件效能最佳化」需要熟悉校園的人邊看畫面邊給回饋。這不是一堂 90 分鐘課堂能一次做完的。
          </p>
        </div>
      </div>
      <div class="toy-callout toy-callout-tip" style="margin-top: 24px;">
        <span class="toy-callout-icon">💡</span>
        <div>
          <strong>今晚最有價值的收穫：</strong>
          把「製作流程、提示詞範本、踩過的坑、免費架構生態」完整帶回去，讓你自己或帶領學生動手時，少走 90% 的冤枉路！
        </div>
      </div>
    `,
    speakerNotes: "坦承跟學員分享真實成本：為什麼網路上很多教學只示範做一顆方塊？因為完整系統要花時間和 Token！今晚把架構和踩坑講透，大家帶走提示詞才是真正能落地的資產。"
  },
  {
    id: 3,
    category: "開場總覽",
    title: "三大實戰作品現場巡禮",
    subtitle: "全部在瀏覽器直接開啟，純前端 / 零主機費託管",
    contentHtml: `
      <div class="grid-3" style="margin-top: 10px;">
        <div class="toy-card toy-card-alt" style="border-top: 6px solid var(--toy-teal); padding: 18px;">
          <img src="assets/shot_animalia.png" alt="全球動物現場真實畫面" style="width: 100%; height: 110px; object-fit: cover; border-radius: 10px; border: 1.5px solid #3C332A; margin-bottom: 8px;">
          <span class="toy-pill toy-pill-teal">環境與動物</span>
          <h3 style="margin: 6px 0 4px; font-size: 1.15rem;">全球動物現場</h3>
          <div style="font-size: 0.8rem; color: var(--toy-teal); font-weight: 700; margin-bottom: 6px;">Animalia Live</div>
          <p style="font-size: 0.88rem; color: var(--ink-secondary); line-height: 1.5; margin-bottom: 10px;">
            結合地理環境、動物生態與即時視角，將地球上的野生動物現場化為 3D 空間。
          </p>
          <a href="https://animalia-live.vercel.app/" target="_blank" class="toy-btn toy-btn-teal" style="font-size: 0.8rem; padding: 4px 12px;">開啟網站 ↗</a>
        </div>

        <div class="toy-card toy-card-alt" style="border-top: 6px solid var(--toy-red); padding: 18px;">
          <img src="assets/shot_campus.png" alt="3D校園導覽真實畫面" style="width: 100%; height: 110px; object-fit: cover; border-radius: 10px; border: 1.5px solid #3C332A; margin-bottom: 8px;">
          <span class="toy-pill toy-pill-red">實體校園對照</span>
          <h3 style="margin: 6px 0 4px; font-size: 1.15rem;">3D 校園導覽</h3>
          <div style="font-size: 0.8rem; color: var(--toy-red); font-weight: 700; margin-bottom: 6px;">南大附中校園導航</div>
          <p style="font-size: 0.88rem; color: var(--ink-secondary); line-height: 1.5; margin-bottom: 10px;">
            只用一張平面圖與一張配置表！支援樓層剖切、A* 尋路、第一人稱漫遊。
          </p>
          <a href="https://begin0808.github.io/3Dtntcsh/" target="_blank" class="toy-btn toy-btn-primary" style="font-size: 0.8rem; padding: 4px 12px;">開啟導覽 ↗</a>
        </div>

        <div class="toy-card toy-card-alt" style="border-top: 6px solid var(--toy-yellow); padding: 18px;">
          <img src="assets/shot_islands.png" alt="探索群島真實畫面" style="width: 100%; height: 110px; object-fit: cover; border-radius: 10px; border: 1.5px solid #3C332A; margin-bottom: 8px;">
          <span class="toy-pill toy-pill-yellow">微縮模型城市</span>
          <h3 style="margin: 6px 0 4px; font-size: 1.15rem;">南大附中探索群島</h3>
          <div style="font-size: 0.8rem; color: var(--toy-yellow-dark); font-weight: 700; margin-bottom: 6px;">tntcshisland.vercel.app</div>
          <p style="font-size: 0.88rem; color: var(--ink-secondary); line-height: 1.5; margin-bottom: 10px;">
            10座八角島嶼連成群島，移軸微縮感、即時天氣光影、姓名遮蔽與找松鼠。
          </p>
          <a href="https://tntcshisland.vercel.app/" target="_blank" class="toy-btn toy-btn-secondary" style="font-size: 0.8rem; padding: 4px 12px;">登島探索 ↗</a>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 0.95rem; color: var(--ink-secondary);">
        👉 點擊按鈕可在新分頁實際操作，所有作品皆可在手機與電腦順暢運行。
      </div>
    `,
    speakerNotes: "快速展示三個作品的連結。強調這三個網站的特點：全部不需要昂貴的伺服器，學生點開連結就能操作，支援手機與電腦。"
  },
  {
    id: 4,
    category: "前言・真實案例",
    title: "爆紅案例：全球動物現場 4 萬人造訪",
    subtitle: "上線一個多月累積 41,000+ 人次，https://animalia-live.vercel.app/",
    contentHtml: `
      <div style="display: flex; gap: 28px; align-items: center; margin-top: 10px;">
        <div style="flex: 1.1;">
          <div class="toy-pill toy-pill-teal" style="margin-bottom: 10px;">上線一個多月・超乎預期的熱烈迴響</div>
          <p style="font-size: 1.05rem; line-height: 1.8; color: var(--ink-primary); margin-bottom: 14px;">
            將全球 85+ 個野生動物即時攝影機，標註在可互動旋轉的 3D 地球上。串接即時氣象與當地時差，在家就能漫步非洲大草原！
          </p>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 14px;">
            <div style="background: #FFF; padding: 10px; border-radius: 10px; border: 1.5px solid #E8DAC8; text-align: center;">
              <div style="font-size: 1.4rem; font-weight: 900; color: var(--toy-red);">41,000+</div>
              <div style="font-size: 0.75rem; color: var(--ink-secondary); font-weight: 700;">造訪人次</div>
            </div>
            <div style="background: #FFF; padding: 10px; border-radius: 10px; border: 1.5px solid #E8DAC8; text-align: center;">
              <div style="font-size: 1.4rem; font-weight: 900; color: var(--toy-teal);">85+</div>
              <div style="font-size: 0.75rem; color: var(--ink-secondary); font-weight: 700;">即時攝影機</div>
            </div>
            <div style="background: #FFF; padding: 10px; border-radius: 10px; border: 1.5px solid #E8DAC8; text-align: center;">
              <div style="font-size: 1.4rem; font-weight: 900; color: var(--toy-yellow-dark);">$0 元</div>
              <div style="font-size: 0.75rem; color: var(--ink-secondary); font-weight: 700;">永久零主機費</div>
            </div>
          </div>
          <div class="toy-callout toy-callout-tip" style="padding: 10px 14px;">
            <span class="toy-callout-icon">💡</span>
            <div style="font-size: 0.88rem;">
              <strong>這印證了一件事：</strong>技術實作只花幾天，但真正能打動四萬多人的，是「有溫度、有意義的創意思維」！
            </div>
          </div>
        </div>
        <div style="flex: 0.9; text-align: center;">
          <img src="assets/shot_animalia.png" alt="全球動物現場真實網站畫面" style="width: 100%; max-height: 280px; object-fit: cover; border-radius: 16px; border: 2.5px solid #3C332A; box-shadow: 0 6px 0 #3C332A;">
          <div style="margin-top: 8px;">
            <a href="https://animalia-live.vercel.app/" target="_blank" class="toy-btn toy-btn-teal" style="font-size: 0.85rem; padding: 6px 16px;">開啟全球動物現場 ↗</a>
          </div>
        </div>
      </div>
    `,
    speakerNotes: "開場帶入真實爆紅案例：全球動物現場上線短短一個多月，已經累積四萬多人次造訪。這讓我深刻體會到：有了 AI 寫 code，做出一個網站不難，但為什麼大家願意看、願意轉發？背後的創意思維才是核心。"
  },
  {
    id: 5,
    category: "前言・爆紅分析",
    title: "它為什麼會紅？四大動人魅力拆解",
    subtitle: "動物很可愛 ＋ 解決家庭與教育現場的真需求",
    contentHtml: `
      <div class="grid-2" style="margin-top: 10px;">
        <div class="toy-card toy-card-alt" style="border-top: 6px solid var(--toy-yellow);">
          <h3 style="font-size: 1.15rem; color: var(--toy-yellow-dark); margin-bottom: 6px;">🧸 1. 動物很可愛：共通的療癒語言</h3>
          <p style="font-size: 0.88rem; color: var(--ink-secondary); line-height: 1.6;">
            企鵝、斑馬、水豚、北極熊。可愛天然具備跨越年齡與語言的吸睛力，大人小孩看一眼就被深深療癒。
          </p>
        </div>
        <div class="toy-card toy-card-alt" style="border-top: 6px solid var(--toy-red);">
          <h3 style="font-size: 1.15rem; color: var(--toy-red); margin-bottom: 6px;">🎟️ 2. 免門票、不出門看野生非洲動物</h3>
          <p style="font-size: 0.88rem; color: var(--ink-secondary); line-height: 1.6;">
            去動物園舟車勞頓買門票，去非洲更是花費龐大。在家吹冷氣開電視，客廳就是大草原，親子陪伴零負擔！
          </p>
        </div>
        <div class="toy-card toy-card-alt" style="border-top: 6px solid var(--toy-teal);">
          <h3 style="font-size: 1.15rem; color: var(--toy-teal-dark); margin-bottom: 6px;">🌍 3. 超棒教育現場：雙語與世界地理</h3>
          <p style="font-size: 0.88rem; color: var(--ink-secondary); line-height: 1.6;">
            看肯亞即時下雨、氣溫 23°C、當地時差 12:27。時區、經緯度與生態不再是枯燥課文，而是眼前活生生的景象。
          </p>
        </div>
        <div class="toy-card toy-card-alt" style="border-top: 6px solid var(--toy-blue);">
          <h3 style="font-size: 1.15rem; color: var(--toy-blue-dark); margin-bottom: 6px;">🌐 4. 3D 地球儀 ＋ 白噪音專注陪伴</h3>
          <p style="font-size: 0.88rem; color: var(--ink-secondary); line-height: 1.6;">
            捨棄死板影片列表，用 3D 旋轉地球找動物；內建專注番茄鐘與大自然背景音，邊工作邊看斑馬喝水治癒疲勞。
          </p>
        </div>
      </div>
    `,
    speakerNotes: "拆解受歡迎的四大原因。請大家注意第二點：它解決了真痛點！不是每個人都能飛去非洲，但每個孩子都想看野生斑馬。把門檻降為零，就是科技最好的用處。"
  },
  {
    id: 6,
    category: "前言・核心價值",
    title: "AI 時代最難能可貴的特質：「真實感」",
    subtitle: "當 AI 假圖假影片氾濫，此刻正在呼吸的世界最打動人心",
    contentHtml: `
      <div class="toy-callout toy-callout-warning" style="margin-bottom: 14px;">
        <span class="toy-callout-icon">💬</span>
        <div style="font-size: 0.95rem; line-height: 1.7;">
          在 Midjourney、Sora 等生成式 AI 滿天飛的時代，大家隨手就能算出一張逼真的獅子或太空船。<br>
          <strong>但也因為假的東西太多了，人們開始對生成內容感到審美疲勞與真實感焦慮。</strong>
        </div>
      </div>
      <div class="grid-2">
        <div class="toy-card" style="border-left: 6px solid #B0A090;">
          <h4 style="font-size: 1.1rem; color: var(--ink-secondary); margin-bottom: 8px;">🤖 虛擬算繪（演算法生成的畫面）</h4>
          <p style="font-size: 0.88rem; color: var(--ink-secondary); line-height: 1.6;">
            畫面再精緻、毛髮再逼真，觀眾心裡始終知道那是算出來的假圖，看過即忘，難以沉澱為真實感動。
          </p>
        </div>
        <div class="toy-card toy-card-accent" style="border-left: 6px solid var(--toy-teal);">
          <h4 style="font-size: 1.1rem; color: var(--toy-teal-dark); margin-bottom: 8px;">🌱 真實生命（此時此刻的地球彼端）</h4>
          <p style="font-size: 0.88rem; color: var(--ink-primary); line-height: 1.6;">
            肯亞水塘邊那隻小斑馬，正真實地打瞌睡、晃耳朵、喝水。<strong>「這是真實正在發生的」</strong>，帶來無可取代的信任與心靈震撼！
          </p>
        </div>
      </div>
      <div class="toy-callout toy-callout-tip" style="margin-top: 14px; text-align: center;">
        <strong>科技的本質不是製造虛構假象，而是化為一扇窗，帶孩子看見真實星球的美好。</strong>
      </div>
    `,
    speakerNotes: "強調這一點：AI 時代最貴的不是技術，而是「真實感」！在充斥 AI 假影片的當下，全球動物現場帶大家看的是「此刻活生生的地球」，這種真誠反差正是爆紅關鍵。"
  },
  {
    id: 7,
    category: "前言・社群傳播",
    title: "行銷的力量：IG 短影音引爆社群人潮",
    subtitle: "好作品遇見好推手：https://www.instagram.com/reels/DebXS5UPDng/",
    contentHtml: `
      <div style="display: flex; gap: 24px; align-items: center; margin-top: 10px;">
        <div style="flex: 1.1;">
          <h3 style="font-size: 1.25rem; color: var(--toy-red); margin-bottom: 10px;">📱 好專案更需要懂它的伯樂！</h3>
          <p style="font-size: 0.95rem; color: var(--ink-secondary); line-height: 1.8; margin-bottom: 14px;">
            非常感謝在 Instagram 上有熱心創作者主動剪輯介紹了這個網站。精準的痛點切入與俐落的節奏，迅速引發了數萬名家長與學生熱烈轉發！
          </p>
          <div style="background: #FFF; padding: 14px; border-radius: 12px; border: 1.5px solid #E8DAC8; line-height: 1.7; font-size: 0.88rem;">
            <strong>短影音帶給教育創作者的啟發：</strong><br>
            1. <strong>黃金 3 秒抓痛點：</strong>開頭直擊「免買門票、在家看野生非洲動物」！<br>
            2. <strong>動態展示勝過萬語：</strong>滑動 3D 地球儀與斑馬喝水實況，說服力十足。<br>
            3. <strong>情感共鳴引爆分享：</strong>不聊複雜技術，只談能幫家庭帶來怎樣的驚喜。
          </div>
          <div style="margin-top: 14px;">
            <a href="https://www.instagram.com/reels/DebXS5UPDng/" target="_blank" class="toy-btn toy-btn-secondary" style="font-size: 0.88rem; padding: 6px 16px;">
              觀看 IG Reels 推薦短影音 ↗
            </a>
          </div>
        </div>
        <div style="flex: 0.9; text-align: center;">
          <div class="toy-card toy-card-teal" style="padding: 24px; border: 2.5px solid #3C332A;">
            <div style="font-size: 2.5rem; margin-bottom: 8px;">🎬</div>
            <h4 style="font-size: 1.1rem; color: var(--toy-teal-dark); margin-bottom: 8px;">技術是骨架，傳播是翅膀</h4>
            <p style="font-size: 0.85rem; color: var(--ink-secondary); line-height: 1.6;">
              很多好作品默默躺在硬碟裡很可惜。學會用大眾聽得懂的語言與短影音行銷借力，才能讓教育專案走進更多人的生活！
            </p>
          </div>
        </div>
      </div>
    `,
    speakerNotes: "分享社群傳播心得。很多老師專案做得很棒，但不知道怎麼讓別人知道。感謝 IG 創作者的短影音，讓我學到：技術是骨架，傳播是翅膀。用痛點與情感跟大眾溝通，才能發揮最大的影響力。"
  },
  {
    id: 8,
    category: "實戰一・校園導覽",
    title: "3D 校園導覽：兩張圖就能開始的奇蹟",
    subtitle: "以南大附中 3D 校園導覽為例（參考 01 製作指南）",
    contentHtml: `
      <div class="toy-callout toy-callout-tip">
        <span class="toy-callout-icon">✨</span>
        <div>
          <strong>零 3D 手工建模、零伺服器建置！</strong><br>
          本專案第一版只用了兩張圖片：學校招生簡章裡的<strong>「校園平面圖」</strong>＋ 教務處公佈的<strong>「115 學年度班級教室配置圖」</strong>，直接交給 AI（本專案使用 Claude Code）完成！
        </div>
      </div>
      <div class="grid-3" style="margin-top: 20px;">
        <div class="toy-card toy-card-alt">
          <div class="toy-pill toy-pill-yellow">必備 1</div>
          <h3 style="margin: 10px 0; font-size: 1.15rem;">校園平面圖 (JPG/PNG)</h3>
          <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.6;">
            寬度建議 2000px 以上。俯視平面圖鋪在地面當貼圖，AI 依圖上的大樓外框擠出 3D 建築。
          </p>
        </div>
        <div class="toy-card toy-card-alt">
          <div class="toy-pill toy-pill-red">必備 2</div>
          <h3 style="margin: 10px 0; font-size: 1.15rem;">教室配置圖 (PNG/Excel)</h3>
          <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.6;">
            教務處每年公告的各樓層教室排列表。格子越接近真實寬度，產生的 3D 教室比例越真實。
          </p>
        </div>
        <div class="toy-card toy-card-alt">
          <div class="toy-pill toy-pill-teal">輔助 3</div>
          <h3 style="margin: 10px 0; font-size: 1.15rem;">已知長度比例尺</h3>
          <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.6;">
            例如「400 公尺跑道直道約 85 公尺」，AI 即可精確換算圖上像素與實際公尺比例！
          </p>
        </div>
      </div>
    `,
    speakerNotes: "進入實戰一。說明只要有這兩張現成的行政文件，就能啟動專案，不需要找測量隊或 3D 繪圖師。"
  },
  {
    id: 9,
    category: "實戰一・校園導覽",
    title: "校園導覽的系統架構與技術棧",
    subtitle: "極簡純靜態前端：雙擊 index.html 即可開啟！",
    contentHtml: `
      <div class="toy-table-wrap">
        <table class="toy-table">
          <thead>
            <tr>
              <th style="width: 20%;">層級</th>
              <th style="width: 35%;">使用的技術</th>
              <th style="width: 45%;">在專案中的實際用途</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>3D 繪圖引擎</strong></td>
              <td><code>Three.js (WebGL)</code></td>
              <td>從 CDN (import map) 載入，不需 Node.js 建置，純瀏覽器執行。</td>
            </tr>
            <tr>
              <td><strong>程式化建模</strong></td>
              <td><code>ExtrudeGeometry</code></td>
              <td>依平面圖建物矩形直接「擠出」每層 3.6m 樓高；動態排列教室彩色方塊。</td>
            </tr>
            <tr>
              <td><strong>高效渲染</strong></td>
              <td><code>InstancedMesh</code></td>
              <td>一次批量渲染校園內上千棵樹木與周邊街廓，極大減少 Draw Calls。</td>
            </tr>
            <tr>
              <td><strong>文字標籤</strong></td>
              <td><code>CSS2DRenderer</code></td>
              <td>將 HTML 大樓名稱掛在 3D 物件上方，字體銳利清晰且點選靈敏。</td>
            </tr>
            <tr>
              <td><strong>尋路導航</strong></td>
              <td><code>A* 演算法</code></td>
              <td>在校園步道路網尋找最短路線，計算步行時間（每秒 1.3m）與轉彎提示。</td>
            </tr>
            <tr>
              <td><strong>地圖貼圖</strong></td>
              <td><code>Base64 內嵌貼圖</code></td>
              <td>將平面圖直接轉 base64 存入 JS，解決本機 <code>file://</code> 跨域安全性報錯。</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    speakerNotes: "講解技術棧亮點。特別強調 import map 和 Base64 貼圖：這是能讓整個專案直接雙擊 index.html 就能跑的功臣，完全避開 CORS 錯誤。"
  },
  {
    id: 10,
    category: "實戰一・校園導覽",
    title: "核心亮點功能深度解析",
    subtitle: "鳥瞰、樓層切換、精準搜尋、第一人稱漫遊",
    contentHtml: `
      <div class="grid-2">
        <div class="toy-card toy-card-accent">
          <h3 style="font-size: 1.15rem; margin-bottom: 8px;">🦅 1. 鳥瞰與樓層切換</h3>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.6; margin-bottom: 8px;">
            建物點擊時鏡頭平滑俯衝特寫。點擊「2F」時，3 樓與屋頂瞬間隱藏，內部依配置表自動生成彩色教室方塊（高一綠、高二藍綠、高三黃、處室橘），並保留走廊。
          </p>
        </div>
        <div class="toy-card toy-card-teal">
          <h3 style="font-size: 1.15rem; margin-bottom: 8px;">🔍 2. 智慧搜尋跳轉</h3>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.6; margin-bottom: 8px;">
            輸入「203」或「健康中心」，相機自動優雅飛至該大樓，並自動切換到 2 樓、標記紅色高亮跳動箭頭。
          </p>
        </div>
        <div class="toy-card toy-card-blue">
          <h3 style="font-size: 1.15rem; margin-bottom: 8px;">📍 3. A* 路線規劃</h3>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.6; margin-bottom: 8px;">
            在校園步道節點計算最短路徑，地面浮現動態前進箭頭，上方提示「距離 180 公尺，步行約 2 分 18 秒，於中庭向左轉」。
          </p>
        </div>
        <div class="toy-card toy-card-red">
          <h3 style="font-size: 1.15rem; margin-bottom: 8px;">🚶 4. 第一人稱漫遊防碰撞</h3>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.6; margin-bottom: 8px;">
            支援鍵盤 WASD、滑鼠轉向與手機虛擬搖桿。以大樓矩形邊界做碰撞滑移檢測，人物不會穿透建築，且能穿越穿堂。
          </p>
        </div>
      </div>
    `,
    speakerNotes: "逐一介紹導覽的四大王牌功能。這四個功能加在一起，就超越了大部分學校花幾十萬外包的導覽網站。"
  },
  {
    id: 11,
    category: "實戰一・踩坑記",
    title: "【踩坑一】180° 方向旋轉大陷阱！",
    subtitle: "教務處的配置圖，上方「不一定」是北方！",
    contentHtml: `
      <div class="toy-callout toy-callout-pitfall">
        <span class="toy-callout-icon">💥</span>
        <div>
          <strong>真實踩坑重現：</strong><br>
          第一版 AI 做出來時，走進校園發現<strong>整排教室由左到右全部顛倒</strong>！101 跑到 105 的位置！
        </div>
      </div>
      <div class="grid-2" style="margin-top: 16px;">
        <div class="toy-card">
          <h4 style="color: var(--toy-red); margin-bottom: 8px;">原因分析</h4>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7;">
            教務處印製教室配置表是為了紙張排版方便，常把正德樓放在紙面上方。但校園平面圖上，正德樓其實在<strong>南方</strong>！這相當於旋轉了 180 度。<br>
            AI 預設將圖片上方當作北方，導致東側變成西側。
          </p>
        </div>
        <div class="toy-card">
          <h4 style="color: var(--toy-teal); margin-bottom: 8px;">解法與提示詞秘訣</h4>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7;">
            在提示詞中明確指定錨點：<br>
            <code style="background: var(--bg-subtle); padding: 4px 8px; border-radius: 4px; display: block; margin-top: 6px;">
              「配置圖上方是南方；正德樓靠近校門的那一端是 101 教室，排列方向為由東向西。」
            </code>
          </p>
        </div>
      </div>
    `,
    speakerNotes: "這是最具代表性的坑！分享時可以帶點幽默：連 AI 都會被教務處的排版騙過。一定要找熟悉校園的老師去核對第一間教室到底靠近哪邊。"
  },
  {
    id: 12,
    category: "實戰一・踩坑記",
    title: "【踩坑二】大樓別名與 Python 自動樹木偵測",
    subtitle: "名稱對照、標籤避讓與平面圖樹冠自動種植",
    contentHtml: `
      <div class="grid-2">
        <div class="toy-card toy-card-accent">
          <h3 style="font-size: 1.15rem; color: var(--toy-yellow-dark); margin-bottom: 8px;">🏷️ 大樓名稱別名機制</h3>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7;">
            <strong>問題：</strong>平面圖寫「土木館」、配置圖寫「土木營建館」；學生口語叫「K書中心」、官方叫「自主學習中心」。AI 會當成兩棟不同大樓。<br>
            <strong>解法：</strong>在 <code>campus-data.js</code> 加入 <code>aliases: ['土木館', '營建館']</code>，讓搜尋引擎全部能命中。
          </p>
        </div>

        <div class="toy-card toy-card-teal">
          <h3 style="font-size: 1.15rem; color: var(--toy-teal); margin-bottom: 8px;">🌳 Python 自動抓樹冠種樹</h3>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7;">
            <strong>問題：</strong>校園有幾百棵樹，手動標註座標會瘋掉。<br>
            <strong>解法：</strong>撰寫輕量 Python 腳本（Pillow + NumPy），利用「綠色色相門檻 ＋ 局部紋理變化量」，自動偵測平面圖上的綠色圓形樹冠，產出 <code>trees-data.js</code> 座標，丟進 <code>InstancedMesh</code> 瞬間種出千棵 3D 樹木！
          </p>
        </div>
      </div>
      <div class="toy-callout toy-callout-warning" style="margin-top: 20px;">
        <span class="toy-callout-icon">🏷️</span>
        <div>
          <strong>標籤避讓 (Label Occlusion)：</strong>鳥瞰拉遠時，幾十個大樓標籤疊在一起像狗皮膏藥。必須加入相機距離計算：拉遠時只顯示「正德樓、行政大樓」等主要建物，拉近時才浮現細部處室標籤。
        </div>
      </div>
    `,
    speakerNotes: "介紹 Python 自動抓樹冠的妙招。展示 AI 是全端協作的：不僅寫 JS，還能寫 Python 前處理腳本，把原本需要幾天手動標記的工作，5 秒內搞定。"
  },
  {
    id: 13,
    category: "實戰一・永續維護",
    title: "資料與程式分開：行政同仁也能維護",
    subtitle: "每學年更新班級，不用改程式碼，甚至直接讀 Google 試算表！",
    contentHtml: `
      <div class="grid-2">
        <div class="toy-card">
          <h4 style="font-size: 1.1rem; color: var(--toy-red); margin-bottom: 10px;">方案 A：修改獨立資料檔 rooms-data.js</h4>
          <p style="font-size: 0.88rem; color: var(--ink-secondary); line-height: 1.6; margin-bottom: 10px;">
            每間教室用 <code>名稱*寬度</code> 格式表示，順序照配置表：
          </p>
          <pre style="background: #2D251F; color: #F5EFEB; padding: 12px; border-radius: 8px; font-size: 0.8rem; overflow-x: auto;">
zhengde: {
  '3F': ['樓梯*33', '男廁*69', '女廁*66', '309*67', '308*66', ...],
  '2F': ['樓梯*33', '男廁*69', '女廁*66', '209*67', '208*66', ...],
  '1F': ['樓梯*33', '男廁*69', '女廁*66', '104*99', ...]
}</pre>
        </div>

        <div class="toy-card">
          <h4 style="font-size: 1.1rem; color: var(--toy-teal); margin-bottom: 10px;">方案 B：Google 試算表 CSV 雲端連動</h4>
          <p style="font-size: 0.88rem; color: var(--ink-secondary); line-height: 1.6; margin-bottom: 10px;">
            教務處同仁最熟悉的介面！試算表設定「發布到網路」為 CSV：
          </p>
          <div style="background: var(--bg-subtle); padding: 12px; border-radius: 8px; font-size: 0.85rem; line-height: 1.7; border: 1.5px solid #DECBB2;">
            欄位：<code>building, floor, order, name, width</code><br>
            網頁載入時優先 fetch 試算表 CSV，若連線失敗則自動降級（fallback）使用本機資料檔。
          </div>
        </div>
      </div>
      <div class="toy-callout toy-callout-tip" style="margin-top: 18px;">
        <span class="toy-callout-icon">💡</span>
        <div>
          <strong>校園專案能活過三年的秘訣：</strong>
          把「工程程式碼」留給資訊老師或 AI，把「教室內容」還給教務處。行政人員改得動，網站才不會隨老師輪調而廢棄！
        </div>
      </div>
    `,
    speakerNotes: "強調永續維護性。很多學校專案最怕的是做出來很炫，第二年沒人會改。我們把教室資料抽離成 Excel / CSV 格式，教務處幹事自己就能改。"
  },
  {
    id: 14,
    category: "實戰一・提示詞",
    title: "提示詞心法：一次完成 vs 四階段推進",
    subtitle: "面對龐大需求，如何避免 AI 寫到一半記憶力耗盡？",
    contentHtml: `
      <div class="grid-2">
        <div class="toy-card toy-card-accent">
          <h3 style="font-size: 1.15rem; color: var(--toy-yellow-dark); margin-bottom: 8px;">⚡ 一次完成版（適合資料已齊全）</h3>
          <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.6; margin-bottom: 10px;">
            將「資料路徑、技術限制（Three.js CDN、純前端）、各項功能清單 A~I、工作驗證要求」打包成一張完整規格書。
          </p>
          <div class="toy-pill toy-pill-yellow">優點：速度極快</div>
          <div class="toy-pill toy-pill-red" style="margin-top: 6px;">缺點：若圖片太複雜，AI 可能漏掉細節</div>
        </div>

        <div class="toy-card toy-card-teal">
          <h3 style="font-size: 1.15rem; color: var(--toy-teal); margin-bottom: 8px;">🪜 分階段推進版</h3>
          <div class="toy-pill toy-pill-teal" style="margin-bottom: 6px;">優點：循序推進、降低 AI 記憶混亂</div>
          <div class="toy-pill toy-pill-yellow" style="margin-bottom: 10px;">缺點：需分次輸入指令與逐步引導</div>
          <div style="font-size: 0.88rem; line-height: 1.6; color: var(--ink-primary);">
            <strong>階段 0：</strong>先讀圖、比對方向，列出建物清單（不寫程式碼）<br>
            <strong>階段 1：</strong>做出可旋轉縮放的 3D 鳥瞰 MVP<br>
            <strong>階段 2：</strong>串接獨立教室配置檔與樓層切換<br>
            <strong>階段 3：</strong>加入搜尋、A* 路線與第一人稱碰撞<br>
            <strong>階段 4：</strong>導覽路線、日夜光影、省電模式與上線
          </div>
        </div>
      </div>
      <div class="toy-callout toy-callout-info" style="margin-top: 20px;">
        <span class="toy-callout-icon">🎯</span>
        <div>
          <strong>給 AI 下指令的五大黃金原則：</strong>
          1. 指定專屬資料夾 ｜ 2. 先讀資料再動手 ｜ 3. 不確定就標示「推估」 ｜ 4. 資料與程式分開 ｜ 5. 要求瀏覽器實際截圖測試。
        </div>
      </div>
    `,
    speakerNotes: "重點傳授提示詞分階段哲學。特別提醒「階段 0」的重要性：先讓 AI 說出它看懂了什麼，人類確認方位無誤再讓它動工，能省下一半的 Token！"
  },
  {
    id: 15,
    category: "實戰二・探索群島",
    title: "3D 探索群島：微縮童話般的學程地圖",
    subtitle: "以南大附中探索群島為例（參考 02 製作指南）",
    contentHtml: `
      <div class="toy-callout toy-callout-tip">
        <span class="toy-callout-icon">🏝️</span>
        <div>
          <strong>十座八角形浮空小島 ＋ 木拱橋相連！</strong><br>
          中央是行政島，其餘九座代表一個專門學程或學制。島上有學程大樓、上課中的小人、牧場牛羊、會動的機具。
        </div>
      </div>
      <div class="grid-3" style="margin-top: 20px;">
        <div class="toy-card toy-card-alt">
          <div class="toy-pill toy-pill-yellow">技術核心</div>
          <h4 style="margin: 8px 0; font-size: 1.1rem;">React 19 + R3F</h4>
          <p style="font-size: 0.88rem; color: var(--ink-secondary); line-height: 1.6;">
            React Three Fiber 9 + drei 10，將 3D 物件化為優雅的 React 元件，狀態由 Zustand 全域管理。
          </p>
        </div>
        <div class="toy-card toy-card-alt">
          <div class="toy-pill toy-pill-teal">遊戲化互動</div>
          <h4 style="margin: 8px 0; font-size: 1.1rem;">9 題測驗與找松鼠</h4>
          <p style="font-size: 0.88rem; color: var(--ink-secondary); line-height: 1.6;">
            趣味適性測驗推薦三座島，校園樹上藏著 12 隻小松鼠尋寶小遊戲，讓參觀時間大幅延長。
          </p>
        </div>
        <div class="toy-card toy-card-alt">
          <div class="toy-pill toy-pill-red">真實連動</div>
          <h4 style="margin: 8px 0; font-size: 1.1rem;">即時天氣與日夜</h4>
          <p style="font-size: 0.88rem; color: var(--ink-secondary); line-height: 1.6;">
            台灣時間白天夕陽夜晚切換，Open-Meteo 免費氣象連動（雨天場景真下雨），官網公告即時爬蟲。
          </p>
        </div>
      </div>
    `,
    speakerNotes: "轉入實戰二：探索群島。這是一個更偏向形象宣傳、招生、遊戲化探索的專案，技術架構升級為 React Three Fiber。"
  },
  {
    id: 16,
    category: "實戰二・探索群島",
    title: "為什麼堅持「純程式幾何建模」？",
    subtitle: "不使用外部 3D 模型檔 (GLTF/FBX) 的三大戰略優勢",
    contentHtml: `
      <div class="grid-3" style="margin-top: 15px;">
        <div class="toy-card toy-card-accent">
          <div class="toy-pill toy-pill-yellow">優勢 1</div>
          <h3 style="margin: 10px 0; font-size: 1.2rem;">極速載入、極低流量</h3>
          <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.7;">
            傳統 3D 模型一個建築動輒 20MB~50MB，手機 4G 網路要跑很久。<br>
            <strong>幾何程式碼只有幾十 KB</strong>，瀏覽器秒開，完全不卡頻寬！
          </p>
        </div>

        <div class="toy-card toy-card-teal">
          <div class="toy-pill toy-pill-teal">優勢 2</div>
          <h3 style="margin: 10px 0; font-size: 1.2rem;">零美術門檻、易修改</h3>
          <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.7;">
            學校沒有專業 3D 建模師。所有建築、小人、動物都由「方塊、圓柱、球體」組合。<br>
            <strong>想改造型？直接告訴 AI 改參數</strong>，不必開 Blender 重新烘焙材質！
          </p>
        </div>

        <div class="toy-card toy-card-red">
          <div class="toy-pill toy-pill-red">優勢 3</div>
          <h3 style="margin: 10px 0; font-size: 1.2rem;">風格高度統一</h3>
          <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.7;">
            網路上免費下載的 3D 模型風格各異（寫實、動漫、低模混雜）。<br>
            <strong>純程式幾何讓全場光影、配色、材質完美統一</strong>，玩具微縮感渾然天成。
          </p>
        </div>
      </div>
    `,
    speakerNotes: "深入解釋為何不用 GLTF 模型檔。這打破了很多人的直覺：大家以為做 3D 一定要先去 Sketchfab 下載模型。其實純程式碼拼積木，在網頁上更輕、更快、更受控。"
  },
  {
    id: 17,
    category: "實戰二・探索群島",
    title: "營造微縮玩具感的關鍵魔法",
    subtitle: "移軸模糊 (Tilt-Shift) ＋ 柔和暖色調光影",
    contentHtml: `
      <div class="grid-2">
        <div class="toy-card">
          <h3 style="color: var(--toy-red); font-size: 1.2rem; margin-bottom: 10px;">🔍 後製魔法：移軸微縮 (Tilt-Shift)</h3>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7; margin-bottom: 12px;">
            在相機後製管線加入 <code>@react-three/postprocessing</code>：
          </p>
          <ul style="padding-left: 20px; line-height: 1.7; font-size: 0.9rem; color: var(--ink-primary);">
            <li><strong>景深移軸 (Depth of Field)：</strong>讓畫面上下兩端模糊、中央焦點清晰，人眼會立刻產生「看桌上微縮模型」的錯覺！</li>
            <li><strong>飽和度微增：</strong>讓玩具色彩更加溫潤飽滿。</li>
            <li><strong>手機自動關閉：</strong>移軸效果在手機端耗電，檢測到行動裝置自動關閉以維持順暢。</li>
          </ul>
        </div>

        <div class="toy-card">
          <h3 style="color: var(--toy-yellow-dark); font-size: 1.2rem; margin-bottom: 10px;">🌤️ 自然光線與低多邊形 (Flat Shading)</h3>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7; margin-bottom: 12px;">
            材質全部使用 <code>meshStandardMaterial</code> 搭配 <code>flatShading: true</code>：
          </p>
          <ul style="padding-left: 20px; line-height: 1.7; font-size: 0.9rem; color: var(--ink-primary);">
            <li>每個多邊形反射的光線角度明確，呈現精緻的積木立體面。</li>
            <li>半球光源 (HemisphereLight) 給予天空藍與地面沙色的雙色補光。</li>
            <li>柔和的接觸陰影 (ContactShadows)，小島彷彿真切浮在蔚藍海面上。</li>
          </ul>
        </div>
      </div>
    `,
    speakerNotes: "揭秘「玩具微縮感」的秘訣：移軸攝影效果 (Tilt-shift) 與 Flat Shading。這兩個技術是讓作品看起來高級且充滿溫度的核心。"
  },
  {
    id: 18,
    category: "實戰二・踩坑記",
    title: "【踩坑三】3,600 個物件效能最佳化保衛戰",
    subtitle: "從手機卡成幻燈片，到獨立顯卡 43+ FPS 的演進",
    contentHtml: `
      <div class="toy-callout toy-callout-pitfall">
        <span class="toy-callout-icon">⚡</span>
        <div>
          <strong>效能危機：</strong>全場 10 座島嶼加上大樓、欄杆、樹木、機器、道路，零件總數突破 <strong>3,600 個 Mesh</strong>！<br>
          在一般筆電和手機上開啟，Draw Calls 破千，畫面掉到 10 FPS 以下。
        </div>
      </div>
      <div class="grid-2" style="margin-top: 16px;">
        <div class="toy-card">
          <h4 style="color: var(--toy-red); margin-bottom: 8px;">解決方案：靜態物件合併 (Batching / Merging)</h4>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7;">
            請 AI 將島上<strong>不會移動的裝飾物件（地基、大樓本體、固定樹幹、屋頂、木拱橋）</strong>依同種材質進行幾何合併 (BufferGeometryUtils.mergeGeometries)。<br>
            Draw Calls 瞬間減少 80%，在測試顯卡上穩定維持 43~60 FPS！
          </p>
        </div>

        <div class="toy-card">
          <h4 style="color: var(--toy-teal); margin-bottom: 8px;">防穿牆與防重疊檢查</h4>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7;">
            <strong>小人穿牆：</strong>人物走路常從大樓中間穿過。設定島嶼路徑航點 (Waypoints)，小人只沿著指定步道巡邏。<br>
            <strong>動物疊羅漢：</strong>畜牧島上的羊和小豬隨機走動會重疊在一起。加入每幀簡單的球體距離排斥邏輯，確保動物不穿模。
          </p>
        </div>
      </div>
    `,
    speakerNotes: "分享效能最佳化的實戰。這是很多初學者使用 AI 做 3D 容易撞牆的地方：AI 寫得出來，但手機跑不動。物件合併是必經之路。"
  },
  {
    id: 19,
    category: "實戰二・踩坑記",
    title: "【踩坑四】官網 Big5 轉碼與李OO個資保護",
    subtitle: "做教育應用，最不能妥協的兩道防線：個資與編碼",
    contentHtml: `
      <div class="grid-2">
        <div class="toy-card toy-card-alt" style="border-top: 6px solid var(--toy-red);">
          <h3 style="color: var(--toy-red); font-size: 1.2rem; margin-bottom: 10px;">🔒 嚴格個資防護：學生姓名遮蔽</h3>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7; margin-bottom: 10px;">
            <strong>升學榜單：</strong>三年榜單 PDF 經 Python 解析轉 JSON 時，程式自動將姓名處理為「李OO」、「陳OO」，且原始 PDF 絕不上傳至公開 GitHub。<br>
            <strong>即時公告：</strong>官網公告爬蟲取回後，伺服器函式預先以正規表達式過濾姓名，確保網頁完全不暴露學生個資。
          </p>
        </div>

        <div class="toy-card toy-card-alt" style="border-top: 6px solid var(--toy-blue);">
          <h3 style="color: var(--toy-blue-dark); font-size: 1.2rem; margin-bottom: 10px;">🌐 學校官網的 Big5 編碼老坑</h3>
          <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7; margin-bottom: 10px;">
            許多老舊學校網站公告系統仍使用 <strong>Big5 編碼</strong>，瀏覽器直接 fetch 會抓出一堆亂碼。<br>
            <strong>解法：</strong>在 Vercel Serverless Function (<code>/api/news</code>) 中使用 <code>iconv-lite</code> 轉為 UTF-8，再送回前端，徹底解決跨域與亂碼難題！
          </p>
        </div>
      </div>
      <div class="toy-callout toy-callout-info" style="margin-top: 20px;">
        <span class="toy-callout-icon">👥</span>
        <div>
          <strong>零個資即時線上計數器：</strong>使用 Upstash Redis Free 方案，僅儲存匿名訪客的隨機 Session ID 與時間戳記，不記錄任何 IP 或個資，達成「線上 N 人・累計 N 人次」的激勵效果！
        </div>
      </div>
    `,
    speakerNotes: "強調法規與行政合規。做學校專案最容易被行政退件的就是個資問題。我們在底層直接做好遮蔽，校長和行政主任看了就會非常放心。"
  },
  {
    id: 20,
    category: "延伸發想・風格庫",
    title: "3D 互動網站還能怎麼玩？12 大畫面風格",
    subtitle: "換一套材質與光影，就是完全不同的氣氛！（參考 03 創意發想）",
    contentHtml: `
      <div class="grid-4" style="margin-top: 10px; font-size: 0.9rem;">
        <div class="toy-card" style="padding: 16px;">
          <div style="font-size: 1.5rem; margin-bottom: 6px;">🧸</div>
          <strong>溫暖玩具模型</strong>
          <div style="font-size: 0.8rem; color: var(--ink-secondary); margin-top: 4px;">低多邊形、移軸模糊、暖色調、親切治癒</div>
        </div>
        <div class="toy-card" style="padding: 16px;">
          <div style="font-size: 1.5rem; margin-bottom: 6px;">🟠</div>
          <strong>黏土動畫風</strong>
          <div style="font-size: 0.8rem; color: var(--ink-secondary); margin-top: 4px;">圓滾滾手捏感、指紋粗糙紋理、彈跳動作</div>
        </div>
        <div class="toy-card" style="padding: 16px;">
          <div style="font-size: 1.5rem; margin-bottom: 6px;">📖</div>
          <strong>紙雕立體書</strong>
          <div style="font-size: 0.8rem; color: var(--ink-secondary); margin-top: 4px;">紙片分層堆疊、翻頁立起動畫、語文歷史</div>
        </div>
        <div class="toy-card" style="padding: 16px;">
          <div style="font-size: 1.5rem; margin-bottom: 6px;">🧱</div>
          <strong>積木拼裝風</strong>
          <div style="font-size: 0.8rem; color: var(--ink-secondary); margin-top: 4px;">顆粒積木、零件拆解、STEAM 機械工程</div>
        </div>
        <div class="toy-card" style="padding: 16px;">
          <div style="font-size: 1.5rem; margin-bottom: 6px;">⛏️</div>
          <strong>方塊像素世界</strong>
          <div style="font-size: 0.8rem; color: var(--ink-secondary); margin-top: 4px;">Voxel 體素方塊沙盒、學生最熟悉、社團共創</div>
        </div>
        <div class="toy-card" style="padding: 16px;">
          <div style="font-size: 1.5rem; margin-bottom: 6px;">🎨</div>
          <strong>卡通描邊漫畫</strong>
          <div style="font-size: 0.8rem; color: var(--ink-secondary); margin-top: 4px;">Toon Shading、色階外框線、動漫青少年宣傳</div>
        </div>
        <div class="toy-card" style="padding: 16px;">
          <div style="font-size: 1.5rem; margin-bottom: 6px;">🖌️</div>
          <strong>水彩繪本風</strong>
          <div style="font-size: 0.8rem; color: var(--ink-secondary); margin-top: 4px;">暈染筆觸、水彩紙紋、生命教育與文學</div>
        </div>
        <div class="toy-card" style="padding: 16px;">
          <div style="font-size: 1.5rem; margin-bottom: 6px;">📐</div>
          <strong>藍圖工程線稿</strong>
          <div style="font-size: 0.8rem; color: var(--ink-secondary); margin-top: 4px;">深藍底白線條、從線框長出實體、製圖營建</div>
        </div>
      </div>
      <div style="text-align: center; margin-top: 15px; font-size: 0.95rem; color: var(--toy-teal); font-weight: 700;">
        另有「霓虹賽博夜城、復古像素遊戲、水晶玻璃折射、剪影光影皮影戲」等風格！
      </div>
    `,
    speakerNotes: "展示 12 種風格。告訴老師們：同樣的校園資料，只要換個材質關鍵字，就能給國小、高中、高職或校慶設計出完全不同調性的視覺饗宴。"
  },
  {
    id: 21,
    category: "延伸發想・主題庫",
    title: "群島之外的 14 種空間比喻主題",
    subtitle: "如果學校不做成群島，還可以做成什麼？",
    contentHtml: `
      <div class="grid-3" style="font-size: 0.92rem;">
        <div class="toy-card">
          <h4 style="font-size: 1.1rem; color: var(--toy-red); margin-bottom: 6px;">🪐 星系與星球</h4>
          <p style="color: var(--ink-secondary); line-height: 1.6;">
            學校是中央恆星，各科是繞行的行星，社團是小衛星！搭火箭登陸星球。
          </p>
        </div>
        <div class="toy-card">
          <h4 style="font-size: 1.1rem; color: var(--toy-yellow-dark); margin-bottom: 6px;">🎈 熱氣球嘉年華</h4>
          <p style="color: var(--ink-secondary); line-height: 1.6;">
            每顆熱氣球是一個學程，吊籃裡有上課微縮場景，氣球隨人氣緩緩升降。
          </p>
        </div>
        <div class="toy-card">
          <h4 style="font-size: 1.1rem; color: var(--toy-teal); margin-bottom: 6px;">🚂 列車與軌道路網</h4>
          <p style="color: var(--ink-secondary); line-height: 1.6;">
            每一站是一個學程，轉乘站是跨域選修課程，呈現「升學進路」動態。
          </p>
        </div>
        <div class="toy-card">
          <h4 style="font-size: 1.1rem; color: var(--toy-blue-dark); margin-bottom: 6px;">🌳 一棵知識大樹</h4>
          <p style="color: var(--ink-secondary); line-height: 1.6;">
            樹幹是校訓、大樹枝是學群、果實是各科，小松鼠在枝椏間跳躍跑動。
          </p>
        </div>
        <div class="toy-card">
          <h4 style="font-size: 1.1rem; color: var(--toy-purple); margin-bottom: 6px;">🎡 主題遊樂園</h4>
          <p style="color: var(--ink-secondary); line-height: 1.6;">
            每項遊樂設施是一個科別，入口門票是適性測驗，摩天輪俯瞰全校。
          </p>
        </div>
        <div class="toy-card">
          <h4 style="font-size: 1.1rem; color: #5C4A3A; margin-bottom: 6px;">🎲 大富翁桌遊地圖</h4>
          <p style="color: var(--ink-secondary); line-height: 1.6;">
            每格是一個校園景點，擲骰子前進，機會命運是校園小知識問答。
          </p>
        </div>
      </div>
    `,
    speakerNotes: "啟發大家跳脫「群島」框架。可以問現場聽眾：你的學校有沒有百年老樹？那就做知識大樹！你的學校鄰近海港？那就做海底潛水艇！"
  },
  {
    id: 22,
    category: "延伸發想・領域篇",
    title: "跨領域教育應用矩陣",
    subtitle: "3D 的最大優勢：看得到原本看不到的東西",
    contentHtml: `
      <div class="toy-table-wrap">
        <table class="toy-table" style="font-size: 0.9rem;">
          <thead>
            <tr>
              <th style="width: 20%;">領域</th>
              <th style="width: 40%;">適合的主題應用</th>
              <th style="width: 40%;">3D 帶來的獨特教學價值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>課堂學科</strong></td>
              <td>地科板塊運動、太陽系比例、物理光學折射、化學分子晶體、生物細胞結構。</td>
              <td>化抽象公式為可手動旋轉、切換參數的立體動態模型。</td>
            </tr>
            <tr>
              <td><strong>技職專業實作</strong></td>
              <td>機械零件爆炸拆解、營建從地基到屋頂施工流程、餐飲食品廚房動線檢查。</td>
              <td>零耗材成本、安全無危險的預習與虛擬實習。</td>
            </tr>
            <tr>
              <td><strong>校務與行政</strong></td>
              <td>新生報到動線、防災逃生模擬、選課博覽會、3D 數位校史館。</td>
              <td>跨越空間限制的 24 小時開放日，家長學生不再迷路。</td>
            </tr>
            <tr>
              <td><strong>醫學與健康</strong></td>
              <td>CPR / AED 操作步驟模擬、人體器官逐層剝開、就醫動線指引。</td>
              <td>降低恐懼感，透過微縮模型進行親切衛教。</td>
            </tr>
            <tr>
              <td><strong>體育與戰術</strong></td>
              <td>籃球足球 3D 戰術跑位板、運動動作多視角分解、路跑高低起伏預覽。</td>
              <td>讓球員從第三人稱視角理解空間戰術與補位邏輯。</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    speakerNotes: "總結跨學科應用。3D 的本質是「看得見太大、太小、太危險、或已消失的事物」。這段能激發各學科老師的共鳴。"
  },
  {
    id: 23,
    category: "部署方案",
    title: "零主機費部署方案：學校與個人皆適用，0 元永久託管",
    subtitle: "",
    contentHtml: `
      <div class="toy-table-wrap" style="margin-top: 15px;">
        <table class="toy-table" style="font-size: 0.95rem;">
          <thead>
            <tr>
              <th style="width: 20%;">服務項目</th>
              <th style="width: 25%;">推薦平台</th>
              <th style="width: 30%;">免費方案規格 (Free Tier)</th>
              <th style="width: 25%;">在專案中的角色</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>靜態網站託管</strong></td>
              <td>GitHub Pages / Cloudflare Pages</td>
              <td>永久免費，無限流量，支援自訂網域</td>
              <td>校園導覽網站（純前端 index.html）發布</td>
            </tr>
            <tr>
              <td><strong>全端應用主機</strong></td>
              <td>Vercel (Hobby Free)</td>
              <td>自動 Git 部署，每月 100GB 頻寬</td>
              <td>探索群島網站託管與 Serverless Functions</td>
            </tr>
            <tr>
              <td><strong>即時氣象資料</strong></td>
              <td>Open-Meteo API</td>
              <td>每日 10,000 次免費查詢，無需 API Key</td>
              <td>取得學校或所在地座標氣溫與即時天氣情境連動</td>
            </tr>
            <tr>
              <td><strong>參觀人次資料庫</strong></td>
              <td>Upstash Redis (Serverless)</td>
              <td>每日 10,000 次免費指令，零伺服器維護</td>
              <td>線上即時人數與累計參觀人次計數</td>
            </tr>
            <tr>
              <td><strong>中文字型 CDN</strong></td>
              <td>Google Fonts (Noto Sans TC)</td>
              <td>開源免費 CDN 載入 (SIL 授權)</td>
              <td>介面繁體中文字型清晰渲染</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="toy-callout toy-callout-tip" style="margin-top: 20px;">
        <span class="toy-callout-icon">💡</span>
        <div>
          <strong>零預算永續運作：</strong>
          無論是公私立學校或個人創作者，申請伺服器與公有雲預算往往繁瑣或花費高昂。本專案採用的雲端生態架構完全依靠主流平台的免費方案（Free Tier），免綁信用卡，學校與個人都能零成本長期穩定營運！
        </div>
      </div>
    `,
    speakerNotes: "介紹零主機費生態系。公立學校最怕每年編列維護費，這套技術組合完全免費且自動化，讓專案能長期在學校穩定運行。"
  },
  {
    id: 24,
    category: "總結與交流",
    title: "從點子到作品：落地六部曲",
    subtitle: "回顧今晚精華，明天就能動手啟動你的第一個專案",
    contentHtml: `
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
        <div class="slide-bullet-item">
          <span class="bullet-icon">1️⃣</span>
          <div class="bullet-text">
            <strong>找資料與盤點</strong>：校園平面圖、配置表、官網公開資料（先確認個資與授權安全）。
          </div>
        </div>
        <div class="slide-bullet-item">
          <span class="bullet-icon">2️⃣</span>
          <div class="bullet-text">
            <strong>選一個好比喻</strong>：群島、星球、列車、大樹……挑一個觀眾一看就懂、能激發想像的。
          </div>
        </div>
        <div class="slide-bullet-item">
          <span class="bullet-icon">3️⃣</span>
          <div class="bullet-text">
            <strong>定一種畫面風格</strong>：溫暖微縮模型、黏土動畫、水彩繪本，並考慮手機端執行效能。
          </div>
        </div>
        <div class="slide-bullet-item">
          <span class="bullet-icon">4️⃣</span>
          <div class="bullet-text">
            <strong>從小做起 (MVP)</strong>：先做三座島、兩棟樓、一個點擊互動，手感順了再擴充。
          </div>
        </div>
        <div class="slide-bullet-item">
          <span class="bullet-icon">5️⃣</span>
          <div class="bullet-text">
            <strong>資料與程式碼分開獨立管理</strong>：文字放獨立資料檔或 Google 試算表，方便行政日後維護。
          </div>
        </div>
        <div class="slide-bullet-item">
          <span class="bullet-icon">6️⃣</span>
          <div class="bullet-text">
            <strong>熟悉校園的人一起校對</strong>：找老師、學生一起抓出左右顛倒與穿模問題，共同成就作品！
          </div>
        </div>
      </div>
    `,
    speakerNotes: "幫全體學員梳理落地六部曲，加深記憶。這也是整場演講最精簡的實踐指南。"
  },
  {
    id: 25,
    category: "總結與交流",
    title: "總結與 Q&A 互動時間",
    subtitle: "歡迎提出你心中的點子或踩坑疑問，一起交流！",
    contentHtml: `
      <div class="toy-card toy-card-accent" style="text-align: center; padding: 36px 24px; margin-top: 10px;">
        <div style="font-size: 2.8rem; margin-bottom: 10px;">🌟</div>
        <h3 style="font-size: 1.6rem; margin-bottom: 12px; color: var(--ink-primary);">
          「AI 降低了技術門檻，但賦予作品靈魂與溫度的，<br>永遠是心懷熱情與愛的你們。」
        </h3>
        <p style="font-size: 1rem; color: var(--ink-secondary); max-width: 720px; margin: 0 auto 20px; line-height: 1.8;">
          希望今晚全球動物現場的爆紅經驗、校園導覽與群島的踩坑紀錄，能成為大家手邊一把實用的起子。期待在不久的將來，看見各位專屬的 3D 故事！
        </p>
        <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; margin-bottom: 20px;">
          <a href="#/toolbox" class="toy-btn toy-btn-primary" style="font-size: 0.95rem; padding: 10px 22px;">前往提示詞工具箱 📋</a>
          <a href="#/creative-extensions" class="toy-btn toy-btn-teal" style="font-size: 0.95rem; padding: 10px 22px;">體驗創意發想實驗室 🧪</a>
          <a href="https://begin0808.github.io/studio0808/#sponsor-section" target="_blank" class="toy-btn toy-btn-secondary" style="background: #F59E0B; color: #FFF; font-weight: 800; font-size: 0.95rem; padding: 10px 22px; border: 2px solid #3C332A; box-shadow: 0 4px 0 #3C332A;">☕ 請我喝杯咖啡 ↗</a>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; font-size: 0.9rem; color: var(--ink-secondary); flex-wrap: wrap; gap: 10px;">
        <span>李佳恩老師（Studio0808 智造實驗室）・2026/10/28</span>
        <span>感謝所有參與今晚線上分享會的夥伴 😊</span>
      </div>
    `,
    speakerNotes: "演講結語。感謝大家今晚的參與，開放問答。若覺得今天的分享有幫助，也歡迎點擊按鈕請我喝杯咖啡支持持續創作！"
  }
];
