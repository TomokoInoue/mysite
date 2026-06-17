'use strict';

const phrases = ['살 빼려고 했는데 치킨을 시켰어요.', '분명히 바쁜데 한 게 없어요.', '휴대폰을 보다가 하루가 끝났어요.'];

const phraseEl = document.querySelector('.js-phrase-text');

const TYPE_SPEED = 130;
const DELETE_SPEED = 80;
const HOLD_AFTER = 2200;
const PAUSE_NEXT = 600;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typeText(text) {
  for (const char of text) {
    phraseEl.textContent += char;
    await wait(TYPE_SPEED);
  }
}

async function deleteText() {
  while (phraseEl.textContent.length > 0) {
    phraseEl.textContent = phraseEl.textContent.slice(0, -1);
    await wait(DELETE_SPEED);
  }
}

async function loop() {
  let index = 0;
  while (true) {
    await typeText(phrases[index]);
    await wait(HOLD_AFTER);
    await deleteText();
    await wait(PAUSE_NEXT);
    index = (index + 1) % phrases.length;
  }
}

loop();
