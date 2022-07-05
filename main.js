
//intitialize variables
    //general
    let cards = [];
    let suits = ['HEART', 'DIAMOND', 'SPADE', 'CLUB'];
    let deck = [];
    let target = true;
    let deckVal = false;
    let shuffled = false;
    let dealt = false;
    let suitsSymbols = " ♥ ♦ ♠ ♣";
    let i = 0;

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
        game.html("New Game!  Deal two cards to start!");
        $(".roundsWon h3").replaceWith(game);
        
        //start game
        setup();
    });

    $('#rules').on('click', function() {

        alert("1: If you go over 21, you lose!\
        \n\n2: If you and the dealer both go over 21, you both lose!\
        \n\n3: Pressing the deal button will deal one card to each player.\
        \n\n4: Pressing the hit button will deal another card to the player.\
        \n\n5: Pressing the stay button will end the player's turn.\
        \n\n6: Once both the player and the dealer have finished their turns,\
        the winner is determined.")

    });

    $('#credits').on('click', function() {
        let credits = $("<h4>");
        credits.html("Nicholas Larson<br><br>\
        With special thanks to:<br><br>\
        The Larson Clan: the best guinea pigs<br><br>\
        Peter: god-tier wizard coder extraordinaire<br><br>\
        Klaus: absolute nonstop heckling<br><br>\
        Nibby - not really a wanker<br><br>\
        --see @readme for full source list--");
        $("#credits").after(credits);
        setTimeout(function() {
            $(credits).remove();
        }, 10000);
    });

    $("#deal").on('click', function() {
        while (i < 4) {
            dealTimer(i);
            i++;
        }
        let turn = $("<h3>");
        
        if (i === 4) {
//remove deal button when each player has two cards in hand
            $("#deal").removeClass("button").addClass("disabled");

            setTimeout(function() {
                $("#hit").removeClass("disabled").addClass("button");
                $("#stay").removeClass("disabled").addClass("button");
            }, 1200);

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
        pHandVal = 0;
        dHandVal = 0;
        i = 0;

        let won = $("<h2>");
        won.html("Player Wins: " + playerWins + "&nbsp &nbsp &nbsp" + suitsSymbols + "&nbsp &nbsp &nbsp" + " Dealer Wins: " + dealerWins)
        $(".roundsWon h2").replaceWith(won);
        $(".roundsWon h3").replaceWith("<h3>");
        roundOver();
    });

    $("#reset").on('click', function() {
        gameOver();
    });

//game function
    function game() {
        updateScores();
        if (target === false && dealerStand === false) {
            console.log(dHandVal)
            $("#hit").removeClass("button").addClass("disabled");
            $("#stay").removeClass("button").addClass("disabled");
            //$(".roundsWon h2").replaceWith("<h2>Dealer's turn!</h2>");
            dealer();          
        };
        if (dealerStand === true) {
            winConditions();
        };
       /* if (dHandVal > 21) {
            winConditions();
        };
        if (pHandVal > 21) {
            $("#hit").removeClass("button").addClass("disabled");
            $("#stay").removeClass("button").addClass("disabled");
            winConditions();
        }; */

        
    };

    function winConditions() {
        let win = $("<h3>")
        console.log("wincon loop has started")
        console.log(pHandVal, dHandVal) //switch statement maybe instead of if/else?

        if (dHandVal === 21){ //dealer blackjack
            if (pHandVal === 21) { //dealer and player both have blackjack
                win.html("It's A Tie!");
                $(".roundsWon h3").replaceWith(win);
                $("#playAgain").removeClass("disabled").addClass("button");
            } else { //dealer has blackjack and player does not
                win.html(dealerWinMessage); 
                $(".roundsWon h3").replaceWith(win);
                dealerWins++;
                $("#playAgain").removeClass("disabled").addClass("button");
            }
        } else if (dHandVal > 21) { //dealer is bust
            if (pHandVal <= 21) { //dealer is bust and player is not bust
                win.html(playerWinMessage);
                $(".roundsWon h3").replaceWith(win);
                playerWins++;
                $("#playAgain").removeClass("disabled").addClass("button");
            } else { //dealer and player are both bust
                win.html("You're Both Bust!");
                $(".roundsWon h3").replaceWith(win);
                $("#playAgain").removeClass("disabled").addClass("button");
            }
        } else if (dHandVal < 21) { //dealer has score less than 21
            if (pHandVal === 21) { //player has blackjack, and dealer does not
                win.html(playerWinMessage);
                $(".roundsWon h3").replaceWith(win);
                playerWins++;
                $("#playAgain").removeClass("disabled").addClass("button");
            } else if (pHandVal < 21 && pHandVal > dHandVal) { //neither have blackjack, player score is greater than dealer
                win.html(playerWinMessage);
                $(".roundsWon h3").replaceWith(win);
                playerWins++;
                $("#playAgain").removeClass("disabled").addClass("button");
            } else if (dHandVal === pHandVal) { //player and dealer have equal scores
                win.html("It's A Tie!");
                $(".roundsWon h3").replaceWith(win);
                $("#playAgain").removeClass("disabled").addClass("button");
            } else { //dealer has greater score than player
                win.html(dealerWinMessage);
                $(".roundsWon h3").replaceWith(win);
                dealerWins++;
                $("#playAgain").removeClass("disabled").addClass("button");
            }
        }


    };

    function updateScores() {
        //referencing https://github.com/jacquelynmarcella/blackjack/blob/master/js/main.js
        //line 69 && associated logic
        //Was having a difficult time getting scores to update on button press, without adding multiplicatively.
        //Initial attempts at logic remain commented out below.
        
        
        pHandVal = 0;
        dHandVal = 0;
        
        for (let i = 0; i < playerHand.length; i++) {
            if (playerHand[i].value === 1 ) {
                if (pHandVal + 11 > 21) {
                    playerHand[i].value = 1;
                } else {
                    playerHand[i].value = 11;
                }
            }
            pHandVal += playerHand[i].value;
            $(pVal).text("Current Hand Value: " + pHandVal);
        };
        for (let i = 0; i < dealerHand.length; i++) {
            if (dealerHand[i].value === 1 ) {
                if (dHandVal + 11 > 21) {
                    dealerHand[i].value = 1;
                } else {
                    dealerHand[i].value = 11;
                }
            }
            dHandVal += dealerHand[i].value;
            $(dVal).text("Current Hand Value: " + dHandVal);
        };
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
//potentially better as a separate function  <-- was made into a separate function and it is better this way.
        deck = [];
        cards = [];
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

        $(pVal).text("");
        $(dVal).text("");

        setup();
    }

//game over function
    function gameOver() {
        let winner = $("<h3>");
        if (playerWins > dealerWins) {
            winner.html("Game Over!<br>Player Wins!");
            $(".roundsWon h3").replaceWith(winner);
        } else if(playerWins < dealerWins) {
            winner.html("Game Over!<br>Dealer Wins!");
            $(".roundsWon h3").replaceWith(winner);
        } else {
            winner.html("Game Over!<br>It's a tie!");
            $(".roundsWon h3").replaceWith(winner);
        }

        //reset buttons
        $("#hit").removeClass("button").addClass("disabled");
        $("#stay").removeClass("button").addClass("disabled");
        $("#deal").removeClass("button").addClass("disabled");
        $("#newGame").removeClass("disabled").addClass("button");

        //reset variables
        playerScore = 0;
        dealerScore = 0;
        playerWins = 0;
        dealerWins = 0;
        deck = [];
        cards = [];
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
        $(pVal).text("");
        $(dVal).text("");

        
        $(".roundsWon h2").replaceWith("<h2>Game Over!</h2>");
        setTimeout(function() {
            $(".roundsWon h2").replaceWith("<h2>");
        }, 1000);
        $("roundsWon h3").replaceWith(winner);

        setup();
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
                    face: i,
                    value: i
                }
                
                deck.push(card);
            }
            
        };

        for (let card in deck) { 
//check face cards and assign appropriate point value
//assign face cards with appropriate names: Jack, Queen, King, Ace(?)
            
            if (deck[card].value === 11) {
                deck[card].face = 'JACK' //jack
                deck[card].value = 10;
            }
            if (deck[card].value === 12) {
                deck[card].face = 'QUEEN' //queen
                deck[card].value = 10;
            }
            if (deck[card].value === 13) {
                deck[card].face = 'KING' //king
                deck[card].value = 10;
            }

        };

        if (deck.length === 52) {
            
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
        
        game();
        
    };

    //deal cards
    function playerDeal() {            
                let pCard = deck.pop();
                playerHand.push(pCard);
                cardImg(pCard).appendTo("#playerCards");
                updateScores();
    };

    function dealerDeal() {   
            let dCard = deck.pop();
            dealerHand.push(dCard);   
            cardImg(dCard).prependTo("#dealerCards");
            updateScores();
    }

    function dealTimer(i) {
            if (i % 2 === 0) {
                setTimeout(function() {
                    playerDeal();
                    
                }, i * 500);
                
            } else {
                setTimeout(function() {
                    dealerDeal();
                    
                }, i * 500);
                
        };
        
        console.log(playerHand.length)
        console.log(dealerHand.length)
    }
    
    function cardImg(card) {
        
        let cardImg = $("<img>");
        cardImg.attr("src", `assets/${card.suit}-${card.face}.svg`);
        return cardImg;
    }

    //hit
    function hit() {

        let card = deck.pop();
        playerHand.push(card);
        cardImg(card).prependTo("#playerCards");
        pHandVal += card.value;

        if (pHandVal > 21) {
            stand();
        }
        updateScores();
    }

    //stand
    function stand() {
        playerStand = true;
        target = false;
        
        game();
    }

//dealer logic
    function dealer() {
        
        let turn = $("<h3>");

        if (dHandVal < 17 && pHandVal <= 21) {
            //timeout functions idea from 
            setTimeout(function() {
                dealerDeal();
                turn.html("Dealer Hits!")
                $(".roundsWon h3").replaceWith(turn);
                game();
            }, 1500);
        } else if (dHandVal > 21) {
            setTimeout(function() {
                dealerStand = true;
                game();
            }, 1500);
        } else if (dHandVal <= 21) {
            console.log('enter dealer stand else if')
            setTimeout(function() {
                target = true;
                dealerStand = true;
                turn.html("Dealer Stands!")
                $(".roundsWon h3").replaceWith(turn);
                game();
            }, 1500);
        }

    };
