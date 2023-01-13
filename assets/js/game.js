/**
 * Open and Close Hamburger Menu
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
 * Play Clicker Game
 */

var game = {
    // Store data on variables
    power: 10,
    monsterHP: 10,
    monsterHealthMax: 10,
    monsterCount: 0,
    level: 1,
    bossRounds: [5, 10, 15, 20, 25, 30],
    isBossRound: false,
    coins: 0,
    coinsToGet: 10,

    /**
     * Deal damage to monster HP
     * Takes away health from monsterHP 
     */
    dealDamage: function(amount) { 
        // Take amount from monsterHP
        this.monsterHP -= amount;

        // Call update Monster HP function
        display.updateMonsterHP();

        // Check if Monster HP is below 0
        this.checkMonsterHP();
    },

    /**
     * Checks if Monster HP is below 0
     */
    checkMonsterHP: function() {
        if (this.monsterHP <= 0) {
            // Create new monster
            this.monsterKilled();
        } 
    },

    /**
     * Creates new monster
     * Sets HP and calls update display
     */
    monsterKilled: function() {
        // Update Monster HP
        display.updateMonsterHP();

        // Wait before creating new monster
        setTimeout(() => {
            // Check if 10 monsters are dead
            if (this.monsterCount >= 9) {
                
                // Add coins
                this.addCoins();

                // Create new monster
                this.newMonster();
    
                // Set monster count to 0
                this.monsterCount = 0;
    
                // Update the display
                display.updateMonsterCount();
    
                // 10 monsters are dead time to level up
                this.levelUp();
            } else if (this.isBossRound) {
                
                // Add coins
                this.addCoins();

                // Boss killed time to level up
                this.levelUp();

                // Create New Monster
                this.newMonster();

                // Set monster count to 0
                this.monsterCount = 0;
    
                // Update the display
                display.updateMonsterCount();
            } else {
                
                // Add coins
                this.addCoins();
                
                // Create new monster
                this.newMonster();
            }
        }, 100);
    },

    /**
     * Create new monster
     * Increment monster count and set hp
     */
    newMonster: function() {
        // Increment monster count by 1
        this.monsterCount += 1;
        
        // Update the display
        display.updateMonsterCount();

        // Set new hp of monster
        this.monsterHP = 10;

        // Update the display
        display.updateMonsterHP();

        // Set Monster Max Health
        this.monsterHealthMax = 10;
    },

    /**
     * Levels Up once 10 monsters are killed or boss is defeated
     */
    levelUp: function() {
        // Increment level by 1
        this.level += 1;

        // Update the display
        display.updateLevel();

        // Update coins to get
        this.coinsToGet = this.level * 10;

        // Checks if player is going on to a boss round
        if (this.bossRounds.includes(this.level)) {
            this.createBossRound();
        } else {
            // Set isBossRound to false
            this.isBossRound = false;
        }
    },

    /**
     * Create the boss round
     * Set the boss hp
     */
    createBossRound: function() {
        // Set hp of boss
        this.monsterHP = 200;

        // Update the display
        display.updateBossRound();

        // Set Monster Max Health
        this.monsterHealthMax = 200;

        // Set isBossRound to true
        this.isBossRound = true;

        // Update Coins to get
        this.coinsToGet = this.level * 200;
    },

    addCoins: function() {
        // Add coins to get to coins
        this.coins += this.coinsToGet;

        // Update the display
        display.updateCoins();
    }
}

var display = {
    /**
     * Update Monster HP
     */
    updateMonsterHP: function() {
        // Change HP
        document.getElementById("monster-hp").innerHTML = game.monsterHP;

        // Change Health Bar
        const healthBar = document.querySelector(".health-progress");
        healthBar.style.width = `${game.monsterHP / game.monsterHealthMax * 100}%`;
    },

    /**
     * Update Monster Count
     */
    updateMonsterCount: function() {
        document.getElementById("monster-count").innerHTML = game.monsterCount + "/10";
    },

    /**
     * Update Level
     */
    updateLevel: function () {
        document.getElementById("level").innerHTML = game.level;
    },

    /**
     * Update Boss round
     */
    updateBossRound: function() {
        document.getElementById("monster-hp").innerHTML = game.monsterHP;
        document.getElementById("monster-count").innerHTML = game.monsterCount + "/1";
    },

    updateCoins: function() {
        document.querySelector(".coins").innerHTML = game.coins;
    }
}

/**
 * Update game when monster is clicked
 */
// Define monster variable
const monster = document.querySelector(".monster-clicker");

monster.addEventListener("click", () => {
    // Deal damage to monster when clicked
    game.dealDamage(game.power);

    // Create number on click
    createNumberOnClick(event);
})

/**
 * Create number to display on screen when monster is clicked
 */

function createNumberOnClick(event) {
    // Grab the position of where the cursor is when monster is clicked
    let cursorOffset = monster.getBoundingClientRect();
    let randomOffset = randomNumber(-20, 10);
    let position = {
        x: event.pageX - cursorOffset.left + randomOffset,
        y: event.pageY - cursorOffset.top
    }

    // Create the number as html element
    let element = document.createElement("div");
    element.textContent = "-" + game.power;
    element.classList.add("number", "unselectable");
    element.style.left = position.x + "px";
    element.style.top = position.y + "px";

    // Add the number to monster
    monster.appendChild(element);

    // Slowely rise the element to top of screen
    let movementInterval = window.setInterval(() => {
        if (typeof element == "undefined" && element == null) clearInterval(movementInterval);

        position.y--;
        element.style.top = position.y + "px";
    }, 10);

    // Slowly fade out
    fadeOut(element, 2000, 0.2, function() {
        element.remove();
    })
}

/**
 * Makes an element slowly fade out
 */
function fadeOut(element, duration, finalOpacity, callback) {
    // Opacity starts at 1 and fades until hits final opacity
    let opactiy = 1;
    let elementFadingInterval = window.setInterval(() => {
        opactiy -= 50 / duration;

        if (opactiy <= finalOpacity) {
            clearInterval(elementFadingInterval);
            callback();
        }
    }, 50);
}
/**
 * Create random number
 */
function randomNumber(min,max) {
    return Math.round(Math.random() * (max-min) + min);
}


/**
 * Open and Close Upgrade Menu
 */

// Define variables
const upgradeMenuBtn = document.querySelector(".upgrade-menu-btn");
const upgradeMenu = document.querySelector(".upgrade-menu");
const transitionDiv = document.querySelector(".transition-div");
const upgradeMenuBtnIcon = document.querySelector(".upgrade-menu-btn-icon");

upgradeMenuBtn.addEventListener("click", () => {
    // Apply active class
    upgradeMenuBtn.classList.toggle("active");
    upgradeMenu.classList.toggle("active");
    transitionDiv.classList.toggle("active");
    upgradeMenuBtnIcon.classList.toggle("active");

    // Remove and replace icon
    setTimeout(() => {
        upgradeMenuBtnIcon.classList.toggle("fa-chevron-left");
        upgradeMenuBtnIcon.classList.toggle("fa-chevron-right");
    }, 150);
})



