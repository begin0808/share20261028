/**
 * 研習會計時器與時鐘 (對應今晚 2026/10/28 20:00~21:30 線上分享會)
 */
export function initPresenterTimer() {
  const timerEl = document.getElementById('dockTimerDisplay');
  if (!timerEl) return;

  function update() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // Check session timing (20:00 ~ 21:30)
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const startMins = 20 * 60; // 20:00
    const endMins = 21 * 60 + 30; // 21:30

    let statusTag = '⏰';
    let progressText = `${hours}:${minutes}:${seconds}`;

    if (currentMins >= startMins && currentMins <= endMins) {
      const elapsed = currentMins - startMins;
      const remaining = endMins - currentMins;
      statusTag = '🟢 研習中';
      progressText = `${hours}:${minutes} (剩 ${remaining} 分)`;
    } else if (currentMins < startMins) {
      const until = startMins - currentMins;
      statusTag = '⏳ 待開場';
      progressText = `${hours}:${minutes} (距開場 ${until} 分)`;
    } else {
      statusTag = '🏁 交流中';
      progressText = `${hours}:${minutes}`;
    }

    timerEl.innerHTML = `<span style="font-size: 0.8rem; opacity: 0.85;">${statusTag}</span> <span>${progressText}</span>`;
  }

  update();
  setInterval(update, 1000);
}
