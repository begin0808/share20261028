/**
 * PAGE 05: 零主機費部署方案
 * 移除 Token 黑洞，專注於學校網站的 0 元永久託管與雲端生態系
 */
export function renderPitfallsPage() {
  return `
    <div class="page-header-box">
      <div class="page-badge-row">
        <span class="toy-pill toy-pill-teal">零主機費架構</span>
        <span class="toy-pill toy-pill-yellow">免費方案</span>
        <span class="toy-pill toy-pill-red">學校與個人皆適用</span>
      </div>
      <h1 class="page-title">零主機費部署方案</h1>
    </div>

    <!-- $0 免費雲端架構生態 -->
    <div class="toy-card toy-card-accent" style="margin-top: 10px; border: 2.5px solid #3C332A;">
      <h2 style="font-size: 1.45rem; margin-bottom: 12px; color: var(--ink-primary);">
        ☁️ 零主機費生態系：讓學校與個人 3D 作品 0 元永久託管
      </h2>
      <p style="font-size: 1rem; color: var(--ink-secondary); line-height: 1.8; margin-bottom: 20px;">
        無論是公私立學校或個人創作者，申請伺服器與雲端主機預算往往繁瑣或花費高昂。本專案採用的架構經過實證，能<strong>完全依靠主流平台的免費方案 (Free Tier) 永久運作</strong>，不需綁定信用卡，學校或個人零預算也能輕鬆上線！
      </p>

      <div class="toy-table-wrap">
        <table class="toy-table">
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
              <td>永久免費，無限流量，支援自訂網域與 HTTPS</td>
              <td>校園導覽網站（純前端 index.html）發布</td>
            </tr>
            <tr>
              <td><strong>全端應用主機</strong></td>
              <td>Vercel (Hobby Free)</td>
              <td>自動 Git 部署，每月 100GB 頻寬，無伺服器維護負擔</td>
              <td>探索群島網站託管與 Serverless Functions</td>
            </tr>
            <tr>
              <td><strong>即時氣象資料</strong></td>
              <td>Open-Meteo API</td>
              <td>每日 10,000 次免費查詢，無需 API Key，開箱即用</td>
              <td>取得學校或所在地座標氣溫與即時天氣情境連動</td>
            </tr>
            <tr>
              <td><strong>參觀人次資料庫</strong></td>
              <td>Upstash Redis (Serverless)</td>
              <td>每日 10,000 次免費指令，超量平滑降級，零維護</td>
              <td>線上即時人數與累計參觀人次計數</td>
            </tr>
            <tr>
              <td><strong>中文字型 CDN</strong></td>
              <td>Google Fonts</td>
              <td>開源免費 CDN 載入 (SIL Open Font License)</td>
              <td>Noto Sans TC 介面字型清晰渲染</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 學校與個人部署指南卡片 -->
    <div class="grid-2" style="margin-top: 28px;">
      <div class="toy-card toy-card-teal">
        <div class="toy-pill toy-pill-teal">途徑 A</div>
        <h3 style="font-size: 1.25rem; margin: 10px 0;">GitHub Pages 靜態發布流程</h3>
        <ul style="padding-left: 20px; line-height: 1.8; font-size: 0.95rem; color: var(--ink-primary);">
          <li>適合「純前端無後端」的 3D 校園導覽專案。</li>
          <li>在 GitHub 建立一個公開或私有儲存庫（Repository）。</li>
          <li>將專案資料夾推送至儲存庫，至 Settings ➔ Pages 開啟 GitHub Pages。</li>
          <li>約 1 分鐘後即可取得 <code>https://&lt;帳號&gt;.github.io/&lt;專案名&gt;/</code> 永久免費網址！</li>
        </ul>
      </div>

      <div class="toy-card toy-card-blue">
        <div class="toy-pill toy-pill-blue">途徑 B</div>
        <h3 style="font-size: 1.25rem; margin: 10px 0;">Vercel 自動化部署流程</h3>
        <ul style="padding-left: 20px; line-height: 1.8; font-size: 0.95rem; color: var(--ink-primary);">
          <li>適合「Vite + React + Three.js」或需要代理爬蟲的專案。</li>
          <li>使用 GitHub 帳號免費登入 Vercel 官網。</li>
          <li>點擊「Add New Project」選取專案儲存庫，點擊 Deploy。</li>
          <li>推送到 GitHub 後 Vercel 自動打包編譯，提供 <code>vercel.app</code> 免費域名與 CDN 加速。</li>
        </ul>
      </div>
    </div>
  `;
}
