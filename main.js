
//intitialize variables
let cards = [];
let suits = ['hearts', 'diamonds', 'spades', 'clubs'];
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0; // round score player
let dealerScore = 0; // round score dealer
let pHandVal = 0; // current hand value player
let dHandVal = 0; // current hand value dealer
let playerWins = 0;
let dealerWins = 0;
let playerBust = false;
let dealerBust = false;
let playerBlackjack = false;
let dealerBlackjack = false;
let playerStand = false;
let dealerStand = false;
let playerBustMessage = "Oh no you're bust!";
let dealerBustMessage = "Dealer is bust!";
let playerBlackjackMessage = "You got blackjack!";
let dealerBlackjackMessage = "Dealer got blackjack!";
let playerWinMessage = "You win!";
let dealerWinMessage = "Dealer wins!";
let target = true;
let deckVal = false;
let shuffled = false;
let dealt = false;
//CSS

    //setup event listeners to style buttons
    $('.button').on('mouseover', function() {
        //change color
        $(this).css('background-color', '#DDA74F');
        $(this).css('color', '#272A31');
    });
    
    $('.button').on('mouseout', function() {
        //change color
        $(this).css('background-color', '#181B22');
        $(this).css('color', '#DDA74F');
    });


//setup function
    function setup() {
        createDeck();
    }

//menu function

    //button functions
    $('#newGame').on('click', function() {
        //change menu item based on choice
        let newGame = $("<div>");
        newGame.addClass("gameBoard");
        $(".menu").after(newGame)

        $("#hit").removeClass("disabled").addClass("button");
        $("#stay").removeClass("disabled").addClass("button");
        $("#deal").removeClass("disabled").addClass("button");
        $("#newGame").removeClass("button").addClass("disabled");
        $("#rules").removeClass("button").addClass("disabled");
        $("#credits").removeClass("button").addClass("disabled");
        
        //start game
        setup();
    });

    $('#rules').on('click', function() {
        console.log('works')
        let rules = $("<p>");
        rules.html("The goal is to, using the cards you are dealt, get as close to 21 as possible.<br>The cards are dealt in a random order, and you can choose to hit or stay.");
        $(".menu").after(rules)
    });

    $('#credits').on('click', function() {
        let credits = $("<div>");
        credits.addClass("credits");
        $(".menu").after(credits)
    });

//game function
    function game() { 
        if (target === true) { //true is player, false is dealer
            //player turn
            if (playerStand === false) {
                hit();
                $("#playerHand").append(playerHand.suit + " " + playerHand.value);
                target = false;
            } else { //dealer turn
                dealer();
                target = true;
            }
            //round over
        }
        if (playerStand === true && dealerStand === true) {
            for (let i = 0; i < playerHand.length; i++) {
                pHandVal += playerHand[i].value;
            }
            for (let i = 0; i < dealerHand.length; i++) {
                dHandVal += dealerHand[i].value;
            }

            if (pHandVal > 21) {
                playerBust = true;
                dealerScore++;
                roundOver();
            }
            if (dHandVal > 21) {
                dealerBust = true;
                playerScore++;
                roundOver();
            }
            if (pHandVal === 21) {
                playerBlackjack = true;
                $("#playerHand").append(playerBlackjackMessage);
                playerScore++;
                roundOver();
            }
            if (dHandVal === 21) {
                dealerBlackjack = true;
                $("#dealerHand").append(dealerBlackjackMessage);
                dealerScore++;
                roundOver();
            }
            if (pHandVal > dealerScore) {
                playerWins++;
                $("#playerHand").append(playerWinMessage);
                roundOver();
            }
            if (dHandVal > playerScore) {
                dealerWins++;
                $("#dealerHand").append(dealerWinMessage);
                roundOver();
            }
        }
    }

//round over, to next round
    function roundOver() { // reset
        playerHand = [];
        dealerHand = [];
        playerStand = false;
        dealerStand = false;
        playerBust = false;
        dealerBust = false;
        playerBlackjack = false;
        dealerBlackjack = false;
        pHandVal = 0;
        dHandVal = 0;
        target = true;

        createDeck();
        shuffleDeck();
    }

//game over function
    function gameOver() {
        $("#hit").removeClass("button").addClass("disabled");
        $("#stay").removeClass("button").addClass("disabled");
        $("#deal").removeClass("button").addClass("disabled");
        $("#newGame").removeClass("disabled").addClass("button");
        $("#rules").removeClass("disabled").addClass("button");
        $("#credits").removeClass("disabled").addClass("button");
        playerScore = 0;
        dealerScore = 0;
    }

//card logic

    //create deck
    function createDeck() {
        /* suits: 4
           point values: ace = 1 or 11, numbers = 2-10, face cards = 10 */
        for (let suit in suits) { // loop through suits
            for (let i = 1; i < 14; i++) { // for each suit, loop through numbers
                let card = {
                    suit: suits[suit],
                    value: i
                }
                deck.push(card);
            }
        };

        for (let card in deck) { //check face cards and assign appropriate point value
            if (deck[card].value === 11) {
                deck[card].value = 10;
            }
            if (deck[card].value === 12) {
                deck[card].value = 10;
            }
            if (deck[card].value === 13) {
                deck[card].value = 10;
            }
            if (deck[card].value === 14) {
                deck[card].value = 10;
            }
        };

        if (deck.length === 52) {
            console.log("Deck created");
            deckVal = true;
        }

        if (deckVal === true) {
            shuffleDeck();
        }
        
    };

    //make sure deck values are randomized
    function shuffleDeck() {
        for (let i = 0; i < deck.length; i++) {
            let random = Math.floor(Math.random() * deck.length);
            let current = deck[i];
            deck[i] = deck[random];
            deck[random] = current;
        };
        shuffled = true;
        console.log("Deck shuffled");
        if (shuffled === true) {
            deal();
        }
    };

    //deal cards
    function deal() {
        let totalCards = 0;
        if (playerHand.length < 2 && totalCards < 4) {
            let card = deck.pop();
            playerHand.push(card);
            totalCards++;
        }
        if (dealerHand.length < 2 && totalCards < 4) {
            let card = deck.pop();
            dealerHand.push(card);
            totalCards++;
        };
        let pH = $('<p>')
        let dH = $('<p>')
        console.log(playerHand, dealerHand)
        console.log(deck)
        pH.html(playerHand[0].suit + " " + playerHand[0].value);
        //pH.html(playerHand[1].suit + " " + playerHand[1].value);
        dH.html(dealerHand[0].suit + " " + dealerHand[0].value);
        //dH.html(dealerHand[1].suit + " " + dealerHand[1].value);
        $("#playerCards").append(pH);
        $("#dealerCards").append(dH);
        dealt = true;
        if (dealt === true) {
            game();
        }
    };

    //hit
    function hit() {
        let card = deck.pop();
        playerHand.push(card);
    }

    //stand
    function stand() {
        playerStand = true;
    }

//dealer logic
    function dealer() {

        if (dealerHand.length === 2) {
            if (dealerHand[0].value + dealerHand[1].value < 17) {
                let card = deck.pop();
                dealerHand.push(card);
            } else if (dealerHand[0].value + dealerHand[1].value === 17) {
                dealerStand = true;
            }
        }
    }
