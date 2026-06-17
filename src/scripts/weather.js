'use strict';

// 都市の座標データを取得する
const CITIES = {
  ko: { lat: 35.1796, lon: 129.0756 },
  ja: { lat: 35.6762, lon: 139.6503 },
};

// 天気表示を変数に入れる
const WEATHER_ICONS = {
  clear: '🌞',
  cloudy: '☁️',
  rain: '☔️',
  snow: '☃️',
};

// 天気コードから絵文字を変換する
function getIcon(code) {
  if (code === 0) return WEATHER_ICONS.clear;
  if (code <= 3 || (code >= 45 && code <= 48)) return WEATHER_ICONS.cloudy;
  if (code >= 71 && code <= 77) return WEATHER_ICONS.snow;
  if (code >= 85 && code <= 86) return WEATHER_ICONS.snow;
  return WEATHER_ICONS.rain;
}

// APIからデータを取得する(asyncとawaitはAPIの応答を待ってから処理する仕組み)
async function fetchWeather(lang) {
  const { lat, lon } = CITIES[lang];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;
  const res = await fetch(url);
  const data = await res.json();
  return {
    temp: Math.round(data.current.temperature_2m),
    icon: getIcon(data.current.weather_code),
  };
}

// 画面に反映する（querySelectorAllで2箇所同時に更新）
async function updateWeather(lang) {
  const { temp, icon } = await fetchWeather(lang);
  document.querySelectorAll('.info__temp').forEach((el) => (el.textContent = `${temp}°C`));
  document.querySelectorAll('.info__weather').forEach((el) => (el.textContent = icon));
}

// 初期表示（デフォルトは ko）
const initialLang = document.querySelector('.langToggle')?.dataset.current ?? 'ko';
updateWeather(initialLang);

// 言語切り替え時に更新
document.addEventListener('langchange', (e) => {
  updateWeather(e.detail.lang);
});
