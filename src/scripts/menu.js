// 読み込み確認
'use strict';

/* --------------------------
   時間の表示
--------------------------- */
function updateTime() {
  const now = new Date();
  const offset = 9; // 東京・釜山どちらもUTC+9

  const localTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + offset * 3600000);

  const hh = String(localTime.getHours()).padStart(2, '0');
  const mm = String(localTime.getMinutes()).padStart(2, '0');

  document.querySelectorAll('.info__clock').forEach(el => {
    el.textContent = `${hh}:${mm}`;
  });
}

updateTime();
setInterval(updateTime, 1000);

/* --------------------------
   言語切り替え
--------------------------- */
const toggleBtns = document.querySelectorAll('.langToggle');
const langMenus = document.querySelectorAll('.langMenu');
const langTexts = document.querySelectorAll('.langText');

// 言語メニューの開閉（クリックしたボタンの親 .lang のみ開閉）
toggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.lang').classList.toggle('active');
  });
});

// 言語選択（どのメニューからでも全体に反映）
langMenus.forEach(menu => {
  menu.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.dataset.lang;

      // テキストの切り替え
      langTexts.forEach(el => {
        el.classList.toggle('isHidden', el.dataset.lang !== selectedLang);
      });

      // 全トグルボタンの表示を更新
      toggleBtns.forEach(toggle => {
        toggle.textContent = btn.textContent;
        toggle.dataset.current = selectedLang;
      });

      // 全メニューの選択中言語ボタンを隠す・メニューを閉じる
      langMenus.forEach(m => {
        m.querySelector('button[data-lang="ja"]')?.classList.toggle('isHidden', selectedLang === 'ja');
        m.querySelector('button[data-lang="ko"]')?.classList.toggle('isHidden', selectedLang === 'ko');
        m.parentElement.classList.remove('active');
      });
    });
  });
});
