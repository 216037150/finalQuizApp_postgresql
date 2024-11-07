import { questions } from '../UtilFiles/quizQuestions.js';
import { validatePlayerName } from '../UtilFiles/validatePlayerName.js';
import { Utils } from '../storage/localStorage.js';
import {saveScoreToDb} from '../server/server.js'

// DOM elements
let currentQuestion = 0;
let score = 0;

function startQuiz() {
  const playerName = document.getElementById('player-name').value.trim();
  
  
  try {
    validatePlayerName(playerName);
    currentPlayerName = playerName;

    document.getElementById('name-prompt').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');

    loadQuestion();
    displayGreeting();
    nextButton();  
    } catch (error) {
    alert(error.message);
  }
}



async function nextButton() {
  document.getElementById('next-btn').addEventListener('click', () => {
      currentQuestion++;
      if (currentQuestion >= questions.length) {
          endQuiz();
      } else {
          loadQuestion();
          document.getElementById('next-btn').classList.add('hidden');
      }
  });
}

function displayGreeting() {
  document.getElementById('myName').textContent = `Hello, ${currentPlayerName}!`;
}

function loadQuestion() {
  if (currentQuestion >= questions.length) {
      endQuiz();
      return;
  }

  const question = questions[currentQuestion];
  document.getElementById('question').textContent = question.question;
  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';

  for (let i = 0; i < question.options.length; i++) {
      const button = document.createElement('button');
      button.textContent = question.options[i];
      button.className = 'option-btn';
      button.onclick = () => checkAnswer(i);
      optionsContainer.appendChild(button);
  }

  document.getElementById('next-btn').classList.add('hidden');
}


function checkAnswer(selectedOption) {
  if (selectedOption === questions[currentQuestion].correct) {
      score++;
  }
  document.getElementById('next-btn').classList.remove('hidden');
}

async function endQuiz() {
  document.getElementById('quiz-container').classList.add('hidden');
  const resultContainer = document.getElementById('result-container');
  resultContainer.classList.remove('hidden');
  document.getElementById('result-text').textContent = `${currentPlayerName}, you scored ${score} out of ${questions.length}`;
console.log("Saving data")
  await saveScoreToDb(currentPlayerName, score, questions.length, percent, currentDate, email); // Await the score saving
  displayHighScores();
}


// function displayHighScores() {
//   const scoresList = document.getElementById('scores-list');
//   scoresList.innerHTML = '<h3>High Scores</h3>';
  
//   const highScores = Utils.getHighScores();
//   highScores.forEach((scoreData, index) => {
//       const scoreElement = document.createElement('div');
//       scoreElement.className = 'score-item';
//       const date = new Date(scoreData.date).toLocaleDateString();
//       scoreElement.textContent = `${index + 1}. ${scoreData.name} - ${scoreData.score} points (${date})`;
//       scoresList.appendChild(scoreElement);
//   });
// }
async function displayHighScores() {
  const scoresList = document.getElementById('scores-list');
  scoresList.innerHTML = '<h3>High Scores</h3>';

  try {
      const highScores = await fetchHighScores();
      highScores.forEach((scoreData, index) => {
          const scoreElement = document.createElement('div');
          scoreElement.className = 'score-item';
          scoreElement.textContent = `${index + 1}. ${scoreData.name} - ${scoreData.score} points (${new Date(scoreData.date).toLocaleDateString()})`;
          scoresList.appendChild(scoreElement);
      });
  } catch (error) {
      console.error('Error fetching high scores:', error);
      alert('Failed to load high scores. Please try again later.'); // Notify user on error
  }
}
function resetQuiz() {
  currentQuestion = 0;
  score = 0;

  document.getElementById('name-prompt').classList.remove('hidden');
  document.getElementById('quiz-container').classList.add('hidden');
  document.getElementById('result-container').classList.add('hidden');
  document.getElementById('player-name').value = '';
}

function init() {
  document.getElementById('start-btn').addEventListener('click', startQuiz);
  document.getElementById('restart-btn').addEventListener('click', resetQuiz);
}

document.addEventListener('DOMContentLoaded', init());

