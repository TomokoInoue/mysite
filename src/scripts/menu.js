// 読み込み確認
'use strict';

/* --------------------------
   時間の表示
--------------------------- */
function updateTime() {
  const now = new Date();
  const offset = 9; // 東京・釜山どちらもUTC+9

  const localTime = new Date(
    now.getTime() + now.getTimezoneOffset() * 60000 + offset * 3600000
  );

  const hh = String(localTime.getHours()).padStart(2, '0');
  const mm = String(localTime.getMinutes()).padStart(2, '0');

  const el = document.getElementById('time');
  if (el) el.textContent = `${hh}:${mm}`;
}

updateTime();
setInterval(updateTime, 1000);

/* --------------------------
   言語切り替え
--------------------------- */
const toggleBtn = document.querySelector('.langToggle');
const langMenu = document.querySelector('.langMenu');
const langTexts = document.querySelectorAll('.langText');

if (toggleBtn && langMenu) {
  const jaBtn = langMenu.querySelector('button[data-lang="ja"]');
  const koBtn = langMenu.querySelector('button[data-lang="ko"]');

  // 言語メニューの開閉
  toggleBtn.addEventListener('click', () => {
    langMenu.parentElement.classList.toggle('active');
  });

  // 言語選択
  langMenu.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.dataset.lang;
      // テキストの切り替え
      langTexts.forEach((el) => {
        el.classList.toggle(
          'isHidden',
          el.dataset.lang !== selectedLang
        );
      });

      // トグルボタン表示更新
      toggleBtn.textContent = btn.textContent;
      toggleBtn.dataset.current = selectedLang;

      // 選択中言語ボタンを隠す
      if (selectedLang === 'ja') {
        jaBtn?.classList.add('isHidden');
        koBtn?.classList.remove('isHidden');
      } else {
        jaBtn?.classList.remove('isHidden');
        koBtn?.classList.add('isHidden');
      }

      // メニューを閉じる
      langMenu.parentElement.classList.remove('active');
    });
  });
}

/* --------------------------------
   ハンバーガーメニューの開閉
--------------------------------- */
const infoBtn = document.querySelector('[data-menu-btn]');
const siteWrap = document.querySelector('[data-site]');
const closeBtn = document.querySelector('[data-menu-close]');

// 閉じる処理（共通関数）
function closeDrawer() {
  if (!siteWrap || !infoBtn) return;
  siteWrap.classList.remove('isDrawerOpen');
  infoBtn.setAttribute('aria-expanded', 'false');
}

// 開閉ボタン
if (infoBtn && siteWrap) {
  infoBtn.addEventListener('click', () => {
    const isOpen = siteWrap.classList.toggle('isDrawerOpen');
    infoBtn.setAttribute('aria-expanded', String(isOpen));
  });
}

// ×ボタン
if (closeBtn) {
  closeBtn.addEventListener('click', closeDrawer);
}
