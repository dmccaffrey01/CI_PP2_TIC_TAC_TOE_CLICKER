/**
 * Open and close hamburger menu
 */
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
})

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}))

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
]

const COLORS = ['#16a085', '#27ae60', '#2c3e50', '#f39c12', '#e74c3c', '#9b59b6', '#FB6964', '#342224', "#472E32", "#BDBB99", "#77B1A9", "#73A857"];

window.onload = init;

function init() {
    generateQuote();
}

function generateQuote() {
    // Get random Number
    let quoteSize = QUOTEBANK.length;
    let randomNum = Math.floor(Math.random() * quoteSize);
    if(randomNum === lastNum) {
        if(randomNum === 0) {
            randomNum += 1;
        } else {
            randomNum -= 1;
        }
    }
    lastNum = randomNum;

    // Use random number to get random quote
    randomQuoteData = QUOTEBANK[randomNum];

    let twitterLink = "https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=%22"

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

    // Change color of background an icon
    document.documentElement.style.setProperty("--MAIN", COLORS[colorNum]);

    if(colorNum == COLORS.length - 1) {
        colorNum = 0;
    } else {
        colorNum++;
    }
}