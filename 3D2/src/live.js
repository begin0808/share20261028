import { WEATHER, CLUB_SESSIONS, FEED } from './config.js';

/* ---------- 臺灣時間 ---------- */
const TZ = 'Asia/Taipei';
export function taipeiNow() {
  // 回傳「臺灣時間的牆上時鐘」各欄位
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short',
    hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23',
  }).formatToParts(new Date()).map(p => [p.type, p.value]));
  const wd = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[parts.weekday];
  return { y: +parts.year, mo: +parts.month, d: +parts.day, wd, h: +parts.hour, mi: +parts.minute, s: +parts.second };
}
export const WEEKDAY = ['日', '一', '二', '三', '四', '五', '六'];
const pad = n => String(n).padStart(2, '0');

/* ---------- 社課時段 ---------- */
const toMin = hhmm => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
export function sessionStatus() {
  const n = taipeiNow();
  const nowMin = n.wd * 1440 + n.h * 60 + n.mi + n.s / 60;
  let best = null;
  for (const s of CLUB_SESSIONS) {
    const start = s.weekday * 1440 + toMin(s.start), end = s.weekday * 1440 + toMin(s.end);
    if (nowMin >= start && nowMin < end) return { live: true, session: s, minsLeft: Math.ceil(end - nowMin) };
    let until = start - nowMin;
    if (until < 0) until += 7 * 1440;
    if (!best || until < best.until) best = { until, session: s };
  }
  return best ? { live: false, session: best.session, minsUntil: Math.ceil(best.until) } : { live: false };
}
export function fmtDuration(mins) {
  const d = Math.floor(mins / 1440), h = Math.floor(mins % 1440 / 60), m = mins % 60;
  if (d) return `${d} 天 ${h} 小時`;
  if (h) return `${h} 小時 ${m} 分`;
  return `${m} 分鐘`;
}

/* ---------- 即時天氣（Open-Meteo） ---------- */
const WMO = [
  [[0], '☀️', '晴朗', 'clear'], [[1], '🌤️', '晴時多雲', 'clear'], [[2], '⛅', '多雲', 'cloudy'], [[3], '☁️', '陰天', 'cloudy'],
  [[45, 48], '🌫️', '有霧', 'cloudy'], [[51, 53, 55, 56, 57], '🌦️', '毛毛雨', 'rain'], [[61, 63, 65, 66, 67, 80, 81, 82], '🌧️', '下雨', 'rain'],
  [[71, 73, 75, 77, 85, 86], '🌨️', '降雪', 'cloudy'], [[95, 96, 99], '⛈️', '雷雨', 'rain'],
];
export async function fetchWeather() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${WEATHER.lat}&longitude=${WEATHER.lon}` +
    '&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day,precipitation_probability&timezone=Asia%2FTaipei';
  const res = await fetch(url);
  if (!res.ok) throw new Error('weather ' + res.status);
  const { current: c } = await res.json();
  const row = WMO.find(([codes]) => codes.includes(c.weather_code)) || [[], '🌡️', '—', 'clear'];
  const night = !c.is_day && row[3] === 'clear';
  return {
    temp: Math.round(c.temperature_2m), feels: Math.round(c.apparent_temperature), humidity: c.relative_humidity_2m,
    wind: Math.round(c.wind_speed_10m), pop: c.precipitation_probability,
    icon: night ? '🌙' : row[1], text: row[2], kind: row[3],
  };
}

/* ---------- 即時動態 ---------- */
function parseCSV(text) {
  const rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows.filter(r => r.some(Boolean));
  const keys = head.map(h => h.trim());
  return body.map(r => Object.fromEntries(keys.map((k, i) => [k, (r[i] || '').trim()])));
}

// 時間字串一律視為臺灣時間
function parseTime(s) {
  if (!s) return 0;
  if (/[zZ]|[+-]\d\d:?\d\d$/.test(s)) return Date.parse(s);
  return Date.parse(s.replace(' ', 'T') + '+08:00');
}

export async function fetchFeed() {
  let items;
  if (FEED.sheetCsv) {
    const res = await fetch(FEED.sheetCsv, { cache: 'no-store' });
    items = parseCSV(await res.text());
  } else {
    const res = await fetch(FEED.json + '?t=' + Date.now(), { cache: 'no-store' });
    const data = await res.json();
    items = data.items || data;
  }
  return items
    .map((it, i) => ({ ...it, ts: parseTime(it.time), key: `${it.time}|${it.clubId}|${it.title}|${i}` }))
    .filter(it => it.title && it.ts)
    .sort((a, b) => b.ts - a.ts);
}

export function timeAgo(ts) {
  const diff = (Date.now() - ts) / 60000;
  if (diff < 0) {
    const d = new Date(ts + 8 * 3600000);
    return `預告 ${d.getUTCMonth() + 1}/${d.getUTCDate()} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  }
  if (diff < 1) return '剛剛';
  if (diff < 60) return `${Math.floor(diff)} 分鐘前`;
  if (diff < 1440) return `${Math.floor(diff / 60)} 小時前`;
  if (diff < 1440 * 7) return `${Math.floor(diff / 1440)} 天前`;
  const d = new Date(ts + 8 * 3600000);
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
}

export function fmtClock(n = taipeiNow()) {
  return { date: `${n.mo} 月 ${n.d} 日`, week: `星期${WEEKDAY[n.wd]}`, time: `${pad(n.h)}:${pad(n.mi)}`, sec: pad(n.s) };
}

export { FEED, WEATHER };
