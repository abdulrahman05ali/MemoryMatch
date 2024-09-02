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
    <div>
      <img class="iconimage" src="images/${icon}.png">
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
  iconimg.forEach((img) => {
    img.addEventListener('click',() => {
      console.log('clicked')
    })
  })
}

// give them class

// for each 

// give them hidden css 

// when they tap remove the hidden 

// when 2 things are tapped check if it is the same

// if same remove permantely hidden and remove from icons for icons clone if not put it back