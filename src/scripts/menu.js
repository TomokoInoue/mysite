'use strict';
console.log('読み込み');

// document.querySelector('.hamburger').addEventListener('click', () => {
//   document.querySelector('.nav-links').classList.toggle('expanded');
// });

// 時間の表示
function updateTime() {
  const nowUTC = new Date();
  const offset = 9; // 東京・釜山どちらもUTC+9

  const localTime = new Date(nowUTC.getTime() + nowUTC.getTimezoneOffset() * 60000 + offset * 3600000);
  const hh = String(localTime.getHours()).padStart(2, '0');
  const mm = String(localTime.getMinutes()).padStart(2, '0');

  document.getElementById('time').textContent = `${hh}:${mm}`;
}

updateTime();
setInterval(updateTime, 1000);
