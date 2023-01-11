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
            this.newMonster();
        } 
    },

    /**
     * Creates new monster
     * Sets HP and calls update display
     */
    newMonster: function() {
        // Check if 10 monsters are dead
        if (this.monsterCount >= 9) {
            // Set monster count to 0
            this.monsterCount = 0;

            // Create new monster
            this.newMonster();
 
            // Set monster count to 0
            this.monsterCount = 0;
 
            // Update the display
            display.updateMonsterCount();
 
            // 10 monsters are dead time to level up
            this.levelUp();
        } else if (this.isBossRound) {
            console.log("hello");
            // Boss killed time to level up
            this.levelUp();

            // Set monster count to 0
            this.monsterCount = 0;
 
            // Update the display
            display.updateMonsterCount();
        } else {
            // Increment monster count by 1
            this.monsterCount += 1;
        
            // Update the display
            display.updateMonsterCount();

            // Set new hp of monster
            this.monsterHP = 10;

            // Update the display
            display.updateMonsterHP();
        }
    },

    /**
     * Levels Up once 10 monsters are killed or boss is defeated
     */
    levelUp: function() {
        // Checks if player is going on to a boss round
        if (this.bossRounds.includes(this.level + 1)) {
            this.createBossRound();
        }

        // Increment level by 1
        this.level += 1;

        // Update the display
        display.updateLevel();

        // Set isBossRound to false
        this.isBossRound = false;
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

// Define monster variable
const monster = document.querySelector(".monster-clicker");

// Deal damage to monster when clicked
monster.addEventListener("click", () => {
    game.dealDamage(game.power);
})
