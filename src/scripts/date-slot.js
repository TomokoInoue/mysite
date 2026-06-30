'use strict';

import { BREAKPOINT_SP } from './constants.js';

const mq = window.matchMedia(`(max-width: ${BREAKPOINT_SP}px)`);

function createDateRow(dateStr) {
  const [month, day] = dateStr.split('.');
  const row = document.createElement('div');
  row.className = 'right__date-row';

  for (const [part, text] of [
    ['month', month],
    ['sep', '.'],
    ['day', day],
  ]) {
    const wrap = document.createElement('span');
    wrap.className = 'right__digit-wrap';
    wrap.dataset.part = part;
    const inner = document.createElement('span');
    inner.className = 'right__digit-inner';
    inner.textContent = text;
    wrap.appendChild(inner);
    row.appendChild(wrap);
  }
  return row;
}

function animateDate(fromStr, toStr, container) {
  const [fromMonth, fromDay] = fromStr.split('.');
  const [toMonth, toDay] = toStr.split('.');
  const row = container.querySelector('.right__date-row');
  if (!row) return;

  const monthWrap = row.querySelector('[data-part="month"]');
  const dayWrap = row.querySelector('[data-part="day"]');

  if (monthWrap && fromMonth !== toMonth) {
    animateSlot(fromMonth, toMonth, monthWrap, 'right__digit-inner');
  }
  if (dayWrap && fromDay !== toDay) {
    animateSlot(fromDay, toDay, dayWrap, 'right__digit-inner');
  }
}

function animateSlot(from, to, container, innerClass) {
  if (from === to) return;

  container.querySelectorAll(`.${innerClass}.out`).forEach((el) => el.remove());
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
  let currentLang = document.querySelector('.langToggle')?.dataset.current || 'ja';

  function getWeekText(section) {
    return currentLang === 'ko' ? section.dataset.weekdayKo : section.dataset.weekdayJa;
  }

  const sections = document.querySelectorAll('.right__box');
  if (!sections.length) return;

  const yearContainer = document.querySelector('.right__date-year');
  const dateContainer = document.querySelector('.right__date-number');
  const weekContainer = document.querySelector('.right__date-slot--week');
  if (!yearContainer || !dateContainer || !weekContainer) return;

  const firstSection = sections[0];
  const initYear = firstSection.dataset.year;
  const initDateStr = `${firstSection.dataset.month}.${firstSection.dataset.day}`;
  const initWeek = getWeekText(firstSection);

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
    const week = getWeekText(section);

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
  const sentinels = Array.from(sections).map((section) => {
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
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
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
    },
    {
      rootMargin: `-${stickyHeight}px 0px 0px 0px`,
      threshold: 0,
    },
  );

  sentinels.forEach((s) => observer.observe(s));

  document.addEventListener('langchange', (e) => {
    currentLang = e.detail.lang;
    const week = getWeekText(sections[currentIndex]);
    const weekEl = weekContainer.querySelector('.right__week-inner');
    if (weekEl) weekEl.textContent = week;
    currentWeek = week;
  });
}

if (mq.matches) {
  initDateSlot();
}
