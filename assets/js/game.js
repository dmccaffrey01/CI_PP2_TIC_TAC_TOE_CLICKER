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
 * Play Clicker Game
 */

var game = {
    // Store data on variables
    power: 10,
    monsterHP: 10,
    monsterCount: 0,
    level: 1,
    bossRounds: [5, 10, 15, 20, 25, 30],
    isBossRound: false,

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
        // Check if 10 monsters are dead
        if (this.monsterCount >= 9) {

            // Create new monster
            this.newMonster();
 
            // Set monster count to 0
            this.monsterCount = 0;
 
            // Update the display
            display.updateMonsterCount();
 
            // 10 monsters are dead time to level up
            this.levelUp();
        } else if (this.isBossRound) {
            // Boss killed time to level up
            this.levelUp();

            // Set monster count to 0
            this.monsterCount = 0;
 
            // Update the display
            display.updateMonsterCount();
        } else {
            this.newMonster();
        }
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
    },

    /**
     * Levels Up once 10 monsters are killed or boss is defeated
     */
    levelUp: function() {
        // Increment level by 1
        this.level += 1;

        // Update the display
        display.updateLevel();

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

        // Set isBossRound to true
        this.isBossRound = true;
    }
}

var display = {
    /**
     * Update Monster HP
     */
    updateMonsterHP: function() {
        document.getElementById("monster-hp").innerHTML = game.monsterHP;
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
    let position = {
        x: event.pageX - cursorOffset.left + randomNumber(-5, 5),
        y: event.pageY - cursorOffset.top
    }
    console.log(position.x, position.y);

    // Create the number as html element
    let element = document.createElement("div");
    element.textContent = "-" + game.power;
    element.classList.add("number", "unselectable");
    element.style.left = position.x + "px";
    element.style.top = position.y + "px";
    console.log(element.style.left, element.style.top);
    // Add the number to monster
    monster.appendChild(element);


}

/**
 * Create random number
 */
function randomNumber(min,max) {
    return Math.round(Math.random() * (max-min) + min);
}
