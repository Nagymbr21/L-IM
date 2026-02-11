const questions = [
  { q: 'Mi Magyarország fővárosa?', a: ['Budapest', 'Debrecen', 'Szeged', 'Pécs'], correct: 0 },
  {q: 'Melyik évben kezdődött a második világháború?', a:['1914','1939','1945','1929'], correct:1},
  {q: 'Milyen szín keveredik a sárgából és a kékkel?', a:['Zöld','Lila','Barna','Narancs'], correct:0},
  {q: 'Ki írta a "Tündér Lala" című művet?', a:['Jókai Mór','Móra Ferenc','Erkel Ferenc','Petőfi Sándor'], correct:1},
  {q: 'Mekkora a Föld átlagos sugara km-ben (kb.)?', a:['6400','12000','3000','10000'], correct:0},
  {q: 'Mi az elektron töltése?', a:['Pozitív','Negatív','Semleges','Változó'], correct:1},
  {q: 'Melyik bolygó a Naprendszer legnagyobb bolygója?', a:['Föld','Vénusz','Jupiter','Mars'], correct:2},
  {q: 'Mi a magyar nemzeti ünnep augusztus 20-án?', a:['Nemzeti összetartozás napja','Az államalapítás ünnepe','Forradalom évfordulója','Szabadság napja'], correct:1},
  {q: 'Melyik a legkisebb egész szám?', a:['-1','0','1','2'], correct:0},
  {q: 'Mi az alapanyag a kenyér készítéséhez?', a:['Cukor','Liszt','Só','Vaj'], correct:1}
];

const money = ['100','200','300','500','1 000','2 000','4 000','8 000','16 000','32 000'];

let current = 0;
let used5050 = false;

// Elements
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const playScreen = document.getElementById('play-screen');
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const moneyList = document.getElementById('money-list');
const statusEl = document.getElementById('status');
const lifeline50 = document.getElementById('lifeline-50');

function init() {
  // populate ladder (highest first)
  moneyList.innerHTML = '';
  for (let i = money.length - 1; i >= 0; i--) {
    const li = document.createElement('li');
    li.textContent = `${money[i]} Ft`;
    if (i === current) li.classList.add('current');
    moneyList.appendChild(li);
  }
}

function startGame(){
  startScreen.classList.add('hidden');
  playScreen.classList.remove('hidden');
  current = 0; used5050 = false; lifeline50.disabled = false;
  init();
  showQuestion();
}

function showQuestion() {
  const q = questions[current];
  questionEl.textContent = q.q;
  choicesEl.innerHTML = '';

  q.a.forEach((txt, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.type = 'button';
    const label = String.fromCharCode(65 + i); // A, B, C, D
    btn.textContent = `${label}. ${txt}`;
    btn.dataset.idx = i;
    btn.setAttribute('aria-label', `Válasz ${label}: ${txt}`);
    btn.addEventListener('click', () => selectAnswer(i, btn));
    choicesEl.appendChild(btn);
  });

  updateLadder();
  showStatus(`Kérdés ${current + 1}/${questions.length}`);
}

function showStatus(text) {
  statusEl.textContent = text;
}

function selectAnswer(idx, btn) {
  disableChoices(true);
  const q = questions[current];
  const isCorrect = q.correct === idx;

  if (isCorrect) {
    btn.classList.add('correct');
    showStatus('Helyes!');
    setTimeout(() => {
      current++;
      if (current >= questions.length) endGame(true);
      else {
        init();
        showQuestion();
        disableChoices(false);
      }
    }, 900);
    return;
  }

  // wrong answer
  btn.classList.add('wrong');
  const correctBtn = [...choicesEl.children].find((b) => +b.dataset.idx === q.correct);
  if (correctBtn) correctBtn.classList.add('correct');
  showStatus('Rossz válasz — vége.');
  setTimeout(() => endGame(false), 1000);
}

function disableChoices(state) {
  [...choicesEl.children].forEach((b) => {
    b.classList.toggle('disabled', state);
    b.disabled = state;
  });
}

function updateLadder() {
  const items = moneyList.querySelectorAll('li');
  items.forEach((li, idx) => {
    li.classList.toggle('current', idx === money.length - 1 - current);
  });
}

function use5050() {
  if (used5050) return;
  used5050 = true;
  lifeline50.disabled = true;

  const q = questions[current];
  const incorrect = q.a.map((_, i) => i).filter((i) => i !== q.correct);
  shuffleArray(incorrect);
  const toRemove = incorrect.slice(0, 2);

  [...choicesEl.children].forEach((b) => {
    if (toRemove.includes(+b.dataset.idx)) {
      b.classList.add('disabled');
      b.disabled = true;
      b.setAttribute('aria-hidden', 'true');
    }
  });
}

function endGame(won){
  if(won) statusEl.textContent = 'Gratulálok — végigértél!';
  else statusEl.textContent = `Nyert: ${money[Math.max(0,current-1)]} Ft`;
  // reset to start after short timeout
  setTimeout(()=>{
    playScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
  },1500);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

startBtn.addEventListener('click', startGame);
lifeline50.addEventListener('click', use5050);

// init UI on load
init();
