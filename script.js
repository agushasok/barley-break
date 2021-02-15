const gameFieldEl = document.querySelector('.gameField');
let gameArray = [];

function reset() {
  gameFieldEl.innerHTML = '';
}

function newGameClicks() {
  document.querySelectorAll('.play-button').forEach(el => {
    el.addEventListener('click', (event) => {
      startGame(+event.target.id);
    })
  })
}

function newGame() {
  reset();

  const easyBtn = document.createElement('button');
  easyBtn.classList.add('play-button');
  easyBtn.id = '3';
  easyBtn.innerText = 'Easy';

  const normBtn = document.createElement('button');
  normBtn.classList.add('play-button');
  normBtn.id = '4';
  normBtn.innerText = 'Normal';

  const hardBtn = document.createElement('button');
  hardBtn.classList.add('play-button');
  hardBtn.id = '5';
  hardBtn.innerText = 'Hard';

  gameFieldEl.append(easyBtn, normBtn, hardBtn);
  newGameClicks();
}

function startGame(fieldsCount) {
  reset();

  document.body.addEventListener('keydown', event => event.code === 'Escape' && newGame());

  const table = document.createElement('table');
  gameArray = [];
  for (let i = 0; i < fieldsCount**2 - 1; i++) gameArray.push(i+1);

  for (let i = 0 ; i < fieldsCount; i++) {
    const tableRow = document.createElement('tr');

    for (let j = 0; j < fieldsCount; j++) {
      const tableData = document.createElement('td');
      tableData.setAttribute('x-index', j.toString());
      tableData.setAttribute('y-index', i.toString());
      tableData.innerText = gameArray[i*fieldsCount + j] ?? '';
      tableRow.append(tableData);
    }
    table.append(tableRow);
  }

  table.querySelectorAll('td').item(fieldsCount**2-1).classList.add('empty');
  gameFieldEl.append(table);

  const backBtn = document.createElement('button');
  backBtn.classList.add('back-btn');
  backBtn.innerText = 'Back';
  backBtn.addEventListener('click', newGame);
  gameFieldEl.append(backBtn);

  cellClicks();

  for (let i = 0; i < 50; i++) {
    let emptyCell = {
      x: document.querySelector('.empty')?.getAttribute('x-index'),
      y: document.querySelector('.empty')?.getAttribute('y-index')
    }
    let rndCoord = Math.round(Math.random()*(fieldsCount-1));
    document.querySelector(`[x-index="${rndCoord}"][y-index="${emptyCell.y}"]`)?.click();

    emptyCell = {
      x: document.querySelector('.empty')?.getAttribute('x-index'),
      y: document.querySelector('.empty')?.getAttribute('y-index')
    }
    rndCoord = Math.round(Math.random()*(fieldsCount-1));
    document.querySelector(`[x-index="${emptyCell.x}"][y-index="${rndCoord}"]`)?.click();
  }
}

function cellClicks() {
  document.querySelectorAll('td').forEach(el => {
    el.addEventListener('click', moveCells)
  })
}

function moveCells(event) {
  const targetCellCoords = {
    x: +event.target.getAttribute('x-index'),
    y: +event.target.getAttribute('y-index')
  }

  const emptyCellCoords = {
    x: +document.querySelector('.empty').getAttribute('x-index'),
    y: +document.querySelector('.empty').getAttribute('y-index')
  }

  if (targetCellCoords.x !== emptyCellCoords.x && targetCellCoords.y !== emptyCellCoords.y) return;
  if (targetCellCoords.x === emptyCellCoords.x && targetCellCoords.y === emptyCellCoords.y) return;

  document.querySelector('.empty').classList.remove('empty');
  event.target.classList.add('empty');

  if (targetCellCoords.x === emptyCellCoords.x) {
    if (targetCellCoords.y > emptyCellCoords.y) {
      for (let i = emptyCellCoords.y; i < targetCellCoords.y; i++) {
        const a = document.querySelector(`[x-index="${targetCellCoords.x}"][y-index="${i}"]`);
        const b = document.querySelector(`[x-index="${targetCellCoords.x}"][y-index="${i+1}"]`);
        [a.innerText, b.innerText] = [b.innerText, a.innerText];
      }
    } else {
      for (let i = emptyCellCoords.y; i > targetCellCoords.y; i--) {
        const a = document.querySelector(`[x-index="${targetCellCoords.x}"][y-index="${i}"]`);
        const b = document.querySelector(`[x-index="${targetCellCoords.x}"][y-index="${i-1}"]`);
        [a.innerText, b.innerText] = [b.innerText, a.innerText];
      }
    }
  } else {
    if (targetCellCoords.x > emptyCellCoords.x) {
      for (let i = emptyCellCoords.x; i < targetCellCoords.x; i++) {
        const a = document.querySelector(`[x-index="${i}"][y-index="${targetCellCoords.y}"]`);
        const b = document.querySelector(`[x-index="${i+1}"][y-index="${targetCellCoords.y}"]`);
        [a.innerText, b.innerText] = [b.innerText, a.innerText];
      }
    } else {
      for (let i = emptyCellCoords.x; i > targetCellCoords.x; i--) {
        const a = document.querySelector(`[x-index="${i}"][y-index="${targetCellCoords.y}"]`);
        const b = document.querySelector(`[x-index="${i-1}"][y-index="${targetCellCoords.y}"]`);
        [a.innerText, b.innerText] = [b.innerText, a.innerText];
      }
    }
  }

  checkWin();
}

function checkWin() {
  gameArray = Array.from(document.querySelectorAll('td')).map(el => el.innerText);
  const standard = [...gameArray].sort((a, b) => +a - +b).splice(1);
  standard.push('');

  if (gameArray.toString() === standard.toString()) {
    endGame();
  }
}

function endGame() {
  reset();

  const congrats = document.createElement('h3');
  congrats.innerText = 'Congratulations! You solve the puzzle!';
  const newGameBtn = document.createElement('button');
  newGameBtn.classList.add('new-game-btn');
  newGameBtn.innerText = 'Start new game';
  newGameBtn.addEventListener('click', newGame);

  gameFieldEl.append(congrats, newGameBtn);
}

newGame();
