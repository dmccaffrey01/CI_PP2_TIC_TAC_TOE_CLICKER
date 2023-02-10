/*jshint esversion: 6 */

/**
 * Generate Random Quotes
 */

let lastNum = 0;
let colorNum = 0;
const QUOTEBANK = [
    { 
        quote: "Knowing yourself is the beginning of all wisdom.",
        author: "Aristotle"
    }, { 
        quote: "Life isn't about getting and having, it's about giving and being.",
        author: "Kevin Kruse"
    }, { 
        quote: "Whatever the mind of man can conceive and believe, it can achieve.",
        author: "Napoleon Hill"
    }, { 
        quote: "Strive not to be a success, but rather to be of value.",
        author: "Albert Einstein"
    }, { 
        quote: "Two roads diverged in a wood, and I took the one less traveled by, And that has made all the difference.",
        author: "Aristotle"
    }, {
        quote: "I attribute my success to this: I never gave or took any excuse.",
        author:"Florence Nightingale"
    }, { 
        quote: "You miss 100% of the shots you don't take.",
        author: "Wayne Gretzky"
    },{
        quote:"Every strike brings me closer to the next home run.",
        author:"Babe Ruth"
    } 
];

const COLORS = ['#205295', '#3B185F', '#C060A1', '#735F32', '#624F82', '#50577A', '#3F3B6C', '#342224', "#4C0033", "#2C3333", "#1E5128", "#734046"];

/**
 * When window is loaded execute generate quote function
 */
window.onload = init;

function init() {
    generateQuote();
}

/**
 * Choose a random quote and color from the array and objects
 * And display on screen
 */

function generateQuote() {
    // Get random Number
    let quoteSize = QUOTEBANK.length;
    let randomNum = randomNumber(0, quoteSize-1, lastNum);
    
    lastNum = randomNum;

    // Use random number to get random quote
    let randomQuoteData = QUOTEBANK[randomNum];

    let twitterLink = "https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=%22";

    // Add the Quote
    let quoteInApiFormat = randomQuoteData.quote.replace(/ /g, "%20");
    twitterLink += quoteInApiFormat;
    twitterLink += "%22";

    // Add the Author
    let authorInApiFormat = randomQuoteData.author.replace(/ /g, "%20");
    twitterLink += "%20-%20";
    twitterLink += authorInApiFormat;
    
    // Change the quote, author and tweet
    document.getElementById("tweet-quote").href = twitterLink;
    document.getElementById("quote-text").innerText = randomQuoteData.quote;
    document.getElementById("quote-author").innerText = "- " + randomQuoteData.author;

    // Get random Number
    let colorSize = COLORS.length;
    let randomNum2 = randomNumber(0, colorSize-1, colorNum);

    // Set colorNum to randomNum2
    colorNum = randomNum2;

    // Change color of background an icon
    document.documentElement.style.setProperty("--MAIN", COLORS[randomNum2]);
}

/**
 * Create random number
 */
function randomNumber(min, max, lastRandomNumber) {
    // Create random number
    let randNum = Math.round(Math.random() * (max-min) + min);
    
    // If random number is same as last random number change it
    if (randNum == lastRandomNumber) {
        let numArr = [];
        let newNumArr = [];
        let totalNumbers = (max - min) + 1;
        
        // Create array of numbers
        for (let i = min; i < max + 1; i++) {
            numArr.push(i);
        }

        // Create new array without the last random number
        for (let i = 0; i < totalNumbers; i++) {
            if (numArr[i] != lastRandomNumber) {
                newNumArr.push(numArr[i]);
            }
        }
        // Create random index
        let randomIndex = Math.floor(Math.random() * newNumArr.length);

        // Set randNum to be a random number in new array
        randNum = newNumArr[randomIndex];
    }
    return randNum;
}