/**
 * PAGE 02: 實戰一・3D 校園導覽網站開發實戰
 * 深度整合 01_3D校園導覽網站_製作指南與技術說明.pdf
 */
export function renderCampusTourPage() {
  return `
    <div class="page-header-box">
      <div class="page-badge-row">
        <span class="toy-pill toy-pill-red">實戰案例 01</span>
        <span class="toy-pill toy-pill-yellow">純前端靜態</span>
        <span class="toy-pill toy-pill-teal">國立臺南大學附中</span>
      </div>
      <h1 class="page-title">3D 校園導覽網站</h1>
      <div style="margin-top: 16px;">
        <a href="https://begin0808.github.io/3Dtntcsh/" target="_blank" class="toy-btn toy-btn-primary">
          🚀 開啟實作成果：南大附中 3D 校園導覽 ↗
        </a>
      </div>
    </div>

    <!-- 成果核心功能展示 -->
    <div class="toy-card toy-card-accent" style="margin-bottom: 28px;">
      <h3 style="font-size: 1.3rem; margin-bottom: 14px;">🌟 成果介紹：做出來的網站有什麼功能？</h3>
      <div class="grid-3" style="margin: 0;">
        <div style="background: var(--bg-card-alt); padding: 16px; border-radius: 14px; border: 1.5px solid #EADBCC;">
          <strong style="color: var(--toy-red-dark); display: block; margin-bottom: 4px;">🦅 鳥瞰校園</strong>
          平面圖鋪成地面，建物依圖擠出 3D 量體；依平面圖樹冠自動種植上千棵樹木，支援全方位平移縮放。
        </div>
        <div style="background: var(--bg-card-alt); padding: 16px; border-radius: 14px; border: 1.5px solid #EADBCC;">
          <strong style="color: var(--toy-yellow-dark); display: block; margin-bottom: 4px;">🔢 樓層切換與彩色教室</strong>
          點選大樓後上層自動隱藏，依配置表動態生成彩色方塊教室（高一綠、高二藍綠、高三黃、處室橘）。
        </div>
        <div style="background: var(--bg-card-alt); padding: 16px; border-radius: 14px; border: 1.5px solid #EADBCC;">
          <strong style="color: var(--toy-teal-dark); display: block; margin-bottom: 4px;">🔍 智慧搜尋特寫</strong>
          搜尋「203」或「健康中心」，相機優雅飛過去並自動切換到正德樓 3 樓，以動態箭頭標記位置。
        </div>
        <div style="background: var(--bg-card-alt); padding: 16px; border-radius: 14px; border: 1.5px solid #EADBCC;">
          <strong style="color: var(--toy-blue-dark); display: block; margin-bottom: 4px;">📍 A* 演算法路線規劃</strong>
          在校園步道路網找最短路徑，即時計算距離、步行時間（每秒 1.3m）與轉彎提示，地面浮現前進箭頭。
        </div>
        <div style="background: var(--bg-card-alt); padding: 16px; border-radius: 14px; border: 1.5px solid #EADBCC;">
          <strong style="color: var(--toy-purple); display: block; margin-bottom: 4px;">🚶 第一人稱漫遊防碰撞</strong>
          支援鍵盤 WASD、滑鼠轉頭、手機虛擬搖桿與點擊地面行走。以建物占地矩形做碰撞檢測，絕不穿牆！
        </div>
        <div style="background: var(--bg-card-alt); padding: 16px; border-radius: 14px; border: 1.5px solid #EADBCC;">
          <strong style="color: var(--ink-primary); display: block; margin-bottom: 4px;">🧭 精選導覽與日夜光影</strong>
          新生報到路線自動逐站巡航播放、支援白天／黃昏／夜晚窗燈、小地圖、省電模式與深色模式。
        </div>
      </div>
    </div>

    <!-- 實戰踩坑專區 -->
    <h2 style="font-size: 1.6rem; margin: 32px 0 16px;">💣 實戰踩坑：六大最容易翻車的血淚眉角</h2>
    <div class="grid-2">
      <div class="toy-card toy-card-red">
        <span class="toy-pill toy-pill-red">致命坑 1</span>
        <h3 style="margin: 8px 0; font-size: 1.2rem;">配置圖方向與平面圖旋轉 180°</h3>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7;">
          <strong>血淚教訓：</strong>教務處畫配置圖是為了紙張排版好看，不一定上方是北方！本校配置圖把正德樓畫在上方、利用樓在右側；但平面圖上正德樓在南、利用樓在西，等於<strong>旋轉了 180°</strong>！第一版做出來，全校教室整排左右相反。<br>
          <strong>防坑解法：</strong>提示詞務必寫明錨點：「正德樓靠近校門的那一端是 101 教室，排列方向為由東向西」。
        </p>
      </div>

      <div class="toy-card toy-card-accent">
        <span class="toy-pill toy-pill-yellow">混淆坑 2</span>
        <h3 style="margin: 8px 0; font-size: 1.2rem;">名稱不統一與同義詞搜尋</h3>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7;">
          <strong>血淚教訓：</strong>平面圖寫「土木館」、配置圖寫「土木營建館」；甚至有「畜牧館」vs「畜產館」，AI 會誤判為兩棟不同建物！<br>
          <strong>防坑解法：</strong>指定以官方名稱為準，並在資料檔加入 <code>aliases: ['K書中心', '晚自習室']</code>，搜尋別名也能精準跳轉。
        </p>
      </div>

      <div class="toy-card toy-card-teal">
        <span class="toy-pill toy-pill-teal">自動化 3</span>
        <h3 style="margin: 8px 0; font-size: 1.2rem;">校園樹木自動種植：Python 影象偵測</h3>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7;">
          <strong>血淚教訓：</strong>校園裡有數百棵樹木，手動在 3D 空間點選座標根本是不可能的任務。<br>
          <strong>防坑解法：</strong>請 AI 寫一支 <code>tools/build_assets.py</code>，用 Pillow + NumPy 分析平面圖上的綠色圓形樹冠，自動提取座標並生成 <code>trees-data.js</code>，再透過 <code>InstancedMesh</code> 瞬間渲染數千棵樹！
        </p>
      </div>

      <div class="toy-card toy-card-blue">
        <span class="toy-pill toy-pill-blue">體驗坑 4</span>
        <h3 style="margin: 8px 0; font-size: 1.2rem;">鳥瞰標籤重疊與遮擋避讓</h3>
        <p style="font-size: 0.92rem; color: var(--ink-secondary); line-height: 1.7;">
          <strong>血淚教訓：</strong>鳥瞰視角時，幾十棟建築與處室的 CSS2D HTML 標籤疊在一起，整個畫面一片混亂。<br>
          <strong>防坑解法：</strong>計算相機與建物距離：距離較遠時只顯示主要大樓名稱；相機拉近時才漸顯各樓層處室細節，並做水平自動避讓。
        </p>
      </div>
    </div>

    <!-- 永續維護架構 -->
    <div class="toy-card toy-card-alt" style="margin-top: 28px; border: 2.5px solid #3C332A;">
      <h3 style="font-size: 1.3rem; margin-bottom: 12px; color: var(--toy-teal-dark);">
        🌱 永續維護：如何讓非工程背景的行政同仁每年自己更新？
      </h3>
      <p style="font-size: 0.95rem; color: var(--ink-secondary); line-height: 1.7; margin-bottom: 16px;">
        網站要活下去，絕對不能每次換學年都要資訊老師重寫程式碼。我們設計了<strong>資料與程式分開的雙軌機制</strong>：
      </p>
      <div class="grid-2">
        <div style="background: #FFF; padding: 18px; border-radius: 12px; border: 1.5px solid #DFCFC0;">
          <strong style="color: var(--toy-red);">方法 1：獨立檔案 rooms-data.js</strong>
          <p style="font-size: 0.88rem; color: var(--ink-secondary); margin: 6px 0 10px;">
            每一層是一串「名稱*寬度」，順序照配置表：
          </p>
          <pre style="background: #2D251F; color: #FAF6EE; padding: 10px; border-radius: 6px; font-size: 0.8rem; overflow-x: auto;">
zhengde: {
  '3F': ['樓梯*33', '男廁*69', '309*67', '308*66', ...],
  '2F': ['樓梯*33', '男廁*69', '209*67', '208*66', ...],
  '1F': ['樓梯*33', '健康中心*130', '101*67', ...]
}</pre>
        </div>
        <div style="background: #FFF; padding: 18px; border-radius: 12px; border: 1.5px solid #DFCFC0;">
          <strong style="color: var(--toy-teal);">方法 2：Google 試算表 CSV 雲端直連</strong>
          <p style="font-size: 0.88rem; color: var(--ink-secondary); margin: 6px 0 10px;">
            教務處同仁最熟悉的試算表！設定「發布到網路」為 CSV：
          </p>
          <div style="background: var(--bg-subtle); padding: 10px; border-radius: 6px; font-size: 0.82rem; line-height: 1.6;">
            欄位：<code>building, floor, order, name, width</code><br>
            網頁載入時動態讀取，讀取失敗時無縫切換本地靜態檔。行政改完試算表，3D 網站立刻生效！
          </div>
        </div>
      </div>
    </div>

    <!-- 上線前驗收檢查表 -->
    <div class="toy-card toy-card-accent" style="margin-top: 28px;">
      <h3 style="font-size: 1.3rem; margin-bottom: 14px;">✅ 上線前 10 大關鍵檢查清單</h3>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 0.92rem;">
        <div style="background: #FFF; padding: 12px 16px; border-radius: 10px; border: 1px solid #E2D3BF;">
          ☑ <strong>1. 方位校對：</strong>請熟悉校園的老師實地站在校門確認教室左右方向無誤。
        </div>
        <div style="background: #FFF; padding: 12px 16px; border-radius: 10px; border: 1px solid #E2D3BF;">
          ☑ <strong>2. 樓層標記：</strong>非教學大樓（宿舍、圖書館）樓層數確認，推估資料明示「推估」。
        </div>
        <div style="background: #FFF; padding: 12px 16px; border-radius: 10px; border: 1px solid #E2D3BF;">
          ☑ <strong>3. 搜尋測試：</strong>搜尋常用目標（教務處、某班教室、健康中心）均能正確飛航特寫。
        </div>
        <div style="background: #FFF; padding: 12px 16px; border-radius: 10px; border: 1px solid #E2D3BF;">
          ☑ <strong>4. 路線通暢：</strong>校門至各主建物 A* 路徑合理，不穿過封閉大樓，玄關設為可通行。
        </div>
        <div style="background: #FFF; padding: 12px 16px; border-radius: 10px; border: 1px solid #E2D3BF;">
          ☑ <strong>5. 行動體驗最佳化：</strong>手機直式瀏覽操作順暢，底部抽屜面板可滑動關閉。
        </div>
        <div style="background: #FFF; padding: 12px 16px; border-radius: 10px; border: 1px solid #E2D3BF;">
          ☑ <strong>6. 舊電腦效能：</strong>學校電腦教室的無顯卡電腦開啟順暢，提供省電模式開關。
        </div>
        <div style="background: #FFF; padding: 12px 16px; border-radius: 10px; border: 1px solid #E2D3BF;">
          ☑ <strong>7. 隱私防線：</strong>學生宿舍、機房僅留外觀，絕不公開不宜之室內隱私配置。
        </div>
        <div style="background: #FFF; padding: 12px 16px; border-radius: 10px; border: 1px solid #E2D3BF;">
          ☑ <strong>8. 個資檢驗：</strong>配置表與標籤中嚴禁出現學生姓名或私人電話。
        </div>
        <div style="background: #FFF; padding: 12px 16px; border-radius: 10px; border: 1px solid #E2D3BF;">
          ☑ <strong>9. 授權確認：</strong>校徽、平面圖資使用已取得學校行政或總務處授權。
        </div>
        <div style="background: #FFF; padding: 12px 16px; border-radius: 10px; border: 1px solid #E2D3BF;">
          ☑ <strong>10. 免費部署：</strong>上傳至 GitHub Pages 或 Cloudflare Pages，享受永久免費託管！
        </div>
      </div>
    </div>
  `;
}
