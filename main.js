
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
        game();
    }

//menu function

    //button functions
    $('#newGame').on('click', function() {
        //change menu item based on choice

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
                    $("#deal").removeClass("button").addClass("disabled");
                    pHandVal = playerHand[0].value + playerHand[1].value;
                    
                };
            });

            $("#hit").on('click', function() {
                //hit logic
                hit();
                let _hit = $('<p>');
                _hit.html(playerHand[playerHand.length - 1].suit + " " + playerHand[playerHand.length - 1].value);
                $("#playerCards").append(_hit);
                pHandVal += playerHand[playerHand.length - 1].value;

                game();
                
            });

            $("#stay").on('click', function() {
                stand();
                $("#hit").removeClass("button").addClass("disabled");
                $("#stay").removeClass("button").addClass("disabled");
                $("#deal").removeClass("button").addClass("disabled");

                
                game();
            
            });

        } else if (target === false) {
            
            dealer();
            updateScores();
        } 
        if (playerStand === true && dealerStand === true) {
            winConditions();
        }
    };

    function winConditions() {
        let win = $("<p>");
        let dWin = $("<p>");
        console.log("wincon loop has started")
        if (pHandVal > 21) {
            playerBust = true;
        }
        if (dHandVal > 21) {
            dealerBust = true;
        }
        if (pHandVal === 21) {
            playerBlackjack = true;
        }
        if (dHandVal === 21) {
            dealerBlackjack = true;
        }
        if (playerBust === true) {
            win.html(playerBustMessage);
        }
        if (dealerBust === true) {
            dWin.html(dealerBustMessage);
        }
        if (playerBlackjack === true) {
            win.html(playerBlackjackMessage);
        }
        if (dealerBlackjack === true) {
            dWin.html(dealerBlackjackMessage);
        }
        if (playerBust === true && dealerBust === true) {
            win.html(playerBustMessage);
            dWin.html(dealerBustMessage);
            $("playerCards").append(win);
            $("dealerCards").append(dWin);
        }
        if (playerBlackjack === true && dealerBlackjack === true) {
            win.html(playerBlackjackMessage);
            dWin.html(dealerBlackjackMessage);
            $("playerCards").append(win);
            $("dealerCards").append(dWin);
        }
        if (playerBust === true && dealerBlackjack === true) {
            win.html(playerBustMessage);
            dWin.html(dealerBlackjackMessage);
            $("playerCards").append(win);
            $("dealerCards").append(dWin);
        }
        if (playerBlackjack === true && dealerBust === true) {
            win.html(playerBlackjackMessage);
            dWin.html(dealerBustMessage);
            $("playerCards").append(win);
            $("dealerCards").append(dWin);
        }
        if (pHandVal > dHandVal && playerBust === false) {
            win.html(playerWinMessage);
            $("playerCards").append(win);
        }
        if (dHandVal > pHandVal && dealerBust === false) {
            dWin.html(dealerWinMessage);
            $("dealerCards").append(dWin);
        }
    }

    function updateScores() {
        let pVal = $('<p>');
        let dVal = $('<p>');

        /*for (let i = 0; i < playerHand.length; i++) {
            
            pHandVal += playerHand[i].value;
            
        }; */

        for (let i = 0; i < dealerHand.length; i++) {
            
            dHandVal += dealerHand[i].value;
        
        }; 

        pVal.html(`<h3>Score: ${pHandVal}`)
        dVal.html(`<h3>Score: ${dHandVal}`)
        $("#pScore").replaceWith(pVal);
        $("#dScore").replaceWith(dVal);

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
        let card = deck.pop();
        playerHand.push(card);
        $("#playerCards").append(card)
        target = false;

    }

    //stand
    function stand() {
        playerStand = true;
        target = false;

    }

//dealer logic
    function dealer() {
            if (dHandVal < 17) {
                let card = deck.pop();
                dealerHand.push(card);
                let _hit = $('<p>');
                _hit.html(dealerHand[dealerHand.length - 1].suit + " " + dealerHand[dealerHand.length - 1].value);
                $("#dealerCards").append(_hit);

            
            } else if (dHandVal >= 17) {
                dealerStand = true;
                target = true;

                game();

            };
        
    };
