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
  iconimg.forEach((icon) => {
    icon.classList.add('hidden');
  })

  icontile.forEach((tile,index) => {
    tile.addEventListener('click', ()=> {
      iconimg[index].classList.remove('hidden');
    })
  })
}