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

  let clickQueue = []; // Single queue to manage clicks
  let isProcessing = false; // Single processing flag

  icontile.forEach((tile, index) => {
    tile.addEventListener('click', () => {
      // If the tile is already matched, or already in the queue, or currently being processed, do nothing
      if (tile.classList.contains('matched') || isProcessing || clickQueue.some(item => item.tile === tile)) {
        return;
      }

      iconimg[index].classList.remove('hidden'); // Reveal the clicked icon

      // Add clicked tile and image details to the queue
      clickQueue.push({ tile, img: iconimg[index], src: iconimg[index].src });

      // If we have a pair, initiate processing
      if (clickQueue.length === 2 && !isProcessing) { 
        processQueue();
      }
    });
  });

  function processQueue() {
    isProcessing = true; // Set processing flag to true

    const [firstTile, secondTile] = clickQueue.splice(0, 2); // Get the first two elements

    setTimeout(() => {
      if (firstTile.src === secondTile.src) {
        // If both icons match, mark them as matched
        firstTile.tile.classList.add('matched');
        secondTile.tile.classList.add('matched');
      } else {
        // Otherwise, hide the icons again
        firstTile.img.classList.add('hidden');
        secondTile.img.classList.add('hidden');
      }

      // Clean up clickQueue to prevent stuck tiles
      clickQueue = clickQueue.filter(item => !item.tile.classList.contains('matched'));

      isProcessing = false; // Reset the processing flag

      // Check if more items are left in the queue
      if (clickQueue.length >= 2) {
        processQueue(); // Process the next pair
      }
    }, 500);
  }
}
