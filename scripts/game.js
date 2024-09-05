import { icons } from "./icons.js";

export function shuffleIcons(timer2) {
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

export function gameMechanic() {
  let timer3 = 0;
  let timerInterval3;
  const top = document.querySelector('.flex-container');

  timerInterval3 = setInterval(() => {
    timer3 += 10;
    const seconds = (timer3/1000).toFixed(2);
    top.innerHTML = `time: ${seconds}`;

   if (Math.abs(seconds - 60.01) < 0.01) {
    clearInterval(timerInterval3);
    saveScore(timer3)
   }
  },10);
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
    tile.addEventListener('click', () => {
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

function saveScore(timer3) {
  const finalTime = (timer3/1000).toFixed(2);
  // time saved in finalTime
  // change page, transition
  // find way to save score in database
}