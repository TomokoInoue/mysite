'use strict';
console.log('読み込み');

// document.querySelector('.hamburger').addEventListener('click', () => {
//   document.querySelector('.nav-links').classList.toggle('expanded');
// });

/* ------------------
   時間の表示
------------------- */
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

/* ------------------
   言語切り替え
------------------- */
const toggleBtn = document.querySelector('.langToggle');
const menu = document.querySelector('.langMenu');
const langTexts = document.querySelectorAll('.langText');
const jaBtn = menu.querySelector('button[data-lang="ja"]'); //buttonタグかつ、data-lang属性が"ja"のもの
const koBtn = menu.querySelector('button[data-lang="ko"]');

// 【メニュー表示切替】
//　アロー関数を使ってfunctionをわざわざ書かずに使い捨て
toggleBtn.addEventListener('click', () => {
  console.log('クリック！');
  menu.parentElement.classList.toggle('active');
});

// 【各言語ボタンの切り替え処理】
//　コールバック関数のforEachを使ってループ処理を行う（menuの中身を集めて、1つ1つのbtnに同じ処理をする。forEachが順番に処理を渡している。btnの所の名前はなんでも良い）
//　クリックされたら、そのbuttonタグが持っている[data-lang]を読む
menu.querySelectorAll('button').forEach((btn) => {
  btn.addEventListener('click', () => {
    console.log('言語を切り替えるよ！');
    const selectedLang = btn.dataset.lang;

    //テキスト表示の切り替え（もし要素の[data-lang]が選んだ言語と違ったら".isHidden"を付ける。同じなら外す）
    langTexts.forEach((el) => {
      el.classList.toggle('isHidden', el.dataset.lang !== selectedLang);
    });

    //トグルボタンの国旗変更（クリックしたbuttonの国旗をそのままコピー + 現在の言語状態も更新）
    toggleBtn.textContent = btn.textContent;
    toggleBtn.dataset.current = selectedLang;

    //ボタンの表示制御（今選んだ言語は非表示に）
    if (selectedLang === 'ja') {
      jaBtn.classList.add('isHidden');
      koBtn.classList.remove('isHidden');
    } else {
      jaBtn.classList.remove('isHidden');
      koBtn.classList.add('isHidden');
    }

    //メニューを閉じる
    menu.parentElement.classList.remove('active');
  });
});
