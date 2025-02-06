// Game configuration
const CONFIG = {
  difficulties: {
    easy: { time: 30 },
    medium: { time: 25 },
    hard: { time: 20 },
  },
  maxLives: 3,
  colorOptions: 6, 
}

// Game state
const gameState = {
  targetColor: "",
  score: 0,
  highScore: 0,
  lives: CONFIG.maxLives,
  timeLeft: CONFIG.difficulties.easy.time,
  difficulty: "easy",
  timerInterval: null,
  isDarkMode: true,
}

// DOM Elements
const elements = {
  loadingScreen: document.getElementById("loading-screen"),
  gameScreen: document.getElementById("game-screen"),
  startGameBtn: document.getElementById("start-game-btn"),
  colorBox: document.getElementById("color-box"),
  colorOptions: document.getElementById("color-options"),
  gameStatus: document.getElementById("game-status"),
  scoreElement: document.getElementById("score"),
  highScoreElement: document.getElementById("high-score"),
  livesElement: document.getElementById("lives"),
  timerElement: document.getElementById("timer"),
  newGameBtn: document.getElementById("new-game-btn"),
  difficultySelect: document.getElementById("difficulty-select"),
  gameInstructions: document.getElementById("game-instructions"),
  loadingBar: document.getElementById("loading-bar"),
  toggleThemeBtn: document.getElementById("toggle-theme-btn"),
}

// Utility functions
function generateRandomColor() {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgb(${r}, ${g}, ${b})`
}

function showElement(element) {
  element.classList.remove("hidden")
}

function hideElement(element) {
  element.classList.add("hidden")
}

//Import confetti function
function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  })
}

// Game logic
function startGame() {
  hideElement(elements.loadingScreen)
  showElement(elements.gameScreen)
  resetGameState()
  startNewRound()
}

function resetGameState() {
  gameState.score = 0
  gameState.lives = CONFIG.maxLives
  gameState.difficulty = elements.difficultySelect.value
  gameState.timeLeft = CONFIG.difficulties[gameState.difficulty].time
  updateUI()
}

function startNewRound() {
  clearInterval(gameState.timerInterval)
  gameState.targetColor = generateRandomColor()
  gameState.timeLeft = CONFIG.difficulties[gameState.difficulty].time
  createColorOptions()
  updateUI()
  startTimer()
}

function createColorOptions() {
  const colors = [gameState.targetColor]

  while (colors.length < CONFIG.colorOptions) {
    const newColor = generateRandomColor()
    if (!colors.includes(newColor)) {
      colors.push(newColor)
    }
  }

  colors.sort(() => Math.random() - 0.5)

  elements.colorOptions.innerHTML = ""
  colors.forEach((color) => {
    const button = document.createElement("button")
    button.classList.add("color-option")
    button.style.backgroundColor = color
    button.dataset.testid = "colorOption"
    button.addEventListener("click", () => checkGuess(color))
    elements.colorOptions.appendChild(button)
  })
}

function checkGuess(guessedColor) {
  if (guessedColor === gameState.targetColor) {
    gameState.score++
    if (gameState.score > gameState.highScore) {
      gameState.highScore = gameState.score
      localStorage.setItem("highScore", gameState.highScore)
    }
    elements.gameStatus.textContent = "Correct!"
    elements.gameStatus.style.color = "green"
    launchConfetti()
    setTimeout(startNewRound, 1500)
  } else {
    gameState.lives--
    if (gameState.lives > 0) {
      elements.gameStatus.textContent = `Wrong! Try again. ${gameState.lives} ${gameState.lives === 1 ? "life" : "lives"} left.`
      elements.gameStatus.style.color = "red"
      elements.colorBox.classList.add("shake")
      setTimeout(() => elements.colorBox.classList.remove("shake"), 500)
    } else {
      endGame("You ran out of lives!")
    }
  }
  updateUI()
}

function startTimer() {
  gameState.timerInterval = setInterval(() => {
    gameState.timeLeft--
    updateUI()
    if (gameState.timeLeft <= 0) {
      endGame("Time's up!")
    }
  }, 1000)
}

function endGame(message) {
  clearInterval(gameState.timerInterval)
  elements.gameStatus.textContent = `${message} Game over. Your score: ${gameState.score}`
  elements.gameStatus.style.color = "red"
  elements.colorOptions.innerHTML = ""
}

function updateUI() {
  elements.colorBox.style.backgroundColor = gameState.targetColor
  elements.scoreElement.textContent = gameState.score
  elements.highScoreElement.textContent = gameState.highScore
  elements.livesElement.textContent = gameState.lives
  elements.timerElement.textContent = gameState.timeLeft
  elements.gameInstructions.textContent = `Guess the correct color! You have ${gameState.timeLeft} seconds and ${gameState.lives} lives.`
}

// Loading simulation
function simulateLoading() {
  let progress = 0
  const loadingInterval = setInterval(() => {
    progress += 10
    elements.loadingBar.style.width = `${progress}%`
    if (progress >= 100) {
      clearInterval(loadingInterval)
      elements.startGameBtn.disabled = false
    }
  }, 200)
}

// Theme toggle
function toggleTheme() {
  gameState.isDarkMode = !gameState.isDarkMode
  document.body.classList.toggle("light-mode", !gameState.isDarkMode)
  localStorage.setItem("isDarkMode", gameState.isDarkMode)
}

// Event Listeners
elements.startGameBtn.addEventListener("click", startGame)
elements.newGameBtn.addEventListener("click", startNewRound)
elements.difficultySelect.addEventListener("change", (e) => {
  gameState.difficulty = e.target.value
  startNewRound()
})
elements.toggleThemeBtn.addEventListener("click", toggleTheme)

// Initialize the game
function init() {
  showElement(elements.loadingScreen)
  hideElement(elements.gameScreen)
  simulateLoading()

  // Load high score from local storage
  const savedHighScore = localStorage.getItem("highScore")
  if (savedHighScore) {
    gameState.highScore = Number.parseInt(savedHighScore, 10)
    elements.highScoreElement.textContent = gameState.highScore
  }

  // Load theme preference from local storage
  const savedTheme = localStorage.getItem("isDarkMode")
  if (savedTheme !== null) {
    gameState.isDarkMode = JSON.parse(savedTheme)
    document.body.classList.toggle("light-mode", !gameState.isDarkMode)
  }
}

init()

