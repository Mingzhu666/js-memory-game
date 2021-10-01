// css class for different card image
const CARD_TECHS = [
  'html5',
  'css3',
  'js',
  'sass',
  'nodejs',
  'react',
  'linkedin',
  'heroku',
  'github',
  'aws',
  'html5',
  'css3',
  'js',
  'sass',
  'nodejs',
  'react',
  'linkedin',
  'heroku',
  'github',
  'aws'
];

// only list out some of the properties,
// add more when needed
const game = {
  score: 0,
  level: 1,
  timer: 60,
  timerDisplay: document.querySelector('.game-timer__bar'),
  scoreDisplay: document.querySelector('.game-stats__score--value'),
  levelDisplay: document.querySelector('.game-stats__level--value'),
  timerInterval: null,
  startButton: document.querySelector('.game-stats__button'),
  gameBoard: document.querySelector('.game-board'),
  timerBar: document.querySelector('.game-timer__bar'),
};

let flippedCardTech = [];
let succeededCardPairCount = 0;

setGame();

/*******************************************
/     game process
/******************************************/
function setGame() {
  // register any element in your game object
  startGame();
}

function startGame() {
  const { startButton } = game;
  startButton.addEventListener('click', () => {
    if(startButton.innerHTML === 'New Game') {
      startButton.innerHTML = 'End Game';
      firstLevel();
      handleCardFlip();
      updateTimerDisplay();
      console.log('click new game');
    }
    else if(startButton.innerHTML === 'Start Game') {
      startButton.innerHTML = 'End Game';
      firstLevel();
      game.score = 0;
      game.scoreDisplay.innerHTML = game.score;
      game.level = 1;
      game.levelDisplay.innerHTML = game.level;
      game.timer = 60;
      succeededCardPairCount = 0;
      flippedCardTech = [];
      handleCardFlip();
      updateTimerDisplay();
      // firstLevel();
    }
    else if(startButton.innerHTML === 'End Game') {
      handleGameOver();
      clearInterval(game.timerInterval);
      startButton.innerHTML = 'Start Game';
    }
  })
}

function firstLevel() {
  const { gameBoard } = game;
  gameBoard.style = 'grid-template-columns: repeat(2, 1fr)';
  gameBoard.innerHTML = null;
  for (let i = 0; i < 2; i++) {
    gameBoard.append(createCard(CARD_TECHS[i]));
  }
  copyCards();
  shuffleCards();
}

function secondLevel() {
  const { gameBoard } = game;
  gameBoard.style = 'grid-template-columns: repeat(4, 1fr)';
  gameBoard.innerHTML = null;
  for (let i = 0; i < 8; i++) {
    gameBoard.append(createCard(CARD_TECHS[i]));
  }
  copyCards();
  shuffleCards();
}

function thirdLevel() {
  const { gameBoard } = game;
  gameBoard.style = 'grid-template-columns: repeat(6, 1fr)';
  gameBoard.innerHTML = null;
  for (let i = 0; i < 18; i++) {
    gameBoard.append(createCard(CARD_TECHS[i]));
  }
  copyCards();
  shuffleCards();
}

function createCard(className) {
  let newCard = document.createElement('div');
  newCard.classList.add('card');
  newCard.classList.add(`${className}`);
  newCard.setAttribute('data-tech', `${className}`);
  let newCardFront = document.createElement('div');
  newCardFront.classList.add('card__face', 'card__face--front');
  let newCardBack = document.createElement('div');
  newCardBack.classList.add('card__face', 'card__face--back');
  newCard.append(newCardFront, newCardBack);
  return newCard;
}

function copyCards() {
  const { gameBoard } = game;
  gameBoard.childNodes.forEach(
    (card) => {
      gameBoard.append(card.cloneNode(true));
    }
  )
}

function shuffleCards() {
  const { gameBoard } = game;
  let cards = gameBoard.querySelectorAll('.card');
  let size = gameBoard.querySelectorAll('.card').length;
  cards.forEach(
    (card) => {
      let random = Math.floor(Math.random() * size);
      card.style.order = random;
    }
  )
}

function handleCardFlip() {
  const { gameBoard } = game;
  let cards = gameBoard.querySelectorAll('.card');
  let flipped = [];
  
  cards.forEach(
    (card) => {
      card.addEventListener('click', () => {
        if(flippedCardTech.length === 0 && !card.classList.contains('done')) {
          console.log('clicked the card.');
          card.classList.add('card--flipped', 'done');
          flippedCardTech.push(card.getAttribute('data-tech'));
          flipped[flippedCardTech.length - 1] = card;
        }
        if(flippedCardTech.length === 1 && !card.classList.contains('done')) {
          card.classList.add('card--flipped', 'done');
          flippedCardTech.push(card.getAttribute('data-tech'));
          flipped[flippedCardTech.length - 1] = card;

          if(flippedCardTech[0] === flippedCardTech[1]) {  // Paired
            flippedCardTech = [];
            succeededCardPairCount ++;
            updateScore();
            passLevel();
          }
          else {
            console.log('not paired.')
            setTimeout((e) => {
              flipped[0].classList.remove('card--flipped', 'done');
              flipped[1].classList.remove('card--flipped', 'done');
              flippedCardTech = [];
            }, 1500)
          }
        }
      })
    }
  )
}

function passLevel() {
  let { level, timerInterval } = game;
  if(level === 1 && succeededCardPairCount === 2) {
    setTimeout( () => {
      secondLevel();
      updateLevelInfo();
      // clearInterval(timerInterval);
      updateTimerDisplay();
      handleCardFlip();
    }, 1500)
  }
  else if(level === 2 && succeededCardPairCount === 8) {
    setTimeout( () => {
      thirdLevel();
      updateLevelInfo();
      updateTimerDisplay();
      handleCardFlip();
    }, 1500)
  }
  else if(level === 3 && succeededCardPairCount === 18) {
    handleGameOver();
    clearInterval(timerInterval);
  }
}

function handleGameOver() {
  let { score, timer, level } = game;
  let success = 0;
  if(level === 3 && succeededCardPairCount === 18) {
    success = 1;
  }

  if(success === 1) {
    alert(`Congratulations. Yor score is ${score}`);
  }
  else {
    console.log('fail' + timer);
    if(timer > 0) {
      alert(`Yor score is ${score}`);
    }
    else {
      alert(`Your score is ${score} and you failed on level ${level}`);
    }
  }

  score = 0;
  level = 1;
  flippedCardTech = [];
  succeededCardPairCount = 0;
  resetGameStats();
}

 function resetGameStats() {
  let { score, level, scoreDisplay, levelDisplay } = game;
  scoreDisplay.innerHTML = score;
  levelDisplay.innerHTML = level;
}

function updateLevelInfo() {
  let { level, timer, levelDisplay } = game;
  game.level = level + 1;
  levelDisplay.innerHTML = game.level;
  console.log('level' + level);
  game.timer = 60;
  console.log('updatedleveltimer' + timer);
  succeededCardPairCount = 0;
};

function restartGame() {
  clearInterval(game.timerInterval);
  game.succeededCardPairCount = 0;
  game.startButton.innerHTML = 'Start Game';
  resetGameStats();
  firstLevel();
}

/*******************************************
/     UI update
/******************************************/
function updateScore() {
  let { score, level, scoreDisplay, timerDisplay } = game;
  game.score = parseInt(scoreDisplay.innerHTML) + level * level * parseInt(timerDisplay.innerHTML.slice(0, -1)); 
  scoreDisplay.innerHTML = game.score;
  // game.score = 1234;
  // scoreDisplay.innerHTML = game.score;
  // score = 1234;
  // scoreDisplay.innerHTML = score;
}

function updateTimerDisplay() {
  let { timer, timerDisplay, timerInterval, timerBar } = game; //L288 timerInterval为什么解构出来不能直接用，timer在晋级的时候出问题
  timerBar.style.width = '100%';
  game.timer = 60;
  timer = game.timer;
  timerDisplay.innerHTML = 60 + 's';
  clearInterval(game.timerInterval);
  //timerInterval = setInterval(() => {
  game.timerInterval = setInterval(() => {
    if(timer > 0) {
      timer --;
      timerBar.style.width = `${timer/60*100}%`;
      timerDisplay.innerHTML = timer + 's';
      game.timer = timer;
    } else {
      clearInterval(game.timerInterval);
      restartGame();
      handleGameOver();
    }
  }, 1000);
}

/*******************************************
/     bindings
/******************************************/
function bindStartButton() {}

function unBindCardClick(card) {}

function bindCardClick() {}
