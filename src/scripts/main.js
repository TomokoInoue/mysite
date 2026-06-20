'use strict';

/* --------------------------
   ランダム写真表示
--------------------------- */
const photoImg = document.getElementById('todays-photo');
if (photoImg) {
  const base = photoImg.dataset.photoBase;
  const count = parseInt(photoImg.dataset.photoCount, 10);
  const random = Math.floor(Math.random() * count) + 1;
  photoImg.src = `${base}${String(random).padStart(2, '0')}.jpg`;
}

/* --------------------------
   ローディング
--------------------------- */
const loadingEl = document.getElementById('js-loading');
if (loadingEl) {
  loadingEl.addEventListener('animationend', (e) => {
    if (e.animationName === 'loadingFadeOut') {
      loadingEl.remove();
    }
  });
}
