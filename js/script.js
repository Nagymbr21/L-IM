const questions = [
  { q: 'Hány lába van egy póknak?', a: ['6', '4', '8', '10'], correct: 2 },
  {q: 'Melyik szín keveréséből keletkezik a zöld szín?', a:['Piros és kék','Sárga és kék','Piros és sárga','Fekete és fehér'], correct:1},
  {q: 'Melyik állat ugat?', a:['Macska','Kutya','Hal','Madár'], correct:1},
  {q: 'Melyik a Disney mese?', a:['A lármás család','Alvin és a mókusok','Katicabogár','Gumball csodálatos világa'], correct:2},
  {q: 'Melyik évszakban hullanak a levelek?', a:['Tavasz','Tél','Ősz','Nyár'], correct:2},
  {q: 'Ha egy kakas tojást tojik a tetőre az merre gurul el?', a:['Jobbra','Balra','Előre','Sehova'], correct:3},
  {q: 'Mi nehezebb 1 kg toll vagy 1 kg vas?', a:['Toll','Egyenlő','Attól függ','Vas'], correct:1},
  {q: 'Melyik állat tud úszni és repülni is?', a:['Pingvin','Strucc','Gólya','Kacsa'], correct:3},
  {q: 'Melyik hónapba van 28 nap?', a:['Február','Június','December','Minden hónapban'], correct:3},
  {q: 'Hány lába van egy madárnak?', a:['1','0','2','3'], correct:2},
  {q: 'Melyik madár nem tud repülni? ', a:['Gólya','Fecske','Strucc','Galamb'], correct:2},
  {q: 'Melyik kontinensen található Magyarország?', a:['Afrika','Ázsia','Ausztrália','Európa'], correct:3},
  {q: 'Mi Magyarország fővárosa?', a:['Bukarest','Budapest','Szolnok','Sopron'], correct:1},
  {q: 'Melyik ország nem Magyarország szomszédja?', a:['Szerbia','Ukrajna','Lengyelország','Szlovénia'], correct:2},
  {q: 'Mennyi 5 × 5?', a:['25','13','20','68'], correct:0},
  {q: 'Ha 13 éves vagy akkor mikor születtél?', a:['2012','2010','2019','2013'], correct:3},
  {q: 'Ki Shrek párja?', a:['Hamupipőke','Fióna','Csipkerózsika','Ariel'], correct:1},
  {q: 'Hányat lép egy veréb egy évben?', a:['100.000','500.000','Semennyit','10.000'], correct:2},
  {q: 'Az alábbi állatok közül melyik hüllő?', a:['Cápa','Kaméleon','Gólya','Kutya'], correct:1},
  {q: 'Melyik kontinensen található az Amazonas őserdő?', a:['Afrika','Ázsia','Dél-Amerika','Európa'], correct:2},
  {q: 'Mennyi 8 × 7?', a:['54','56','48','64'], correct:1},
  {q: 'Melyik korban építették a piramisokat?', a:['Középkor','Újkor','Ókor','Jövőkor'], correct:2},
  {q: 'Melyik gáz szükséges leginkább a légzéshez?', a:['Szén-dioxid','Oxigén','Hidrogén','Hélium'], correct:1},
  {q: 'Melyik anyag vezeti legjobban az elektromos áramot?', a:['Fa','Műanyag','Vas','Réz'], correct:3},
  {q: 'Ki írta a János vitéz című művet?', a:['Arany János','Petőfi Sándor','Móra Ferenc','Mikszáth Kálmán'], correct:1},
  {q: 'Melyik ország fővárosa Róma?', a:['Franciaország','Spanyolország','Olaszország','Görögország'], correct:2},
  {q: 'Mennyi 144 osztva 12-vel?', a:['10','11','12','14'], correct:2},
  {q: 'Melyik csoportba tartozik a béka?', a:['Hüllők','Kétéltűek','Emlősök','Halak'], correct:1},
  {q: 'Ki volt a „legnagyobb magyar”?', a:['Kossuth Lajos','Széchenyi István','Rákoczi Ferenc','Deák Ferenc'], correct:1}
];

const money = ['1 000','3 000','6 000','12 000','20 000','25 000','30 000','40 000','45 000','50 000'];

const MAX_QUESTIONS = 10;

let current = 0;
let gameQuestions = [];
let _hasShownQuestion = false;

// Elements
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const playScreen = document.getElementById('play-screen');
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const moneyList = document.getElementById('money-list');
const statusEl = document.getElementById('status');
const headerEl = document.querySelector('main h1');
let headerOriginalHTML = null;

function setHeaderQuestion(text) {
  if (!headerEl) return;
  if (!headerOriginalHTML) headerOriginalHTML = headerEl.innerHTML;
  const crown = headerEl.querySelector('.crown');
  const crownHtml = crown ? crown.outerHTML : '';
  const span = `<span id="header-question" style="margin-left:8px;vertical-align:middle">${escapeHtml(
    text
  )}</span>`;
  headerEl.innerHTML = crownHtml + span;
  headerEl.classList.add('game-header');
}

// small helper to escape HTML in dynamic text
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function restoreHeader() {
  if (!headerEl) return;
  if (headerOriginalHTML !== null) {
    headerEl.innerHTML = headerOriginalHTML;
    headerOriginalHTML = null;
  }
  headerEl.classList.remove('game-header');
}

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
  // prepare screens
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
  const questionArea = document.getElementById('question-area');

  const render = () => {
    if (questionEl) questionEl.textContent = '';
    setHeaderQuestion(q.q);
    choicesEl.innerHTML = '';

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
      btn.addEventListener('click', () => {
        [...choicesEl.children].forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectAnswer(choice.idx, btn);
      });
      choicesEl.appendChild(btn);
    });

    updateLadder();
    showStatus(`Kérdés ${current + 1}/${MAX_QUESTIONS}`);

    // enter animation
    if (questionArea) {
      questionArea.classList.remove('transition-exit');
      questionArea.classList.add('transition-enter');
      const onEnterEnd = () => {
        questionArea.classList.remove('transition-enter');
        questionArea.removeEventListener('animationend', onEnterEnd);
      };
      questionArea.addEventListener('animationend', onEnterEnd);
    }

    _hasShownQuestion = true;
  };

  // if we've shown a question before, animate exit then render the new one
  if (_hasShownQuestion && questionArea) {
    console.log('showQuestion: playing exit animation for question', current);
    questionArea.classList.remove('transition-enter');
    questionArea.classList.add('transition-exit');
    let handled = false;
    const onExitEnd = () => {
      if (handled) return;
      handled = true;
      questionArea.removeEventListener('animationend', onExitEnd);
      console.log('showQuestion: exit animation ended');
      render();
    };
    // safety fallback: if animationend doesn't fire, render after 400ms
    const fallback = setTimeout(() => {
      if (handled) return;
      handled = true;
      questionArea.removeEventListener('animationend', onExitEnd);
      console.warn('showQuestion: exit animation did not fire, using fallback render');
      render();
    }, 400);
    questionArea.addEventListener('animationend', () => {
      clearTimeout(fallback);
      onExitEnd();
    });
  } else {
    render();
  }
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
    showStatus('Helyes! Nyomd a szóközt a folytatáshoz');

    // wait for Space key to continue to next question
    const onSpace = (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        document.removeEventListener('keydown', onSpace);
        current++;
        if (current >= gameQuestions.length) endGame(true);
        else {
          init();
          showQuestion();
          disableChoices(false);
        }
      }
    };
    // attach listener
    document.addEventListener('keydown', onSpace);
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
  if (won) statusEl.textContent = 'Gratulálok — végigértél! Nyomd a szóközt a kilépéshez';
  else statusEl.textContent = `Nyert: ${money[Math.max(0, current - 1)]} Ft — Nyomd a szóközt a kilépéshez`;

  // disable choices and wait for explicit Space key to exit back to start
  disableChoices(true);

  const onSpaceExit = (e) => {
    if (e.code === 'Space' || e.key === ' ') {
      document.removeEventListener('keydown', onSpaceExit);
      playScreen.classList.add('hidden');
      // restore original header/title
      restoreHeader();
      // restore placeholder in the question card for the start screen
      if (questionEl) questionEl.textContent = 'Kérdés szövege';
      startScreen.classList.remove('hidden');
      disableChoices(false);
    }
  };

  // attach listener: only Space will trigger exit
  document.addEventListener('keydown', onSpaceExit);
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

