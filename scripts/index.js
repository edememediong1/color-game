// Game configuration
const CONFIG = {
    difficulties: {
      easy: { colors: 6, time: 30 },
      medium: { colors: 8, time: 25 },
      hard: { colors: 10, time: 20 },
    },
    maxLives: 3,
  }
  
  // Game state
  const gameState = {
    targetColor: "",
    score: 0,
    lives: CONFIG.maxLives,
    timeLeft: CONFIG.difficulties.easy.time,
    difficulty: "easy",
    timerInterval: null,
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
    livesElement: document.getElementById("lives"),
    timerElement: document.getElementById("timer"),
    newGameBtn: document.getElementById("new-game-btn"),
    difficultySelect: document.getElementById("difficulty-select"),
    gameInstructions: document.getElementById("game-instructions"),
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
    const numColors = CONFIG.difficulties[gameState.difficulty].colors
  
    while (colors.length < numColors) {
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
      elements.gameStatus.textContent = "Correct!"
      elements.gameStatus.style.color = "green"
      setTimeout(startNewRound, 1000)
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
    elements.livesElement.textContent = gameState.lives
    elements.timerElement.textContent = gameState.timeLeft
    elements.gameInstructions.textContent = `Guess the correct color! You have ${gameState.timeLeft} seconds and ${gameState.lives} lives.`
  }
  
  // Event Listeners
  elements.startGameBtn.addEventListener("click", startGame)
  elements.newGameBtn.addEventListener("click", startNewRound)
  elements.difficultySelect.addEventListener("change", (e) => {
    gameState.difficulty = e.target.value
    startNewRound()
  })
  
  // Initialize the game
  function init() {
    showElement(elements.loadingScreen)
    hideElement(elements.gameScreen)
  }
  
  init()
  
  