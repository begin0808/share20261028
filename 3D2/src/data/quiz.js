// 社團配對測驗：每個選項替「分類」與「興趣標籤」加分
// cat：對應 CATEGORIES 的 id；tags：對應 CLUBS 的 tags
export const QUESTIONS = [
  {
    q: '放學鐘聲一響，你最想去哪裡？',
    a: [
      ['球場或操場，先流一身汗', { sport: 3 }, ['active', 'sport']],
      ['練團室或舞蹈教室', { music: 3 }, ['music', 'stage']],
      ['找朋友玩桌遊、聊動漫', { leisure: 3 }, ['game', 'social']],
      ['安靜的角落畫畫、寫字、做手作', { arts: 3 }, ['create', 'hands', 'calm']],
      ['圖書館或電腦教室查資料', { academic: 3 }, ['logic', 'tech']],
      ['農場、花圃或社區幫忙', { service: 3 }, ['service', 'nature']],
    ],
  },
  {
    q: '哪一種時刻最讓你有成就感？',
    a: [
      ['比賽最後一球，全隊一起歡呼', { sport: 2 }, ['team', 'active']],
      ['站上舞台，台下響起掌聲', { music: 2 }, ['stage']],
      ['一個點子讓大家笑成一團', { leisure: 2 }, ['social', 'game']],
      ['作品完成，被別人稱讚好看', { arts: 2 }, ['create', 'visual']],
      ['終於解開卡了很久的難題', { academic: 2 }, ['logic', 'science']],
      ['幫上別人的忙，對方說謝謝', { service: 2 }, ['service', 'social']],
    ],
  },
  {
    q: '朋友最常說你是……',
    a: [
      ['精力旺盛的運動咖', { sport: 1 }, ['active', 'sport', 'team']],
      ['很有節奏感的表演魂', { music: 1 }, ['music', 'stage']],
      ['腦洞很大的點子王', { leisure: 1 }, ['create', 'game', 'story']],
      ['心細手巧的小職人', { arts: 1 }, ['hands', 'calm', 'create']],
      ['什麼都想問為什麼的研究者', { academic: 1 }, ['logic', 'science', 'language']],
      ['很會照顧人的暖心擔當', { service: 1 }, ['service', 'animals', 'social']],
    ],
  },
  {
    q: '如果可以馬上學會一項技能，你會選？',
    a: [
      ['說一口流利的外語', { academic: 1 }, ['language']],
      ['寫程式、做網頁或 App', { academic: 1 }, ['tech', 'logic']],
      ['拍照、拍片、剪影片', { arts: 1, leisure: 1 }, ['visual', 'media']],
      ['一種樂器或一支舞', { music: 1 }, ['music', 'active']],
      ['照顧動物、種出漂亮的植物', { service: 1 }, ['animals', 'nature']],
      ['一項帥氣的球類運動', { sport: 1 }, ['sport', 'active']],
    ],
  },
  {
    q: '週末的理想行程是？',
    a: [
      ['露營、爬山、去海邊', { service: 1, sport: 1 }, ['outdoor', 'nature', 'team']],
      ['看一場電影或追完一部動畫', { leisure: 1 }, ['story', 'visual']],
      ['去看演唱會或街舞比賽', { music: 1 }, ['music', 'stage']],
      ['逛市集、做手作、插一盆花', { arts: 1 }, ['hands', 'create']],
      ['研究科技新聞或投資理財', { academic: 1 }, ['business', 'tech', 'logic']],
      ['和朋友玩桌遊、打電動', { leisure: 1 }, ['game', 'social']],
    ],
  },
  {
    q: '你最希望社團帶給你什麼？',
    a: [
      ['更好的體能與團隊默契', { sport: 2 }, ['active', 'team']],
      ['上台表演的勇氣', { music: 2 }, ['stage']],
      ['一群志同道合的好朋友', { leisure: 2 }, ['social']],
      ['一件件能留下來的作品', { arts: 2 }, ['create', 'story']],
      ['升學與備審用得到的能力', { academic: 2 }, ['logic', 'language', 'science']],
      ['為別人付出的實際經驗', { service: 2 }, ['service']],
    ],
  },
];
