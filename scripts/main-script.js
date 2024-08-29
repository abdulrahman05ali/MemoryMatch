let isClicked = false; 

const moreButton = document.querySelector('.h-div');
const dropdown = document.querySelector('.dropdown')
moreButton.addEventListener('click',() => {
  if (!isClicked) {
    dropdown.classList.remove('js-dropdown');
    isClicked = true;
  } else {
    dropdown.classList.add('js-dropdown');
    isClicked = false;
  }
})

const playButton = document.querySelector('.playButton');
const content = document.querySelector('.gameplay-contents');
playButton.addEventListener('click',() => {
  content.classList.add('hidden');

  setTimeout(() => {
    content.innerHTML = 
    `<div class="visuals-2">
      <div class="image-1">
        <img src="https://fontmeme.com/permalink/240829/7ffe2442ba9c7f5068c27c90678296c5.png">
      </div>
      <div class="control-buttons">
          <img src="images/backButton.png">
          <img src="images/playbutton.png">
      </div>
    </div> `;

    content.classList.remove('hidden');
  },400)
}) 