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
      <img src="images/${icon}.png">
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
 