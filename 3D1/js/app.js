// 國立南大附中 3D 校園導覽 — 介面與互動
(function () {
  "use strict";
  const TN = window.TN, C = window.CAMPUS, W = TN.world;
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const DEG = Math.PI / 180;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const isTouch = matchMedia("(pointer: coarse)").matches;
  document.body.classList.toggle("touch", isTouch);

  const loadMsg = (t, p) => { $("#loadingMsg").textContent = t; $("#loadingBar").style.width = p + "%"; };

  // ───────── 初始化 ─────────
  const canvas = $("#scene");
  let ctl;
  function boot() {
    loadMsg("建構校園模型中…", 30);
    W.init(canvas);
    loadMsg("配置互動功能…", 80);
    ctl = TN.ctl = TN.Controls(W.camera, canvas);
    TN.walk.bindPointer(canvas);
    ctl.onClick = onSceneClick;
    ctl.onUserMove = () => { if (TN.nav.sim) stopSim(); };
    resize();
    $("#yearTxt").textContent = C.academicYear;
    $("#addrTxt").textContent = `${C.school.name}｜${C.school.address}｜電話 ${C.school.phone}`;
    buildLabels(); buildSearch(); buildNav(); buildPrograms(); buildViews(); buildMinimap(); bindUI();
    applyView(C.views[0], 0);
    if (!readHash()) setTimeout(() => toast(isTouch ? "單指拖曳平移、雙指縮放旋轉，點建築看介紹" : "拖曳平移、右鍵旋轉、滾輪縮放，點建築看介紹"), 900);
    requestAnimationFrame(loop);
    setTimeout(() => { $("#loading").classList.add("done"); }, 250);
    // 字型載入後重繪地面文字
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => W.setTheme(W.theme));
  }

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    W.renderer.setSize(w, h, false);
    W.camera.aspect = w / h;
    W.camera.fov = w < h ? 55 : 45;
    W.camera.updateProjectionMatrix();
    viewShift = -1;
  }
  window.addEventListener("resize", resize);

  // ───────── 主迴圈 ─────────
  let lastT = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
    const t = now / 1000;
    if (TN.walk.active) {
      const p = TN.walk.tick(dt);
      if (p) updateWalkNear(p);
    } else ctl.step(now);
    TN.nav.tick(dt, t, ctl);
    W.tick(t);
    updateViewOffset();
    W.renderer.render(W.scene, W.camera);
    updateLabels();
    updateHud();
    requestAnimationFrame(loop);
  }

  // 手機版底部面板展開時，將 3D 畫面中心上移，避免選取的建築被面板遮住
  let viewShift = -1;
  function updateViewOffset() {
    const w = window.innerWidth, h = window.innerHeight;
    // 桌機版右側資訊面板開啟時，則將畫面中心左移
    const mobile = w <= 720, walking = TN.walk.active;
    const sheet = mobile && !walking && (!$("#drawer").hidden || !$("#navPanel").hidden || !$("#progPanel").hidden);
    const side = !mobile && !walking && !$("#drawer").hidden;
    const sx = side ? 190 : 0, sy = sheet ? Math.round(h * 0.24) : 0;
    const key = sx * 10000 + sy;
    if (key === viewShift) return;
    viewShift = key;
    if (sx || sy) W.camera.setViewOffset(w, h, sx, sy, w, h); else W.camera.clearViewOffset();
  }

  // ───────── 標籤 ─────────
  const labels = [];
  const catIcon = { 教學: "🏫", 行政: "🏛️", 學程: "🛠️", 生活: "☕", 運動: "🏃", 設施: "🅿️" };
  function buildLabels() {
    const box = $("#labels");
    TN.allPlaces.forEach((b) => {
      const r = W.records[b.id]; if (!r) return;
      const el = document.createElement("div");
      el.className = "blabel cat-" + b.cat;
      el.innerHTML = `<i>${catIcon[b.cat] || "📍"}</i>${esc(b.name)}`;
      el.addEventListener("click", () => openBuilding(b.id, { fly: true }));
      box.appendChild(el);
      const prio = { 教學: 3, 行政: 3, 學程: 2, 生活: 2, 運動: 1, 設施: 0 }[b.cat] || 1;
      labels.push({ id: b.id, el, pos: new THREE.Vector3(r.rw.cx, r.top + 3, r.rw.cz), prio, room: false });
    });
  }
  function setRoomLabels(fv) {
    labels.filter((l) => l.room).forEach((l) => l.el.remove());
    for (let i = labels.length - 1; i >= 0; i--) if (labels[i].room) labels.splice(i, 1);
    if (!fv) return;
    fv.layout.forEach(({ room, box, y0 }, i) => {
      if (room.t === "st" || room.t === "wc" && room.w < 2) return;
      const el = document.createElement("div");
      el.className = "rlabel t-" + room.t;
      el.textContent = room.t === "wc" ? "🚻" : TN.roomTitle(room);
      el.addEventListener("click", () => focusRoom(i, true));
      $("#labels").appendChild(el);
      labels.push({ id: fv.id, el, pos: new THREE.Vector3((box.x0 + box.x1) / 2, y0 + TN.FLOOR_H + 0.4, (box.z0 + box.z1) / 2), prio: 9, room: true, idx: i });
    });
  }
  const v = new THREE.Vector3();
  function updateLabels() {
    const w = window.innerWidth, h = window.innerHeight, placed = [];
    const far = !TN.walk.active && ctl.dist > 950;
    const sel = state.selected;
    const order = labels.slice().sort((a, b) => (b.id === sel) - (a.id === sel) || b.prio - a.prio);
    for (const L of order) {
      v.copy(L.pos).project(W.camera);
      let show = v.z < 1 && v.x > -1.1 && v.x < 1.1 && v.y > -1.1 && v.y < 1.1;
      if (show && !L.room && far && L.prio < 2 && L.id !== sel) show = false;
      if (show && W.floorView && !L.room && L.id === W.floorView.id) show = false;
      if (show && TN.walk.active) {
        const d = W.camera.position.distanceTo(L.pos);
        if (d > 160 || L.room) show = false;
      }
      if (!show) { L.el.style.display = "none"; continue; }
      const x = (v.x * 0.5 + 0.5) * w, y = (-v.y * 0.5 + 0.5) * h;
      const bw = L.room ? 40 : L.el.offsetWidth || 80, bh = 22;
      const rect = [x - bw / 2, y - bh, x + bw / 2, y];
      if (!L.room && placed.some((p) => rect[0] < p[2] && rect[2] > p[0] && rect[1] < p[3] && rect[3] > p[1])) { L.el.style.display = "none"; continue; }
      if (!L.room) placed.push(rect);
      L.el.style.display = "";
      L.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
      L.el.classList.toggle("sel", L.id === sel && !L.room);
      if (L.room) L.el.classList.toggle("focus", W.floorView && W.floorView.focus === L.idx);
    }
  }

  // ───────── 指北針、比例尺、小地圖 ─────────
  function updateHud() {
    let yaw = ctl.yaw;
    if (TN.walk.active) yaw = -TN.walk.position().h;
    $("#dial").style.transform = `rotate(${yaw / DEG}deg)`;
    // 比例尺：以畫面中心的地面距離估算
    const D = TN.walk.active ? 12 : W.camera.position.distanceTo(ctl.target);
    const mpp = (2 * D * Math.tan((W.camera.fov * DEG) / 2)) / window.innerHeight;
    const target = 90 * mpp, pow = Math.pow(10, Math.floor(Math.log10(target)));
    const nice = [1, 2, 5, 10].map((k) => k * pow).filter((n) => n <= target).pop() || pow;
    $("#scaleBar").style.width = nice / mpp + "px";
    $("#scaleTxt").textContent = nice >= 1000 ? nice / 1000 + " km" : nice + " m";
    updateMinimap(yaw);
    $("#btnTilt").textContent = ctl.pitch > 80 * DEG ? "3D" : "2D";
  }

  let mm = null;
  function buildMinimap() {
    const img = $("#mmImg");
    img.src = C.map.image;
    const svg = $("#mmSvg");
    svg.setAttribute("viewBox", `0 0 ${C.map.width} ${C.map.height}`);
    svg.innerHTML = `<polyline id="mmRoute" fill="none" stroke="#ff3d68" stroke-width="26" stroke-linejoin="round" stroke-linecap="round"/>
      <g id="mmMe"><path d="M0,-120 L60,40 L0,10 L-60,40Z" fill="#1d6fe0" stroke="#fff" stroke-width="14"/></g>
      <circle id="mmSel" r="60" fill="none" stroke="#ff3d68" stroke-width="22" style="display:none"/>`;
    mm = { svg, me: $("#mmMe"), route: $("#mmRoute"), sel: $("#mmSel") };
    $("#mmBody").addEventListener("click", (e) => {
      const r = $("#mmBody").getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * C.map.width, py = ((e.clientY - r.top) / r.height) * C.map.height;
      const w = TN.px2w(px, py);
      if (TN.walk.active) return;
      ctl.flyTo({ x: w.x, z: w.z, dist: Math.min(ctl.dist, 320) }, 900);
    });
    $("#miniToggle").addEventListener("click", () => {
      const c = $("#minimap").classList.toggle("collapsed");
      $("#miniToggle").textContent = c ? "▴" : "▾";
    });
    if (isTouch && window.innerWidth < 700) { $("#minimap").classList.add("collapsed"); $("#miniToggle").textContent = "▴"; }
  }
  function updateMinimap(yaw) {
    if (!mm) return;
    let x = ctl.target.x, z = ctl.target.z;
    if (TN.walk.active) { const p = TN.walk.position(); x = p.x; z = p.z; }
    const [px, py] = TN.w2px(x, z);
    mm.me.setAttribute("transform", `translate(${px.toFixed(0)},${py.toFixed(0)}) rotate(${(-yaw / DEG).toFixed(1)})`);
  }
  function minimapRoute(route) {
    mm.route.setAttribute("points", route ? route.pts.map((p) => TN.w2px(p.x, p.y).map((n) => n.toFixed(0)).join(",")).join(" ") : "");
  }
  function minimapSel(id) {
    const b = id && TN.byId[id];
    if (!b) { mm.sel.style.display = "none"; return; }
    mm.sel.style.display = "";
    mm.sel.setAttribute("cx", (b.rect[0] + b.rect[2]) / 2); mm.sel.setAttribute("cy", (b.rect[1] + b.rect[3]) / 2);
    mm.sel.setAttribute("r", Math.max(60, Math.max(b.rect[2] - b.rect[0], b.rect[3] - b.rect[1]) / 2 + 30));
  }

  // ───────── 視角 ─────────
  function applyView(vw, ms) {
    const w = TN.px2w(vw.center[0], vw.center[1]);
    const to = { x: w.x, z: w.z, dist: vw.dist * (window.innerWidth < window.innerHeight ? 1.35 : 1), yaw: vw.yaw * DEG, pitch: vw.pitch * DEG };
    if (!ms) { Object.assign(ctl, { dist: to.dist, yaw: to.yaw, pitch: to.pitch }); ctl.target.set(to.x, 0, to.z); ctl.update(); }
    else ctl.flyTo(to, ms);
  }
  function buildViews() {
    const box = $("#viewChips");
    C.views.forEach((vw) => {
      const b = document.createElement("button");
      b.className = "chip glass"; b.innerHTML = `${vw.icon} ${esc(vw.name)}`;
      b.addEventListener("click", () => { exitWalk(); closeDrawer(); applyView(vw, 1400); });
      box.appendChild(b);
    });
  }
  function flyToBuilding(id, extra) {
    const r = W.records[id]; if (!r) return;
    const size = Math.max(r.rw.w, r.rw.d);
    const dist = THREE.MathUtils.clamp(size * 1.9 + r.top * 2.2, 70, 520) * (window.innerWidth < 700 ? 1.3 : 1);
    ctl.flyTo(Object.assign({ x: r.rw.cx, z: r.rw.cz, dist, pitch: Math.max(ctl.pitch > 80 * DEG ? 50 * DEG : ctl.pitch, 32 * DEG) }, extra || {}), 1300);
  }
  function fitBounds(pts, ms) {
    const xs = pts.map((p) => p.x), zs = pts.map((p) => p.z);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), z0 = Math.min(...zs), z1 = Math.max(...zs);
    const span = Math.max(x1 - x0, (z1 - z0) * 1.1, 60);
    ctl.flyTo({ x: (x0 + x1) / 2, z: (z0 + z1) / 2 + span * 0.05, dist: span * 1.5 + 110, pitch: 55 * DEG }, ms || 1300);
  }

  // ───────── 點選 ─────────
  function onSceneClick(x, y) {
    const hit = W.pick(x, y);
    if (!hit) { closeSearch(); return; }
    if (hit.room != null && W.floorView && hit.id === W.floorView.id) { focusRoom(hit.room, true); return; }
    openBuilding(hit.id, { fly: false });
  }

  // ───────── 建築資訊面板 ─────────
  const state = { selected: null, floor: 0 };
  function dims(id) {
    const b = TN.byId[id], r = W.records[id];
    const w = (b.rect[2] - b.rect[0]) * C.map.metersPerPx, d = (b.rect[3] - b.rect[1]) * C.map.metersPerPx;
    return { L: Math.max(w, d), D: Math.min(w, d), H: r ? r.top : 0 };
  }
  function openBuilding(id, opt) {
    opt = opt || {};
    const b = TN.byId[id]; if (!b) return;
    closePanel("progPanel");
    state.selected = id;
    W.highlight([id], "#ff4d6d"); minimapSel(id);
    if (opt.fly) flyToBuilding(id);
    renderDrawer(id);
    if (opt.floor) selectFloor(opt.floor, opt.room);
    else if (W.floorView) { W.exitFloor(); setRoomLabels(null); }
    setHash(id, opt.floor, opt.room);
  }
  function renderDrawer(id) {
    const b = TN.byId[id], dm = dims(id), dr = $("#drawer");
    const floors = b.rooms ? Object.keys(b.rooms).map(Number) : [];
    const progs = C.programs.filter((p) => p.buildings.includes(id));
    const isBld = !!C.buildings.find((x) => x.id === id);
    const statFloors = isBld && b.floors ? `<div><b>${b.floors}</b><small>樓層${b.basement ? "＋B1" : ""}</small></div>` : "";
    dr.innerHTML = `
      <div class="p-head">
        <div><span class="cat cat-${b.cat}">${catIcon[b.cat] || "📍"} ${esc(b.cat)}</span><h2>${esc(b.name)}</h2></div>
        <button class="x" id="drawerClose" aria-label="關閉">✕</button>
      </div>
      <div class="stats">${statFloors}
        <div><b>${dm.L.toFixed(0)}<em>×</em>${dm.D.toFixed(0)}</b><small>長×寬 (m)</small></div>
        ${isBld ? `<div><b>${dm.H.toFixed(0)}</b><small>約高 (m)</small></div>` : ""}
      </div>
      <p class="sum">${esc(b.summary || "")}</p>
      <div class="tags">${(b.tags || []).map((t) => `<span>${esc(t)}</span>`).join("")}${progs.map((p) => `<span class="prog" style="--c:${p.color}">${p.icon} ${esc(p.name)}</span>`).join("")}</div>
      <div class="acts">
        <button class="btn pri" id="actNav">🧭 帶我去</button>
        <button class="btn" id="actWalk">🚶 從這裡漫步</button>
        <button class="btn ghost" id="actShare" title="複製此建築的連結">🔗</button>
      </div>
      ${floors.length ? `
        <div class="floors">
          <div class="f-head"><b>樓層透視</b><small>${C.academicYear} 學年度教室配置</small></div>
          <div class="f-tabs" role="tablist">
            <button data-floor="0" class="on">外觀</button>
            ${floors.map((f) => `<button data-floor="${f}">${f}F</button>`).join("")}
          </div>
          <div id="floorBody"></div>
        </div>` : isBld && b.floors > 1 ? `<p class="note">此館未列於 ${C.academicYear} 學年度班級教室配置圖。</p>` : ""}
    `;
    dr.hidden = false;
    document.body.classList.add("drawer-open");
    dr.scrollTop = 0;
    $("#drawerClose").onclick = closeDrawer;
    $("#actNav").onclick = () => { openNav(); $("#navTo").value = id; if ($("#navFrom").value === id) $("#navFrom").value = id === "gate" ? "legeng" : "gate"; runNav(); };
    $("#actWalk").onclick = () => { const b2 = TN.byId[id]; startWalk({ at: b2.door || [(b2.rect[0] + b2.rect[2]) / 2, b2.rect[3] + 20], heading: headingToward(b2) }); };
    $("#actShare").onclick = () => {
      const url = location.href.split("#")[0] + "#" + hashFor(id, state.floor);
      (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => toast("已複製連結"), () => prompt("複製此連結：", url));
    };
    $$("#drawer .f-tabs button").forEach((btn) => btn.addEventListener("click", () => selectFloor(+btn.dataset.floor)));
    state.floor = 0;
    if (floors.length) renderFloorBody(0);
  }
  function headingToward(b) {
    const d = b.door ? TN.px2w(b.door[0], b.door[1]) : null; if (!d) return 0;
    const c = TN.px2w((b.rect[0] + b.rect[2]) / 2, (b.rect[1] + b.rect[3]) / 2);
    return Math.atan2(c.x - d.x, -(c.z - d.z)) / DEG;
  }
  function selectFloor(f, roomIdx) {
    const id = state.selected; if (!id) return;
    state.floor = f;
    $$("#drawer .f-tabs button").forEach((b) => b.classList.toggle("on", +b.dataset.floor === f));
    if (!f) { W.exitFloor(); setRoomLabels(null); renderFloorBody(0); setHash(id); return; }
    const fv = W.showFloor(id, f, roomIdx);
    setRoomLabels(fv);
    renderFloorBody(f, roomIdx);
    const r = W.records[id];
    ctl.flyTo({ x: r.rw.cx, y: (f - 1) * TN.FLOOR_H, z: r.rw.cz, dist: THREE.MathUtils.clamp(Math.max(r.rw.w, r.rw.d) * 1.25, 60, 260) * (window.innerWidth < 700 ? 1.3 : 1), pitch: 58 * DEG }, 1000);
    setHash(id, f, roomIdx);
  }
  function renderFloorBody(f, focus) {
    const body = $("#floorBody"); if (!body) return;
    const b = TN.byId[state.selected];
    if (!f) {
      body.innerHTML = `<p class="note">選擇樓層後，建築會轉為半透明並顯示該層每一間教室的位置。</p>`;
      return;
    }
    const rooms = b.rooms[f] || [];
    if (!rooms.length) { body.innerHTML = `<p class="note">配置圖中此樓層未標示空間用途。</p>`; return; }
    const r = W.records[b.id], alongX = r.rw.w >= r.rw.d;
    const ends = alongX ? ["西", "東"] : ["北", "南"];
    body.innerHTML = `
      <div class="strip-ends"><span>◀ ${ends[0]}側</span><span>${ends[1]}側 ▶</span></div>
      <div class="strip">${rooms.map((rm, i) => `<button class="cell t-${rm.t}${i === focus ? " focus" : ""}" data-i="${i}" style="flex:${rm.w}" title="${esc(TN.roomTitle(rm))}"><span>${esc(rm.t === "st" ? "梯" : rm.t === "wc" ? "廁" : rm.n.replace(/[()（）]/g, ""))}</span></button>`).join("")}</div>
      <div class="legend">${legendFor(rooms)}</div>
      <div id="roomInfo" class="room-info">${focus != null && rooms[focus] ? roomInfo(b, f, focus) : "點選上方色塊或 3D 中的教室，可標示該空間。"}</div>`;
    $$("#floorBody .cell").forEach((c) => c.addEventListener("click", () => focusRoom(+c.dataset.i, true)));
  }
  function legendFor(rooms) {
    const types = [...new Set(rooms.map((r) => r.t))];
    return types.map((t) => `<span><i class="t-${t}"></i>${TN.roomTypes[t].label}</span>`).join("");
  }
  function roomInfo(b, f, i) {
    const rm = b.rooms[f][i], ty = TN.roomTypes[rm.t];
    return `<b>${esc(TN.roomTitle(rm))}</b><span>${esc(b.name)}・${f}F・${ty.label}</span>`;
  }
  function focusRoom(i, fly) {
    const fv = W.floorView; if (!fv) return;
    W.focusRoom(i);
    $$("#floorBody .cell").forEach((c) => c.classList.toggle("focus", +c.dataset.i === i));
    const b = TN.byId[fv.id];
    const info = $("#roomInfo"); if (info) info.innerHTML = roomInfo(b, fv.floor, i);
    if (fly) {
      const L = fv.layout[i], bx = L.box;
      ctl.flyTo({ x: (bx.x0 + bx.x1) / 2, y: L.y0, z: (bx.z0 + bx.z1) / 2, dist: 95 * (window.innerWidth < 700 ? 1.3 : 1), pitch: 55 * DEG }, 900);
    }
    setHash(fv.id, fv.floor, i);
  }
  function closeDrawer() {
    $("#drawer").hidden = true;
    document.body.classList.remove("drawer-open");
    state.selected = null; W.clearHighlight(); minimapSel(null);
    if (W.floorView) { W.exitFloor(); setRoomLabels(null); }
    if (ctl.target.y && !TN.walk.active) ctl.flyTo({ y: 0 }, 600);
    setHash();
  }

  // ───────── 搜尋 ─────────
  let index = [];
  function buildSearch() {
    TN.allPlaces.forEach((b) => {
      index.push({ kind: "b", id: b.id, title: b.name, sub: b.cat + (b.tags ? "・" + b.tags.slice(0, 3).join("、") : ""), keys: [b.name].concat(b.tags || []).join(" "), icon: catIcon[b.cat] || "📍" });
      if (!b.rooms) return;
      Object.entries(b.rooms).forEach(([f, rooms]) => rooms.forEach((rm, i) => {
        if (["st", "wc"].includes(rm.t) || rm.n.startsWith("（")) return;
        const cls = /^\d{3}$/.test(rm.n);
        index.push({ kind: "r", id: b.id, floor: +f, room: i, title: TN.roomTitle(rm), sub: `${b.name} ${f}F・${TN.roomTypes[rm.t].label}`, keys: rm.n + (cls ? " " + rm.n + "班" : ""), icon: cls ? "🎒" : "🚪", cls });
      }));
    });
    C.programs.forEach((p) => index.push({ kind: "p", id: p.id, title: p.name, sub: "學程・" + p.buildings.map((x) => TN.byId[x].name).join("、"), keys: p.name, icon: p.icon }));
    const inp = $("#searchInput"), list = $("#searchResults");
    let cur = -1, items = [];
    const render = () => {
      const q = inp.value.trim().toLowerCase().replace(/\s+/g, "");
      if (!q) { list.hidden = true; return; }
      items = index.map((it) => {
        const k = it.keys.toLowerCase().replace(/\s+/g, " "), t = it.title.toLowerCase();
        let s = 0;
        if (t === q || (it.cls && it.keys.split(" ")[0] === q)) s = 100;
        else if (t.startsWith(q)) s = 60;
        else if (k.split(" ").some((w) => w.startsWith(q))) s = 40;
        else if (k.includes(q) || t.includes(q)) s = 20;
        return [s && s + (it.kind === "b" ? 3 : 0), it];
      }).filter(([s]) => s > 0).sort((a, b) => b[0] - a[0]).slice(0, 12).map(([, it]) => it);
      cur = items.length ? 0 : -1;
      list.innerHTML = items.length
        ? items.map((it, i) => `<li role="option" data-i="${i}" class="${i === cur ? "on" : ""}"><i>${it.icon}</i><div><b>${esc(it.title)}</b><small>${esc(it.sub)}</small></div></li>`).join("")
        : `<li class="empty">找不到「${esc(inp.value)}」，試試班級號碼、處室或建築名稱</li>`;
      list.hidden = false;
      $$("#searchResults li[data-i]").forEach((li) => li.addEventListener("click", () => choose(items[+li.dataset.i])));
    };
    const choose = (it) => {
      if (!it) return;
      list.hidden = true; inp.blur();
      exitWalk();
      if (it.kind === "p") { openPrograms(); selectProgram(it.id); return; }
      if (it.kind === "r") { openBuilding(it.id, { fly: false }); selectFloor(it.floor, it.room); setTimeout(() => focusRoom(it.room, true), 1050); }
      else openBuilding(it.id, { fly: true });
      inp.value = it.title;
      $("#searchBox").classList.remove("open");
    };
    inp.addEventListener("input", render);
    inp.addEventListener("focus", render);
    inp.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault(); if (!items.length) return;
        cur = (cur + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        $$("#searchResults li[data-i]").forEach((li) => li.classList.toggle("on", +li.dataset.i === cur));
      } else if (e.key === "Enter") choose(items[cur]);
      else if (e.key === "Escape") { list.hidden = true; inp.blur(); }
    });
    document.addEventListener("pointerdown", (e) => { if (!$("#searchBox").contains(e.target)) closeSearch(); });
  }
  function closeSearch() { $("#searchResults").hidden = true; $("#searchBox").classList.remove("open"); }

  // ───────── 導航 ─────────
  const catOrder = ["設施", "行政", "教學", "學程", "生活", "運動"];
  function buildNav() {
    const opts = catOrder.map((cat) => {
      const items = TN.allPlaces.filter((b) => b.cat === cat && b.door);
      return `<optgroup label="${cat}">${items.map((b) => `<option value="${b.id}">${esc(b.name)}</option>`).join("")}</optgroup>`;
    }).join("");
    $("#navFrom").innerHTML = opts; $("#navTo").innerHTML = opts;
    $("#navFrom").value = "gate"; $("#navTo").value = "legeng";
    $("#navGo").addEventListener("click", runNav);
    $("#navSwap").addEventListener("click", () => { const a = $("#navFrom").value; $("#navFrom").value = $("#navTo").value; $("#navTo").value = a; if (TN.nav.route) runNav(); });
    $("#navClear").addEventListener("click", clearNav);
    $("#simBtn").addEventListener("click", () => (TN.nav.sim ? stopSim() : startSim()));
    const speeds = [[1, 10], [2, 20], [4, 40]]; let si = 0;
    $("#simSpeed").addEventListener("click", () => {
      si = (si + 1) % speeds.length; $("#simSpeed").textContent = `速度 ${speeds[si][0]}×`;
      if (TN.nav.sim) TN.nav.sim.speed = speeds[si][1];
    });
    buildNav.speed = () => speeds[si][1];
  }
  function runNav() {
    const a = $("#navFrom").value, b = $("#navTo").value;
    if (a === b) { toast("起點與終點相同"); return; }
    exitWalk();
    const route = TN.nav.compute(a, b);
    TN.nav.show(route);
    minimapRoute(route);
    const mins = Math.max(1, Math.round(route.length / 1.2 / 60));
    $("#navDist").textContent = `${Math.round(route.length)} 公尺`;
    $("#navTime").textContent = `步行約 ${mins} 分鐘`;
    $("#navSteps").innerHTML = directions(route, a, b).map((s) => `<li>${s}</li>`).join("");
    $("#navResult").hidden = false;
    $("#simBar").style.width = "0";
    W.highlight([b], "#ff3d68"); state.selected = null;
    fitBounds(route.pts.map((p) => ({ x: p.x, z: p.y })));
  }
  function directions(route, a, b) {
    const P = route.pts, out = [`從 <b>${esc(TN.byId[a].name)}</b> 出發`];
    let acc = 0;
    for (let i = 1; i < P.length - 1; i++) {
      acc += P[i].distanceTo(P[i - 1]);
      const d1 = P[i].clone().sub(P[i - 1]).normalize(), d2 = P[i + 1].clone().sub(P[i]).normalize();
      const ang = Math.acos(THREE.MathUtils.clamp(d1.dot(d2), -1, 1));
      if (ang > 35 * DEG && acc > 4) {
        const cross = d1.x * d2.y - d1.y * d2.x;
        out.push(`直行 ${Math.round(acc)} 公尺後<b>${cross > 0 ? "右" : "左"}轉</b>`);
        acc = 0;
      }
    }
    acc += P[P.length - 1].distanceTo(P[P.length - 2]);
    out.push(`直行 ${Math.round(acc)} 公尺，抵達 <b>${esc(TN.byId[b].name)}</b>`);
    return out;
  }
  function clearNav() {
    TN.nav.clear(); minimapRoute(null); $("#navResult").hidden = true; W.clearHighlight();
  }
  function startSim() {
    if (!TN.nav.route) return;
    closeDrawer();
    $("#simBtn").textContent = "⏸ 停止帶路";
    TN.nav.startSim(buildNav.speed(), (p) => ($("#simBar").style.width = p * 100 + "%"), () => {
      $("#simBtn").textContent = "▶ 模擬帶路"; toast("已抵達 " + TN.byId[TN.nav.route.to].name);
      flyToBuilding(TN.nav.route.to);
    });
  }
  function stopSim() { TN.nav.stopSim(); $("#simBtn").textContent = "▶ 模擬帶路"; }
  function openNav() { closePanel("progPanel"); $("#navPanel").hidden = false; setDock("nav"); }

  // ───────── 學程 ─────────
  function buildPrograms() {
    $("#progList").innerHTML = C.programs.map((p) => `
      <button class="prog-card" data-p="${p.id}" style="--c:${p.color}">
        <i>${p.icon}</i>
        <div><b>${esc(p.name)}</b><small>${p.buildings.map((x) => esc(TN.byId[x].name)).join("・")}</small></div>
      </button>
      <div class="prog-detail" id="pd-${p.id}" hidden>
        <p>${esc(p.summary)}</p>
        <div class="prog-bld">${p.buildings.map((x) => `<button class="chip" data-b="${x}">${esc(TN.byId[x].name)} →</button>`).join("")}</div>
      </div>`).join("");
    $$("#progList .prog-card").forEach((el) => el.addEventListener("click", () => selectProgram(el.dataset.p)));
    $$("#progList .prog-bld .chip").forEach((el) => el.addEventListener("click", () => openBuilding(el.dataset.b, { fly: true })));
  }
  function selectProgram(pid) {
    const p = C.programs.find((x) => x.id === pid);
    $$("#progList .prog-card").forEach((el) => el.classList.toggle("on", el.dataset.p === pid));
    $$("#progList .prog-detail").forEach((el) => (el.hidden = el.id !== "pd-" + pid));
    const det = $("#pd-" + pid); if (det) det.scrollIntoView({ block: "nearest", behavior: "smooth" });
    if (W.floorView) { W.exitFloor(); setRoomLabels(null); }
    $("#drawer").hidden = true; document.body.classList.remove("drawer-open"); state.selected = null;
    W.highlight(p.buildings, p.color);
    const pts = []; p.buildings.forEach((id) => { const r = W.records[id].rw; pts.push({ x: r.x0, z: r.z0 }, { x: r.x1, z: r.z1 }); });
    fitBounds(pts, 1200);
  }
  function openPrograms() { closePanel("navPanel"); $("#progPanel").hidden = false; setDock("prog"); }

  // ───────── 漫步 ─────────
  function startWalk(spawn) {
    closeDrawer(); closePanel("navPanel"); closePanel("progPanel"); TN.nav.stopSim();
    ctl.enabled = false;
    TN.walk.start(spawn || C.spawns[0], W.camera, canvas);
    document.body.classList.add("walking");
    $("#walkHud").hidden = false;
    $("#joystick").hidden = !isTouch;
    setDock("walk");
    toast(isTouch ? "用左下搖桿移動，拖曳畫面環顧" : "W/S 前進後退、A/D 轉向、Shift 奔跑");
  }
  function exitWalk() {
    if (!TN.walk.active) return;
    TN.walk.stop();
    ctl.enabled = true;
    document.body.classList.remove("walking");
    $("#walkHud").hidden = true; $("#joystick").hidden = true;
    const p = TN.walk.position();
    ctl.target.set(p.x, 0, p.z); ctl.yaw = -p.h; ctl.dist = 30; ctl.pitch = 30 * DEG; ctl.update();
    ctl.flyTo({ x: p.x, z: p.z, dist: 260, pitch: 50 * DEG }, 1200);
    setDock(null);
  }
  let nearCache = "";
  function updateWalkNear(p) {
    let best = null, bd = 1e9;
    TN.allPlaces.forEach((b) => {
      const r = W.records[b.id]; if (!r) return;
      const cx = Math.max(r.rw.x0, Math.min(p.x, r.rw.x1)), cz = Math.max(r.rw.z0, Math.min(p.z, r.rw.z1));
      const d = Math.hypot(p.x - cx, p.z - cz) + (b.id === "quad" ? 5 : 0);
      if (d < bd) { bd = d; best = b; }
    });
    const txt = best && bd < 25 ? `📍 ${best.name}${bd < 1 ? "" : "附近"}` : "📍 校園道路";
    if (txt !== nearCache) { $("#walkNear").textContent = txt; nearCache = txt; }
  }
  function bindWalkUI() {
    $("#walkExit").addEventListener("click", exitWalk);
    $$("#walkHud [data-kind]").forEach((b) => b.addEventListener("click", () => {
      TN.walk.setKind(b.dataset.kind);
      $$("#walkHud [data-kind]").forEach((x) => x.classList.toggle("on", x === b));
    }));
    $("#walkView").addEventListener("click", () => { const fp = TN.walk.toggleView(); $("#walkView").textContent = fp ? "👁️ 第一人稱" : "🎥 第三人稱"; });
    $("#walkRun").addEventListener("click", () => { TN.walk.run = !TN.walk.run; $("#walkRun").classList.toggle("on", TN.walk.run); });
    const sel = $("#walkSpawn");
    sel.innerHTML = `<option value="">📍 傳送到…</option>` + C.spawns.map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join("");
    sel.addEventListener("change", () => { const s = C.spawns.find((x) => x.id === sel.value); if (s) TN.walk.start(s, W.camera, canvas); sel.value = ""; sel.blur(); });
    // 搖桿
    const joy = $("#joystick"), knob = joy.querySelector("i");
    let jid = null;
    const move = (e) => {
      const r = joy.getBoundingClientRect(), R = r.width / 2;
      let dx = e.clientX - (r.left + R), dy = e.clientY - (r.top + R);
      const d = Math.hypot(dx, dy); if (d > R) { dx *= R / d; dy *= R / d; }
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      TN.walk.setJoy(dx / R, dy / R);
      TN.walk.run = d > R * 0.92;
    };
    joy.addEventListener("pointerdown", (e) => { jid = e.pointerId; joy.setPointerCapture(jid); move(e); e.stopPropagation(); });
    joy.addEventListener("pointermove", (e) => { if (e.pointerId === jid) move(e); });
    const up = (e) => { if (e.pointerId !== jid) return; jid = null; knob.style.transform = ""; TN.walk.setJoy(0, 0); TN.walk.run = false; };
    joy.addEventListener("pointerup", up); joy.addEventListener("pointercancel", up);
  }

  // ───────── 面板／主題／雜項 ─────────
  const themeInfo = { day: ["☀️", "白天"], dusk: ["🌇", "黃昏"], night: ["🌙", "夜晚"], model: ["🧊", "白模"] };
  function setTheme(t) {
    W.setTheme(t);
    $("#themeIco").textContent = themeInfo[t][0]; $("#themeTxt").textContent = themeInfo[t][1]; $("#dockThemeIco").textContent = themeInfo[t][0];
    document.body.dataset.theme = t;
    try { localStorage.setItem("tn3d-theme", t); } catch (e) { /* 無法儲存時忽略 */ }
  }
  function closePanel(id) { $("#" + id).hidden = true; }
  function setDock(k) { $$("#dock button").forEach((b) => b.classList.toggle("on", b.dataset.dock === k)); }
  let toastT;
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2800); }

  function goHome() { exitWalk(); closeDrawer(); applyView(C.views[0], 1400); setDock("home"); }
  function bindUI() {
    $("#btnHome").addEventListener("click", goHome);
    $("#btnNav").addEventListener("click", () => ($("#navPanel").hidden ? openNav() : closePanel("navPanel")));
    $("#btnPrograms").addEventListener("click", () => ($("#progPanel").hidden ? openPrograms() : closePanel("progPanel")));
    $("#btnWalk").addEventListener("click", () => (TN.walk.active ? exitWalk() : startWalk(spawnNearView())));
    $$("[data-close]").forEach((b) => b.addEventListener("click", () => { closePanel(b.dataset.close); setDock(null); }));
    const menu = $("#themeMenu");
    $("#btnTheme").addEventListener("click", (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; $("#btnTheme").setAttribute("aria-expanded", !menu.hidden); });
    $$("#themeMenu button").forEach((b) => b.addEventListener("click", () => { setTheme(b.dataset.theme); menu.hidden = true; }));
    document.addEventListener("click", () => (menu.hidden = true));
    $("#btnInfo").addEventListener("click", () => ($("#modal").hidden = false));
    $("#modalClose").addEventListener("click", () => ($("#modal").hidden = true));
    $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") $("#modal").hidden = true; });

    $("#compass").addEventListener("click", () => { if (!TN.walk.active) ctl.flyTo({ yaw: 0 }, 700); });
    $$("#viewCtl [data-act]").forEach((b) => b.addEventListener("click", () => {
      if (TN.walk.active) return;
      const a = b.dataset.act;
      if (a === "zoomIn") ctl.zoomBy(0.7); if (a === "zoomOut") ctl.zoomBy(1.4);
      if (a === "rotL") ctl.flyTo({ yaw: ctl.yaw + 45 * DEG }, 500); if (a === "rotR") ctl.flyTo({ yaw: ctl.yaw - 45 * DEG }, 500);
      if (a === "tilt") toggleTilt();
      if (a === "drag") { ctl.leftMode = ctl.leftMode === "pan" ? "rotate" : "pan"; b.textContent = ctl.leftMode === "pan" ? "✋" : "🔄"; toast(ctl.leftMode === "pan" ? "左鍵拖曳：平移" : "左鍵拖曳：旋轉"); }
    }));

    $$("#dock button").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.dock;
      if (k === "home") goHome();
      if (k === "nav") { exitWalk(); $("#navPanel").hidden ? openNav() : (closePanel("navPanel"), setDock(null)); }
      if (k === "prog") { exitWalk(); $("#progPanel").hidden ? openPrograms() : (closePanel("progPanel"), setDock(null)); }
      if (k === "walk") TN.walk.active ? exitWalk() : startWalk(spawnNearView());
      if (k === "theme") { const order = ["day", "dusk", "night", "model"]; const t = order[(order.indexOf(W.theme) + 1) % order.length]; setTheme(t); toast("主題：" + themeInfo[t][1]); }
    }));
    bindWalkUI();

    // 鍵盤
    const held = {};
    window.addEventListener("keydown", (e) => {
      if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
      if (e.key === "/") { e.preventDefault(); $("#searchInput").focus(); return; }
      if (e.key === "Escape") { if (!$("#modal").hidden) $("#modal").hidden = true; else if (TN.walk.active) exitWalk(); else closeDrawer(); return; }
      if (TN.walk.active) return;
      held[e.code] = true;
      if (e.code === "KeyH") goHome();
      if (e.code === "KeyT") toggleTilt();
      if (e.key === "+" || e.key === "=") ctl.zoomBy(0.8);
      if (e.key === "-") ctl.zoomBy(1.25);
    });
    window.addEventListener("keyup", (e) => (held[e.code] = false));
    setInterval(() => {
      if (TN.walk.active || !ctl.enabled) return;
      const s = ctl.dist * 0.012;
      const dx = (held.KeyD || held.ArrowRight ? 1 : 0) - (held.KeyA || held.ArrowLeft ? 1 : 0);
      const dz = (held.KeyW || held.ArrowUp ? 1 : 0) - (held.KeyS || held.ArrowDown ? 1 : 0);
      if (dx || dz) { ctl.anim = null; ctl.panScreen(dx * s, dz * s); }
      if (held.KeyQ) ctl.rotateBy(0.03); if (held.KeyE) ctl.rotateBy(-0.03);
    }, 16);

    window.addEventListener("hashchange", readHash);
    let saved = null; try { saved = localStorage.getItem("tn3d-theme"); } catch (e) { /* 無法讀取時使用預設 */ }
    if (saved && themeInfo[saved]) setTheme(saved);
  }
  function toggleTilt() {
    if (ctl.pitch > 80 * DEG) ctl.flyTo({ pitch: 50 * DEG }, 700);
    else ctl.flyTo({ pitch: 89.5 * DEG, yaw: 0 }, 800);
  }
  function spawnNearView() {
    // 依目前畫面中心挑選最近的漫步起點
    const [px, py] = TN.w2px(ctl.target.x, ctl.target.z);
    let best = C.spawns[0], bd = 1e9;
    C.spawns.forEach((s) => { const d = Math.hypot(s.at[0] - px, s.at[1] - py); if (d < bd) { bd = d; best = s; } });
    return best;
  }

  // ───────── 網址分享 ─────────
  let hashLock = false;
  function hashFor(id, f, r) { return id ? "b=" + id + (f ? "&f=" + f : "") + (r != null && f ? "&r=" + r : "") : ""; }
  function setHash(id, f, r) {
    const h = hashFor(id, f, r);
    if (location.hash.slice(1) === h) return;
    hashLock = true; history.replaceState(null, "", h ? "#" + h : location.pathname + location.search);
    setTimeout(() => (hashLock = false), 0);
  }
  function readHash() {
    if (hashLock) return false;
    const q = new URLSearchParams(location.hash.slice(1));
    const id = q.get("b");
    if (!id || !TN.byId[id]) return false;
    const f = +q.get("f") || 0, r = q.has("r") ? +q.get("r") : null;
    openBuilding(id, { fly: !f });
    if (f) { selectFloor(f, r); if (r != null) setTimeout(() => focusRoom(r, true), 1050); }
    return true;
  }

  try { boot(); }
  catch (err) {
    console.error(err);
    loadMsg("無法啟動 3D 校園：" + (err && err.message ? err.message : err) + "（請確認瀏覽器支援 WebGL）", 100);
  }
})();
