'use strict';

import { BREAKPOINT_SP } from './constants.js';

/* --------------------------
   時間の表示
--------------------------- */
function updateTime() {
  const now = new Date();
  const offset = 9; // 東京・釜山どちらもUTC+9

  const localTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + offset * 3600000);

  const hh = String(localTime.getHours()).padStart(2, '0');
  const mm = String(localTime.getMinutes()).padStart(2, '0');

  document.querySelectorAll('.info__clock').forEach((el) => {
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

toggleBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.closest('.lang').classList.toggle('active');
  });
});

langMenus.forEach((menu) => {
  menu.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.dataset.lang;

      langTexts.forEach((el) => {
        el.classList.toggle('isHidden', el.dataset.lang !== selectedLang);
      });

      document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: selectedLang } }));

      toggleBtns.forEach((toggle) => {
        toggle.textContent = btn.textContent;
        toggle.dataset.current = selectedLang;
      });

      langMenus.forEach((m) => {
        m.querySelector('button[data-lang="ja"]')?.classList.toggle('isHidden', selectedLang === 'ja');
        m.querySelector('button[data-lang="ko"]')?.classList.toggle('isHidden', selectedLang === 'ko');
        m.parentElement.classList.remove('active');
      });
    });
  });
});

/* --------------------------------
   ハンバーガーメニューの開閉
--------------------------------- */
const infoBtns = document.querySelectorAll('[data-menu-btn]');
const siteWrap = document.querySelector('[data-site]');
const closeBtn = document.querySelector('[data-menu-close]');
const drawerEl = document.querySelector('.drawer');
let savedScrollY = 0;

function lockBodyScroll() {
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.width = '100%';
}

function unlockBodyScroll() {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
}

function closeDrawer() {
  if (!siteWrap) return;
  siteWrap.classList.remove('isDrawerOpen');
  infoBtns.forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
  if (window.innerWidth <= BREAKPOINT_SP) {
    unlockBodyScroll();
    window.scrollTo({ top: savedScrollY, behavior: 'instant' });
    if (drawerEl) drawerEl.scrollTop = 0;
  }
}

infoBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const isOpen = siteWrap.classList.toggle('isDrawerOpen');
    infoBtns.forEach((b) => b.setAttribute('aria-expanded', String(isOpen)));
    if (isOpen && window.innerWidth <= BREAKPOINT_SP) {
      savedScrollY = window.scrollY;
      lockBodyScroll();
    } else if (!isOpen && window.innerWidth <= BREAKPOINT_SP) {
      unlockBodyScroll();
      window.scrollTo({ top: savedScrollY, behavior: 'instant' });
      if (drawerEl) drawerEl.scrollTop = 0;
    }
  });
});

if (closeBtn) {
  closeBtn.addEventListener('click', closeDrawer);
}

const mq = window.matchMedia(`(max-width: ${BREAKPOINT_SP}px)`);
mq.addEventListener('change', () => {
  if (siteWrap) {
    siteWrap.classList.add('is-resizing');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        siteWrap.classList.remove('is-resizing');
      });
    });
  }
});
