import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

export function renderScore() {
  const leaderboard = document.querySelector('.ranking')
  const db = getDatabase();
  const scoreRef = ref(db , 'scores');
  get(scoreRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      let leaderboardHTML = '';
      const dataArray = Object.values(data);
      dataArray.sort((a,b) => {
        return parseFloat(a.score) - parseFloat(b.score)
      })
      dataArray.forEach((user,index) => {
        leaderboardHTML += 
         `<div class="rank">
            <div class="pos">${index + 1}.</div>
            <div class="name">${user.username}</div>
            <div class="time-taken">${user.score}s</div>
          </div>` 
      });
      leaderboard.innerHTML = leaderboardHTML; 
    } else {
      console.log('no data in scores');
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
};