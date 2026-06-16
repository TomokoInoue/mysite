'use strict';

/* --------------------------------
   ハンバーガーメニューの開閉
--------------------------------- */
const infoBtns = document.querySelectorAll('[data-menu-btn]');
const siteWrap = document.querySelector('[data-site]');
const closeBtn = document.querySelector('[data-menu-close]');
let savedScrollY = 0;

function lockBodyScroll() {
  document.body.style.position = 'fixed';
  document.body.style.top = '0';
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
  if (window.innerWidth <= 768) {
    unlockBodyScroll();
    window.scrollTo({ top: savedScrollY, behavior: 'instant' });
  }
}

infoBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const isOpen = siteWrap.classList.toggle('isDrawerOpen');
    infoBtns.forEach((b) => b.setAttribute('aria-expanded', String(isOpen)));
    if (isOpen && window.innerWidth <= 768) {
      savedScrollY = window.scrollY;
      window.scrollTo({ top: 0, behavior: 'instant' });
      lockBodyScroll();
    } else if (!isOpen && window.innerWidth <= 768) {
      unlockBodyScroll();
      window.scrollTo({ top: savedScrollY, behavior: 'instant' });
    }
  });
});

if (closeBtn) {
  closeBtn.addEventListener('click', closeDrawer);
}

const mq = window.matchMedia('(max-width: 768px)');
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
