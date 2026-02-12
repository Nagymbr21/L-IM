const questions = [
  { q: 'Hány lába van egy póknak?', a: ['6', '4', '8', '10'], correct: 2 },
  {q: 'Melyik szín keveréséből keletkezik a zöld szín?', a:['Piros és kék','Sárga és kék','Piros és sárga','Fekete és fehér'], correct:1},
  {q: 'Melyik állat ugat?', a:['Macska','Kutya','Hal','Madár'], correct:1},
  {q: 'Melyik a Disney mese?', a:['A lármás család','Alvin és a mókusok','Katicabogár','Gumball csodálatos világa'], correct:2},
  {q: 'Melyik évszakban hullanak a levelek?', a:['Tavasz','Tél','Ősz','Nyár'], correct:2},
  {q: 'Ha egy kakas tojást tojik a tetőre az merre gurul el?', a:['Jobbra','Balra','Előre','Sehová'], correct:3},
  {q: 'Mi nehezebb 1 kg toll vagy 1 kg vas?', a:['Toll','Egyenlő','Attól függ','Vas'], correct:1},
  {q: 'Melyik állat tud úszni és repülni is?', a:['Pingvin','Strucc','Gólya','Kacsa'], correct:3},
  {q: 'Melyik hónapba van 28 nap?', a:['Február','Június','December','Minden hónapban'], correct:3},
  {q: 'Hány lába van egy madárnak?', a:['1','0','2','3'], correct:2},
  {q: 'Melyik madár nem tud repülni? ', a:['Gólya','Fecske','Strucc','Galamb'], correct:2},
  {q: 'Melyik kontinensen található Magyarország?', a:['Afrika','Ázsia','Ausztrália','Európa'], correct:3},
  {q: 'Mi Magyarország fővárosa?', a:['Bukarest','Budapest','Szolnok','Sopron'], correct:1},
  {q: 'Melyik ország nem Magyarország szomszédja?', a:['Szerbia','Ukrajna','Lengyelország','Szlovénia'], correct:2},
  {q: 'Mennyi 5×5?', a:['25','13','20','68'], correct:0},
  {q: 'Ha 13 éves vagy akkor mikor születtél?', a:['2012','2010','2019','2013'], correct:3},
  {q: 'Ki Shrek párja?', a:['Hamupipőke','Fióna','Csipkerózsika','Ariel'], correct:1},
  {q: 'Hányat lép egy veréb egy évben?', a:['100.000','500.000','Semennyit','10.000'], correct:2},
  {q: 'Az alábbi állatok közül melyik hüllő?', a:['Cápa','Kaméleon','Gólya','Kutya'], correct:1}
];

const money = ['100','200','300','500','1 000','2 000','4 000','8 000','16 000','32 000'];

const MAX_QUESTIONS = 10;

let current = 0;
let gameQuestions = [];

// Elements
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const playScreen = document.getElementById('play-screen');
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const moneyList = document.getElementById('money-list');
const statusEl = document.getElementById('status');

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
  current = 0;

  // prepare randomized question order for this play session
  gameQuestions = questions.slice();
  shuffleArray(gameQuestions);
  // limit number of questions per game
  gameQuestions = gameQuestions.slice(0, MAX_QUESTIONS);

  init();
  showQuestion();
}

function showQuestion() {
  const q = gameQuestions[current];
  questionEl.textContent = q.q;
  choicesEl.innerHTML = '';

  q.a.forEach((txt, i) => {
    // create shuffled choice objects that keep original index
  });

  const choices = q.a.map((txt, i) => ({ txt, idx: i }));
  shuffleArray(choices);
  choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.type = 'button';
    const label = String.fromCharCode(65 + i); // displayed label A, B, C, D
    btn.textContent = `${label}. ${choice.txt}`;
    btn.dataset.orig = choice.idx; // original index to compare with q.correct
    btn.setAttribute('aria-label', `Válasz ${label}: ${choice.txt}`);
    btn.addEventListener('click', () => selectAnswer(choice.idx, btn));
    choicesEl.appendChild(btn);
  });

  updateLadder();
  showStatus(`Kérdés ${current + 1}/${MAX_QUESTIONS}`);
}

function showStatus(text) {
  statusEl.textContent = text;
}

function selectAnswer(idx, btn) {
  disableChoices(true);
  const q = gameQuestions[current];
  const isCorrect = q.correct === idx;
  if (isCorrect) {
    btn.classList.add('correct');
    animateElement(btn);
    showStatus('Helyes!');
    setTimeout(() => {
      current++;
      if (current >= gameQuestions.length) endGame(true);
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
  animateElement(btn);
    const correctBtn = [...choicesEl.children].find((b) => +b.dataset.orig === q.correct);
  if (correctBtn) {
    correctBtn.classList.add('correct');
    animateElement(correctBtn);
  }
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

// removed 50:50 lifeline — function cleaned up

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

function animateElement(el) {
  if (!el) return;
  el.classList.add('reveal');
  const onEnd = () => {
    el.classList.remove('reveal');
    el.removeEventListener('animationend', onEnd);
  };
  el.addEventListener('animationend', onEnd);
}

// Attach handlers after DOM is ready to avoid timing issues
if (startBtn) {
  startBtn.addEventListener('click', startGame);
  // init UI on load
  init();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('start-btn');
    if (btn) btn.addEventListener('click', startGame);
    init();
  });
}

