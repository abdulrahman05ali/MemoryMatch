import { icons } from "./icons.js";
import { getDatabase, ref, push, runTransaction} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
import { renderScore, saveNewScore } from './savescore.js';

const content = document.querySelector('.gameplay-contents');

function setOriginalPlay() {
  const playButton = document.querySelector('.playButton');
  playButton.addEventListener('click',() => {
    content.classList.add('hidden');
    
    setTimeout(() => {
      content.innerHTML = 
      `<div class="visuals-2">
        <div class="instruction-screen">
          <p>Welcome to Memory Match! The aim of the game is simple:</p>
          <div class="b">
              <p>1. You have 5 seconds to memorise the position of each tile</p>
              <p>2. Match all the pairs as quickly as possible</p>
              <p>3. Get faster and climb to the top of the leaderboard!</p>
          </div>
          <div class="button-container">
            <button class="back">Back to Start</button>
            <button class="newplay">Play Game</button>
          </div>
        </div>
      </div>`;

      content.classList.remove('hidden');

      const newPlay = document.querySelector('.newplay');
      newPlay.addEventListener('click', incrementGamesPlayed);
      newPlay.addEventListener('click', () => {
        intoGame();
      })

      const backButton = document.querySelector('.back');
      backButton.addEventListener('click',() => {
        content.classList.add('hidden');

        setTimeout(() => {
          content.innerHTML = 
           `<div class="visuals-1">
              <div class="game-title">Memory Match</div>
              <div class="playButton">Start Game</div>
            </div> `;
          
          content.classList.remove('hidden')
          setOriginalPlay();
        },400)
      })
    },400)
  }) 
}

export { setOriginalPlay };

function memoriseSection() {
  let timer2 = 5
  let timerInterval;
  const randomise = shuffleIcons();

  content.innerHTML = 
    `<div class="visuals-4">
      <div class="top-gameplay">
        <div class="flex-container">
          time remaining:&nbsp;<span id="timer">${timer2}</span>
        </div>
      </div>` + randomise;

  timerInterval = setInterval(() => {
    timer2--;
    document.getElementById('timer').textContent = timer2;

    if (timer2 === 0) {
      clearInterval(timerInterval);
      gameMechanic();
    }
 },1000)
}

function shuffleIcons(timer2) {
  for (let i = icons.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i  + 1));
    [icons[i], icons[j]] = [icons[j], icons[i]]; 
  }

  let randomHTML = `
      <div class="bottom-gameplay">
        <div class="tiles">`

  icons.forEach((icon) => {
    randomHTML += `
    <div class="icontile">
      <img class="iconimage" src="images/${icon}.png" ondragstart="return false;">
    </div>
    `
  })

  const finalHTML = randomHTML + 
  `
        </div>
      </div>
    </div>`


    return finalHTML;
}

function gameMechanic() {
  let timer3 = 0;
  let timerInterval3;
  const top = document.querySelector('.flex-container');
  const startTime = performance.now();

  timerInterval3 = setInterval(() => {
    const currentTime = performance.now();
    timer3 = Math.floor(currentTime - startTime);
    const seconds = (timer3 / 1000).toFixed(2);
    top.innerHTML = `time: ${seconds}`;

    if (Math.abs(seconds - 60.01) < 0.01) {
      clearInterval(timerInterval3);
      saveScore(timer3);
    }
  }, 10);
  let score = 0;

  const iconimg = document.querySelectorAll('.iconimage');
  const icontile = document.querySelectorAll('.icontile');
  iconimg.forEach((icon) => {
    icon.classList.add('hidden');
  });

  let clickedTiles = [];
  let processingTimeout = null;

  function resetTile(tile, img) {
    if (!tile.classList.contains('matched')) {
      img.classList.add('hidden');
    }
  }

  function processMatches() {
    while (clickedTiles.length >= 2) {
      const [first, second] = clickedTiles.splice(0, 2);

      if (first.src === second.src) {
        first.tile.classList.add('matched');
        second.tile.classList.add('matched');
        score++;
      } else {
        resetTile(first.tile, first.img);
        resetTile(second.tile, second.img);
      }

      if (score === 6) {
        clearInterval(timerInterval3);
        saveScore(timer3)
      }
    }

    processingTimeout = null;
  }

  icontile.forEach((tile, index) => {
    tile.addEventListener('click', (event) => {
      if (!isClickGenuine(event, tile)) {
        console.log("Suspicious click detected!");
        return;
      }

      if (tile.classList.contains('matched') || clickedTiles.some(item => item.tile === tile)) {
        return;
      }

      iconimg[index].classList.remove('hidden');
      clickedTiles.push({ tile, img: iconimg[index], src: iconimg[index].src });

      if (processingTimeout) {
        clearTimeout(processingTimeout);
      }

      processingTimeout = setTimeout(processMatches, 250);
    });
  });
}

function isClickGenuine(event, tile) {
  const rect = tile.getBoundingClientRect();
  const clickX = event.clientX;
  const clickY = event.clientY;

  return (
    clickX >= rect.left &&
    clickX <= rect.right &&
    clickY >= rect.top &&
    clickY <= rect.bottom
  );
}

function saveScore(timer3) {
  const finalTime = (timer3/1000).toFixed(2);
  content.classList.add('hidden');

  setTimeout(() => {
    content.innerHTML = 
    ` <div class="visuals-5">
        <div class="inner-visuals-5">
          <div class="time">Time: ${finalTime} seconds</div>
          <div class="input-button-container">
            <input class="input-name" maxlength="14" placeholder="name">
            <button class="game-button save-score">Save</button>
          </div>
          <div class="button-container">
            <button class="game-button home-button">Home</button>
            <button class="game-button play-again">Play Again</button>
          </div>
        </div>
      </div>`;

    const saveButton = document.querySelector('.save-score');
    const userInput = document.querySelector('.input-name');
    
    saveButton.addEventListener('click', () => {
      if (userInput.value) {
        saveNewScore(userInput.value, finalTime)
          .then(() => {
            renderScore();
            content.classList.add('hidden');
            setTimeout(() => {
              content.innerHTML = 
              `<div class="visuals-1">
                  <div class="game-title">Memory Match</div>
                  <div class="playButton">Start Game</div>
              </div>`;
              content.classList.remove('hidden');
              setOriginalPlay();
            }, 400);
          })
          .catch((error) => {
            alert(`Error saving score: ${error}`);
          });
      }
    });

    const home = document.querySelector('.home-button');
    home.addEventListener('click',() => {
      content.classList.add('hidden');
  
      setTimeout(() => {
        content.innerHTML = 
         `<div class="visuals-1">
            <div class="game-title">Memory Match</div>
            <div class="playButton">Start Game</div>
          </div> `;
        
        content.classList.remove('hidden')
        setOriginalPlay();
      },400)
    })


    const playAgain = document.querySelector('.play-again');
    playAgain.addEventListener('click', incrementGamesPlayed);
    playAgain.addEventListener('click', () => {
      content.classList.add('hidden');
      setTimeout(() => {
        intoGame();
        content.classList.remove('hidden');
      }, 400);
  })

      content.classList.remove('hidden');
  },400)
}

function incrementGamesPlayed() {
  const db = getDatabase();
  const gamesPlayedRef = ref(db, 'gamesPlayed');

  runTransaction(gamesPlayedRef, (currentValue) => {
    if (currentValue === null) {
      return 1; 
    } else {
      return currentValue + 1; 
    }
  }).catch((error) => {
    console.error('Error updating games played counter:', error);
  });
}

function intoGame() {
  let timer = 3
  let intervalId;

  content.innerHTML = `<div class="visuals-3">${timer}</div>`;
  

 intervalId = setInterval(() => {
  timer--;
  content.innerHTML =
  `<div class="visuals-3">${timer}</div>`
  

  if (timer === 0) {
    clearInterval(intervalId)
    memoriseSection(); 
  }
 },1000)
}