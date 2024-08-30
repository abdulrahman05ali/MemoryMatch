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

const content = document.querySelector('.gameplay-contents');

function setOriginalPlay() {
  const playButton = document.querySelector('.playButton');
  playButton.addEventListener('click',() => {
    content.classList.add('hidden');
    
    setTimeout(() => {
      content.innerHTML = 
      `<div class="visuals-2">
        <div class="image-1">
          <img src="https://fontmeme.com/permalink/240829/7ffe2442ba9c7f5068c27c90678296c5.png">
        </div>
        <div class="control-buttons">
            <img class="back" src="images/backButton.png">
            <img class="newplay" src="images/playbutton.png">
        </div>
      </div> `;

      content.classList.remove('hidden');

      const newPlay = document.querySelector('.newplay');
      newPlay.addEventListener('click', () => {
        let timer = 3
        let intervalId;

        content.innerHTML = `<div class="visuals-3">${timer}</div>`;
        timer--;

       intervalId = setInterval(() => {
        content.innerHTML =
        `<div class="visuals-3">${timer}</div>`
        timer--;

        if (timer === 0) {
          clearInterval(intervalId)
          memoriseSection(); 
        }
       },1000)
      })

      const backButton = document.querySelector('.back');
      backButton.addEventListener('click',() => {
        content.classList.add('hidden');

        setTimeout(() => {
          content.innerHTML = 
          `<div class="visuals-1">
            <img src="images/play.png" class="playButton"> 
          </div>`;
          
          content.classList.remove('hidden')
          setOriginalPlay();
        },400)
      })
    },400)
  }) 
}

function memoriseSection() {
  let timer2 = 5

  let timerInterval;

  timerInterval = setInterval(() => {

    if (!timer2) {
      clearInterval(timerInterval);
      timer2 = 'play' // add function here that adds class list hidden and removes when you tap tile
    } 
  
    content.innerHTML = 
    `<div class="visuals-4">
      <div class="top-gameplay">
        <div class="flex-container">
          time remaining: ${timer2}
        </div>
      </div>
      <div class="bottom-gameplay">
        <div class="tiles">
          <div></div> 
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>`;  // generate DIVs with JS
    timer2--;
 },1000)
}



setOriginalPlay();