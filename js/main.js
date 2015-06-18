(function() {
    /*jslint browser: true, devel: true */
    'use strict';

    /**
     * Randomize array element order in-place.
     * Using Fisher-Yates shuffle algorithm.
     * http://stackoverflow.com/a/12646864
     */
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    function pickRandom(someArray, amount) {
        var indices = [];
        var result = [];
        for(i=0; i<someArray.length; i++) {
            indices.push(i)
        }
        indices = shuffleArray(indices).slice(0, amount)
        for (var i = 0; i < indices.length; i++) {
            result.push(someArray[indices[i]])
        }
        return result;
    }

    var i;
    var flagsToUse = [];
    var flagsToUseDouble = [];
    var flagBackside = '<div class="flag backside"></div>';
    var flagFinland = '<div class="flag Finland"><div class="hor"></div><div class="ver"></div></div>';
    var flagSweden = '<div class="flag Sweden"><div class="hor"></div><div class="ver"></div></div>';
    var flagDenmark = '<div class="flag Denmark"><div class="hor"></div><div class="ver"></div></div>';
    var flagJapan = '<div class="flag Japan"><div class="circle"></div>';
    var flagCzech = '<div class="flag Czech"><div class="red"></div><div class="triangle"></div></div>';
    var flagBangladesh = '<div class="flag Bangladesh"><div class="circle"></div>';
    var flagPoland = '<div class="flag Poland"><div class="red"></div></div>';
    var flagUkraine = '<div class="flag Ukraine"><div class="yellow"></div></div>'
    var possibleFlags = [flagFinland, flagSweden, flagDenmark, flagJapan, flagCzech, flagBangladesh, flagPoland, flagUkraine];


    //Array of possible flags x2, shuffled randomly
    //each element in array is actually html code
    //They can now be mapped to tiles
    flagsToUse = pickRandom(possibleFlags, 6)
    flagsToUseDouble = flagsToUse.concat(flagsToUse)
    flagsToUseDouble = shuffleArray(flagsToUseDouble);

    var flagsOnGamefield = [];
    var previousCard = null;
    var frozenGamefield = false;
    var playerClicks = 0;
    var matchesFound = 0;
    var allMatches = 0;
    var minPossible = 0;

    var tiles = document.getElementsByClassName("tile");

    function FlagObject(sourcecode) {
        //I'm an object constructor.
        this.sourcecode = sourcecode;
        this.clickable = true; //turn off when match found
        this.DOMelement = "";
        this.flipFaceDown = function() {
            this.DOMelement.innerHTML = flagBackside;
            this.visible = false;
        };
        this.flipFaceUp = function() {
            this.DOMelement.innerHTML = sourcecode;
            this.visible = true;
        };
    }

    function checkMatch(card) {
        //compare!
        if (previousCard.sourcecode === card.sourcecode) {
            console.log("match!");
            matchesFound = matchesFound + 1;
            document.getElementById("matchesFound").textContent = matchesFound;
            if (matchesFound == allMatches) {
                activateOverlay();
            }
            card.DOMelement.classList.add("fade");
            previousCard.DOMelement.classList.add("fade");
            previousCard.clickable = false;
            card.clickable = false;
            previousCard = null;
        } else {
            console.log("no match!");
            frozenGamefield = true;
            console.log("gamefield frozen");
            setTimeout(function() {
                frozenGamefield = false;
                card.flipFaceDown();
                previousCard.flipFaceDown();
                previousCard = null;
                console.log("gamefield unfrozen");
            }, 2000);
        }
    }

    function addClickEvents(card) {
        card.DOMelement.addEventListener("click", function() {
            if (frozenGamefield === true) {
                return;
            }
            if (card.visible === true) {
                return;
            }
            if (card.clickable === false) {
                return;
            }
            card.flipFaceUp();
            playerClicks = playerClicks + 1;
            document.getElementById("playerClicks").textContent = playerClicks;
            if (previousCard === null) {
                previousCard = card;
            } else {
                //compare!
                checkMatch(card);
            }
        }, false);
    }

    function playGame(cards) {
        for (i = 0; i < cards.length; i++) {
            addClickEvents(cards[i]);
        }

    }

    for (i = 0; i < flagsToUseDouble.length; i++) {
        //generate an item for every possible flag
        flagsOnGamefield.push(new FlagObject(flagsToUseDouble[i]));
        //the minimum number of moves to win:
        minPossible = flagsOnGamefield.length;
        allMatches = (flagsOnGamefield.length) / 2;
        document.getElementById("allMatches").textContent = allMatches;
    }

    for (i = 0; i < tiles.length; i++) {
        //draw item in every tile;
        flagsOnGamefield[i].DOMelement = tiles.item(i);
        flagsOnGamefield[i].flipFaceDown();
    }


    playGame(flagsOnGamefield);

    var cardsToConsole = document.getElementById('cardsToConsole');
    cardsToConsole.onclick = function() {
        for (i = 0; i < tiles.length; i++) {
            console.log(flagsOnGamefield[i].DOMelement, flagsOnGamefield[i].sourcecode);
        }
    };

    function activateOverlay() {
        console.log("overlay active");
        var overlayAll = document.getElementById("overlayAll");
        overlayAll.style.display = "initial";
    }


    document.getElementById('activateOverlay').onclick = function() {
        activateOverlay();
    };

})();
