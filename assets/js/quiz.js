// Get home play btn
const homePlayBtn = document.querySelector(".quiz-play-btn");

// Get home section
const homeSection = document.querySelector(".quiz-home");

// Get quiz game section
const quizGameSection = document.querySelector(".quiz-game-section");

// Get end game section
const quizEndGameSection = document.querySelector(".quiz-end-section");

// Add event listener for home play btn
homePlayBtn.addEventListener("click", () => {
    // Fade out
    homeSection.classList.add("fade");

    // Wait 0.5s
    setTimeout(() => {
        // Add play class
        homeSection.classList.add("play");

        // Add play
        quizGameSection.classList.add("play");

        // Start game
        startGame();

        // Remove fade
        quizGameSection.classList.remove("fade");
    }, 500)
})

// Get question
const question = document.querySelector(".quiz-game-question");

// Get choices
const choices = Array.from(document.querySelectorAll(".choice-text"));

// Get question counter text
const questionCounterText = document.querySelector(".quiz-question-count");

// Get score text
const scoreText = document.querySelector(".quiz-score");

// Create let variables
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [
    {
        question: "a",
        choice1: "1a",
        choice2: "2a",
        choice3: "3a",
        choice4: "4a",
        answer: 1
    },
    {
        question: "b",
        choice1: "1b",
        choice2: "2b",
        choice3: "3b",
        choice4: "4b",
        answer: 2
    },
    {
        question: "c",
        choice1: "1c",
        choice2: "2c",
        choice3: "3c",
        choice4: "4c",
        answer: 3
    },
    {
        question: "d",
        choice1: "1d",
        choice2: "2d",
        choice3: "3d",
        choice4: "4d",
        answer: 4
    }
]

// Create constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 4;

/**
 * Start the quiz game
 */
function startGame() {
    // Set varialbes
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];

    // Get a new question
    getNewQuesiton();
}

/**
 * Get a new Question
 */
function getNewQuesiton() {
    // Check if all questions answered
    if (availableQuestions.length <= 0 || questionCounter >= MAX_QUESTIONS) {
        // Go to end section
        endGame();
        return;
    }
    
    // Increment question counter
    questionCounter++;

    // Update question text
    questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;

    // Update score
    scoreText.innerText = score;

    // Get random question index
    let questionIndex = Math.floor(Math.random() * availableQuestions.length);

    // Get a random question using index
    currentQuestion = availableQuestions[questionIndex];

    // Update question display
    question.innerText = currentQuestion.question;

    // Update choices display
    choices.forEach((choice) => {
        // Get number
        let num = choice.dataset["number"];

        // Change choice text to current question choice
        choice.innerText = currentQuestion["choice" + num];
    });

    // Take question out of available questions
    availableQuestions.splice(questionIndex, 1);

    // Change accepting answers
    acceptingAnswers = true;
}

// Add event listeners for choices
choices.forEach((choice) => {
    choice.addEventListener("click", (e) => {
        // Return if not accepting answers
        if (!acceptingAnswers) return;

        // Change accepting answers
        acceptingAnswers = false;

        // Get selected choice and answer
        let selectedChoice = e.target;
        let selectedAnswer = selectedChoice.dataset["number"];

        // Check if correct or incorrect
        let classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        // Increment score if correct
        if (classToApply == "correct") {
            incrementScore(CORRECT_BONUS);
        }

        // Add class to choice
        selectedChoice.classList.add(classToApply);

        // Wait 1 sec
        setTimeout(() => {
            // Remove class
            selectedChoice.classList.remove(classToApply);

            // Get new question once selected
            getNewQuesiton();
        }, 1000);
    });
});

/**
 * Increment score by number passed into it
 */
function incrementScore(num) {
    // Add to score
    score += num;

    // Update score display
    scoreText.innerText = score;
}

/**
 * End the game
 */
function endGame() {
    // Change final score
    finalScore.innerText = score;
    
    // Fade out game section
    quizGameSection.classList.add("fade");

    // Wait 0.5s
    setTimeout(() => {
        // Add active
        quizEndGameSection.classList.add("active");

        // Remove fade
        quizEndGameSection.classList.remove("fade");
    }, 500)
}

// Get high scores
let quizHighScores = JSON.parse(localStorage.getItem("quizHighScores")) || [];

/**
 * End screen
 */
// Define element variables
const nameEntry = document.querySelector(".quiz-name-entry");
const saveScoreBtn = document.querySelector(".quiz-name-save-btn");
const finalScore = document.querySelector(".quiz-end-score");

// Add event listener for click
saveScoreBtn.addEventListener("click", () => {
    saveHighScore();
})

/**
 * Save name and score to high scores
 */
function saveHighScore() {
    // Save score and name in object
    const recentScore = {
        score: Math.floor(Math.random() * 100),
        name: nameEntry.value
    }
    
    // Push score to high scores
    quizHighScores.push(recentScore);
    
    // Sort the high scores
    quizHighScores.sort((a, b) => b.score - a.score)

    // Remove 6th high score
    quizHighScores.splice(5);

    // Update local storage
    localStorage.setItem("quizHighScores", JSON.stringify(quizHighScores));

    // Reset game
    resetGame();
}

/**
 * Reset Game
 */
function resetGame() {
    // Reset variables
    currentQuestion = {};
    acceptingAnswers = false;
    score = 0;
    questionCounter = 0;
    availableQuestions = [];

    // Go back to home screen
    quizEndGameSection.classList.add("fade");

    // Wait 0.5s
    setTimeout(() => {
        // Remove active class
        quizEndGameSection.classList.remove("active");

        // Remove play  and fade class
        homeSection.classList.remove("play", "fade");

        
    }, 500)
}

/**
 * High scores
 */
const highScoresBtn = document.querySelector(".quiz-high-scores-btn");
const highScoresSection = document.querySelector(".high-scores-section");
const highScoresList = document.querySelector(".high-scores-list");
const goHomeBtn = document.querySelector(".go-home-btn");

// Add event listener to open high scores
highScoresBtn.addEventListener("click", () => {
    // Fade out home section
    homeSection.classList.add("fade");

    // Get high scores from local storage
    quizHighScores = JSON.parse(localStorage.getItem("quizHighScores")) || [];

    // Create li for each high score and add to list
    highScoresList.innerHTML = 
        quizHighScores.map((score) => {
            return `<li class="high-score-li">${score.name} - ${score.score}</li>`;
        }).join("");

    // Wait 0.5s
    setTimeout(() => {
        // Add play class
        homeSection.classList.add("play");

        // Add active class and remove fade class
        highScoresSection.classList.add("active");
        highScoresSection.classList.remove("fade");
    }, 500)
})

// Add event listener to close high scores
goHomeBtn.addEventListener("click", () => {
    // Fade out home section
    highScoresSection.classList.add("fade");

    // Wait 0.5s
    setTimeout(() => {
        // Remove active class
        highScoresSection.classList.remove("active");

        // Remove play and fade class
        homeSection.classList.remove("play");
        homeSection.classList.remove("fade");
    }, 500)
})


