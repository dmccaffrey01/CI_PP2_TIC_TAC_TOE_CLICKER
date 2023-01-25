/**
 * Play Clicker Game
 */

var game = {
    // Store data on variables
    power: 10000,
    monsterHP: 10,
    monsterHealthMax: 10,
    monsterCount: 0,
    monstersPerLevel: 3,
    level: 1,
    bossRounds: [5, 10, 15, 20, 25, 30],
    isBossRound: false,
    coins: 0,
    coinsToGet: 500,
    coinsAdded: 0,
    isMonsterDead: false,
    newMonsterDelay: 0,
    time: 0,
    interval: null,

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
        // Create and add coins to display
        this.createCoins();

        // Update kill monster
        display.monsterKilled();

        // Update Monster HP
        display.updateMonsterHP();

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

            } else {
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

    /**
     * Add on the coins, update the display
     * and create coins to display
     */
    addCoins: function() {
        // Add coins to get to coins
        this.coins += game.coinsAdded;

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
            return
        }
        
        // Create interval for timer
        this.interval = setInterval(() => {
            this.timer();
        }, 1000);
    }
}

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
        1,
        2,
        3
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
            return
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

            // Change buy upgrades delay
            this.buyUpgradeDelay = true;
        }
    }
}


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

        // Update displays
        this.updateLevel();
        this.updateMonsterCount();
        this.updateMonsterHP();
        this.updatePower();
        this.updateCoins();
        this.updateTimer("00", "00", "00");
        this.updateUpgradesMenu();

        // Create new island and monster
        this.newIsland();
        this.createNewMonster();

        // Start clicker hover animation
        this.animationOn = true;
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
            if (!this.animationOn) {
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
        }, 1000)
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
            // Create number of addedPower after 0.1s
            let number = document.createElement("div");
            
            // Add class to number
             number.classList.add("power-number", "unselectable");
                
            // Add text
            number.textContent = "+" + addedPower;

            // Get power container
            let powerNumber = document.querySelector(".power-count-number")
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
            })
        }
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
        })
    },

    /**
     * Create cost number when upgrade is bought
     */
    createCostNumber: function(index) {
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
        })
    },

    /**
     * Create count number when upgrade is bought
     */
    createCountNumber: function(index) {
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
       })
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
        let upgradeNameBar = upgradeNameBars[index];

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
        }, 10)
    },

    /**
     * Transition the island from 1 background to the next
     */
    transitionIsland: function() {
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
            // Remove interval if element is removed
            if (typeof element == "undefined" && element == null) clearInterval(movementInterval);

            position.y--;
            element.style.top = position.y + "px";
        }, 10);

        // Slowly fade out
        fadeOut(element, 2000, 0.2, function() {
            element.remove();
        })
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
     * Animate deal damage to monster
     */
    dealDamageAnimation: function() {
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
                imgIndex = 0
            } else {
                imgIndex++;
            }

            // Set new image to index + 1
            coin.src = `./assets/images/coins/${this.coinImages[imgIndex]}`

            // Clear interval when duration is 0
            if (duration <= 0) {
                clearInterval(coinAnimatingInterval);
            }
        }, 120)
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
            }

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
            })
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
        })
    }
}

/**
 * Start the game when play btn is clicked
 */
// Define playBtn var
const playBtn = document.querySelector(".play-btn");

// Add event listener for click
playBtn.addEventListener("click", () => {
    // Load the game
    loadGame();
    
    // Start display functions
    display.startGame();

    // Start game functions
    game.startGame();
})

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
})

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
                overlay.classList.toggle("transition")

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
            }, 300)
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
})

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
                overlay.classList.toggle("transition")

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
            }, 300)
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
})

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
})

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
        isMonsterDead: game.isMonsterDead,
        newMonsterDelay: game.newMonsterDelay,
        time: game.time,
        count: upgrades.count,
        powerIncrease: upgrades.powerIncrease,
        cost: upgrades.cost
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
}

/**
 * Load game save
 */
function loadGame() {
    // Convert game save from string to vars
    var savedGame = JSON.parse(localStorage.getItem("gameSave"));

    // Set game vars to saved game vars
    if (localStorage.getItem("gameSave") !== null) {
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
        if (typeof savedGame.isMonsterDead !== "undefined") game.isMonsterDead = savedGame.isMonsterDead;
        if (typeof savedGame.newMonsterDelay !== "undefined") game.newMonsterDelay = savedGame.newMonsterDelay;
        if (typeof savedGame.time !== "undefined") game.time = savedGame.time;
        if (typeof savedGame.interval !== "undefined") game.interval = savedGame.interval;
        if (typeof savedGame.count !== "undefined") {
            for (i=0; i < savedGame.count.length; i++) {
                upgrades.count[i] = savedGame.count[i];
            }
        };
        if (typeof savedGame.powerIncrease !== "undefined") {
            for (i=0; i < savedGame.powerIncrease.length; i++) {
                upgrades.powerIncrease[i] = savedGame.powerIncrease[i];
            }
        };
        if (typeof savedGame.cost !== "undefined") {
            for (i=0; i < savedGame.cost.length; i++) {
                upgrades.cost[i] = savedGame.cost[i];
            }
        };
    }
}

/**
 * Save game when save game button is clicked
 */

// Define btn var
const resetGameBtn = document.querySelector(".reset-game-btn");

// Add listener for click
resetGameBtn.addEventListener("click", () => {
    // Save game function
    resetGame();
})

/**
 * Reset the game
 */
function resetGame() {
    if (confirm("Are you sure you want to reset your game")) {
        var gameSave = {}
        localStorage.setItem("gameSave", JSON.stringify(gameSave));
        location.reload();
        loadGame();
    }
}



