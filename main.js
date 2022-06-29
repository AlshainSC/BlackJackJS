
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
let pVal = $('#pScore');
let dVal = $('#dScore');
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
        $("#deal").removeClass("disabled").addClass("button");
        $("#newGame").removeClass("button").addClass("disabled");
        $("#rules").removeClass("button").addClass("disabled");
        $("#credits").removeClass("button").addClass("disabled");
        let dealCards = $("<h2>");
        dealCards.html("New Game!  Deal two cards to start!");
        $(".header").append(dealCards);
        
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

    $("#deal").on('click', function() {
        deal();

        let pH = $('<p>')
        let dH = $('<p>')
        for (let i = 0; i < playerHand.length; i++) {
//update html to reflect dealt cards
//this logic was pushed from the deal() function 
//keep this in mind for hit() and stay() etc...
            pH.html(playerHand[i].suit + " " + playerHand[i].value); 
            
            dH.html(dealerHand[i].suit + " " + dealerHand[i].value);
            
            $("#playerCards").append(pH);
            $("#dealerCards").append(dH);
            
        }
        
        if (playerHand.length === 2) {
//remove deal button when each player has two cards in hand
            pHandVal = playerHand[0].value + playerHand[1].value;
            dHandVal = dealerHand[0].value + dealerHand[1].value;

            $("#deal").removeClass("button").addClass("disabled");
            $("#hit").removeClass("disabled").addClass("button");
            $("#stay").removeClass("disabled").addClass("button");
            $(".header h2").replaceWith("<h2>Your turn!</h2>");
        };
        game();
    });

    $("#hit").on('click', function() {
        //hit logic
        hit();
        let _hit = $('<p>');
        _hit.html(playerHand[playerHand.length - 1].suit + " " + playerHand[playerHand.length - 1].value);
        $("#playerCards").append(_hit);
        
    });

    $("#stay").on('click', function() {
        
        $("#hit").removeClass("button").addClass("disabled");
        $("#stay").removeClass("button").addClass("disabled");
        $(".header h2").replaceWith("<h2>Dealer's turn!</h2>");
        stand();
        
    
    });

//game function
    function game() {
        
        if (target === false) {
            console.log(dHandVal)
            //$(".header h2").replaceWith("<h2>Dealer's turn!</h2>");
            dealer();

        } else {
            if (playerStand === true && dealerStand === true) {
                
                console.log('entered else if')
                $(".header h2").replaceWith("<h2>Round Over</h2>");
                winConditions();
            }
        }
        updateScores();
    };

    function winConditions() {
        
        let win = $("<h2>")
        console.log("wincon loop has started")
        console.log(pHandVal, dHandVal)
        if (pHandVal > 21) {
            win.html(dealerWinMessage);
            dealerWins++;
            $(".header h2").replaceWith(win);
        } else if (dHandVal > 21) {
            win.html(playerWinMessage);
            playerWins++;
            $(".header h2").replaceWith(win);
        } else if (pHandVal > 21 && dHandVal > 21) {
            win.html("You're both bust!");
            $(".header h2").replaceWith(win);
        } else if (pHandVal < dHandVal) {
            win.html(dealerWinMessage);
            dealerWins++;
            $(".header h2").replaceWith(win);
        } else if (pHandVal > dHandVal) {
            win.html(playerWinMessage);
            playerWins++;
            $(".header h2").replaceWith(win);
        } else {
            win.html("<h2>It's a tie!</h2>");
            $(".header h2").replaceWith(win);
        }
    };

    function updateScores() {
        //referencing https://github.com/jacquelynmarcella/blackjack/blob/master/blackjack.html
        //line 69 && associated logic
        //Was having a difficult time getting scores to update on button press, without adding multiplicatively.
        //Initial attempts at logic remain commented out below.
        $(pVal).text("Current Hand Value: " + pHandVal);
        $(dVal).text("Current Hand Value: " + dHandVal);


        /*pHandVal = 0;
        dHandVal = 0;

        let pVal = $('<p>');
        let dVal = $('<p>');

        for (let i = 0; i < playerHand.length; i++) {
            
            pHandVal += playerHand[i].value;
            
        };
        for (let i = 0; i < dealerHand.length; i++) {
            
            dHandVal += dealerHand[i].value;
        
        }; 

        pVal.html(`<h3>Hand Value: ${pHandVal}`)
        dVal.html(`<h3>Hand Value: ${dHandVal}`)
        $("#pScore").replaceWith(pVal);
        $("#dScore").replaceWith(dVal);*/

    };

//round over, to next round
    function roundOver() {
//reset variables
//potentially better as a separate function
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

        setup();
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
// reference material for this and shuffle function: https://www.programiz.com/javascript/examples/shuffle-card 
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

        for (let card in deck) { 
//check face cards and assign appropriate point value
//assign face cards with appropriate names: Jack, Queen, King, Ace(?)
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
        game();
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

    };

    //hit
    function hit() {
        if (pHandVal < 21) {
            let card = deck.pop();
            playerHand.push(card);
            pHandVal += card.value;
            $("#playerCards").append(card)
            game();
        } else {
            winConditions();
        }
    }

    //stand
    function stand() {
        playerStand = true;
        target = false;
        game();
    }

//dealer logic
    function dealer() {
        console.log('entered dealer loop')

        if (dHandVal < 17) {
            setTimeout(function() {
                let card = deck.pop();
                dealerHand.push(card);
                let _hit = $("<p>");
                _hit.html(dealerHand[dealerHand.length - 1].suit + " " + dealerHand[dealerHand.length - 1].value);
                $("#dealerCards").append(_hit);
                $(".header h2").replaceWith("<h2>Dealer Hits</h2>");
                dHandVal += card.value;
                game();
            }, 1500);
        } else if (dHandVal > 21) {
            setTimeout(function() {
                winConditions();
            }, 1000);
        } else {
            setTimeout(function() {
                dealerStand = true;
                $(".header h2").replaceWith("<h2>Dealer Stands</h2>");
                winConditions();
            }, 1000);
        }

    };
