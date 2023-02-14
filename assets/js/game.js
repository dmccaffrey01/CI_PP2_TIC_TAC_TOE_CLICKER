/*jshint esversion: 6 */

/**
 * Code to do with clicker game
 */
var game = {
    // Store data on variables
    leaderboardPlayers: 0,
    totalClicks: 0,
    totalCoins: 0,
    power: 1,
    monsterHP: 10,
    monsterHealthMax: 10,
    monsterCount: 0,
    monstersPerLevel: 10,
    level: 1,
    bossRounds: [5, 10, 15, 20, 25, 30],
    isBossRound: false,
    coins: 0,
    coinsToGet: 10,
    coinsAdded: 0,
    isMonsterDead: false,
    newMonsterDelay: 800,
    time: 0,
    interval: null,
    timingRememberNumber: 0,
    timingCount: 0,
    timingTimer: 10.0,
    timingTimeMax: 10.0,

    /**
     * Start the game
     */
    startGame: function() {
        // Start timer
        this.startTimer();
    },

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

        // Update Monster HP function
        display.updateMonsterHP();

        // Animate monster to take damage
        display.dealDamageAnimation();

        // Play hit marker sound effect
        audio.playHitMarker();

        // Check if Monster HP is below 0
        this.checkMonsterHP();

        // Increment total clicks
        this.totalClicks++;
    },

    /**
     * Checks if Monster HP is below 0
     */
    checkMonsterHP: function() {
        if (this.monsterHP <= 0) {
            if (this.monsterCount == 4 || this.monsterCount == 9) {
                this.isMonsterDead = true;
                // Start kill monster game
                this.startKillMonsterGame();
            } else {
                // Create new monster
                this.monsterKilled();

                // Set isMonsterDead to true
                this.isMonsterDead = true;
            }
        } 
    },

    /**
     * Start kill monster game
     */
    startKillMonsterGame: function() {
        // Set all variables
        game.timingCount = 0;
        game.timingTimer = this.timingTimeMax;
        
        // Display kill monster section
        display.startKillMonsterGame();

        // Display remember number
        display.createRememberNumber();

        // Start timing game
        setTimeout(() => {
            display.startTimingGame();
            this.startTimingTimer();
        }, 1050);
    },

    /**
     * Creates new monster
     * Sets HP and calls update display
     */
    monsterKilled: function() {
        // Create and add coins to display
        this.createCoins();

        // Update kill monster
        display.monsterKilled();

        // Update Monster HP
        display.updateMonsterHP();

        // Play monster death sound effect
        audio.playMonsterDeath();

        // Wait before creating new monster
        setTimeout(() => {
            // Check if 10 monsters are dead
            if (this.monsterCount >= this.monstersPerLevel - 1) {
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

                // Create New Monster
                this.newMonster();

                // Set monster count to 0
                this.monsterCount = 0;
    
                // Update the display
                display.updateMonsterCount();

                // Start tic tac toe game
                tttGame.startTicTacToeGame();
            } else {
                // Create new monster
                this.newMonster();
            }
        }, 500);
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

        // Set Monster Max Health
        this.monsterHealthMax = 10 * this.level;

        // Set new hp of monster
        this.monsterHP = 10 * this.level;

        // Update the display
        display.updateMonsterHP();

        // Display new monster
        display.createNewMonster();

        // Set isMonsterDead to false
        setTimeout(() => {
            this.isMonsterDead = false;
        }, this.newMonsterDelay);
    },

    /**
     * Levels Up once 10 monsters are killed or boss is defeated
     */
    levelUp: function() {
        // Increment level by 1
        this.level += 1;

        // Update the display
        display.updateLevel();

        // Play level up sound effect 
        audio.playLevelUp();

        // Update coins to get
        this.coinsToGet += (this.level - 1) * 10;

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
        // Set Monster Max Health
        this.monsterHealthMax = this.level * 100;
        
        // Set hp of boss
        this.monsterHP = this.level * 100;

        // Update the display
        display.updateBossRound();

        // Play boss level sound effect
        audio.playBossLevel();

        // Set isBossRound to true
        this.isBossRound = true;

        // Update Coins to get
        this.coinsToGet = this.level * 200;
    },

    /**
     * Add on the coins, update the display
     * and create coins to display
     */
    addCoins: function() {
        // Add coins to get to coins
        this.coins += game.coinsAdded;

        // Increment total coins
        this.totalCoins += game.coinsAdded;

        // Update the display
        display.updateCoins();
    },

    /**
     * Create coins to display
     */
    createCoins: function() {
        // Set the amount
        let amount = 0;

        // Set the coins to get
        let coinsTG = this.coinsToGet;

        while(amount <= 15 && coinsTG >= 10) {
            // Take 5 coins away
            coinsTG -= 10;
            // Create a coin to display
            display.createCoin();

            // Increment amount by 1
            amount++;
        }

        // Set coin display amount
        display.coinAmount = amount;
    },

    /**
     * Update the timer
     */
    timer: function() {
        // Increment time
        this.time++;

        // Format our time
        let hrs = Math.floor(this.time / 3600);
        let mins = Math.floor((this.time - (hrs * 3600)) / 60);
        let secs = this.time % 60;

        // Add 0 to front
        if (secs < 10) secs = "0" + secs;
        if (mins < 10) mins = "0" + mins;
        if (hrs < 10) hrs = "0" + hrs;

        // Display our time
        display.updateTimer(secs, mins, hrs);
    },

    /**
     * Start the timer
     */
    startTimer: function() {
        // If already started return
        if (this.interval) {
            return;
        }
        
        // Create interval for timer
        this.interval = setInterval(() => {
            this.timer();
        }, 1000);
    },

    /**
     * Start timing timer
     */
    startTimingTimer: function() {
        // Create interval for timer
        this.timingInterval = setInterval(() => {
            // Clear interval
            if (this.timingTimer <= 0.2) {
                clearInterval(this.timingInterval);
                this.endKillMonsterGame();
            }
            // Update timer
            this.timingTime();
        }, 100);
    },

    /**
     * Update the timing timer
     */
    timingTime: function() {
        // Increment time
        this.timingTimer -= 0.1;

        // Display our time
        display.updateTimingTimer(this.timingTimer);
    },


    /**
     * Add to timing count
     */
    addToTimingCount: function() {
        // Increment timing count
        this.timingCount++;

        // Update display
        display.updateTimingCount();
    },

    /**
     * End the kill monster game
     */
    endKillMonsterGame:function() {
        // End kill monster game
        display.endKillMonsterGame();

        if (this.timingCount >= this.timingRememberNumber) {
            // Create new monster
            this.monsterKilled();

            // Set isMonsterDead to true
            this.isMonsterDead = true;
        } else {
            this.respawnMonster();
        }
    },

    /**
     * Respawn the monster
     */
    respawnMonster: function() {
        // Set Monster Max Health
        this.monsterHealthMax = 10 * this.level;
        
        // Set new hp of monster
        this.monsterHP = 10 * this.level;

        // Update the display
        display.updateMonsterHP();

        // Display new monster
        display.createNewMonster();

        this.isMonsterDead = false;
    },

    /**
     * Beat the game
     */
    beatTheGame: function() {
        setTimeout(() => {
            // Display congratulations section
            display.beatTheGame();
        }, 500);

        // Reset game
    }
};

/**
 * Anything to do with upgrades
 */

var upgrades = {
    // Store data on variables
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
        500,
        5000
    ],
    previousCost: [
        1,
        2,
        3
    ],
    buyUpgradeDelay: false,

    /**
     * Purchase the upgrade
     * Take away coins and add power
     */

    purchase: function(index) {
        // Return if delay is active
        if (this.buyUpgradeDelay) {
            return;
        }
        
        // Check if player has enough coins
        if (game.coins >= this.cost[index]) {
            // Take away cost from coins
            game.coins -= this.cost[index];
            
            // Add 1 to count
            this.count[index]++;

            // Update previous cost
            this.previousCost[index] = this.cost[index];

            // Increase the cost by 1.15 times
            this.cost[index] = Math.ceil(this.cost[index] * 1.15);

            // Add powerIncrease to power
            game.power += this.powerIncrease[index];

            // Update coins
            display.updateCoins();

            // Update power
            display.updatePower(this.powerIncrease[index]);

            // Update upgrades menu
            display.updateUpgradesMenu(index);

            // Play upgrade sound effect
            audio.playUpgrade();

            // Change buy upgrades delay
            this.buyUpgradeDelay = true;
        }
    }
};


/**
 * Anything that requires the page display to update
 */
var display = {
    // Store data on variables
    islandNames: ["island-a.png", "island-b.png", "island-c.png", "island-d.png", "island-e.png", "island-f.png", "island-g.png", "island-h.png", "island-i.png"],
    monsterNames: ["monster-a.png", "monster-b.png", "monster-c.png", "monster-d.png", "monster-e.png", "monster-f.png", "monster-g.png", "monster-h.png", "monster-i.png", "monster-j.png", "monster-k.png", "monster-l.png", "monster-m.png", "monster-n.png", "monster-o.png", "monster-p.png"],
    coinPosition: {
        x: 0,
        y: 0
    },
    coinImages: ["coin-a.png", "coin-b.png", "coin-c.png", "coin-d.png", "coin-e.png", "coin-f.png"],
    coinAmount: 0,
    coinsPickedUp: 0,
    animationOn: false,

    /**
     * Start the game
     */
    startGame: function() {
        // Get start section
        let startScreen = document.querySelector(".start-screen");
        
        // Get clicker section
        let clickerSection = document.querySelector(".clicker-section");

        // Add play class
        startScreen.classList.add("play");
        clickerSection.classList.add("play");

        // Add fade class
        setTimeout(() => {
            clickerSection.classList.add("fade");
        }, 500);

        // Update displays
        this.updateLevel();
        this.updateMonsterCount();
        this.updateMonsterHP();
        this.updatePower();
        this.updateCoins();
        this.updateTimer("00", "00", "00");
        this.updateUpgradesMenu();

        // Update audio
        // Change slider value
        musicSliderValue.textContent = musicSlider.value;

        // Update music volume
        audio.updateMusicVolume(musicSlider.value);

        // Change slider value
        seSliderValue.textContent = seSlider.value;

        // Update music volume
        audio.soundEffectVolume = seSlider.value;
        
        // Start the bg audio
        audio.playSoundtrackBG();

        setTimeout(() => {
            // Update music
            audio.updateMusic();
        }, 500);

        // Create new island and monster
        this.newIsland();
        this.createNewMonster();

        // Start clicker hover animation
        this.clickerHoverAnimation();
    },

    /**
     * Make the clicker hover
     */
    clickerHoverAnimation: function() {
        // Get the clicker
        let clicker = document.querySelector(".monster-clicker");

        // Define upDown var
        let upOrDown = "up";

        // Set animation interval
        let animationInterval = window.setInterval(() => {
            // If animation off clear interval
            if (!iaToggleOn) {
                clearInterval(animationInterval);
            } else {
                // Create random number between 5 and 15
                let randomTranslate = randomNumber(8, 14);
                
                // Check whether to translate up or down
                if (upOrDown == "up") {
                    clicker.style.transform = `translateY(${randomTranslate}px)`;
                    upOrDown = "down";
                } else {
                    clicker.style.transform = `translateY(${-randomTranslate}px)`;
                    upOrDown = "up";
                }
            }
        }, 1000);
    },

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

    startKillMonsterGame: function() {
        // Get kill monster section
        let killMonsterSection = document.querySelector(".kill-monster-section");

        // Add active class
        killMonsterSection.classList.add("active");
    },

    endKillMonsterGame: function() {
        // Get kill monster section
        let killMonsterSection = document.querySelector(".kill-monster-section");

        // Remove active class
        killMonsterSection.classList.remove("active");

         // Get timing game container
         let timingGameContainer = document.querySelector(".timing-game-container");

         // Remove classes
         timingGameContainer.classList.remove("active");
         timingGameContainer.classList.remove("fade");
    },

    createRememberNumber: function() {
        // Create remember number div
        let div = document.createElement("div");

        // Add class
        div.classList.add("remember-number");

        // Get random number
        let rememberNumber = randomNumber(3,5);
        game.timingRememberNumber = rememberNumber;

        // Place remember number in div
        div.textContent = rememberNumber;

        // Get kill monster section
        let killMonsterSection = document.querySelector(".kill-monster-section");

        // Add div to kill monster section
        killMonsterSection.appendChild(div);

        // Fade out after 1s
        fadeOut(div, 1000, 0.2, () => {
            div.remove();
        });
    },

    /**
     * Start the timing game
     */
    startTimingGame: function() {
        // Update displays
        let timingCount = document.querySelector(".timing-count");
        timingCount.textContent = game.timingCount;
        let timingTimer = document.querySelector(".timing-timer");
        timingTimer.textContent = game.timingTimer + "s";
        
        // Get timing game container
        let timingGameContainer = document.querySelector(".timing-game-container");

        // Get green areas
        let timingGreenArea = document.querySelector(".timing-green-area");
        let timingGreenAreaDisplay = document.querySelector(".timing-green-area-display");

        // Change to easy game
        if (egToggleOn) {
            timingGreenArea.classList.add("easy-game");
            timingGreenAreaDisplay.classList.add("easy-game");
        } else {
            timingGreenArea.classList.remove("easy-game");
            timingGreenAreaDisplay.classList.remove("easy-game");
        }

        // Add classes
        timingGameContainer.classList.add("active");
        setTimeout(() => {
            timingGameContainer.classList.add("fade");
        }, 50);

        // Start timing bar
        setTimeout(() => {
            this.startTimingBar();
        }, 250);
    },

    /**
     * Start the movement of the timing bar
     */
    startTimingBar: function() {
        // Get timing bar
        let timingBar = document.querySelector(".timing-bar");

        // Set position to 0
        let positionX = 0;
        timingBar.style.left = positionX + "px";

        // Get timing box container
        let timingBoxContainer = document.querySelector(".timing-box-container");

        // Get width of timing box conatiner
        let tbcWidth = timingBoxContainer.offsetWidth;

        // Set duration
        let duration = false;

        // Start duration timer
        setTimeout(()=> {
            duration = true;
        }, (game.timingTimeMax * 1000) - 100);

        // Set movement direction
        let moveRight = true;

        // Create movement interval
        let movementInterval = window.setInterval(() => {
            // Clear interval
            if (duration) {
                clearInterval(movementInterval);
            }

            // Check movement direction
            if (moveRight) {
                // Check if at end
                if (positionX >= tbcWidth - 1) {
                    moveRight = false;
                }
                // Increment position x
                positionX++;

                // Change style
                timingBar.style.left = positionX + "px";
            } else {
                // Check if at end
                if (positionX <= 1) {
                    moveRight = true;
                }
                // Increment position x
                positionX--;

                // Change style
                timingBar.style.left = positionX + "px";
            }
        }, 1);
    },

    /**
     * Check if clicked on green area
     */
    checkIfClickedGreen: function() {
        // Get timing bar
        let timingBar = document.querySelector(".timing-bar");

        // Get green area
        let timingGreenArea = document.querySelector(".timing-green-area");

        // Check if elements overlap
        if (this.checkOverlap(timingBar, timingGreenArea)) {
            // Add to timing count
            game.addToTimingCount();

            // Move and change green area
            this.updateGreenArea();
        } else {
            // Decrement time
            game.timingTimer--;

            // Update display
            this.updateTimingTimer();
        }
    },

    /**
     * Check overlap of elements
     */
    checkOverlap: function(el1, el2) {
        // Get offsets
        let domRect1 = el1.getBoundingClientRect();
        let domRect2 = el2.getBoundingClientRect();

        // Check positions
        return !(
            domRect1.right < domRect2.left ||
            domRect1.left > domRect2.right
        );
    },

    /**
     * Update timing count display
     */
    updateTimingCount: function() {
        // Get timing count
        let timingCount = document.querySelector(".timing-count");

        // Change number
        timingCount.textContent = game.timingCount;
    },

    /**
     * Update timer display
     */
    updateTimingTimer: function(time) {
        // Get timer
        let timingTimer = document.querySelector(".timing-timer");

        // Get timer progress
        let timerProgress = document.querySelector(".timing-countdown-progress");

        // Update display
        timingTimer.textContent = Math.round(game.timingTimer * 10) / 10 + "s";

        timerProgress.style.width = (game.timingTimer / game.timingTimeMax) * 100 + "%";
    },

    /**
     * Move and change green area
     */
    updateGreenArea: function() {
        // Get green area
        let greenArea = document.querySelector(".timing-green-area");

        // Get box container
        let boxContainer = document.querySelector(".timing-box-container");

        // Get widths
        let gaWidth = greenArea.offsetWidth;
        let bcWidth = boxContainer.offsetWidth;

        // Set x position
        let positionX = randomNumber(0, (bcWidth - gaWidth));

        // Set left
        greenArea.style.left = positionX + "px";
    },

    /**
     * Update Monster Count
     */
    updateMonsterCount: function() {
        document.getElementById("monster-count").innerHTML = `${game.monsterCount}/${game.monstersPerLevel}`;
    },

    /**
     * Update Level
     * Change coins to get
     */
    updateLevel: function () {
        document.getElementById("level").innerHTML = game.level;

        // Wait until coins from previous level has been collected
        // Then change coins to get
        setTimeout(() => {
            game.coinsAdded = game.coinsToGet;
        }, 4050);
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

        // Change color of background 
        document.documentElement.style.setProperty("--MAIN", "#9d0208");
    },

    /**
     * Remove boss icon from health bar
     */
    removeBossIcon: function() {
        // Get boss icon
        let bossIcon = document.querySelector(".boss-icon");

        // Remove the active class
        bossIcon.classList.remove("active");

        // Change color of background 
        document.documentElement.style.setProperty("--MAIN", "#262626");
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
    updatePower: function(addedPower) {
        // Change power
        let power = document.querySelector(".power");
        power.innerHTML = game.power;

        if (arguments.length >= 1) {
            // Create power increase number
            this.createPowerIncreaseNumber(addedPower);
        }
    },

    /**
     * Create power increase number
     */
    createPowerIncreaseNumber: function(addedPower) {
        // Check if animation is on
        if (!naToggleOn) {
            return;
        }
        
        // Create number of addedPower after 0.1s
        let number = document.createElement("div");
            
        // Add class to number
         number.classList.add("power-number", "unselectable");
            
        // Add text
        number.textContent = "+" + addedPower;

        // Get power container
        let powerNumber = document.querySelector(".power-count-number");
        let powerContainer = document.querySelector(".power-container");

        // Get power position
        let powerOffset = powerNumber.getBoundingClientRect();
        let powerContainerOffset = powerContainer.getBoundingClientRect();
        let positionX = (powerOffset.left - powerContainerOffset.left) + powerNumber.offsetWidth;
        let positionY = (powerOffset.top - powerContainerOffset.top) - 2;
         
        // Add width to number position
        number.style.left = positionX + "px";
        number.style.top = positionY + "px";
         
        // Append number to container
        powerContainer.appendChild(number);

        // Slowly fade out
        fadeOut(number, 1000, 0.2, function() {
            // Remove number
            number.remove();

            // Change buy upgrade delay
            upgrades.buyUpgradeDelay = false;
        });
    },

    /**
     * Update Upgrades Menu
     * Updates counts and costs
     */
    updateUpgradesMenu: function(index) {
        // Update counts and costs
        let counts = document.querySelectorAll(".upgrade-count");
        let costs = document.querySelectorAll(".upgrade-cost");
        for (let i = 0; i < counts.length; i++) {
            counts[i].innerHTML = upgrades.count[i];
            costs[i].innerHTML = upgrades.cost[i];
        }

        if (arguments.length >= 1) {
            // Create count number
            this.createCountNumber(index);

            // Create cost number
            this.createCostNumber(index);

            // Create coin minus number
            this.createMinusCoinNumber(index);

            // Change name bar
            this.updateUpgradeBuyBar(index);
        }
        
    },

    /**
     * Create minus coin number when upgrade is bought
     */
    createMinusCoinNumber: function(index) {
        // Check if animation is on
        if (!naToggleOn) {
            return;
        }
        
        // Create element
        let number = document.createElement("div");

        // Add text content
        number.textContent = "-" + upgrades.previousCost[index];

        // Add class styleing
        number.classList.add("minus-coin-number", "unselectable");

        // Get amount container
        let coinsText = document.querySelector(".coins");
        let upgradeBtns = document.querySelectorAll(".upgrade-btn");
        let upgradeBtn = upgradeBtns[index];

        // Get power position
        let coinsTextOffset = coinsText.getBoundingClientRect();
        let upgradeBtnOffset = upgradeBtn.getBoundingClientRect();
        let positionX = (coinsTextOffset.left - upgradeBtnOffset.left) + coinsText.offsetWidth;
        let positionY = (coinsTextOffset.top - upgradeBtnOffset.top);
          
        // Add width to number position
        number.style.left = positionX + "px";
        number.style.top = positionY + "px";
        
        // Append number to upgradeBtn
        upgradeBtn.appendChild(number);

        // Slowly fade out
        fadeOut(number, 1000, 0.2, function() {
            // Remove number
            number.remove();
        });
    },

    /**
     * Create cost number when upgrade is bought
     */
    createCostNumber: function(index) {
        // Check if animation is on
        if (!naToggleOn) {
            return;
        }
        
        // Create element
        let number = document.createElement("div");

        // Add text content
        number.textContent = "+" + (upgrades.cost[index] - upgrades.previousCost[index]);

        // Add class styleing
        number.classList.add("cost-number", "unselectable");

        // Get amount container
        let upgradeCosts = document.querySelectorAll(".upgrade-cost");
        let upgradeBtns = document.querySelectorAll(".upgrade-btn");
        let upgradeCost = upgradeCosts[index];
        let upgradeBtn = upgradeBtns[index];

        // Get power position
        let upgradeCostOffset = upgradeCost.getBoundingClientRect();
        let upgradeBtnOffset = upgradeBtn.getBoundingClientRect();
        let positionX = (upgradeCostOffset.left - upgradeBtnOffset.left) + upgradeCost.offsetWidth;
        let positionY = (upgradeCostOffset.top - upgradeBtnOffset.top);
          
        // Add width to number position
        number.style.left = positionX + "px";
        number.style.top = positionY + "px";
        
        // Append number to upgradeBtn
        upgradeBtn.appendChild(number);

        // Slowly fade out
        fadeOut(number, 1000, 0.2, function() {
            // Remove number
            number.remove();
        });
    },

    /**
     * Create count number when upgrade is bought
     */
    createCountNumber: function(index) {
        // Check if animation is on
        if (!naToggleOn) {
            return;
        }
        
        // Create element
        let number = document.createElement("div");

        // Add text content
        number.textContent = "+1";

        // Add class styleing
        number.classList.add("count-number", "unselectable");

       // Get amount container
       let amountNumbers = document.querySelectorAll(".upgrade-amount-number");
       let  upgradeBtns = document.querySelectorAll(".upgrade-btn");
       let amountNumber = amountNumbers[index];
       let  upgradeBtn = upgradeBtns[index];

       // Get power position
       let amountNumberOffset = amountNumber.getBoundingClientRect();
       let upgradeBtnOffset = upgradeBtn.getBoundingClientRect();
       let positionX = (amountNumberOffset.left - upgradeBtnOffset.left) + amountNumber.offsetWidth;
       let positionY = (amountNumberOffset.top - upgradeBtnOffset.top);
        
       // Add width to number position
       number.style.left = positionX + "px";
       number.style.top = positionY + "px";
        
        // Append number to upgradeBtn
        upgradeBtn.appendChild(number);

       // Slowly fade out
       fadeOut(number, 1000, 0.2, function() {
           // Remove number
           number.remove();
       });
    },

    /**
     * Update the upgrade name bar
     */
    updateUpgradeBuyBar: function(index) {
        // Return if delay is active
        if (this.buyUpgradeDelay) {
            return;
        }
        
        // Get upgrade name pseudo
        let upgradeNameBars = document.querySelectorAll(".upgrade-buy-bar");
        
        for (let i = 0; i < upgradeNameBars.length; i++) {
            
            let upgradeNameBar = upgradeNameBars[i];

            // Get max width
            let maxWidth = upgradeNameBar.offsetWidth;

            // Set width to be 0
            upgradeNameBar.style.width = "0px";
            let width = 0;

            // Set interval to increase bar for 900ms
            let upgradeInterval = window.setInterval(() => {
                // Clear interval when bar is 100%
                if (width >= maxWidth - ((10/900) * maxWidth)) {
                    clearInterval(upgradeInterval);
                }

                // Change width by .005%
                width += (10/900) * maxWidth;

                // Set width 
                upgradeNameBar.style.width = width + "px";

                // Set final width
                if (width >= maxWidth) {
                    upgradeNameBar.style.width = maxWidth + "px";
                }
            }, 10);
        }
        
    },

    /**
     * Transition the island from 1 background to the next
     */
    transitionIsland: function() {
        if (!iaToggleOn) {
            return;
        }
        
        // Get island image element
        let island = document.querySelector(".island-bg");

        // Add transition class
        island.classList.add("transition");

        setTimeout(() => {
            // Remove transition class
            island.classList.remove("transition");
        }, 500);
    },

    /**
     * Create number to display on screen when monster is clicked
     */
    createNumberOnClick: function(event) {
        // Check if animation is on
        if (!naToggleOn) {
            return;
        }
        
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
        };

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
            // Remove interval if element is removed
            if (typeof element == "undefined" && element == null) clearInterval(movementInterval);

            position.y--;
            element.style.top = position.y + "px";
        }, 10);

        // Slowly fade out
        fadeOut(element, 2000, 0.2, function() {
            element.remove();
        });
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
        }, 250);
    },

    /**
     * Animate deal damage to monster
     */
    dealDamageAnimation: function() {
        // Check if animation is on
        if (!maToggleOn) {
            return;
        }
        
        // Get monster
        let monster = document.querySelector(".monster");

        // Change scale of monster
        monster.style.transform = "scale(0.80)";

        // Change scale to normal after 0.1s
        setTimeout(() => {
            monster.style.transform = "scale(1)";

        }, 100);
    },

    /**
     * Animate death of monster
     */
    monsterKilled: function() {
        // Check if animation is on
        if (!maToggleOn) {
            return;
        }
        // Get the image element
        let monster = document.querySelector(".monster");

        // Get wrapper
        let monsterWrapper = document.querySelector(".monster-wrapper");

        // Transition monster
        monsterWrapper.classList.add("transition");

        // Scale monster to disappear
        setTimeout(() => {
            monster.classList.add("transition");
            monster.style.transform = "scale(0.01)";
        }, 100);

        // Remove transtion
        setTimeout(() => {
            monster.classList.remove("transition");
            monsterWrapper.classList.remove("transition");
        }, 500);
        
        setTimeout(() => {
            monster.style.transform = "scale(1)";
        }, game.newMonsterDelay);
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
        let newMonsterImgName = this.monsterNames[randNum];

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
    createCoin: function() {
        // Get monster clicker
        let clicker = document.querySelector(".monster-clicker");

        // Create coin img element
        let coin = document.createElement("img");
        coin.src = "./assets/images/coins/coin-a.png";
        coin.classList.add("coin", "unselectable");

        // Add coin to island
        clicker.appendChild(coin);

        // Slowly fade out
        fadeOut(coin, 4000, 0.4, () => {
            this.createNumberOnCoinPickUp(coin);
            coin.remove();
        });

        // Get widths and heights
        let clickerWidth = clicker.offsetWidth;
        let clickerHeight = clicker.offsetHeight;
        let coinWidth = coin.offsetWidth;
        let coinHeight = coin.offsetHeight;

        // Get random positions
        let randomX = randomNumber(0 - (clickerWidth/2), clickerWidth/2, this.coinPosition.x);
        let randomY = randomNumber(0 - (clickerHeight/2), clickerHeight/2, this.coinPosition.y);
        this.coinPosition.x = randomX;
        this.coinPosition.y = randomY;

        // Set coin position to center 
        coin.style.left = (clickerWidth/2) - (coinWidth/2) + "px";
        coin.style.top = (clickerHeight/2) - (coinHeight/2) + "px";

        // Translate to random position
        coin.style.transition = "transform 0.3s ease-in-out";
        coin.style.transform = `translate(${randomX}px, ${randomY}px)`;

        // Set timeout for 0.5s
        setTimeout(()=> {
            // Animate coin
            this.animateCoin(coin, 3500);
        }, 500);

        // Move coin to corner for pick up
        setTimeout(() => {
            coin.style.transform = `translate(${clickerWidth/2}px, ${0}px)`;
        }, 3400);
    },

    /**
     * Animate coin to turn around
     */
    animateCoin: function(coin, duration) {
        // Check if animation is on
        if (!caToggleOn) {
            return;
        }

        let coinAnimatingInterval = window.setInterval(() => {
            // Remove interval if coin has been removed
            if (typeof coin == "undefined" && coin == null) clearInterval(coinAnimatingInterval);
            
            // Decrease duration
            duration -= 120;

            // Change coin image
            // Get name of image
            let imgSrcArr = coin.src.split("/");
            let imgName = imgSrcArr[imgSrcArr.length-1];

            // Get index of name
            let imgIndex = this.coinImages.indexOf(imgName);

            // Get new image index
            if (imgIndex >= this.coinImages.length-1) {
                imgIndex = 0;
            } else {
                imgIndex++;
            }

            // Set new image to index + 1
            coin.src = `./assets/images/coins/${this.coinImages[imgIndex]}`;

            // Clear interval when duration is 0
            if (duration <= 0) {
                clearInterval(coinAnimatingInterval);
            }
        }, 120);
    },

    /**
     * Create a + number when coins are picked up
     */
    createNumberOnCoinPickUp: function(coin) {
        // Add coin to coins picked up
        this.coinsPickedUp++;
        
        let monsterClicker = document.querySelector(".monster-clicker");

        // Check if coins picked up is equal to coin amount
        if (this.coinsPickedUp >= this.coinAmount) {
            // Set coinsPickedUp to 0
            this.coinsPickedUp = 0;

            // Get position of coin
            let coinRect = coin.getBoundingClientRect();
            let monsterClickerRect = monsterClicker.getBoundingClientRect();
            let position = {
                x: coinRect.left - monsterClickerRect.left,
                y: coinRect.top - monsterClickerRect.top - 10
            };

            // Create number element
            let number = document.createElement("div");
            
            // Apply class
            number.classList.add("coin-number");

            // Add text
            number.textContent = "+" + game.coinsAdded;

            // Set position of number
            number.style.left = position.x + "px";
            number.style.top = position.y + "px";

            // Add to monster clicker
            monsterClicker.appendChild(number);

            // Add coins
            game.addCoins();

            // Play audio
            audio.playCoinCollect();

            // Slowely rise the number to top of screen
            let movementInterval = window.setInterval(() => {
                // Remove interval if elemnumberent is removed
                if (typeof number == "undefined" && number == null) clearInterval(movementInterval);

                position.y--;
                number.style.top = position.y + "px";
            }, 10);

            // Slowly fade out
            fadeOut(number, 1000, 0.2, function() {
                number.remove();
            });
        }
    },

    /**
     * Update the timer
     */
    updateTimer: function(secs, mins, hrs) {
        // Get timer
        let timer = document.querySelector(".timer");

        // Set text
        timer.textContent = `${hrs}:${mins}:${secs}`;
    },

    /**
     * Display saved game
     */
    saveGame: function() {
        // Create element
        let element = document.createElement("div");

        // Add text content
        element.textContent = "Game Saved!";

        // Add class styling
        element.classList.add("save-game-text", "unselectable");

        // Add element to main area
        let mainArea = document.querySelector(".main-area");
        mainArea.appendChild(element);

        // Fade out slowly
        fadeOut(element, 3000, 0.2, () => {
            element.remove();
        });
    },

    /**
     * Beat the game
     */
    beatTheGame: function() {
        // Get sections
        let clickerSection = document.querySelector(".clicker-section");
        let congratsSection = document.querySelector(".congrats-section");

        // Remove fade
        clickerSection.classList.remove("fade");

        setTimeout(() => {
            // Remove clickerSection
            clickerSection.classList.remove("play");

            // Add congratulations section
            congratsSection.classList.add("active");

            // Add fade to congrats seciton
            congratsSection.classList.add("fade");

            setTimeout(() => {
                // Display leaderboard entry
                this.leaderboardEntry();
            }, 2000);
        }, 500);
    },

    /**
     * Display leaderboard entry section
     */
    leaderboardEntry: function() {
        // Get content container
        let congratsContentContainer = document.querySelector(".congrats-content-container");

        // Fade content out
        congratsContentContainer.classList.add("fade");

        
        setTimeout(() => {
            // Change content
            congratsContentContainer.innerHTML = `
                <div class="congrats-text">Enter Your Name:</div>
                <input class="leaderboard-name-entry"></input>
                <div class="leaderboard-name-entry-btn">
                    <i class="fa-solid fa-right-to-bracket leaderboard-name-entry-icon"></i>
                </div>
            `;

            // Get entry btn
            let entryBtn = document.querySelector(".leaderboard-name-entry-btn");

            // Add event listener
            entryBtn.addEventListener("click", () => {
                // Get players name
                let name = document.querySelector(".leaderboard-name-entry").value;

                // Close congrats section
                let congratsSection = document.querySelector(".congrats-section");

                // Fade out
                congratsSection.classList.remove("fade");

                setTimeout(() => {
                    // Reset congrats section
                    congratsSection.classList.remove("active");

                    congratsContentContainer.innerHTML = `
                        <div class="congrats-content-container">
                            <div class="congrats-text">Congratulations!</div>
                            <div class="congrats-text">You Beat The Game</div>
                        </div>
                    `;
                    
                    // Add player to leaderboard
                    addPlayerToLeaderboard(name);

                    // Open leaderboard
                    openLeaderboard();
                }, 500);
            });
            
            // Fade back in
            congratsContentContainer.classList.remove("fade");
        }, 1000);
    }
};

/**
 * Audio Settings
 */
var audio = {
    soundtrack: ["violin-bg-soundtrack-a.webm", "violin-bg-soundtrack-b.webm", "violin-bg-soundtrack-c.webm", "violin-bg-soundtrack-d.webm", "violin-bg-soundtrack-e.webm", "violin-bg-soundtrack-f.webm"],
    lastAudioPlayed: 5,
    musicPlayedIndex: 0,
    musicVolume: 100,
    soundEffectVolume: 100,
    
    /**
     * Play the background audio
     */
    playSoundtrackBG: function() {
        // Get audio
        let audio = document.getElementById("bg-soundtrack");

        // Add class 
        audio.classList.add(`music${this.musicPlayedIndex}`);
        
        this.musicPlayedIndex++;

        // Create random number
        let randNum = randomNumber(0, this.soundtrack.length, this.lastAudioPlayed);
        
        // Set src
        audio.src = `./assets/audio/${this.soundtrack[randNum]}`;
        
        // Set lastAudioPlayed
        this.lastAudioPlayed = randNum;
        
        // Set current time
        audio.currentTime = 0;

        // Play audio
        audio.play();
    
        // Add event listener
        audio.addEventListener("ended", () => {
            this.playSoundtrackBG();
        });
    },
    
    /**
     * Play music if music toggle on
     * Stop music if music toggle off
     */
    updateMusic: function() {
        // Check if toggle on or off
        if (musicToggleOn) {
            // Play soundtrack
            this.playSoundtrackBG();
        } else {
            // Stop soundtrack
            let music = document.getElementById("bg-soundtrack");
            music.pause();
        }
    },

    /**
     * Update the music volume
     */
    updateMusicVolume: function(value) {
        // Get music
        let music = document.getElementById("bg-soundtrack");

        // Set music volume
        this.musicVolume = value;
        
        // Change volume
        music.volume = value / 100;
    },

    /**
     * Play coin collect sound
     */
    playCoinCollect: function() {
        // Return if sound effect toggled off
        if (!seToggleOn) {
            return;
        }

        // Create new audio
        let audio = new Audio();

        // Set audio src
        audio.src = "./assets/audio/coin-collect.mp3";

        // Set volume
        audio.volume = this.soundEffectVolume / 100;

        // Set audio time
        audio.currentTime = 0;

        // Load and play sound
        audio.load();
        audio.play();
    },

    /**
     * Play hit marker sound
     */
    playHitMarker: function() {
        // Return if sound effect toggled off
        if (!seToggleOn) {
            return;
        }

        // Create new audio
        let audio = new Audio();

        // Set audio src
        audio.src = "./assets/audio/hit-marker.mp3";

        // Set volume
        audio.volume = this.soundEffectVolume / 100;

        // Set audio time
        audio.currentTime = 0;

        // Load and play sound
        audio.load();
        audio.play();
    },

    /**
     * Play monster death sound
     */
    playMonsterDeath: function() {
        // Return if sound effect toggled off
        if (!seToggleOn) {
            return;
        }

        // Create new audio
        let audio = new Audio();

        // Set audio src
        audio.src = "./assets/audio/monster-death.mp3";

        // Set volume
        audio.volume = this.soundEffectVolume / 100;

        // Set audio time
        audio.currentTime = 0;

        // Load and play sound
        audio.load();
        audio.play();
    },

    /**
     * Play level up sound
     */
    playLevelUp: function() {
        // Return if sound effect toggled off
        if (!seToggleOn) {
            return;
        }

        // Create new audio
        let audio = new Audio();

        // Set audio src
        audio.src = "./assets/audio/level-up.mp3";

        // Set volume
        audio.volume = this.soundEffectVolume / 100;

        // Set audio time
        audio.currentTime = 0;

        // Load and play sound
        audio.load();
        audio.play();
    },

    /**
     * Play upgrade sound
     */
    playUpgrade: function() {
        // Return if sound effect toggled off
        if (!seToggleOn) {
            return;
        }

        // Create new audio
        let audio = new Audio();

        // Set audio src
        audio.src = "./assets/audio/upgrade.mp3";

        // Set audio time
        audio.currentTime = 0;

        // Load and play sound
        audio.load();
        audio.play();
    },

    /**
     * Play boss level sound
     */
    playBossLevel: function() {
        // Return if sound effect toggled off
        if (!seToggleOn) {
            return;
        }

        // Create new audio
        let audio = new Audio();

        // Set audio src
        audio.src = "./assets/audio/boss-level.mp3";

        // Set audio time
        audio.currentTime = 0;

        // Load and play sound
        audio.load();
        audio.play();
    }
};

/**
 * Code to do with tic tac toe game
 */
var tttGame = {
    board: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    cpuTurn: false,
    turns: 0,

    /**
     * Start Tic Tac Toe game
     */
    startTicTacToeGame: function() {
        // Reset Cells
        this.resetCells();

        // Reset Board
        this.resetBoard();

        // Reset Text
        this.updateHeadingText("You Start Place an X");

        // Display ttt section
        this.displaySection();
    },

    /**
     * Reset Cells
     */
    resetCells: function() {
        // Get cells
        let cells = document.querySelectorAll(".ttt-cell");

        // Loop through cells
        for (let i = 0; i < cells.length; i++) {
            // Get cell
            let cell = cells[i];

            // Check if cell contains more than 1 element
            if (cell.children.length >= 2) {
                let icon = cell.childNodes[1].nextElementSibling;
                
                // Remove icon
                cell.removeChild(icon);

                // Remove placed class
                cell.classList.remove("placed");
            }
        }

        // Get winning line
        let line = document.querySelector(".winning-line");
        
        // Get container
        let container = document.querySelector(".ttt-game-container");

        // Remove line
        if (line != null) container.removeChild(line);
    },

    /**
     * Reset board
     */
    resetBoard: function() {
        // Loop through each index
        for (let i = 0; i < this.board.length; i++) {
            this.board[i] = i;
        }

        // Reset turns
        this.turns = 0;
    },

    /**
     * Display ttt section
     */
    displaySection: function() {
        // Get clicker section
        let clickerSection = document.querySelector(".clicker-section");

        // Remove fade class
        clickerSection.classList.remove("fade");

        setTimeout(() => {
            // Remove play class
            clickerSection.classList.remove("play");

            // Get ttt section
            let tttSection = document.querySelector(".ttt-section");

            // Add play class
            tttSection.classList.add("play");

            // Add fade class
            setTimeout(() => {
                tttSection.classList.add("fade");
            }, 500);
        }, 500);
    },

    /**
     * Display clicker section
     */
    displayClickerSection: function() {
        // Get ttt section
        let tttSection = document.querySelector(".ttt-section");

        // Remove fade class
        tttSection.classList.remove("fade");

        setTimeout(() => {
            // Remove play class
            tttSection.classList.remove("play");

            // Get clicker section
            let clickerSection = document.querySelector(".clicker-section");

            // Add play class
            clickerSection.classList.add("play");

            // Add fade class
            setTimeout(() => {
                clickerSection.classList.add("fade");
            }, 500);
        }, 500);
    },

    /**
     * Place the icon on board
     */
    placeIconOnBoard: function(icon, index) {
        // Replace board index
        this.board[index] = icon;

        // Update Text
        if (this.cpuTurn) {
            this.updateHeadingText(`CPU placed in position ${index + 1}`);
        } else {
            this.updateHeadingText(`You placed in position ${index + 1}`);
        }
        
        // Check for winner
        this.checkForWinner(icon);
    },

    /**
     * Check if there is a winner
     */
    checkForWinner: function(icon) {
        // Check winning combinations for icon and draw
        if (this.checkWinningCombination(icon)) {
            // Someone Won
            this.someoneWon(icon);
        } else if (this.checkForDraw()) {
            // Update heading text
            this.updateHeadingText("It's a draw! Play Again");

            setTimeout(() => {
                // Reset game
                this.startTicTacToeGame();
            }, 2000);
        } else {
            // Next persons go
            this.nextPersonsTurn(icon);
        }
    },

    /**
     * Check winning combinations
     */
    checkWinningCombination: function(icon) {
        // Set winning combinations
        let winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        // Loop through each combination and check icon
        for (let i = 0; i < winningCombinations.length; i++) {
            let comboCount = 0;
            for (let j = 0; j < winningCombinations[i].length; j++) {
                if (this.board[winningCombinations[i][j]] == icon) {
                    comboCount++;
                }
            }
            if (comboCount >= 3) {
                this.drawWinningLine(i+1);
                return true;
            }
            comboCount = 0;
        }

        // Return false if no winner
        return false;
    },

    /**
     * Check for draw
     */
    checkForDraw: function() {
        if (this.turns >= 8) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Next persons go
     */
    nextPersonsTurn: function(icon) {
        // Increment turn
        this.turns++;
        
        // Check whose go it is
        if (icon == "x") {
            // Cpu's turn
            this.cpuTurn = true;

            // Play cpu turn
            this.playCpusTurn();

            // Update text
            setTimeout(() => {
                this.updateHeadingText("CPU's Turn");
            }, 2000);
        } else {
            // Players turn
            this.cpuTurn = false;

            // Update text
            setTimeout(() => {
                this.updateHeadingText("Your Turn");
            }, 2000);
        }
    },

    /**
     * Play players turn
     */
    playPlayersTurn: function(cell) {
        // Place X icon
        cell.innerHTML += `
        <div class="ttt-icon-x">
            <div class="ttt-bar"></div>
            <div class="ttt-bar"></div>
        </div>
        `;

        // Add placed class
        cell.classList.add("placed");

        // Get index of cell
        let parent = cell.parentElement;
        let cellIndex = Array.prototype.indexOf.call(parent.children, cell) - 1;
    
        // Place the icon on board
        tttGame.placeIconOnBoard("x", cellIndex);
    },

    /**
     * Play cpus turn
     */
    playCpusTurn: function() {
        setTimeout(() => {
            // Get random cell
            let cell = this.getRandomCell();

            // Place O icon
            cell.innerHTML += `
            <div class="ttt-icon-o"></div>
            `;

            // Add placed class
            cell.classList.add("placed");

            // Get index of cell
            let parent = cell.parentElement;
            let cellIndex = Array.prototype.indexOf.call(parent.children, cell) - 1;
        
            // Place the icon on board
            tttGame.placeIconOnBoard("o", cellIndex);
        }, 3500);
    },

    /**
     * Get random cell
     */
    getRandomCell: function() {
        // Create copy of board
        let boardCopy = this.board.slice();
        
        // Get board state
        let boardState = [];

        // Add possible cell options
        for (let i = 0; i < this.board.length; i++) {
            // Check if there is icon placed
            if (boardCopy[i] != "x" && boardCopy[i] != "o") {
                // Push into board state if not
                boardState.push(boardCopy[i]);
            }
        }
       
        // Get random index between 0 and boardState length - 1
        let randIndex = randomNumber(0, boardState.length-1);

        // Get random board positon
        let randBoardPos = boardState[randIndex];
        
        // Get cells
        let cells = document.querySelectorAll(".ttt-cell");

        // Get random cell
        let cell = cells[randBoardPos];

        return cell;
    },

    /**
     * Someone has won
     */
    someoneWon: function(icon) {
        // Check who won
        setTimeout(() => {
            if (this.cpuTurn) {
                // Update text
                this.updateHeadingText("CPU WINS!");
            } else {
                // Update text
                this.updateHeadingText("YOU WIN!");
            }
        }, 2000);

        // Check if final level
        if (game.level >= 20) {
            // Check who won
            if (this.cpuTurn) {
                // Reset game
                this.updateHeadingText("You lost Try again");

                setTimeout(() => {
                    this.startTicTacToeGame();
                }, 2000);
            } else {
                // Transition back to clicker game
                setTimeout(() => {
                    this.displayClickerSection();

                    // Beat the game
                    game.beatTheGame();
                }, 5000);

                
            }
        } else {
            // Transition back to clicker game
            setTimeout(() => {
                this.displayClickerSection();
            }, 5000);
        }
        
    },

    /**
     * Update the heading text
     */
    updateHeadingText: function(text) {
        // Get heading text
        let headingText = document.querySelector(".ttt-heading-text");

        // Fade out
        headingText.classList.add("fade");

        // Change text
        setTimeout(() => {
            headingText.textContent = text;

            // Fade in
            headingText.classList.remove("fade");
        }, 500);
    },

    /**
     * Draw winning line
     */
    drawWinningLine: function(winningCombo) {
        setTimeout(() => {
            // Create element
            let line = document.createElement("div");
            
            // Add class to element
            line.classList.add("winning-line");

            // Get game container
            let tttGameContainer = document.querySelector(".ttt-game-container");

            // Append line
            tttGameContainer.appendChild(line);

            // Set width var
            let width = 0;

            // Add combo class
            switch (winningCombo) {
                case 1:
                    // Add class
                    line.classList.add("combo-1");

                    // Set interval
                    
                    let widthInterval1 = window.setInterval(() => {
                        if (width >= 500) {
                            clearInterval(widthInterval1);
                        }

                        // Change width
                        width += 1;
                        
                        // Change line
                        line.style.width = width + "px";
                    }, 1);
                    break;
                case 2:
                    // Add class
                    line.classList.add("combo-2");

                    // Set interval
                    let widthInterval2 = window.setInterval(() => {
                        if (width >= 500) {
                            clearInterval(widthInterval2);
                        }

                        // Change width
                        width += 1;
                        
                        // Change line
                        line.style.width = width + "px";
                    }, 1);
                    break;
                case 3:
                    // Add class
                    line.classList.add("combo-3");

                    // Set interval
                    let widthInterval3 = window.setInterval(() => {
                        if (width >= 500) {
                            clearInterval(widthInterval3);
                        }

                        // Change width
                        width += 1;
                        
                        // Change line
                        line.style.width = width + "px";
                    }, 1);
                    break;
                case 4:
                    // Add class
                    line.classList.add("combo-4");

                    // Set interval
                    let widthInterval4 = window.setInterval(() => {
                        if (width >= 500) {
                            clearInterval(widthInterval4);
                        }

                        // Change width
                        width += 1;
                        
                        // Change line
                        line.style.height = width + "px";
                    }, 1);
                    break;
                case 5:
                    // Add class
                    line.classList.add("combo-5");

                    // Set interval
                    let widthInterval5 = window.setInterval(() => {
                        if (width >= 500) {
                            clearInterval(widthInterval5);
                        }

                        // Change width
                        width += 1;
                        
                        // Change line
                        line.style.height = width + "px";
                    }, 1);
                    break;
                case 6:
                    // Add class
                    line.classList.add("combo-6");

                    // Set interval
                    let widthInterval6 = window.setInterval(() => {
                        if (width >= 500) {
                            clearInterval(widthInterval6);
                        }

                        // Change width
                        width += 1;
                        
                        // Change line
                        line.style.height = width + "px";
                    }, 1);
                    break;
                case 7:
                    // Add class
                    line.classList.add("combo-7");

                    // Set interval
                    let widthInterval7 = window.setInterval(() => {
                        if (width >= 680) {
                            clearInterval(widthInterval7);
                        }

                        // Change width
                        width += 1;
                        
                        // Change line
                        line.style.width = width + "px";
                    }, 1);
                    break;
                case 8:
                    // Add class
                    line.classList.add("combo-8");

                    // Set interval
                    let widthInterval8 = window.setInterval(() => {
                        if (width >= 680) {
                            clearInterval(widthInterval8);
                        }

                        // Change width
                        width += 1;
                        
                        // Change line
                        line.style.width = width + "px";
                    }, 1);
                    break;
                default:
                    break;
            }
        }, 2500);
    }
};

/**
 * Start the game when play btn is clicked
 */
// Define playBtn var
const playBtn = document.querySelector(".play-btn");

// Add event listener for click
playBtn.addEventListener("click", () => {
    // Start display functions
    display.startGame();

    // Start game functions
    game.startGame();
});

/**
 * Open and close how to play section
 */
// Define playBtn var
const htpBtn = document.querySelector(".htp-btn");
const htpCloseBtn = document.querySelector(".htp-close-btn");

// Add event listener for click
htpBtn.addEventListener("click", () => {
    // Get start screen
    let startScreen = document.querySelector(".start-screen");

    // Add play class
    startScreen.classList.add("play");

    // Get htp section
    let htpSection = document.querySelector(".htp-section");

    // Add active classs
    htpSection.classList.add("active");

    setTimeout(() => {
        // Add fade class
        htpSection.classList.add("fade");
    }, 500);
});

// Add event listener for close btn
htpCloseBtn.addEventListener("click", () => {
    // Get htp section
    let htpSection = document.querySelector(".htp-section");

    // Remove fade class
    htpSection.classList.remove("fade");

    setTimeout(() => {
        // Remove active class
        htpSection.classList.remove("active");

        // Get start screen
        let startScreen = document.querySelector(".start-screen");

        // Remove play class
        startScreen.classList.remove("play");
    }, 500); 
});

/**
 * Open and close leaderboard section
 */
// Define playBtn var
const leaderboardBtn = document.querySelector(".leaderboard-btn");
const leaderboardCloseBtn = document.querySelector(".leaderboard-close-btn");

// Add event listener for click
leaderboardBtn.addEventListener("click", () => {
    openLeaderboard();
});

// Add event listener for close btn
leaderboardCloseBtn.addEventListener("click", () => {
    // Close leaderboard
    closeLeaderboard();

    // Reset game if game is finshed
    if (game.level >= 20) {
        resetGame();
    }
});

/**
 * Close stats section
 */
// Define btns
const statsCloseBtn = document.querySelector(".stats-close-btn");

// Add event listener for click
statsCloseBtn.addEventListener("click", () => {
    closeStats();
});

/**
 * Add player to leaderboard
 */
function addPlayerToLeaderboard(name) {
    // Set player name
    let playerName = name;

    // Increment leaderboard players
    game.leaderboardPlayers++;

    // Save game
    saveGame();

    // Get player stats
    let gameStats = {
        name: playerName,
        time: game.time,
        totalClicks: game.totalClicks,
        power: game.power,
        totalCoins: game.totalCoins
    };

    // Store variables in local storage as string
    localStorage.setItem(`gameStatsPlayer${game.leaderboardPlayers-1}`, JSON.stringify(gameStats));
}

/**
 * Open leaderboard
 */
function openLeaderboard() {
    // Get start screen
    let startScreen = document.querySelector(".start-screen");

    // Add play class
    startScreen.classList.add("play");

    // Get leaderboard section
    let leaderboardSection = document.querySelector(".leaderboard-section");

    // Add active classs
    leaderboardSection.classList.add("active");

    // Remove placeholder if there are leaderboard players
    if (game.leaderboardPlayers >= 1) {
        // Get placeholder text
        let placeholder = document.querySelector(".leaderboard-placeholder-text");

        // Remove
        placeholder.classList.add("remove");
    }

    // Get table body
    let tbody = document.querySelector(".leaderboard-tbody");

    // Update leaderboard names
    for (let i = 0; i < game.leaderboardPlayers; i++) {
        // Add to tbody
        tbody.innerHTML += `
            <tr>
                <td>${getPlayerName(i)}</td>
                <td>${getPlayerTime(i)}</td>
                <td>
                    <div class="view-stats-btn" data-index-number="${i}" onclick="openStats(${i})">
                        View Stats
                    </div>
                </td>
            </tr>
        `;
    }

    setTimeout(() => {
        // Add fade class
        leaderboardSection.classList.add("fade");
    }, 500);
}

/**
 * Close leaderboard
 */
function closeLeaderboard() {
    // Get leaderboard section
    let leaderboardSection = document.querySelector(".leaderboard-section");

    // Remove fade class
    leaderboardSection.classList.remove("fade");

    setTimeout(() => {
        // Remove active class
        leaderboardSection.classList.remove("active");

        // Get start screen
        let startScreen = document.querySelector(".start-screen");

        // Remove play class
        startScreen.classList.remove("play");

        // Get tbody
        let tbody = document.querySelector(".leaderboard-tbody");

        // Set innerhtml
        tbody.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Time</th>
            <th>Stats</th>
        </tr>
        `;
    }, 500); 
}

/**
 * Get the leaderboard player name
 */
function getPlayerName(index) {
    // Convert game stats from string to vars
    let gameStats = JSON.parse(localStorage.getItem(`gameStatsPlayer${index}`));
    return gameStats.name;
}

/**
 * Get the leaderboard player time
 */
function getPlayerTime(index) {
    // Convert game stats from string to vars
    let gameStats = JSON.parse(localStorage.getItem(`gameStatsPlayer${index}`));
    let time = gameStats.time;

    // Format our time
    let hrs = Math.floor(time / 3600);
    let mins = Math.floor((time - (hrs * 3600)) / 60);
    let secs = time % 60;

    // Add 0 to front
    if (secs < 10) secs = "0" + secs;
    if (mins < 10) mins = "0" + mins;
    if (hrs < 10) hrs = "0" + hrs;

    return `${hrs}:${mins}:${secs}`;
}

/**
 * Open Stats
 */
function openStats(index) {
    // Get game stats
    let gameStats = JSON.parse(localStorage.getItem(`gameStatsPlayer${index}`));

    // Get values
    let time = document.querySelector(".stats-value-time");
    let totalClicks = document.querySelector(".stats-value-total-clicks");
    let power = document.querySelector(".stats-value-power");
    let totalCoins = document.querySelector(".stats-value-total-coins");

    // Set values
    time.textContent = getPlayerTime(index);
    totalClicks.textContent = gameStats.totalClicks;
    power.textContent = gameStats.power;
    totalCoins.textContent = gameStats.totalCoins;
    
    // Get sections
    let leaderboardSection = document.querySelector(".leaderboard-section");
    let statsSection = document.querySelector(".stats-section");
    
    // Fade leaderboard out
    leaderboardSection.classList.remove("fade");

    setTimeout(() => {
        // Remove leaderboard
        leaderboardSection.classList.remove("active");

        // Add stats
        statsSection.classList.add("active");

        // Fade in
        statsSection.classList.add("fade");
    }, 500);
}

/**
 * Close stats
 */
function closeStats() {
    // Get sections
    let statsSection = document.querySelector(".stats-section");
    let leaderboardSection = document.querySelector(".leaderboard-section");

    // Remove fade class
    statsSection.classList.remove("fade");

    setTimeout(() => {
        // Remove active class
        statsSection.classList.remove("active");

        // Add active class
        leaderboardSection.classList.add("active");

        // Add fade class
        leaderboardSection.classList.add("fade");
    }, 500); 
}

/**
 * Reset leaderboard
 */
function resetLeaderboard() {
    dispalyAlert("Are you sure you want to reset leaderboard", "OK", () => {
        // Loop through each player
        for (let i = 0; i < game.leaderboardPlayers; i++) {
            // Set game stats to empty
            let gameStats = {};
            localStorage.setItem(`gameStatsPlayer${i}`, JSON.stringify(gameStats));
        }

        // Set players to 0
        game.leaderboardPlayers = 0;

        // Save game
        saveGame();

        // Get tbody
        let tbody = document.querySelector(".leaderboard-tbody");

        // Set innerhtml
        tbody.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Time</th>
            <th>Stats</th>
        </tr>
        `;

        // Get placeholder text
        let placeholder = document.querySelector(".leaderboard-placeholder-text");

        // Add placeholder
        placeholder.classList.remove("remove");
    }, "Cancel", () => {return;});
}

/**
 * Reset leaderboard when button is clicked
 */
let resetLeaderboardBtn = document.querySelector(".leaderboard-reset-btn");

// Add event listener
resetLeaderboardBtn.addEventListener("click", () => {
    resetLeaderboard();
});

/**
 * Update game when monster is clicked
 */
// Define monster variable
const monsterClicker = document.querySelector(".monster-clicker");

// Add event listener for click
monsterClicker.addEventListener("click", () => {
    // Create number on click
    display.createNumberOnClick(event);
    
    // Deal damage to monster when clicked
    game.dealDamage(game.power);
});

/**
 * Attack monster when timing attack btn is clicked
 */
// Define variable
const timingAttackBtn = document.querySelector(".timing-attack-btn");

// Add event listener for click
timingAttackBtn.addEventListener("click", () => {
    // Check if clicked on green area
    display.checkIfClickedGreen();

    // Play hit marker sound
    audio.playHitMarker();
});

/**
 * Place ttt icon when cell is clicked
 */
// Define variables
const tttGameContainer = document.querySelector(".ttt-game-container");

// Add event listener for click
tttGameContainer.addEventListener("click", (e) => {
    // Check if target is a non placed cell
    if (e.target.classList.contains("ttt-cell") && !e.target.classList.contains("placed") && !tttGame.cpuTurn) {
        // Set selected cell
        let selectedCell = e.target;

        // Play players turn
        tttGame.playPlayersTurn(selectedCell);
    }
});

/**
 * Makes an element slowly fade out
 */
function fadeOut(element, duration, finalOpacity, callback) {
    // Opacity starts at 1 and fades until hits final opacity
    let opactiy = 1;
    let elementFadingInterval = window.setInterval(() => {
        // Take away from opacity at 50ms interval
        opactiy -= (1 - finalOpacity)/(duration / 50);

        // Clear when reaches final opacity
        if (opactiy <= finalOpacity) {
            clearInterval(elementFadingInterval);
            callback();
        }

        // Set the opactiy
        element.style.opacity = String(Math.round(opactiy * 100)/ 100);
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
const upgradeTransitionDiv = document.querySelector(".upgrade-transition-div");
const upgradeMenuBtnIcon = document.querySelector(".upgrade-menu-btn-icon");
const coinsContainer = document.querySelector(".coins-container");
const upgradeMenuContentContainer = document.querySelector(".upgrade-menu-content-container");
const upgradeArea = document.querySelector(".upgrade-area");
const overlay = document.querySelector(".overlay");
let upgradeMenuOpen = false;

upgradeMenuBtn.addEventListener("click", () => {
    // Check screen size
    if (window.innerWidth <= 768) {
        // Check if upgrade menu is open
        if (upgradeMenuOpen) {
            // Remove active class
            overlay.classList.toggle("active");
            toggleActiveClassUpgradeMenu();

            // Move coins container
            moveCoinsContainer();

            // Remove transition class
            setTimeout(() => {
                overlay.classList.toggle("transition");

                // Turn upgradeMenuOpen to false
                upgradeMenuOpen = false;
            }, 150);
        } else {
            // Apply transition class to overlay
            overlay.classList.toggle("transition");

            // Apply active class to upgrade menu elements after 0.3s
            setTimeout(() => {
                overlay.classList.toggle("active");
                toggleActiveClassUpgradeMenu();

                // Move coins container
                moveCoinsContainer();

                // Turn upgradeMenuOpen to true
                upgradeMenuOpen = true;
            }, 300);
        }
    } else {
        // Change upgradeMenuOpen
        if (upgradeMenuOpen) {
            upgradeMenuOpen = false;
        } else {
            upgradeMenuOpen = true;
        }
        
        // Move coins container
        moveCoinsContainer();
        
        // Apply active class to save menu elements
        toggleActiveClassUpgradeMenu();
    }
    
    // Remove and replace icon
    setTimeout(() => {
        upgradeMenuBtnIcon.classList.toggle("fa-chevron-left");
        upgradeMenuBtnIcon.classList.toggle("fa-chevron-right");
    }, 150);
});

/**
 * Toggle active class to upgrade menu elements
 */
function toggleActiveClassUpgradeMenu() {
    // Apply active class
    upgradeMenuBtn.classList.toggle("active");
    upgradeMenu.classList.toggle("active");
    upgradeTransitionDiv.classList.toggle("active");
    upgradeMenuBtnIcon.classList.toggle("active");
    coinsContainer.classList.toggle("active");
}

/**
 * Move coins container
 */
function moveCoinsContainer() {
    // Check if upgrade menu is open
    if (upgradeMenuOpen) {
        upgradeMenuContentContainer.insertBefore(coinsContainer, upgradeMenuContentContainer.firstChild);
    } else {
        upgradeArea.appendChild(coinsContainer);
    }
}


/**
 * Purchase upgrade when upgarde button is clicked
 */
// Get btns
const upgradeBtns = document.querySelectorAll(".upgrade-btn");

// Add event listeners to each
upgradeBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        // Purchase upgrade
        upgrades.purchase(index);
    });
});

/**
 * Open and Close Save Menu
 */

// Define variables
const saveMenuBtn = document.querySelector(".save-menu-btn");
const saveMenu = document.querySelector(".save-menu");
const saveTransitionDiv = document.querySelector(".save-transition-div");
const saveMenuBtnIcon = document.querySelector(".save-menu-btn-icon");
const timerContainer = document.querySelector(".timer-container");
const saveMenuContentContainer = document.querySelector(".save-menu-content-container");
const saveArea = document.querySelector(".save-area");
let saveMenuOpen = false;

// Add listener for click
saveMenuBtn.addEventListener("click", () => {
    // Check screen size
    if (window.innerWidth <= 768) {
        // Check if save menu is open
        if (saveMenuOpen) {
            // Remove active class
            overlay.classList.toggle("active");
            toggleActiveClassSaveMenu();

            // Move timer container
            moveTimerContainer();

            // Remove transition class
            setTimeout(() => {
                overlay.classList.toggle("transition");

                // Turn saveMenuOpen to false
                saveMenuOpen = false;
            }, 150);
        } else {
            // Apply transition class to overlay
            overlay.classList.toggle("transition");

            // Apply active class to save menu elements after 0.3s
            setTimeout(() => {
                overlay.classList.toggle("active");
                toggleActiveClassSaveMenu();

                // Move timer container
                moveTimerContainer();

                // Turn saveMenuOpen to true
                saveMenuOpen = true;
            }, 300);
        }
    } else {
        // Change saveMenuOpen
        if (saveMenuOpen) {
            saveMenuOpen = false;
        } else {
            saveMenuOpen = true;
        }

        // Apply active class to save menu elements
        toggleActiveClassSaveMenu();

        // Move timer container
        moveTimerContainer();
    }
    
    // Remove and replace icon
    setTimeout(() => {
        saveMenuBtnIcon.classList.toggle("fa-chevron-left");
        saveMenuBtnIcon.classList.toggle("fa-chevron-right");
    }, 150);
});

/**
 * Toggle active class to save menu elements
 */
function toggleActiveClassSaveMenu() {
    // Apply active class
    saveMenuBtn.classList.toggle("active");
    saveMenu.classList.toggle("active");
    saveTransitionDiv.classList.toggle("active");
    saveMenuBtnIcon.classList.toggle("active");
    timerContainer.classList.toggle("active");
}

/**
 * Move timer container
 */
function moveTimerContainer() {
    // Check if save menu is open
    if (saveMenuOpen) {
        saveMenuContentContainer.insertBefore(timerContainer, saveMenuContentContainer.firstChild);
    } else {
        saveArea.appendChild(timerContainer);
    }
}

/**
 * Save game when save game button is clicked
 */

// Define btn var
const saveGameBtn = document.querySelector(".save-game-btn");

// Add listener for click
saveGameBtn.addEventListener("click", () => {
    // Save game function
    saveGame();
});

/**
 * Save the game when ctrl + s is hit
 */
document.addEventListener("keydown", (event) => {
    // Check if ctrl + s was hit
    if (event.ctrlKey && event.which == 83) {
        event.preventDefault();
        saveGame();
    }
}, false);

/**
 * Save the game every 30 seconds
 */
setInterval (function() {
    saveGame();
}, 30000);

/**
 * Save the game
 */
function saveGame() {
    // Create variables
    var gameSave = {
        leaderboardPlayers: game.leaderboardPlayers,
        totalClicks: game.totalClicks,
        totalCoins: game.totalCoins,
        power: game.power,
        monsterHP: game.monsterHP,
        monsterHealthMax: game.monsterHealthMax,
        monsterCount: game.monsterCount,
        monstersPerLevel: game.monstersPerLevel,
        level: game.level,
        isBossRound: game.isBossRound,
        coins: game.coins,
        coinsToGet: game.coinsToGet,
        coinsAdded: game.coinsAdded,
        time: game.time,
        count: upgrades.count,
        powerIncrease: upgrades.powerIncrease,
        cost: upgrades.cost,
        musicVolume: audio.musicVolume,
        musicToggleOn: musicToggleOn,
        soundEffectVolume: audio.soundEffectVolume,
        seToggleOn: seToggleOn
    };

    // Store variables in local storage as string
    localStorage.setItem("gameSave", JSON.stringify(gameSave));

    // Update display to show saved game
    display.saveGame();
}

/**
 * Load game when window is reloaded
 */
window.onload = function() {
    loadGame();
};

/**
 * Load game save
 */
function loadGame() {
    // Convert game save from string to vars
    var savedGame = JSON.parse(localStorage.getItem("gameSave"));

    // Set game vars to saved game vars
    if (localStorage.getItem("gameSave") !== null) {
        if (typeof savedGame.leaderboardPlayers !== "undefined") game.leaderboardPlayers = savedGame.leaderboardPlayers;
        if (typeof savedGame.totalClicks !== "undefined") game.totalClicks = savedGame.totalClicks;
        if (typeof savedGame.totalCoins !== "undefined") game.totalCoins = savedGame.totalCoins;
        if (typeof savedGame.power !== "undefined") game.power = savedGame.power;
        if (typeof savedGame.monsterHP !== "undefined") game.monsterHP = savedGame.monsterHP;
        if (typeof savedGame.monsterHealthMax !== "undefined") game.monsterHealthMax = savedGame.monsterHealthMax;
        if (typeof savedGame.monsterCount !== "undefined") game.monsterCount = savedGame.monsterCount;
        if (typeof savedGame.monstersPerLevel !== "undefined") game.monstersPerLevel = savedGame.monstersPerLevel;
        if (typeof savedGame.level !== "undefined") game.level = savedGame.level;
        if (typeof savedGame.isBossRound !== "undefined") game.isBossRound = savedGame.isBossRound;
        if (typeof savedGame.coins !== "undefined") game.coins = savedGame.coins;
        if (typeof savedGame.coinsToGet !== "undefined") game.coinsToGet = savedGame.coinsToGet;
        if (typeof savedGame.coinsAdded !== "undefined") game.coinsAdded = savedGame.coinsAdded;
        if (typeof savedGame.time !== "undefined") game.time = savedGame.time;
        if (typeof savedGame.count !== "undefined") {
            for (let i=0; i < savedGame.count.length; i++) {
                upgrades.count[i] = savedGame.count[i];
            }
        }
        if (typeof savedGame.powerIncrease !== "undefined") {
            for (let i=0; i < savedGame.powerIncrease.length; i++) {
                upgrades.powerIncrease[i] = savedGame.powerIncrease[i];
            }
        }
        if (typeof savedGame.cost !== "undefined") {
            for (let i=0; i < savedGame.cost.length; i++) {
                upgrades.cost[i] = savedGame.cost[i];
            }
        }
        if (typeof savedGame.musicVolume !== "undefined") {
            // Change slider text value
            musicSliderValue.textContent = savedGame.musicVolume;

            // Change slider value
            musicSlider.value = savedGame.musicVolume;

            // Update music volume
            audio.updateMusicVolume(savedGame.musicVolume);
        }
        if (typeof savedGame.musicToggleOn !== "undefined") {
            if (!savedGame.musicToggleOn && musicToggleOn) {
                
                // Animate toggle btn
                animateToggleBtn(musicToggleBtn, musicToggle, musicToggleText, musicToggleOn);

                // Change toggle on
                musicToggleOn = switchToggleBool(musicToggleOn);
                
            }
        }
        if (typeof savedGame.soundEffectVolume !== "undefined") {
            // Change slider text value
            seSliderValue.textContent = savedGame.soundEffectVolume;

            // Change slider value
            seSlider.value = savedGame.soundEffectVolume;

            // Change sound effec volume
            audio.soundEffectVolume = savedGame.soundEffectVolume;
        }
        if (typeof savedGame.seToggleOn !== "undefined") {
            if (!savedGame.seToggleOn && seToggleOn) {
                
                // Animate toggle btn
                animateToggleBtn(seToggleBtn, seToggle, seToggleText, seToggleOn);

                // Change toggle on
                seToggleOn = switchToggleBool(seToggleOn);
            }
        }

        // Update displays
        display.updateLevel();
        display.updateMonsterCount();
        display.updateMonsterHP();
        display.updatePower();
        display.updateCoins();
        display.updateTimer("00", "00", "00");
        display.updateUpgradesMenu();
    }
}

/**
 * Reset game when reset game button is clicked
 */

// Define btn var
const resetGameBtn = document.querySelector(".reset-game-btn");

// Add listener for click
resetGameBtn.addEventListener("click", () => {
    // Save game function
    resetGame();
});

/**
 * Reset the game
 */
function resetGame() {
    dispalyAlert("Are you sure you want to reset your game", "OK", () => {
        var gameSave = {
            leaderboardPlayers: game.leaderboardPlayers
        };
        localStorage.setItem("gameSave", JSON.stringify(gameSave));
        location.reload();
        loadGame();
    }, "Cancel", () => {return;});
}

/**
 * Open settings menu when btn is clicked
 */

// Define variables
const settingsBtn = document.querySelector(".settings-btn");
const settingsSection = document.querySelector(".settings-section");
const clickerSection = document.querySelector(".clicker-section");
let settingsWrapperType = "home";

// Add listener for btn click to open menu
settingsBtn.addEventListener("click", () => {
    // Remove play class from clicker section
    clickerSection.classList.remove("play");

    // Add active class to settings section and wrapper
    settingsSection.classList.add("active");
    let settingsWrapper = document.querySelector(`.settings-wrapper-${settingsWrapperType}`);
    settingsWrapper.classList.add("active");

    // Change color if boss round
    if (game.isBossRound) {
        // Change color of background 
        document.documentElement.style.setProperty("--MAIN", "#262626"); 
    }
});

/**
 * Close settings menu when btn is clicked
 */
// Define variables
const closeSettingsMenuBtn = document.querySelector(".close-settings-menu-btn");

// Add listener for btn click to close menu
closeSettingsMenuBtn.addEventListener("click", () => {
    closeSettingsMenu();
});

function closeSettingsMenu() {
    // Remove active class from settings section and wrapper
    settingsSection.classList.remove("active");
    let settingsWrapper = document.querySelector(`.settings-wrapper-${settingsWrapperType}`);
    settingsWrapper.classList.remove("active");

    // Add play class to clicker section
    clickerSection.classList.add("play");

    // Change color if boss round
    if (game.isBossRound) {
        // Change color of background 
        document.documentElement.style.setProperty("--MAIN", "#9d0208"); 
    }
}

/**
 * Return to previous settings wrapper when btn is clicked
 */

// Define variables
const returnSettingsMenuBtn = document.querySelector(".return-settings-menu-btn");

// Add listener for btn click to close menu
returnSettingsMenuBtn.addEventListener("click", () => {
    // Check if 
    if (settingsWrapperType === "home") {
        closeSettingsMenu();
    } else {
        returnToWrapperHome();
    }
});

/**
 * Return the settings menu wrapper to home
 */
function returnToWrapperHome() {
    // Remove active class from wrapper
    let settingsWrapper = document.querySelector(`.settings-wrapper-${settingsWrapperType}`);
    settingsWrapper.classList.remove("active");

    // Add active class to home
    settingsWrapper = document.querySelector(`.settings-wrapper-home`);
    settingsWrapper.classList.add("active");

    // Set settings wrapper type
    settingsWrapperType = "home";
}

/**
 * Set settings wrapper
 */
function setSettingsWrapper(wrapperType) {
    // Set settingsWrapperType
    settingsWrapperType = wrapperType;
    
    // Add active class to settings section and wrapper
    let settingsWrapper = document.querySelector(`.settings-wrapper-${settingsWrapperType}`);
    settingsWrapper.classList.add("active");

    // Remove active class from settings wrapper home
    let settingsWrapperHome = document.querySelector(".settings-wrapper-home");
    settingsWrapperHome.classList.remove("active");
}


/**
 * Open audio settings menu when btn is clicked
 */

// Define variables
const audioSettingsBtn = document.querySelector(".audio-settings-btn");

// Add listener for btn click to open menu
audioSettingsBtn.addEventListener("click", () => {
    setSettingsWrapper("audio");
});

/**
 * Open display settings menu when btn is clicked
 */

// Define variables
const displaySettingsBtn = document.querySelector(".display-settings-btn");

// Add listener for btn click to open menu
displaySettingsBtn.addEventListener("click", () => {
    setSettingsWrapper("display");
});

/**
 * Open secret settings menu when btn is clicked
 */

// Define variables
const secretSettingsBtn = document.querySelector(".secret-settings-btn");

// Add listener for btn click to open menu
secretSettingsBtn.addEventListener("click", () => {
    setSettingsWrapper("secret");
});

/**
 * Toggle music on and off
 */

// Define variables 
const musicToggleBtn = document.querySelector(".music-toggle-btn");
const musicToggle = document.querySelector(".music-toggle");
const musicToggleText = document.querySelector(".music-toggle-text");
let musicToggleOn = true;

// Add event listener for toggle btn
musicToggleBtn.addEventListener("click", () => {
    // Animate toggle btn
    animateToggleBtn(musicToggleBtn, musicToggle, musicToggleText, musicToggleOn);

    // Change toggle on
    musicToggleOn = switchToggleBool(musicToggleOn);

    // Update music
    audio.updateMusic();
});

/**
 * Move toggle btn over
 */
function animateToggleBtn(toggleBtn, toggle, toggleText, toggleOn) {  
    // Get width of toggle
    let toggleWidth = toggle.offsetWidth;

    // Get heigth of toggle
    let toggleHeight = toggle.offsetHeight;

    // Get width of toggle btn
    let toggleBtnWidth = toggleBtn.offsetWidth;

    // Set positionX
    let positionX = 0;

    // Check if toggle is on
    if (toggleOn) {
        // Calculate toggle btn position
        positionX = toggleWidth - (2 * toggleHeight);
        
        // Set btn to position
        toggleBtn.style.left = positionX + "px";

        // Change color of toggle
        toggle.style.backgroundColor = "var(--MINUS-RED)";

        //Change text of toggle
        toggleText.textContent = "OFF";
    } else {
        // Calculate toggle btn position
        positionX = toggleWidth - toggleBtnWidth - (toggleWidth - (2 * toggleHeight));

        // Set btn to position
        toggleBtn.style.left = positionX + "px";

        // Change color of toggle
        toggle.style.backgroundColor = "var(--ADD-GREEN)";

        //Change text of toggle
        toggleText.textContent = "ON";
    }
}

/**
 * Switch Toggle Bool
 */
function switchToggleBool(bool) {
    if (bool) {
        bool = false;
    } else {
        bool = true;
    }
    return bool;
}

/**
 * Change music volume level
 */
// Define variables
const musicSlider = document.querySelector(".music-slider-range");
const musicSliderValue = document.querySelector(".music-slider-value");

// When slider moves 
musicSlider.oninput = () => {
    // Change slider value
    musicSliderValue.textContent = musicSlider.value;

    // Update music volume
    audio.updateMusicVolume(musicSlider.value);
};

/**
 * Toggle sound effects (se) on and off
 */

// Define variables 
const seToggleBtn = document.querySelector(".se-toggle-btn");
const seToggle = document.querySelector(".se-toggle");
const seToggleText = document.querySelector(".se-toggle-text");
let seToggleOn = true;

// Add event listener for toggle btn
seToggleBtn.addEventListener("click", () => {
    // Animate toggle btn
    animateToggleBtn(seToggleBtn, seToggle, seToggleText, seToggleOn);

    // Change toggle on
    seToggleOn = switchToggleBool(seToggleOn);
});

/**
 * Change se volume level
 */

// Define variables
const seSlider = document.querySelector(".se-slider-range");
const seSliderValue = document.querySelector(".se-slider-value");

// When slider moves 
seSlider.oninput = () => {
    // Change slider value
    seSliderValue.textContent = seSlider.value;

    // Change sound effect volume
    audio.soundEffectVolume = seSlider.value;
};

/**
 * Toggle island animation (ia) on and off
 */

// Define variables 
const iaToggleBtn = document.querySelector(".ia-toggle-btn");
const iaToggle = document.querySelector(".ia-toggle");
const iaToggleText = document.querySelector(".ia-toggle-text");
let iaToggleOn = true;

// Add event listener for toggle btn
iaToggleBtn.addEventListener("click", () => {
    // Animate toggle btn
    animateToggleBtn(iaToggleBtn, iaToggle, iaToggleText, iaToggleOn);

    // Check if toggle on
    if (iaToggleOn) {
        iaToggleOn = false;
    } else {
        iaToggleOn = true;

        // Start clicker hover animation
        display.clickerHoverAnimation();
    }
});

/**
 * Toggle number animation (na) on and off
 */

// Define variables 
const naToggleBtn = document.querySelector(".na-toggle-btn");
const naToggle = document.querySelector(".na-toggle");
const naToggleText = document.querySelector(".na-toggle-text");
let naToggleOn = true;

// Add event listener for toggle btn
naToggleBtn.addEventListener("click", () => {
    // Animate toggle btn
    animateToggleBtn(naToggleBtn, naToggle, naToggleText, naToggleOn);

    // Change toggle on
    naToggleOn = switchToggleBool(naToggleOn);
});

/**
 * Toggle monster animation (ma) on and off
 */

// Define variables 
const maToggleBtn = document.querySelector(".ma-toggle-btn");
const maToggle = document.querySelector(".ma-toggle");
const maToggleText = document.querySelector(".ma-toggle-text");
let maToggleOn = true;

// Add event listener for toggle btn
maToggleBtn.addEventListener("click", () => {
    // Animate toggle btn
    animateToggleBtn(maToggleBtn, maToggle, maToggleText, maToggleOn);

    // Change toggle on
    maToggleOn = switchToggleBool(maToggleOn);
});

/**
 * Toggle coin animation (ca) on and off
 */
// Define variables 
const caToggleBtn = document.querySelector(".ca-toggle-btn");
const caToggle = document.querySelector(".ca-toggle");
const caToggleText = document.querySelector(".ca-toggle-text");
let caToggleOn = true;

// Add event listener for toggle btn
caToggleBtn.addEventListener("click", () => {
    // Animate toggle btn
    animateToggleBtn(caToggleBtn, caToggle, caToggleText, caToggleOn);

    // Change toggle on
    caToggleOn = switchToggleBool(caToggleOn);
});

/**
 * Toggle all animations (dea) on and off
 */

// Define variables 
const deaToggleBtn = document.querySelector(".dea-toggle-btn");
const deaToggle = document.querySelector(".dea-toggle");
const deaToggleText = document.querySelector(".dea-toggle-text");
let toggleAnimations = [
    [iaToggleBtn, iaToggle, iaToggleText, iaToggleOn],
    [naToggleBtn, naToggle, naToggleText, naToggleOn],
    [maToggleBtn, maToggle, maToggleText, maToggleOn],
    [caToggleBtn, caToggle, caToggleText, caToggleOn]
];
let deaToggleOn = true;

// Add event listener for toggle btn
deaToggleBtn.addEventListener("click", () => {
    // Animate toggle btn
    animateToggleBtn(deaToggleBtn, deaToggle, deaToggleText, deaToggleOn);

    // Change toggle on
    deaToggleOn = switchToggleBool(deaToggleOn);
    
    // Create objects
    let toggleObj = {
        "iaToggleOn": iaToggleOn,
        "naToggleOn": naToggleOn,
        "maToggleOn": maToggleOn,
        "caToggleOn": caToggleOn
    };

    // Change toggle
    for (let i = 0; i < toggleAnimations.length; i++) {
        // Switch toggle ons
        switch (Object.keys(toggleObj)[i]) {
            case "iaToggleOn":
                if (iaToggleOn !== deaToggleOn) {
                    if (iaToggleOn) {
                        iaToggleOn = false;
                    } else {
                        iaToggleOn = true;
                       
                        // Start clicker hover animation
                        display.clickerHoverAnimation();
                    }
                }
                // Set toggle on
                toggleAnimations[i][3] = iaToggleOn;
                break;
            case "naToggleOn":
                if (naToggleOn !== deaToggleOn) {
                    // Change toggle on
                    naToggleOn = switchToggleBool(naToggleOn);
                }
                // Set toggle on
                toggleAnimations[i][3] = naToggleOn;
                break;
            case "maToggleOn":
                if (maToggleOn !== deaToggleOn) {
                    // Change toggle on
                    maToggleOn = switchToggleBool(maToggleOn);
                }
                // Set toggle on
                toggleAnimations[i][3] = maToggleOn;
                break;
            case "caToggleOn":
                if (caToggleOn !== deaToggleOn) {
                    // Change toggle on
                    caToggleOn = switchToggleBool(caToggleOn);
                }
                // Set toggle on
                toggleAnimations[i][3] = caToggleOn;
                break;
        }
        
        // Animate toggle ons
        if (toggleAnimations[i][3] == deaToggleOn) {
            // Animate toggle on
            animateToggleBtn(toggleAnimations[i][0], toggleAnimations[i][1], toggleAnimations[i][2], !toggleAnimations[i][3]);
        }
    }
});

/**
 * Enter and check password guess to cheats
 * Unlock or display error message
 */

// Define variables
const cheatPassword = "distinctiondillon123";
const cheatPasswordInput = document.querySelector(".cheat-password-input");
const passwordText = document.querySelector(".secret-settings-text");
const cheatPasswordBtn = document.querySelector(".cheat-password-btn");
const cheatPasswordBtnIcon = document.querySelector(".cheat-password-btn-icon");
let correctCheatPasswordEntered = false;
let passwordTextWord1 = "";
let passwordTextWord2 = "";
let delayPerLetter = 400;
let passwordTextStartDelay = 250;
let passwordTextCursorDelay = 500;
let cheatPasswordGuessDelay = 0;


// Add event listener for cheat password btn
cheatPasswordBtn.addEventListener("click", () => {
    // Check if cheats are enabled
    if (correctCheatPasswordEntered) {
        // Open cheats settings menu
        openCheatSettingsMenu();

        return;
    }
    
    // Get value of input
    let passwordGuess = cheatPasswordInput.value;
    
    // Check if password is correct
    if (passwordGuess === cheatPassword) {
        cheatPasswordCorrect();
    } else {
        cheatPasswordIncorrect();
    }

    cheatPasswordInput.value = "";
});

/**
 * Change password btn
 * Change password text
 * Open cheat settings content
 */
function cheatPasswordCorrect() {
   // Change correctCheatPasswordEntered
   correctCheatPasswordEntered = true;

   // Set passwordText Words
   passwordTextWord1 = "Correct!";
   passwordTextWord2 = "Cheats Enabled!";

   // Get length of words
   let wordsLength = passwordTextWord1.length + passwordTextWord2.length;

   // Set delay
   cheatPasswordGuessDelay = (wordsLength * delayPerLetter) + passwordTextStartDelay;
       
    // Change btn icon by removeing and adding class
    cheatPasswordBtnIcon.classList.remove("fa-lock");
    cheatPasswordBtnIcon.classList.add("fa-lock-open");

    // Change placeholder text
    cheatPasswordInput.type = "text";
    cheatPasswordInput.placeholder = "Click Lock"; 

   // Update password text
   updateCheatPasswordText("correct");
}

function cheatPasswordIncorrect() {
    // Set passwordText Words
    passwordTextWord1 = "Incorrect!";
    passwordTextWord2 = "Try Again!";
 
    // Get length of words
    let wordsLength = passwordTextWord1.length + passwordTextWord2.length;
 
    // Set delay
    cheatPasswordGuessDelay = (wordsLength * delayPerLetter) + passwordTextStartDelay;
 
    // Update password text
    updateCheatPasswordText("incorrect");
 }

/**
 * Updates the password text by correct or incorrect guess
 */
function updateCheatPasswordText(passwordState) {
    // Clear text
    passwordText.innerHTML = `
    <div class="cheat-password-text-letters"></div>
    <div class="cheat-password-text-cursor"></div>
    `;

    // Get cursor
    let passwordTextCursor = document.querySelector(".cheat-password-text-cursor");

    // Get letters
    let passwordTextLetters = document.querySelector(".cheat-password-text-letters");

    // Check if correct or incorrect add class
    if (passwordState === "correct") {
        passwordTextLetters.classList.add("correct");
    } else {
        passwordTextLetters.classList.add("incorrect");
    }

    setTimeout(() => {
        // Set duration
        let duration = cheatPasswordGuessDelay - passwordTextStartDelay;

        // Create arrays for words
        let arr1 = passwordTextWord1.split("");
        let arr2 = passwordTextWord2.split("");
        let startArr2 = false;

        // Create interval for cursor
        let cursorInterval = window.setInterval(() => {
            // Clear interval when duration is 0
            if (duration <= delayPerLetter) {
                clearInterval(cursorInterval);
            }

            // Flash cursor
            passwordTextCursor.classList.toggle("active");
        }, passwordTextCursorDelay);


        // Create interval to update letters
        let letterInterval = window.setInterval(() => {
            // Clear interval when duration is 0
            if (duration <= delayPerLetter) {
                passwordText.innerHTML = "Password:";
                clearInterval(letterInterval);
            }

            // Check arr1 length
            if (startArr2) {
                // Get letter
                let letter = arr2.shift();
            
                // Add letter to display
                passwordTextLetters.textContent += letter;
            } else {
                // Get letter
                let letter = arr1.shift();
            
                // Add letter to display
                passwordTextLetters.textContent += letter;
            }

            // Check if arr1 is empty
            if (arr1.length <= 0 && !startArr2) {
                setTimeout(() => {
                    passwordTextLetters.textContent = "";
                    startArr2 = true;
                }, (delayPerLetter - 50));
            }

            duration -= delayPerLetter;
        }, delayPerLetter);
    }, passwordTextStartDelay);
}

/**
 * Open cheats settings menu
 */
function openCheatSettingsMenu() {
    setSettingsWrapper("cheat");
    removeSecretSettingsWrapper();
}

/**
 * Remove secret settings wrapper
 */
function removeSecretSettingsWrapper() {
   // Remove active class from settings wrapper secret
   let settingsWrapperHome = document.querySelector(".settings-wrapper-secret");
   settingsWrapperHome.classList.remove("active"); 
}

/**
 * Change monsters per level (mpl) slider
 */
// Define variables
const mplSlider = document.querySelector(".mpl-slider-range");
const mplSliderValue = document.querySelector(".mpl-slider-value");

// When slider moves 
mplSlider.oninput = () => {
    // Change slider value
    mplSliderValue.textContent = mplSlider.value;
};

/**
 * Toggle easy game (eg) on and off
 */
// Define variables 
const egToggleBtn = document.querySelector(".eg-toggle-btn");
const egToggle = document.querySelector(".eg-toggle");
const egToggleText = document.querySelector(".eg-toggle-text");
let egToggleOn = false;

// Add event listener for toggle btn
egToggleBtn.addEventListener("click", () => {
    // Animate toggle btn
    animateToggleBtn(egToggleBtn, egToggle, egToggleText, egToggleOn);

    // Change toggle on
    egToggleOn = switchToggleBool(egToggleOn);
});

/**
 * Change game when cheats are enabled
 */
// Define variables
const cheatChangeBtn = document.querySelector(".cheat-change-btn");

// Add event listener for change btn
cheatChangeBtn.addEventListener("click", () => {
    // Get all cheat values and replace game values
    changeCheatSettings();
});

/**
 * Get all cheat values and replace game values
 */
function changeCheatSettings() {
    // Get all cheat values
    // Power
    let cheatPower = Number(document.querySelector(".power-cheat-setting-input").value);
    if (cheatPower == 0) {
        cheatPower = 1;
    }
    // Monsters per level
    let cheatMonstersPerLevel = Number(document.querySelector(".mpl-slider-range").value);
    // Coins per monster
    let cheatCoinsPerMonster = Number(document.querySelector(".coins-cheat-setting-input").value);
    if (cheatCoinsPerMonster == 0) {
        cheatCoinsPerMonster = 10;
    }

    // Replace all game values with cheat values
    game.power = cheatPower;
    game.monstersPerLevel = cheatMonstersPerLevel;
    game.coinsToGet = cheatCoinsPerMonster;
    game.coinsAdded = cheatCoinsPerMonster;
    
    // Update display
    display.updatePower();
    display.updateMonsterCount();
    
    // Close settings menu
    closeSettingsMenu();
}

/**
 * Display alert message
 */
function dispalyAlert(message, btn1, btn1Function, btn2, btn2Function) {
	// Define vars
	let alertSection = document.querySelector(".alert-section");
	let alertText = document.querySelector(".alert-text");
	let alertBtn1 = document.querySelector(".alert-btn1");
	let alertBtn2 = document.querySelector(".alert-btn2");
	
	// Check if 2 buttons
	if (arguments.length <= 4) {
		alertBtn2.classList.add("remove");
	} else {
		// Set btn 2
		alertBtn2.innerText = btn2;

		// Call function when clicked
		alertBtn2.addEventListener("click", () => {
			btn2Function();
			
			// Close alert
			alertSection.classList.remove("active");
		});
	}

	// Set text
	alertText.innerText = message;

	// Set btn 1
	alertBtn1.innerText = btn1;

	// Display section
	alertSection.classList.add("active");

	// Call function when clicked
	alertBtn1.addEventListener("click", () => {
		btn1Function();

		// Close alert
		alertSection.classList.remove("active");
	});
}