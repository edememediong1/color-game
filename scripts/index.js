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


const difficultySettings = {
    easy: {colors: 6, time: 30},
    medium: {colors: 6, time: 25},
    hard: {colors: 6, time: 20}
}

function generateRandomColor(){
    const r = Math.floor(Math.random()* 256)
    const g = Math.floor(Math.random()* 256)
    const b = Math.floor(Math.random()* 256)

    return `rgb(${r}, ${g}, ${b})`
}

function startNewGame() {
    clearInterval(timerInterval)
    targetColor = generateRandomColor()
    colorBox.style.backgroundColor = targetColor
    colorBox.classList.add("fade-in")
    setTimeout(() => colorBox.classList.remove("fade-in"), 500) 
    
    const colors = [targetColor]
    const numColors = difficultySettings[difficulty]
    [difficulty].colors
    while (colors.length < numColors) {
        const newColor = generateRandomColor()
        if (!colors.includes(newColor)){
            colors.push(newColor)
        }
    }

    colors.sort(() => Math.random() - 0.5)
    colorOptions.innerHTML = ""
    colors.forEach((color) => {
        const button = document.createElement('button')
        button.style.backgroundColor = color
        button.dataset.testid = "colorOption"
        button.addEventListener("click", () => checkGuess(color))
        colorOptions.appendChild(button)
    })

    gameStatus.textContent = ""
    lives = 3
    livesElement.textContent = lives
    timeLeft = difficultySettings[difficulty].time
    timerElement.textContent = timeLeft
    startTimer()

    gameInstructions.textContent = `Guess the correctt color! You have ${timeLeft} seconds and ${lives} lives`

}

function checkGuess(guessedColor){
    if (guessedColor === targetColor){
        gameStatus.textContent = "Correct!"
        gameStatus.style.color = "green"
        score++
        scoreElement.textContent = score
        clearInterval(timerInterval)
        setTimeout(startNewGame, 1500)
    } else {
        lives--
        livesElement.textContent = lives
        if (lives > 0) {
            gameStatus.textContent = `Wrong! Try again. ${lives} ${lives === 1 ? "life" : "lives"} left`
            gameStatus.style.color = "red"
            colorBox.classList.add("shake")
            setTimeout(() => colorBox.classList.remove("shake"), 500)
        } else {
            endGame("No lives left, Keep trying!")
        }
    }
}

function startTimer(){
    timerInterval = setInterval(()=> {
        timeLeft--
        timerElement.textContent = timeLeft
        if (timeLeft <= 0) {
            endGame("Time's up! Keep trying!")
        }
    }, 1000)
}

function endGame(message){
    clearInterval(timerInterval)
    gameStatus.textContent = `${message} Game over. Your score: ${score}`
    gameStatus.style.color = "red"
    colorOptions.innerHTML = ""
    newGameButton.focus()
}

newGameButton.addEventListener("click", startNewGame)


difficultySelect.addEventListener("change", 
    (e) => {
        difficulty = e.target.value
        startNewGame()
    }
)

startNewGame()