// Get question
const question = document.querySelector(".quiz-game-question");

// Get choices
const choices = Array.from(document.querySelectorAll(".choice-text"));

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
        console.log("end");
        return;
    }
    
    // Increment question counter
    questionCounter++;

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

        // Get new question once selected
        getNewQuesiton();
    });
});

startGame();