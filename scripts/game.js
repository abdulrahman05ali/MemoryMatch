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
  const iconimg = document.querySelectorAll('.iconimage');
  const icontile = document.querySelectorAll('.icontile');

  // Initially hide all icons
  iconimg.forEach((icon) => {
    icon.classList.add('hidden');
  });

  let clickQueue = []; // Queue to manage clicks
  let isProcessing = false; // Flag to track if processing is happening

  icontile.forEach((tile, index) => {
    tile.addEventListener('click', () => {
      // Ignore clicks on already matched tiles or tiles being processed
      if (tile.classList.contains('matched') || clickQueue.some(item => item.tile === tile)) {
        return;
      }

      iconimg[index].classList.remove('hidden'); // Reveal the clicked icon
      clickQueue.push({ tile, img: iconimg[index], src: iconimg[index].src });

      // Process pairs if there are at least two items in the queue and not currently processing
      if (!isProcessing) {
        processQueue();
      }
    });
  });

  function processQueue() {
    if (clickQueue.length < 2) {
      return; // Not enough tiles to process
    }

    isProcessing = true; // Set processing flag to true

    const pairs = clickQueue.splice(0, 2); // Get the first two tiles

    setTimeout(() => {
      if (pairs.length === 2) { // Ensure we have two tiles to process
        const [firstTile, secondTile] = pairs;

        if (firstTile.src === secondTile.src) {
          // If both icons match, mark them as matched
          firstTile.tile.classList.add('matched');
          secondTile.tile.classList.add('matched');
        } else {
          // Otherwise, hide the icons again
          firstTile.img.classList.add('hidden');
          secondTile.img.classList.add('hidden');
        }
      }

      isProcessing = false; // Reset the processing flag

      // Continue processing any remaining pairs
      if (clickQueue.length >= 2) {
        processQueue(); // Process the next pair
      }
    }, 300); // Short timeout for fast feedback
  }
}