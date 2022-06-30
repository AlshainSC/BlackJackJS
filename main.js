
//intitialize variables
    //general
    let cards = [];
    let suits = ['HEART', 'DIAMOND', 'SPADE', 'CLUB'];
    let deck = [];
    let target = true;
    let deckVal = false;
    let shuffled = false;
    let dealt = false;

    //player
    let playerHand = [];
    let playerScore = 0; // round score player
    let pHandVal = 0; // current hand value player
    let pVal = $('#pScore');
    let playerWins = 0;
    let playerStand = false;
    let playerBustMessage = "Oh no you're bust!";
    let playerWinMessage = "You win!";

    //dealer
    let dealerHand = [];
    let dealerScore = 0; // round score dealer
    let dHandVal = 0; // current hand value dealer
    let dVal = $('#dScore');
    let dealerWins = 0;
    let dealerStand = false;
    let dealerBustMessage = "Dealer is bust!";
    let dealerWinMessage = "Dealer wins!";

//CSS

    //setup event listeners to style buttons
    /* $('.button').on('mouseover', function() {
        //change color
        $(this).css('background-color', '#DDA74F');
        $(this).css('color', '#272A31');
    });
    
    $('.button').on('mouseout', function() {
        //change color
        $(this).css('background-color', '#181B22');
        $(this).css('color', '#DDA74F');
    }); */


//setup function
    function setup() {
        createDeck();

    }

//menu function

    //button functions
    $('#newGame').on('click', function() {
        let game = $("<h3>")
        //change menu item based on choice
        $("#deal").removeClass("disabled").addClass("button");
        $("#newGame").removeClass("button").addClass("disabled");
        /*$("#rules").removeClass("button").addClass("disabled");
        $("#credits").removeClass("button").addClass("disabled");*/
        game.html("New Game!  Deal two cards to start!");
        $(".roundsWon h3").replaceWith(game);
        
        //start game
        setup();
    });

    $('#rules').on('click', function() {
        console.log('works')
        let rules = $("<h4>");
        rules.html("The goal of the game is to reach 21 points.<br>\
        If you go over 21, you lose!<br>\
        If you and the dealer both go over 21, you both lose!<br>\
        Pressing the deal button will deal one card to each player.<br>\
        Pressing the hit button will deal another card to the player.<br>\
        Pressing the stay button will end the player's turn.<br>\
        Once both the player and the dealer have finished their turns,<br>\
        the winner is determined.")
        $("#rules").after(rules)
        setTimeout(function() {
            $(rules).remove();
        }, 3000);
    });

    $('#credits').on('click', function() {
        let credits = $("<h4>");
        credits.html("Nibby is a Wanker");
        $("#credits").after(credits);
        setTimeout(function() {
            $(credits).remove();
        }, 1500);
    });

    $("#deal").on('click', function() {
        deal();
        let turn = $("<h3>");
       /* let pH = $('<p>')
        let dH = $('<p>')
        for (let i = 0; i < playerHand.length; i++) {
//update html to reflect dealt cards
//this logic was pushed from the deal() function 
//keep this in mind for hit() and stay() etc...
            pH.html(playerHand[i].suit + " " + playerHand[i].value); 
            
            dH.html(dealerHand[i].suit + " " + dealerHand[i].value);
            
            $("#playerCards").append(pH);
            $("#dealerCards").append(dH);

            
            
            
        } */
        /* playerHand.forEach(function(card) {
            cardImg(card).appendTo("#playerCards");
        });
        dealerHand.forEach(function(card) {
            cardImg(card).appendTo("#dealerCards");
        }) */
        
        if (playerHand.length === 2) {
//remove deal button when each player has two cards in hand
            pHandVal = playerHand[0].value + playerHand[1].value;
            dHandVal = dealerHand[0].value + dealerHand[1].value;

            $("#deal").removeClass("button").addClass("disabled");
            $("#hit").removeClass("disabled").addClass("button");
            $("#stay").removeClass("disabled").addClass("button");
            turn.html("Your Turn!");
            $(".roundsWon h3").replaceWith(turn);
        };

        
        game();
    });

    $("#hit").on('click', function() {
        //hit logic
        hit();
    });

    $("#stay").on('click', function() {
        let turn = $("<h3>");
        $("#hit").removeClass("button").addClass("disabled");
        $("#stay").removeClass("button").addClass("disabled");
        turn.html("Dealer's Turn!");
        $(".roundsWon h3").replaceWith(turn);
        stand();
        
    
    });

    $("#playAgain").on('click', function() {
        let won = $("<h2>");
        won.html("Player Wins: " + playerWins + " Dealer Wins: " + dealerWins)
        $(".roundsWon h2").replaceWith(won);
        roundOver();
    });

    $("#reset").on('click', function() {
        gameOver();
    });

//game function
    function game() {

        if (target === false) {
            console.log(dHandVal)
            //$(".roundsWon h2").replaceWith("<h2>Dealer's turn!</h2>");
            dealer();

        } else {
            if (playerStand === true && dealerStand === true) {
                
                console.log('entered else if')
                $(".roundsWon h3").replaceWith("Round Over");
                winConditions();
            }
        }
        updateScores();
    };

    function winConditions() {
        let win = $("<h3>")
        console.log("wincon loop has started")
        console.log(pHandVal, dHandVal)
        if (pHandVal > 21 && dHandVal <= 21) {
            win.html(dealerWinMessage);
            dealerWins++;
            $(".roundsWon h3").replaceWith(win);
            $("#playAgain").removeClass("disabled").addClass("button");
        } else if (dHandVal > 21 && pHandVal <= 21) {
            win.html(playerWinMessage);
            playerWins++;
            $(".roundsWon h3").replaceWith(win);
            $("#playAgain").removeClass("disabled").addClass("button");
        } else if (pHandVal > 21 && dHandVal > 21) {
            win.html("You're both bust!");
            $(".roundsWon h3").replaceWith(win);
            $("#playAgain").removeClass("disabled").addClass("button");
        } else if (pHandVal < dHandVal) {
            win.html(dealerWinMessage);
            dealerWins++;
            $(".roundsWon h3").replaceWith(win);
            $("#playAgain").removeClass("disabled").addClass("button");
        } else if (pHandVal > dHandVal) {
            win.html(playerWinMessage);
            playerWins++;
            $(".roundsWon h3").replaceWith(win);
            $("#playAgain").removeClass("disabled").addClass("button");
        } else {
            win.html("<h3>It's a tie!</h2>");
            $(".roundsWon h3").replaceWith(win);
            $("#playAgain").removeClass("disabled").addClass("button");
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
        deck = [];
        playerHand = [];
        dealerHand = [];
        playerStand = false;
        dealerStand = false;
        pHandVal = 0;
        dHandVal = 0;
        target = true;
        $("#playerCards p").remove();
        $("#dealerCards p").remove();
        $("#playerCards img").remove();
        $("#dealerCards img").remove();
        
        $("#deal").removeClass("disabled").addClass("button");
        $("#playAgain").addClass("disabled").removeClass("button");

        setup();
    }

//game over function
    function gameOver() {
        let winner = $("<h3>");
        if (playerWins > dealerWins) {
            winner.html("Game Over!<br>Player Wins!");
        } else if(playerWins < dealerWins) {
            winner.html("Game Over!<br>Dealer Wins!");
        } else {
            winner.html("Game Over!<br>It's a tie!");
        }
        $("#hit").removeClass("button").addClass("disabled");
        $("#stay").removeClass("button").addClass("disabled");
        $("#deal").removeClass("button").addClass("disabled");
        $("#newGame").removeClass("disabled").addClass("button");

        playerScore = 0;
        dealerScore = 0;
        playerWins = 0;
        dealerWins = 0;
        deck = [];
        playerHand = [];
        dealerHand = [];
        playerStand = false;
        dealerStand = false;
        pHandVal = 0;
        dHandVal = 0;
        target = true;
        $("#playerCards p").remove();
        $("#dealerCards p").remove();
        $("#playerCards img").remove();
        $("#dealerCards img").remove();
        
        $(".roundsWon h2").replaceWith("<h2>Game Over!</h2>");
        setTimeout(function() {
            $(".roundsWon h2").replaceWith("<h2>New Game?</h2>");
        }, 5000);
        $("roundsWon h3").replaceWith(winner);
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
            
            if (deck[card].value === 11) { //jack
                deck[card].value = 10;
            }
            if (deck[card].value === 12) { //queen
                deck[card].value = 10;
            }
            if (deck[card].value === 13) { //king
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
            cardImg(card).prependTo("#playerCards");
            totalCards++;
        }
        if (dealerHand.length < 2 && totalCards < 4) {
            let card = deck.pop();
            dealerHand.push(card);
            cardImg(card).appendTo("#dealerCards");
            totalCards++;
        };

        for (let i = 0; i < playerHand.length; i++) {
            if (playerHand[i].value === 1) {
                if (playerHand[i].value + 11 > 21) {
                    playerHand[i].value = 1;
                } else {
                    playerHand[i].value = 11;
                }
            }
        }
        for (let i = 0; i < dealerHand.length; i++) {
            if (dealerHand[i].value === 1) {
                if (dealerHand[i].value + 11 > 21) {
                    dealerHand[i].value = 1;
                } else {
                    dealerHand[i].value = 11;
                }
            }
        }

        

    };
    
    function cardImg(card) {
        console.log("image loaded")
        let cardImg = $("<img>");
        cardImg.attr("src", `assets/${card.suit}-${card.value}.svg`);
        return cardImg;
    }

    //hit
    function hit() {
        if (pHandVal < 21) {
            let card = deck.pop();
            playerHand.push(card);
            pHandVal += card.value;
            cardImg(card).prependTo("#playerCards");
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
        let turn = $("<h3>");

        if (dHandVal < 17) {
            //timeout functions idea from 
            setTimeout(function() {
                let card = deck.pop();
                dealerHand.push(card);
                turn.html("Dealer Hits!")
                $(".roundsWon h3").replaceWith(turn);
                dHandVal += card.value;
                cardImg(card).appendTo("#dealerCards");
                game();
            }, 1500);
        } else if (dHandVal > 21) {
            setTimeout(function() {
                winConditions();
            }, 1500);
        } else {
            setTimeout(function() {
                dealerStand = true;
                turn.html("Dealer Stands!")
                $(".roundsWon h3").replaceWith(turn);
                winConditions();
            }, 1500);
        }

    };
