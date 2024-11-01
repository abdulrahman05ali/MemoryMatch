import { getDatabase, ref, set, get, update, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

const RATE_LIMIT_DURATION = 10000; 
const RATE_LIMIT_KEY = 'lastScoreSubmission';

function getLastSubmissionTime() {
  return localStorage.getItem(RATE_LIMIT_KEY);
}

function updateLastSubmissionTime() {
  localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
}

function isRateLimited() {
  const lastSubmission = getLastSubmissionTime();
  if (!lastSubmission) return false;
  
  const timeSinceLastSubmission = Date.now() - parseInt(lastSubmission);
  return timeSinceLastSubmission < RATE_LIMIT_DURATION;
}

export function renderScore() {
  const leaderboard = document.querySelector('.ranking')
  const db = getDatabase();
  const scoreRef = ref(db, 'scores');
  
  get(scoreRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let leaderboardHTML = '';
        const dataArray = Object.values(data);
        

        dataArray
          .sort((a, b) => parseFloat(a.score) - parseFloat(b.score))
          .forEach((user, index) => {
            leaderboardHTML += 
              `<div class="rank">
                <div class="pos">${index + 1}.</div>
                <div class="name">${sanitizeHTML(user.username)}</div>
                <div class="time-taken">${parseFloat(user.score).toFixed(2)}s</div>
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
}

function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function saveNewScore(username, score) {
  if (isRateLimited()) {
    alert('Please wait 10 seconds between submitting scores');  
    return Promise.reject('Rate limited');
  }

  if (!username || typeof username !== 'string' || username.length > 14) {
    return Promise.reject('Invalid username');
  }

  const scoreNum = parseFloat(score);
  if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 60) {
    return Promise.reject('Invalid score');
  }

  const db = getDatabase();
  const scoreRef = ref(db, 'scores');

  return push(scoreRef, {
    username: username,
    score: scoreNum,
    timestamp: serverTimestamp() 
  }).then(() => {
    updateLastSubmissionTime();
    return 'Score saved successfully';
  });
}