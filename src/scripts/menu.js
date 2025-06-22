'use strict';
console.log('読み込み');

document.querySelector('.hamburger').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('expanded');
});
