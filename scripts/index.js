const colorBox = document.getElementById('colorBox')
const colorOptions = document.getElementById('colorOptions')
const gameStatus = document.getElementById('gameStatus')
const scoreElement = document.getElementById('score')
const livesElement = document.getElementById('lives')
const newGameButton = document.getElementById('newGameButton')
const difficultySelect = document.getElementById('difficultySelect')
const timerElement = document.getElementById('timer')
const gameInstructions = document.getElementById('gameInstructions')    

let targetColor
let score = 0
let lives = 3
let timeLeft = 30
let timerInterval
let difficulty = 'easy'