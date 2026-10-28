/**
 * PAGE 04: 延伸創意發想・風格、主題與跨域應用
 * 深度整合 03創意發想.pdf
 */
export function renderCreativePage() {
  return `
    <div class="page-header-box">
      <div class="page-badge-row">
        <span class="toy-pill toy-pill-purple">創意篇</span>
        <span class="toy-pill toy-pill-yellow">12 種風格</span>
        <span class="toy-pill toy-pill-teal">14 種空間比喻</span>
      </div>
      <h1 class="page-title">3D 互動網站還能怎麼玩？</h1>
    </div>

    <!-- 內嵌互動實驗室 -->
    <div id="metaphorLabContainer"></div>

    <!-- 12 種畫面風格展示區 -->
    <div style="margin: 36px 0 20px;">
      <span class="toy-pill toy-pill-teal">風格實驗室</span>
      <h2 style="font-size: 1.6rem; margin-top: 8px;">12 種 3D 視覺風格與 Prompt 關鍵字庫</h2>
      <p style="color: var(--ink-secondary); font-size: 0.95rem; margin-top: 4px;">
        挑選風格時，先考慮受眾是誰（國小、高中、家長、業界）、主題個性（溫暖、科技、人文）以及手機效能。
      </p>
    </div>

    <div class="style-grid" id="styleExplorerContainer"></div>

    <!-- 14 種空間比喻 -->
    <div style="margin: 40px 0 20px;">
      <span class="toy-pill toy-pill-yellow">主題庫</span>
      <h2 style="font-size: 1.6rem; margin-top: 8px;">群島之外的 14 種空間比喻點子</h2>
      <p style="color: var(--ink-secondary); font-size: 0.95rem; margin-top: 4px;">
        「群島」的本質是一個中心串起許多單元。只要換個比喻，就是一個讓人耳目一新的全新作品！
      </p>
    </div>

    <div class="grid-3">
      <div class="toy-card">
        <div style="font-size: 1.8rem; margin-bottom: 6px;">🪐</div>
        <h4 style="font-size: 1.15rem; color: var(--toy-red);">1. 星系與星球</h4>
        <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.6;">
          學校是中央恆星，各科是繞行的星球，社團是衛星。<br>
          <strong>亮點：</strong>搭火箭降落星球表面；跨科合作畫成星座連線。
        </p>
      </div>

      <div class="toy-card">
        <div style="font-size: 1.8rem; margin-bottom: 6px;">🚀</div>
        <h4 style="font-size: 1.15rem; color: var(--toy-yellow-dark);">2. 太空站與飛船</h4>
        <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.6;">
          每個艙室是一個科別，艦橋是行政核心。<br>
          <strong>亮點：</strong>穿過艙門走廊；新生點擊按鈕「登艦報到」。
        </p>
      </div>

      <div class="toy-card">
        <div style="font-size: 1.8rem; margin-bottom: 6px;">🎈</div>
        <h4 style="font-size: 1.15rem; color: var(--toy-teal);">3. 熱氣球嘉年華</h4>
        <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.6;">
          每顆熱氣球是一個學程，吊籃裡是上課微縮場景。<br>
          <strong>亮點：</strong>氣球緩緩升降；黃昏點燈；可依點擊人氣改變氣球高度。
        </p>
      </div>

      <div class="toy-card">
        <div style="font-size: 1.8rem; margin-bottom: 6px;">🚂</div>
        <h4 style="font-size: 1.15rem; color: var(--toy-blue-dark);">4. 列車與軌道路線圖</h4>
        <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.6;">
          每一站是一個學程，轉乘站是跨領域核心課程。<br>
          <strong>亮點：</strong>小火車進站開門；特別適合作為「升學進路發展」路線圖。
        </p>
      </div>

      <div class="toy-card">
        <div style="font-size: 1.8rem; margin-bottom: 6px;">🎡</div>
        <h4 style="font-size: 1.15rem; color: var(--toy-purple);">5. 主題遊樂園</h4>
        <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.6;">
          每個遊樂設施代表一個學程，入口門票是適性測驗。<br>
          <strong>亮點：</strong>集章闖關卡；搭摩天輪俯瞰全校園區。
        </p>
      </div>

      <div class="toy-card">
        <div style="font-size: 1.8rem; margin-bottom: 6px;">🌊</div>
        <h4 style="font-size: 1.15rem; color: var(--toy-teal-dark);">6. 海底城市與泡泡</h4>
        <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.6;">
          每個透明水下泡泡是一個學程，潛水艇負責導覽穿梭。<br>
          <strong>亮點：</strong>魚群游過、海面灑下光柱，極度適合海洋教育。
        </p>
      </div>

      <div class="toy-card">
        <div style="font-size: 1.8rem; margin-bottom: 6px;">🌳</div>
        <h4 style="font-size: 1.15rem; color: var(--toy-teal);">7. 一棵知識大樹</h4>
        <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.6;">
          樹幹是學校核心、大樹枝是學群、果實是各科。<br>
          <strong>亮點：</strong>春夏秋冬四季落葉代表學期變化；小松鼠在樹枝跑跳。
        </p>
      </div>

      <div class="toy-card">
        <div style="font-size: 1.8rem; margin-bottom: 6px;">☁️</div>
        <h4 style="font-size: 1.15rem; color: var(--toy-blue-dark);">8. 天空之城浮島</h4>
        <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.6;">
          浮在雲海上的漂浮島嶼，飛行船在島嶼之間穿梭往來。<br>
          <strong>亮點：</strong>鏡頭穿雲而過的壯觀運鏡；瀑布從小島邊緣流向雲海。
        </p>
      </div>

      <div class="toy-card">
        <div style="font-size: 1.8rem; margin-bottom: 6px;">🎲</div>
        <h4 style="font-size: 1.15rem; color: var(--toy-yellow-dark);">9. 互動大富翁桌遊</h4>
        <p style="font-size: 0.9rem; color: var(--ink-secondary); line-height: 1.6;">
          棋盤每一格是一個學程或校園地標。<br>
          <strong>亮點：</strong>擲骰子前進，機會命運卡是校園歷史與特色小知識問答。
        </p>
      </div>
    </div>

    <!-- 跨領域應用清單 -->
    <div class="toy-card toy-card-alt" style="margin-top: 36px; border: 2.5px solid #3C332A;">
      <h3 style="font-size: 1.3rem; margin-bottom: 12px; color: var(--ink-primary);">
        🌍 3D 互動網站的六大跨領域實踐戰場
      </h3>
      <div class="grid-2" style="margin: 0; font-size: 0.92rem;">
        <div>
          <strong style="color: var(--toy-teal); display: block; margin-bottom: 6px;">📚 1. 課堂學科教學</strong>
          地科板塊運動、颱風路徑、太陽系比例、物理光的折射與拋射運動、化學分子晶體、生物細胞構造切片、歷史古城重建。
        </div>
        <div>
          <strong style="color: var(--toy-yellow-dark); display: block; margin-bottom: 6px;">🔧 2. 技職專業實作</strong>
          機械零件拆解與組裝順序、營建從地基到屋頂施工流程、電機配電盤電路板元件、餐飲廚房動線檢查遊戲、智慧農場飼養。
        </div>
        <div style="margin-top: 14px;">
          <strong style="color: var(--toy-red); display: block; margin-bottom: 6px;">🏫 3. 校務行政與安全</strong>
          新生報到與無障礙動線、地震火災逃生路線演練、選課博覽會、3D 數位校史館、畢業紀念 3D 校園、大螢幕自動導覽展示。
        </div>
        <div style="margin-top: 14px;">
          <strong style="color: var(--toy-blue-dark); display: block; margin-bottom: 6px;">🏥 4. 醫學、體育與公共議題</strong>
          CPR/AED 救護操作步驟、就醫動線導引；籃球足球 3D 戰術跑位板、運動動作多視角分解；社區淹水模擬、路口視線死角體驗。
        </div>
      </div>
    </div>
  `;
}
