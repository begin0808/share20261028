// ç¶²ç?è¨­å?ï¼šå­¸?¡è??¿äºº?¡å¯ä»¥ç›´?¥ä¿®?¹é€™å€‹æ?æ¡?
export const SCHOOL = {
  name: '?‹ç??ºå?å¤§å­¸?„å±¬é«˜ç?ä¸­å­¸',
  short: '?—å¤§?„ä¸­',
  year: '115 å­¸å¹´åº?,
  address: '?ºå?å¸‚æ°¸åº·å?ä¸­å±±?—è·¯ 948 ??,
  website: 'https://www.tntcsh.tn.edu.tw/',
};

// ?³æ?å¤©æ°£ï¼ˆOpen-Meteoï¼Œå??‘é‘°ï¼‰ï?å­¸æ ¡åº§æ?
export const WEATHER = { lat: 23.018, lon: 120.239, place: '?ºå?æ°¸åº·', refreshMinutes: 15 };

// ç¤¾å?æ´»å??‚é?ï¼ˆä»¥?ºç£?‚é?è¨ˆï??‚weekdayï¼?ï¼é€±ä? ??5ï¼é€±ä?
// ? ï? ä»¥ä??ºç¤ºç¯„æ?æ®µï?è«‹ä?å­¸æ ¡å¯¦é?èª²è¡¨ä¿®æ”¹??export const CLUB_SESSIONS = [
  { weekday: 5, start: '13:10', end: '15:00', label: '?±ä?ç¬?6?? ç¯€' },
];

// ?³æ??•æ?ä¾†æ?ï¼?// 1. ?è¨­è®€??/data/feed.jsonï¼ˆpublic/data/feed.jsonï¼?// 2. ?¥å¡«??Google è©¦ç?è¡¨ã€Œç™¼å¸ƒåˆ°ç¶²è·¯ ??CSV?ç?ç¶²å?ï¼Œæ??ªå?ä½¿ç”¨è©¦ç?è¡?//    è©¦ç?è¡¨æ?ä½ï?time, clubId, title, bodyï¼ˆtime ?¼å? 2026-10-27 13:20ï¼?export const FEED = {
  json: './data/feed.json',
  sheetCsv: '',
  refreshSeconds: 60,
};
