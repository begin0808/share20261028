import { createWorld } from './scene/world.js';
import { CATEGORIES, CLUBS, CLUB_BY_ID, CAT_BY_ID, clubsOf } from './data/clubs.js';
import { QUESTIONS } from './data/quiz.js';
import { WEATHER, FEED } from './config.js';
import { fmtClock, sessionStatus, fmtDuration, fetchWeather, fetchFeed, timeAgo } from './live.js';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* 無痕模式 */ } },
};
const isMobile = () => matchMedia('(max-width: 760px)').matches;

let world;
const passport = new Set(store.get('skyclub.passport', []).filter(id => CLUB_BY_ID[id]));
const viewed = new Set(store.get('skyclub.feedViewed', []));
let feed = [];
let current = null; // 目前面板 { type, id }

/* ================= 開場 ================= */
async function boot() {
  const bar = $('#intro-bar');
  bar.style.width = '15%';
  await Promise.race([document.fonts.ready, sleep(2500)]);
  bar.style.width = '45%';
  await new Promise(r => requestAnimationFrame(() => setTimeout(r, 30)));
  try {
    world = createWorld($('#stage'));
  } catch (err) {
    console.error(err);
    $('#intro-go').innerHTML = '此裝置無法顯示 3D 畫面';
    $('#intro-quiz').disabled = false;
    $('#intro-quiz').textContent = '改用文字清單瀏覽';
    $('#intro-quiz').onclick = () => { $('#intro').classList.add('gone'); openDirectory(); };
    return;
  }
  bar.style.width = '100%';
  world.onSelect = handleSelect;
  const forced = new URLSearchParams(location.search).get('time');
  if (['day', 'dusk', 'night'].includes(forced)) {
    world.setTimeMode(forced);
    $('#time-label').textContent = { day: '白天', dusk: '黃昏', night: '夜晚' }[forced];
    $('#tb-time').classList.add('on');
  }
  world.start();
  if (new URLSearchParams(location.search).has('debug')) window.__world = world;
  setupUI();
  startLive();

  const go = $('#intro-go'), quiz = $('#intro-quiz');
  go.disabled = quiz.disabled = false;
  go.textContent = '啟航探索 ›';
  const enter = () => {
    $('#intro').classList.add('gone');
    world.overview('angle', 3.2);
    setTimeout(applyHash, 900);
  };
  go.onclick = enter;
  quiz.onclick = () => { enter(); setTimeout(openQuiz, 600); };
  go.focus();
}

/* ================= 選取 ================= */
function handleSelect(p) {
  stopTour();
  if (p.type === 'island') showIsland(p.id);
  else if (p.type === 'club') showClub(p.id);
  else if (p.type === 'hub') showHub();
  else if (p.type === 'feed') showFeed();
}

function setHash(h) {
  try { history.replaceState(null, '', h ? `#${h}` : location.pathname + location.search); } catch { /* ignore */ }
}
function applyHash() {
  const h = new URLSearchParams(location.hash.slice(1));
  if (h.get('club') && CLUB_BY_ID[h.get('club')]) showClub(h.get('club'));
  else if (h.get('island') && CAT_BY_ID[h.get('island')]) showIsland(h.get('island'));
  else if (h.has('feed')) showFeed();
}

/* ================= 面板 ================= */
function openPanel(html, ctx, { fly } = {}) {
  current = ctx;
  const panel = $('#panel');
  panel.hidden = false;
  panel.style.animation = 'none';
  void panel.offsetWidth;
  panel.style.animation = '';
  $('#panel-body').innerHTML = html;
  $('#panel-body').scrollTop = 0;
  document.body.classList.add('panel-open');
  syncInset();
  fly?.();
}
function syncInset() {
  if (isMobile()) world.setInset(0, $('#panel').offsetHeight, $('.topbar').getBoundingClientRect().bottom);
  else world.setInset($('#panel').offsetWidth + 32, 0);
}
function closePanel() {
  $('#panel').hidden = true;
  current = null;
  world.setInset(0, 0);
  world.highlightClub(null);
  document.body.classList.remove('panel-open');
  setHash('');
}

const catOf = id => CAT_BY_ID[id];
const clubNews = id => feed.filter(f => f.clubId === id);
const freshNews = f => Date.now() - f.ts < 3 * 86400000 && !viewed.has(f.key);

function clubCard(cl) {
  const cat = catOf(cl.cat);
  const hasNews = clubNews(cl.id).some(freshNews);
  return `<button class="club-card" style="--c:${cat.color}" data-club="${cl.id}">
    <span class="e">${cl.emoji}</span><span><b>${esc(cl.name)}</b><small>${esc(cl.tagline)}</small></span>
    ${passport.has(cl.id) ? '<span class="stamp" title="已蓋章">🎫</span>' : ''}${hasNews ? '<span class="news" title="有新動態"></span>' : ''}
  </button>`;
}

function showIsland(id, { fly = true } = {}) {
  const cat = catOf(id);
  const list = clubsOf(id);
  const idx = CATEGORIES.indexOf(cat);
  const got = list.filter(c => passport.has(c.id)).length;
  const news = list.reduce((n, c) => n + clubNews(c.id).filter(freshNews).length, 0);
  world.highlightClub(null);
  openPanel(`
    <div class="panel-hero" style="--c:${cat.color}">
      <span class="big-emoji">${cat.emoji}</span>
      <h3>${cat.island}</h3>
      <p class="sub">${cat.name}社團・${list.length} 個社團</p>
      <div class="chips"><span class="chip" style="--c:${cat.color}">${esc(cat.focus)}</span></div>
    </div>
    <div class="panel-sec"><p>${esc(cat.intro)}</p></div>
    <div class="panel-sec">
      <div class="stats">
        <div class="stat"><b>${list.length}</b><span>社團</span></div>
        <div class="stat"><b>${got}<small style="font-size:13px">/${list.length}</small></b><span>護照印章</span></div>
        <div class="stat"><b>${news}</b><span>新動態</span></div>
      </div>
    </div>
    <div class="panel-sec"><h4>島上的社團</h4><div class="club-grid">${list.map(clubCard).join('')}</div></div>
    <div class="nav-row">
      <button class="btn btn-ghost btn-sm" data-island="${CATEGORIES[(idx + 5) % 6].id}">‹ ${CATEGORIES[(idx + 5) % 6].island}</button>
      <button class="btn btn-ghost btn-sm" data-island="${CATEGORIES[(idx + 1) % 6].id}">${CATEGORIES[(idx + 1) % 6].island} ›</button>
    </div>`, { type: 'island', id }, { fly: fly ? () => world.focusIsland(id) : null });
  setHash(`island=${id}`);
}

function sessionHtml() {
  const s = sessionStatus();
  if (!s.session) return '<div class="session-box"><span class="dot"></span>社課時間依學校公告</div>';
  if (s.live) return `<div class="session-box live"><span class="dot"></span><div><b>社課進行中</b>・還有 ${fmtDuration(s.minsLeft)}<br><small>${esc(s.session.label)} ${s.session.start}–${s.session.end}</small></div></div>`;
  return `<div class="session-box"><span class="dot"></span><div>下次社課：<b>${esc(s.session.label)}</b> ${s.session.start}<br><small>${fmtDuration(s.minsUntil)}後開始</small></div></div>`;
}

function showClub(id, { fly = true } = {}) {
  const cl = CLUB_BY_ID[id];
  const cat = catOf(cl.cat);
  const list = clubsOf(cl.cat);
  const i = list.indexOf(cl);
  const isNew = !passport.has(id);
  if (isNew) {
    passport.add(id);
    store.set('skyclub.passport', [...passport]);
    updatePassport(true);
  }
  const news = clubNews(id);
  news.forEach(f => viewed.add(f.key));
  store.set('skyclub.feedViewed', [...viewed].slice(-300));
  refreshAlerts();
  world.highlightClub(id);
  openPanel(`
    <div class="panel-hero" style="--c:${cat.color}">
      <button class="link back" data-island="${cat.id}">‹ 回到${cat.island}</button>
      <span class="big-emoji">${cl.emoji}</span>
      <h3>${esc(cl.name)}</h3>
      <p class="sub">${esc(cl.tagline)}</p>
      <div class="chips">
        <button class="chip" style="--c:${cat.color}" data-island="${cat.id}">${cat.emoji} ${cat.island}</button>
        <span class="chip" style="--c:${cat.color}">${cat.name}</span>
        ${sessionStatus().live ? '<span class="chip live">● 社課中</span>' : ''}
      </div>
    </div>
    <div class="panel-sec"><h4>社團介紹</h4><p>${esc(cl.desc)}</p></div>
    <div class="panel-sec" style="--c:${cat.color}"><h4>活動亮點</h4><ul class="hl">${cl.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul></div>
    <div class="panel-sec"><h4>社課時間</h4><div data-live="session">${sessionHtml()}</div></div>
    ${news.length ? `<div class="panel-sec"><h4>社團動態</h4><ul class="feed">${news.slice(0, 4).map(feedItem).join('')}</ul></div>` : ''}
    <div class="panel-sec">
      <div class="stamp-box" style="--c:${cat.color}">
        <div class="stamp-seal ${isNew ? 'new' : ''}">${cl.emoji}</div>
        <div><b>${isNew ? '蓋章成功！' : '已收集這枚印章'}</b><span>社團護照 ${passport.size} / ${CLUBS.length}</span><br><button class="link" data-act="passport">查看我的護照 ›</button></div>
      </div>
    </div>
    <div class="nav-row">
      <button class="btn btn-ghost btn-sm" data-club="${list[(i + list.length - 1) % list.length].id}">‹ ${esc(list[(i + list.length - 1) % list.length].name)}</button>
      <button class="btn btn-ghost btn-sm" data-club="${list[(i + 1) % list.length].id}">${esc(list[(i + 1) % list.length].name)} ›</button>
    </div>
    <p class="foot-note">社團介紹與社課時段為示意內容，實際資訊以學務處及各社團公告為準。</p>`,
  { type: 'club', id }, { fly: fly ? () => world.focusClub(id) : null });
  setHash(`club=${id}`);
  if (isNew && passport.size === CLUBS.length) setTimeout(() => { toast('🎉 50 枚印章全部集滿！你是附中社團達人！'); confetti(); }, 700);
}

function showHub() {
  world.highlightClub(null);
  const max = Math.max(...CATEGORIES.map(c => clubsOf(c.id).length));
  openPanel(`
    <div class="panel-hero" style="--c:#e39b2d">
      <span class="big-emoji">🏛️</span>
      <h3>社團中心</h3>
      <p class="sub">南大附中社團群島的中央島</p>
    </div>
    <div class="panel-sec"><p>延續原「運動、康樂、音樂、學藝、服務」架構，115 學年度社團依性質細分為六大類。六座浮空島以吊橋和社團中心相連，點選小島或攤位就能認識每個社團。</p></div>
    <div class="panel-sec"><h4>分類統計・合計 ${CLUBS.length} 個社團</h4>
      <div class="bars">${CATEGORIES.map(c => {
        const n = clubsOf(c.id).length;
        return `<button class="bar-row" style="--c:${c.color}" data-island="${c.id}"><span>${c.emoji} ${c.name}</span><i style="width:${n / max * 100}%"></i><span>${n}</span></button>`;
      }).join('')}</div>
    </div>
    <div class="panel-sec"><h4>社課時間</h4><div data-live="session">${sessionHtml()}</div></div>
    <div class="panel-sec" style="display:flex;flex-wrap:wrap;gap:8px">
      <button class="btn btn-primary btn-sm" data-act="feed">📌 即時動態</button>
      <button class="btn btn-ghost btn-sm" data-act="list">📋 社團總覽</button>
      <button class="btn btn-ghost btn-sm" data-act="quiz">✨ 配對測驗</button>
      <button class="btn btn-ghost btn-sm" data-act="passport">🎫 社團護照</button>
    </div>`, { type: 'hub' }, { fly: () => world.focusIsland('hub') });
  setHash('');
}

function feedItem(f) {
  const cl = CLUB_BY_ID[f.clubId];
  const cat = cl && catOf(cl.cat);
  return `<li><button class="feed-item" ${cl ? `data-club="${cl.id}"` : ''}>
    <span class="meta">${cl ? `<span class="chip" style="--c:${cat.color}">${cl.emoji} ${esc(cl.name)}</span>` : '<span class="chip">📢 全校</span>'}
    <span class="${freshNews(f) ? 'fresh' : ''}">${timeAgo(f.ts)}</span></span>
    <b>${esc(f.title)}</b>${f.body ? `<p>${esc(f.body)}</p>` : ''}
  </button></li>`;
}

function showFeed() {
  world.highlightClub(null);
  openPanel(`
    <div class="panel-hero" style="--c:#e0483c">
      <span class="big-emoji">📌</span>
      <h3>社團即時動態</h3>
      <p class="sub">每 ${FEED.refreshSeconds} 秒自動更新・共 ${feed.length} 則</p>
    </div>
    <div class="panel-sec">${feed.length ? `<ul class="feed">${feed.map(feedItem).join('')}</ul>` : '<p class="empty">目前沒有新動態</p>'}</div>
    <p class="foot-note">資料來源：${FEED.sheetCsv ? 'Google 試算表' : 'public/data/feed.json'}。標示「示範」的內容為範例資料。</p>`,
  { type: 'feed' }, { fly: () => world.focusIsland('hub') });
  setHash('feed');
}

/* ================= 對話框 ================= */
function openModal(html, onOpen) {
  const modal = $('#modal');
  $('#modal-card').innerHTML = `<button class="panel-close modal-close" data-act="close-modal" aria-label="關閉">✕</button>${html}`;
  modal.hidden = false;
  onOpen?.($('#modal-card'));
}
function closeModal() { $('#modal').hidden = true; }

function openDirectory({ focus = false } = {}) {
  let filter = 'all', q = '';
  openModal(`
    <h3>社團總覽</h3>
    <p class="lead">115 學年度・6 大類 ${CLUBS.length} 個社團。輸入關鍵字或點分類篩選。</p>
    <input class="search-input" id="dir-q" type="search" placeholder="搜尋社團名稱、活動內容…（例如：吉他、程式、動物）" autocomplete="off" />
    <div class="filter-row" id="dir-f">
      <button class="chip on" data-f="all">全部</button>
      ${CATEGORIES.map(c => `<button class="chip" style="--c:${c.color}" data-f="${c.id}">${c.emoji} ${c.name}</button>`).join('')}
    </div>
    <div id="dir-list"></div>`, card => {
    const render = () => {
      const kw = q.trim().toLowerCase();
      const html = CATEGORIES.filter(c => filter === 'all' || filter === c.id).map(c => {
        const hits = clubsOf(c.id).filter(cl => !kw || [cl.name, cl.tagline, cl.desc, ...cl.highlights, c.name, c.island].join(' ').toLowerCase().includes(kw));
        if (!hits.length) return '';
        return `<div class="list-cat" style="--c:${c.color}"><h4><i></i>${c.island}<small>${c.name}・${hits.length} 社</small></h4>
          <div class="list-grid">${hits.map(clubCard).join('')}</div></div>`;
      }).join('');
      card.querySelector('#dir-list').innerHTML = html || `<p class="empty">找不到「${esc(q)}」相關的社團，換個關鍵字試試？</p>`;
    };
    const input = card.querySelector('#dir-q');
    input.addEventListener('input', () => { q = input.value; render(); });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') card.querySelector('#dir-list [data-club]')?.click();
    });
    card.querySelector('#dir-f').addEventListener('click', e => {
      const b = e.target.closest('[data-f]');
      if (!b) return;
      filter = b.dataset.f;
      card.querySelectorAll('#dir-f .chip').forEach(x => x.classList.toggle('on', x === b));
      render();
    });
    render();
    if (focus) setTimeout(() => input.focus(), 50);
  });
}

function openPassport() {
  const got = passport.size;
  openModal(`
    <h3>🎫 我的社團護照</h3>
    <p class="lead">點開社團介紹就會自動蓋章。已收集 <b>${got}</b> / ${CLUBS.length} 枚${got === CLUBS.length ? '，全部集滿了！🎉' : '，繼續探索吧！'}</p>
    ${CATEGORIES.map(c => `<div class="list-cat" style="--c:${c.color}"><h4><i></i>${c.island}<small>${clubsOf(c.id).filter(x => passport.has(x.id)).length} / ${clubsOf(c.id).length}</small></h4>
      <div class="passport-grid">${clubsOf(c.id).map(cl => `<button class="pp-stamp ${passport.has(cl.id) ? 'got' : ''}" style="--c:${c.color}" data-club="${cl.id}"><span><span class="e">${cl.emoji}</span>${esc(cl.name)}</span></button>`).join('')}</div></div>`).join('')}
    <p class="foot-note" style="padding:8px 0 0">印章紀錄只存在這台裝置的瀏覽器中。</p>`);
}

function openQuiz() {
  const answers = [];
  const render = card => {
    const step = answers.length;
    if (step === QUESTIONS.length) return renderResult(card);
    const Q = QUESTIONS[step];
    card.innerHTML = `<button class="panel-close modal-close" data-act="close-modal" aria-label="關閉">✕</button>
      <h3>✨ 社團配對測驗</h3>
      <div class="quiz-progress"><i style="width:${step / QUESTIONS.length * 100}%"></i></div>
      <span class="quiz-step">第 ${step + 1} 題 / 共 ${QUESTIONS.length} 題</span>
      <p class="quiz-q">${Q.q}</p>
      <div class="quiz-opts">${Q.a.map((a, i) => `<button class="quiz-opt" data-a="${i}">${a[0]}</button>`).join('')}</div>
      <div class="quiz-foot">${step ? '<button class="link" data-q="back">‹ 上一題</button>' : '<span></span>'}<span class="quiz-step">憑直覺選就好</span></div>`;
    card.onclick = e => {
      const opt = e.target.closest('[data-a]');
      if (opt) { answers.push(+opt.dataset.a); render(card); }
      if (e.target.closest('[data-q="back"]')) { answers.pop(); render(card); }
    };
  };
  const renderResult = card => {
    const catScore = {}, tagScore = {};
    answers.forEach((ai, qi) => {
      const [, cats, tags] = QUESTIONS[qi].a[ai];
      for (const k in cats) catScore[k] = (catScore[k] || 0) + cats[k];
      tags.forEach(t => { tagScore[t] = (tagScore[t] || 0) + 1; });
    });
    const ranked = CLUBS.map(cl => ({ cl, s: (catScore[cl.cat] || 0) * 0.8 + cl.tags.reduce((n, t) => n + (tagScore[t] || 0), 0) + Math.random() * 0.01 }))
      .sort((a, b) => b.s - a.s);
    const top = ranked.slice(0, 3).map(r => r.cl);
    const bestCat = Object.entries(catScore).sort((a, b) => b[1] - a[1])[0]?.[0] || top[0].cat;
    const cat = catOf(bestCat);
    card.onclick = null;
    card.innerHTML = `<button class="panel-close modal-close" data-act="close-modal" aria-label="關閉">✕</button>
      <h3>測驗結果</h3>
      <p class="lead">最適合你的浮空島是……</p>
      <div class="result-island" style="--c:${cat.color}">
        <span style="font-size:34px">${cat.emoji}</span>
        <b>${cat.island}</b><span class="chip" style="--c:${cat.color}">${cat.name}</span>
        <p>${esc(cat.intro)}</p>
      </div>
      <h4 style="margin:0 0 8px;font-size:14px;color:var(--muted)">推薦你去看看這三個社團</h4>
      <div class="club-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">${top.map(clubCard).join('')}</div>
      <div class="quiz-foot" style="margin-top:18px">
        <button class="link" data-act="quiz">↻ 重新測驗</button>
        <button class="btn btn-primary btn-sm" data-island="${cat.id}">飛去${cat.island} ›</button>
      </div>
      <p class="foot-note" style="padding:12px 0 0">結果只是興趣參考，選社前歡迎實際到社團攤位看看、問問學長姐。</p>`;
  };
  openModal('', render);
}

/* ================= 導覽 ================= */
const TOUR = ['hub', ...CATEGORIES.map(c => c.id)];
const tour = { on: false, i: 0, playing: true, t0: 0, elapsed: 0, dur: 9000, timer: 0 };
function tourGo(i) {
  tour.i = (i + TOUR.length) % TOUR.length;
  tour.t0 = performance.now(); tour.elapsed = 0;
  const id = TOUR[tour.i];
  if (id === 'hub') showHub(); else showIsland(id);
  $('#tour-name').textContent = id === 'hub' ? '社團中心' : catOf(id).island;
}
function startTour() {
  closeModal();
  tour.on = true; tour.playing = true;
  $('#tour-bar').hidden = false;
  $('#tb-tour').classList.add('on');
  $('#tour-play').textContent = '⏸';
  tourGo(0);
  clearInterval(tour.timer);
  tour.timer = setInterval(() => {
    if (!tour.playing) return;
    const e = tour.elapsed + performance.now() - tour.t0;
    $('#tour-progress').style.width = `${Math.min(1, e / tour.dur) * 100}%`;
    if (e >= tour.dur) tourGo(tour.i + 1);
  }, 100);
}
function stopTour() {
  if (!tour.on) return;
  tour.on = false;
  clearInterval(tour.timer);
  $('#tour-bar').hidden = true;
  $('#tb-tour').classList.remove('on');
}
function toggleTourPlay() {
  if (tour.playing) tour.elapsed += performance.now() - tour.t0;
  else tour.t0 = performance.now();
  tour.playing = !tour.playing;
  $('#tour-play').textContent = tour.playing ? '⏸' : '▶';
}

/* ================= 介面綁定 ================= */
function setupUI() {
  $('#howto').textContent = matchMedia('(pointer: coarse)').matches
    ? '單指旋轉・雙指平移與縮放・點島嶼或攤位看介紹'
    : '左鍵拖曳旋轉・右鍵平移・滾輪縮放・按 / 搜尋社團';
  updatePassport(false);

  // 委派點擊：面板、對話框共用 data-* 動作
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-club],[data-island],[data-act]');
    if (!t || t.closest('.label-layer')) return;
    if (t.dataset.club) { closeModal(); stopTour(); showClub(t.dataset.club); return; }
    if (t.dataset.island) { closeModal(); stopTour(); showIsland(t.dataset.island); return; }
    const act = t.dataset.act;
    if (act === 'close-modal') closeModal();
    else if (act === 'passport') openPassport();
    else if (act === 'quiz') openQuiz();
    else if (act === 'list') openDirectory();
    else if (act === 'feed') { closeModal(); showFeed(); }
  });
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
  $('#panel-close').onclick = () => { stopTour(); closePanel(); };
  $('#brand').onclick = e => { e.preventDefault(); stopTour(); closePanel(); world.overview('angle'); setView('angle'); };
  $('#ticker').onclick = () => { stopTour(); showFeed(); };
  $('#passport-mini').onclick = openPassport;
  $('#tb-quiz').onclick = openQuiz;
  $('#tb-search').onclick = () => openDirectory({ focus: true });
  $('#tb-tour').onclick = () => (tour.on ? stopTour() : startTour());
  $('#tour-prev').onclick = () => tourGo(tour.i - 1);
  $('#tour-next').onclick = () => tourGo(tour.i + 1);
  $('#tour-play').onclick = toggleTourPlay;
  $('#tour-end').onclick = stopTour;

  document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.view;
    if (v === 'list') { openDirectory(); return; }
    stopTour(); closePanel(); setView(v); world.overview(v);
  }));

  const TIMES = [['auto', '即時'], ['day', '白天'], ['dusk', '黃昏'], ['night', '夜晚']];
  $('#tb-time').onclick = () => {
    const i = (TIMES.findIndex(([k]) => k === world.timeMode) + 1) % TIMES.length;
    world.setTimeMode(TIMES[i][0]);
    $('#time-label').textContent = TIMES[i][1];
    $('#tb-time').classList.toggle('on', i !== 0);
    toast(i === 0 ? '🕒 跟隨臺灣現在時間' : `🕒 切換到${TIMES[i][1]}`);
  };
  $('#tb-labels').onclick = e => {
    const on = !e.currentTarget.classList.contains('on');
    e.currentTarget.classList.toggle('on', on);
    world.setLabels(on);
  };
  const tilt = $('#tb-tilt');
  tilt.classList.toggle('on', world.tilt);
  tilt.onclick = () => { world.setTilt(!world.tilt); tilt.classList.toggle('on', world.tilt); };
  const pause = $('#tb-pause');
  const syncPause = () => { pause.classList.toggle('on', world.paused); pause.querySelector('span').textContent = world.paused ? '播放' : '暫停'; pause.firstChild.textContent = world.paused ? '▶️ ' : '⏸️ '; };
  syncPause();
  pause.onclick = () => { world.setPaused(!world.paused); syncPause(); };

  addEventListener('keydown', e => {
    if (e.target.matches('input, textarea')) { if (e.key === 'Escape') closeModal(); return; }
    if (e.key === 'Escape') {
      if (!$('#modal').hidden) closeModal();
      else if (tour.on) stopTour();
      else if (current) closePanel();
    } else if (e.key === '/') { e.preventDefault(); openDirectory({ focus: true }); }
    else if (tour.on && e.key === 'ArrowRight') tourGo(tour.i + 1);
    else if (tour.on && e.key === 'ArrowLeft') tourGo(tour.i - 1);
    else if (tour.on && e.key === ' ') { e.preventDefault(); toggleTourPlay(); }
  });
  addEventListener('resize', () => {
    if (current) syncInset();
  });
}
function setView(v) {
  document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('on', b.dataset.view === v));
}

function updatePassport(animate) {
  $('#passport-count').textContent = `${passport.size} / ${CLUBS.length}`;
  $('#passport-bar').style.width = `${passport.size / CLUBS.length * 100}%`;
  if (animate) toast(`🎫 蓋章！社團護照 ${passport.size} / ${CLUBS.length}`);
}

/* ================= 即時資訊 ================= */
function startLive() {
  const tick = () => {
    const c = fmtClock();
    $('#clock-time').innerHTML = `${c.time}<small>:${c.sec}</small>`;
    $('#clock-date').textContent = `${c.date}・${c.week}`;
    const s = sessionStatus();
    world.setLive(!!s.live);
    const box = $('#session');
    box.classList.toggle('live', !!s.live);
    if (s.live) {
      $('#session-title').textContent = '社課進行中';
      $('#session-sub').textContent = `還有 ${fmtDuration(s.minsLeft)}`;
    } else if (s.session) {
      $('#session-title').textContent = `下次社課 ${s.session.label.slice(0, 2)}`;
      $('#session-sub').textContent = `${fmtDuration(s.minsUntil)}後`;
    }
    if (c.sec === '00') document.querySelectorAll('[data-live="session"]').forEach(el => { el.innerHTML = sessionHtml(); });
  };
  tick();
  setInterval(tick, 1000);

  const loadWeather = async () => {
    try {
      const w = await fetchWeather();
      $('#wx-icon').textContent = w.icon;
      $('#wx-temp').textContent = `${w.temp}°C`;
      $('#wx-text').textContent = `${WEATHER.place}・${w.text}`;
      $('#wx').title = `${WEATHER.place}即時天氣：${w.text}，體感 ${w.feels}°C・濕度 ${w.humidity}%・風速 ${w.wind} km/h`;
      world.setWeather(w.kind);
    } catch {
      $('#wx-text').textContent = '天氣暫時無法取得';
    }
  };
  loadWeather();
  setInterval(loadWeather, WEATHER.refreshMinutes * 60000);

  let first = true, known = new Set();
  const loadFeed = async () => {
    try {
      const items = await fetchFeed();
      const fresh = items.filter(f => !known.has(f.key));
      feed = items;
      known = new Set(items.map(f => f.key));
      if (!first && fresh.length) toast(`🔔 新動態：${fresh[0].title}`);
      first = false;
      refreshAlerts();
      startTicker();
      if (current?.type === 'feed') showFeed();
    } catch (err) {
      console.warn('feed', err);
      $('#ticker-text').textContent = '暫時無法讀取社團動態';
    }
  };
  loadFeed();
  setInterval(loadFeed, FEED.refreshSeconds * 1000);
}

function refreshAlerts() {
  world.setAlerts([...new Set(feed.filter(f => f.clubId && freshNews(f)).map(f => f.clubId))]);
}

let tickerTimer, tickerI = 0;
function startTicker() {
  clearInterval(tickerTimer);
  const items = feed.slice(0, 8);
  const el = $('#ticker-text');
  if (!items.length) { el.textContent = '目前沒有新動態'; return; }
  const show = () => {
    const f = items[tickerI++ % items.length];
    el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap');
    el.innerHTML = `${esc(f.title)}<small>${timeAgo(f.ts)}</small>`;
  };
  show();
  tickerTimer = setInterval(show, 5000);
}

/* ================= 小工具 ================= */
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
}
function confetti() {
  const cols = CATEGORIES.map(c => c.color);
  for (let i = 0; i < 90; i++) {
    const d = document.createElement('i');
    d.className = 'confetti';
    d.style.left = `${Math.random() * 100}vw`;
    d.style.background = cols[i % cols.length];
    d.style.animationDuration = `${2 + Math.random() * 2}s`;
    d.style.animationDelay = `${Math.random() * 0.6}s`;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 5000);
  }
}

boot();
