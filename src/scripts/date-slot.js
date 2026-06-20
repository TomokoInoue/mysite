'use strict';

import { BREAKPOINT_SP } from './constants.js';

const mq = window.matchMedia(`(max-width: ${BREAKPOINT_SP}px)`);

function createDateRow(dateStr) {
  const row = document.createElement('div');
  row.className = 'right__date-row';
  [...dateStr].forEach(char => {
    const wrap = document.createElement('span');
    wrap.className = 'right__digit-wrap';
    const inner = document.createElement('span');
    inner.className = 'right__digit-inner';
    inner.textContent = char;
    wrap.appendChild(inner);
    row.appendChild(wrap);
  });
  return row;
}

function animateDigit(wrap, newChar) {
  // 進行中のアニメーションを即時に収束させる
  wrap.querySelectorAll('.right__digit-inner.out').forEach(el => el.remove());
  const pendingIn = wrap.querySelector('.right__digit-inner.in');
  if (pendingIn) pendingIn.classList.remove('in');

  const oldInner = wrap.querySelector('.right__digit-inner');
  if (oldInner) oldInner.classList.add('out');

  const newInner = document.createElement('span');
  newInner.className = 'right__digit-inner in'; // DOMに追加する前にクラスを設定することでリフロー強制不要
  newInner.textContent = newChar;
  wrap.appendChild(newInner);

  newInner.addEventListener('animationend', () => {
    oldInner?.remove();
    newInner.classList.remove('in');
  }, { once: true });
}

function animateDate(fromStr, toStr, container) {
  const oldChars = [...fromStr];
  const newChars = [...toStr];

  if (oldChars.length !== newChars.length) {
    // 進行中の行アニメーションを収束
    const rows = [...container.querySelectorAll('.right__date-row')];
    rows.forEach((row, i) => {
      if (i < rows.length - 1) {
        row.remove();
      } else {
        row.classList.remove('in');
      }
    });

    const oldRow = container.querySelector('.right__date-row');
    if (oldRow) {
      oldRow.classList.add('out');
      oldRow.addEventListener('animationend', () => oldRow.remove(), { once: true });
    }

    const newRow = createDateRow(toStr);
    newRow.classList.add('in'); // DOMに追加する前にクラスを設定
    container.appendChild(newRow);
    newRow.addEventListener('animationend', () => newRow.classList.remove('in'), { once: true });
  } else {
    // 桁アニメーション: 行アニメーション中の古い行が残っている場合は除去し、
    // 現在の行（最後の行）からのみ wrap を取得する
    const rows = [...container.querySelectorAll('.right__date-row')];
    rows.slice(0, -1).forEach(row => row.remove());
    const currentRow = container.querySelector('.right__date-row');
    if (currentRow) currentRow.classList.remove('in');

    const wraps = currentRow ? [...currentRow.querySelectorAll('.right__digit-wrap')] : [];
    oldChars.forEach((char, i) => {
      if (char !== newChars[i] && wraps[i]) {
        animateDigit(wraps[i], newChars[i]);
      }
    });
  }
}

function animateSlot(from, to, container, innerClass) {
  if (from === to) return;

  container.querySelectorAll(`.${innerClass}.out`).forEach(el => el.remove());
  const pendingIn = container.querySelector(`.${innerClass}.in`);
  if (pendingIn) pendingIn.classList.remove('in');

  const oldInner = container.querySelector(`.${innerClass}`);
  if (oldInner) {
    oldInner.classList.add('out');
    oldInner.addEventListener('animationend', () => oldInner.remove(), { once: true });
  }

  const newInner = document.createElement('span');
  newInner.className = `${innerClass} in`;
  newInner.textContent = to;
  container.appendChild(newInner);
  newInner.addEventListener('animationend', () => newInner.classList.remove('in'), { once: true });
}

function initDateSlot() {
  const sections = document.querySelectorAll('.right__box');
  if (!sections.length) return;

  const yearContainer = document.querySelector('.right__date-year');
  const dateContainer = document.querySelector('.right__date-number');
  const weekContainer = document.querySelector('.right__date-slot--week');
  if (!yearContainer || !dateContainer || !weekContainer) return;

  const firstSection = sections[0];
  const initYear = firstSection.dataset.year;
  const initDateStr = `${firstSection.dataset.month}.${firstSection.dataset.day}`;
  const initWeek = firstSection.dataset.weekday;

  yearContainer.innerHTML = '';
  const yearInner = document.createElement('span');
  yearInner.className = 'right__year-inner';
  yearInner.textContent = initYear;
  yearContainer.appendChild(yearInner);

  dateContainer.innerHTML = '';
  dateContainer.appendChild(createDateRow(initDateStr));

  weekContainer.innerHTML = '';
  const weekInner = document.createElement('span');
  weekInner.className = 'right__week-inner';
  weekInner.textContent = initWeek;
  weekContainer.appendChild(weekInner);

  let currentDateStr = initDateStr;
  let currentYear = initYear;
  let currentWeek = initWeek;
  let currentIndex = -1;

  function slideTo(index) {
    if (index === currentIndex) return;
    const isFirst = currentIndex === -1;
    currentIndex = index;

    const section = sections[index];
    const dateStr = `${section.dataset.month}.${section.dataset.day}`;
    const year = section.dataset.year;
    const week = section.dataset.weekday;

    if (!isFirst) {
      animateDate(currentDateStr, dateStr, dateContainer);
      animateSlot(currentYear, year, yearContainer, 'right__year-inner');
      animateSlot(currentWeek, week, weekContainer, 'right__week-inner');
    }

    currentDateStr = dateStr;
    currentYear = year;
    currentWeek = week;
  }

  const stickyEl = document.querySelector('.right__date-sp');
  const stickyHeight = stickyEl ? stickyEl.offsetHeight : 0;

  // 各セクション上端を示す1pxのセンチネル要素をright__wrap先頭に挿入
  // getBoundingClientRect()による同期リフローを避けるため、IOで観測する基点として使用
  const sentinels = Array.from(sections).map(section => {
    const wrap = section.querySelector('.right__wrap') || section;
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'display:block;height:1px;margin-bottom:-1px;pointer-events:none;visibility:hidden;';
    sentinel.setAttribute('aria-hidden', 'true');
    wrap.prepend(sentinel);
    return sentinel;
  });

  slideTo(0);

  const passedSections = new Set();

  // IntersectionObserver: entry.boundingClientRectはブラウザ事前計算値のため同期リフロー不要
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const i = sentinels.indexOf(entry.target);
      if (i === -1) return;
      if (!entry.isIntersecting && entry.boundingClientRect.top < stickyHeight) {
        passedSections.add(i);
      } else {
        passedSections.delete(i);
      }
    });
    const activeIndex = passedSections.size > 0 ? Math.max(...passedSections) : 0;
    slideTo(activeIndex);
  }, {
    rootMargin: `-${stickyHeight}px 0px 0px 0px`,
    threshold: 0
  });

  sentinels.forEach(s => observer.observe(s));
}

if (mq.matches) {
  initDateSlot();
}
