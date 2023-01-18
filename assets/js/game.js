/**
 * Play Clicker Game
 */

var game = {
    // Store data on variables
    power: 5,
    monsterHP: 10,
    monsterHealthMax: 10,
    monsterCount: 0,
    level: 1,
    bossRounds: [5, 10, 15, 20, 25, 30],
    isBossRound: false,
    coins: 0,
    coinsToGet: 10,
    isMonsterDead: false,

    /**
     * Deal damage to monster HP
     * Takes away health from monsterHP 
     */
    dealDamage: function(amount) { 
        // Check if monster is dead
        if (this.isMonsterDead) {
            return;
        }

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

            // Set isMonsterDead to true
            this.isMonsterDead = true;
        } 
    },

    /**
     * Creates new monster
     * Sets HP and calls update display
     */
    monsterKilled: function() {
        // Update kill monster
        display.monsterKilled();

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
        }, 300);
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

        // Display new monster
        display.createNewMonster();

        // Set isMonsterDead to true
        setTimeout(() => {
            this.isMonsterDead = false;
        }, 800);
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

            // Check if it is level after boss round
            if (this.bossRounds.includes(this.level - 1)) {
                // Remove Boss icon
            display.removeBossIcon();
            }
        }

        // Transition new island
        display.transitionIsland();

        // Display new island
        display.newIsland();
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

        // Create and add coins to display
        display.createCoins();
    }
}

/**
 * Anything to do with upgrades
 */

var upgrades = {
    name: [
        "Upgrade 1",
        "Upgrade 2",
        "Upgrade 3"
    ],
    image: [

    ],
    count: [
        0,
        0,
        0
    ],
    powerIncrease: [
        1,
        5,
        10
    ],
    cost: [
        50,
        250,
        500
    ],

    /**
     * Purchase the upgrade
     * Take away coins and add power
     */

    purchase: function(index) {
        // Check if player has enough coins
        if (game.coins >= this.cost[index]) {
            // Take away cost from coins
            game.coins -= this.cost[index];
            
            // Add 1 to count
            this.count[index]++;

            // Increase the cost by 1.15 times
            this.cost[index] = Math.ceil(this.cost[index] * 1.15);

            // Add powerIncrease to power
            game.power += this.powerIncrease[index];

            // Update coins
            display.updateCoins();

            // Update power
            display.updatePower();

            // Update upgrades menu
            display.updateUpgradesMenu();
        }
    }
}


/**
 * Anything that requires the page display to update
 */
var display = {
    islandNames: ["island-a.png", "island-b.png", "island-c.png", "island-d.png", "island-e.png", "island-f.png", "island-g.png", "island-h.png", "island-i.png"],
    monsterNames: ["monster-a.png", "monster-b.png", "monster-c.png", "monster-d.png", "monster-e.png", "monster-f.png", "monster-g.png", "monster-h.png", "monster-i.png", "monster-j.png", "monster-k.png", "monster-l.png", "monster-m.png", "monster-n.png", "monster-o.png", "monster-p.png"],

    /**
     * Update Monster HP
     */
    updateMonsterHP: function() {
        // Change HP
        document.getElementById("monster-hp").innerHTML = game.monsterHP;

        // Change Health Bar
        const healthBar = document.querySelector(".health-progress");
        healthBar.style.width = `${game.monsterHP / game.monsterHealthMax * 100}%`;
        if (game.monsterHP <= 0) {
            healthBar.style.width = "0%";
        }
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
     * Set hp and monster count
     * Add boss icon to health bar
     */
    updateBossRound: function() {
        // Set hp and monster count
        document.getElementById("monster-hp").innerHTML = game.monsterHP;
        document.getElementById("monster-count").innerHTML = game.monsterCount + "/1";
        
        // Get boss icon
        let bossIcon = document.querySelector(".boss-icon");
        // Add active class
        bossIcon.classList.add("active");
    },

    /**
     * Remove boss icon from health bar
     */
    removeBossIcon: function() {
        // Get boss icon
        let bossIcon = document.querySelector(".boss-icon");

        // Remove the active class
        bossIcon.classList.remove("active");
    },

    /**
     * Update Coins
     */
    updateCoins: function() {
        document.querySelector(".coins").innerHTML = game.coins;
    },

    /**
     * Update Power
     */
    updatePower: function() {
        document.querySelector(".power").innerHTML = game.power;
    },

    /**
     * Update Upgrades Menu
     * Updates counts and costs
     */
    updateUpgradesMenu: function() {
        // Update counts and costs
        let counts = document.querySelectorAll(".upgrade-count");
        let costs = document.querySelectorAll(".upgrade-cost");
        for (let i = 0; i < counts.length; i++) {
            counts[i].innerHTML = upgrades.count[i];
            costs[i].innerHTML = upgrades.cost[i];
        }
    },

    /**
     * Transition the island from 1 background to the next
     */
    transitionIsland: function() {
        // Get island image element
        let island = document.querySelector(".island-bg");

        // Add transition class to it
        island.classList.add("transition");

        // Remove transition class after waiting
        setTimeout(() => {
            island.classList.remove("transition");
        }, 500);
    },

    /**
     * Set a new island background for clicker
     * Create a random island image for the background
     */
    newIsland: function() {
        setTimeout(() => {
            // Get island image element
            let island = document.querySelector(".island-bg");

            // Get src of image
            let islandSrc = island.src;

            // Split src into words
            let srcWords = islandSrc.split("/");

            // Get image name, is last word in src
            let islandName = srcWords[srcWords.length-1];

            // Get index of island name in array of island names
            let islandIndex = this.islandNames.indexOf(islandName);

            // Get random number where last number is index in island names
            let randNum = randomNumber(0, 8, islandIndex);

            // Set new island image to random island
            let newIslandImgName = this.islandNames[randNum];

            // Create new source words
            let newSrcWords = srcWords.slice(0, srcWords.length-1);

            // Add new island image name
            newSrcWords.push(newIslandImgName);

            // Join new source words together
            let newIslandSrc = newSrcWords.join("/");

            // Set new island image src
            island.src = newIslandSrc;
        }, 250)
    },

    /**
     * Animate death of monster
     */
    monsterKilled: function() {
        // Get the image element
        let monster = document.querySelector(".monster");

        monster.style.transform = "scale(0.01)";

        setTimeout(() => {
            monster.style.transform = "scale(1)"
        }, 800)
    },

    /**
     * Set a new random monster image for the clicker
     */
    createNewMonster: function() {
        // Get the image element
        let monster = document.querySelector(".monster");

        // Get the src of the img
        let monsterSrc = monster.src;

        // Split src into words
        let srcWords = monsterSrc.split("/");

        // Get image name, is last word of source
        let monsterName = srcWords[srcWords.length-1];

        // Get index of image name in array of monster names
        let monsterIndex = this.monsterNames.indexOf(monsterName);

        // Get random number where last number is index of monster names
        let randNum = randomNumber(0, 15, monsterIndex);

        // Set new monster image to random monster
        let newMonsterImgName = this.monsterNames[randNum]

        // Create new src words
        let newSrcWords = srcWords.slice(0, srcWords.length-1);

        // Add new monster image name
        newSrcWords.push(newMonsterImgName);

        // Join new src words together
        let newMonsterSrc = newSrcWords.join("/");

        // Set new monster image src
        monster.src = newMonsterSrc;
    },

    /**
     * Create coins and display them on screen
     */
    createCoins: function() {
        // Get island bg
        let clickerContainer = document.querySelector(".monster-clicker-container");

        // Create coin img element
        let coin = document.createElement("img");
        coin.src = "./assets/images/coins/coin-a.png";
        coin.classList.add("coin", "unselectable");

        // Add coin to island
        clickerContainer.appendChild(coin);
    }
}

/**
 * Update game when monster is clicked
 */
// Define monster variable
const monsterClicker = document.querySelector(".monster-clicker");

monsterClicker.addEventListener("click", () => {
    // Create number on click
    createNumberOnClick(event);
    
    // Deal damage to monster when clicked
    game.dealDamage(game.power);
})

/**
 * Create number to display on screen when monster is clicked
 */
function createNumberOnClick(event) {
    // Check if monster is dead
    if (game.isMonsterDead) {
        return;
    }

    // Get cursor offset
    let cursorOffset = monsterClicker.getBoundingClientRect();
    // Get random offset
    let randomOffset = randomNumber(-20, 10);
    
    // Grab the position of where the cursor is when monster is clicked
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
    monsterClicker.appendChild(element);

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





