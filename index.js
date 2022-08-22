
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
    let pHandVal = 0; // current hand value player
    let pVal = $('#pScore');
    let playerWins = 0;
    let playerStand = false;
    let playerBustMessage = "Oh No You're Bust!";
    let playerWinMessage = "You Win!";
    let pHasAce = false;
    

    //dealer
    let dealerHand = [];
    let dHandVal = 0; // current hand value dealer
    let dHandValVis = 0;
    let dVal = $('#dScore');
    let dealerWins = 0;
    let dealerStand = false;
    let dealerBustMessage = "Dealer is Bust!";
    let dealerWinMessage = "Dealer Wins!";
    let dHasAce = false;
    



//setup function
    function setup() {
        createDeck();
        console.log('Welcome to my Blackjack game!');
    }

//menu function

    //button functions
    $('#newGame').on('click', function() {
        playerWins = 0;
        dealerWins = 0;
        let won = $("<h2>");
        won.html("Player Wins: " + playerWins + "&nbsp &nbsp &nbsp" + suitsSymbols + "&nbsp &nbsp &nbsp" + " Dealer Wins: " + dealerWins)
        $(".roundsWon h2").replaceWith(won);
        let game = $("<h3>")
        //change menu item based on choice
        $("#deal").removeClass("disabled").addClass("button");
        $("#newGame").removeClass("button").addClass("disabled");
        game.html("New Game!  Deal two cards to start!");
        $(".roundsWon h3").replaceWith(game);
        roundOver();

        
        //start game
        setup();
    });

    $('#rules').on('click', function() {

        alert("1: If you go over 21, you lose!\
        \n\n2: If you and the dealer both go over 21, you both lose!\
        \n\n3: Pressing the deal button will deal two cards to each player.\
        \n\n4: Pressing the hit button will deal another card to the player.\
        \n\n5: Pressing the stay button will end the player's turn.\
        \n\n6: Once both the player and the dealer have finished their turns, the winner is determined.\
        \n\n7: The goal is to bring your hand's value as close to 21 as possible without going over.\
        \n\nGood Luck and Have Fun!");

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
        $("#newGame").removeClass("button").addClass("disabled");
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
        flipCard();
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
        $("#newGame").removeClass("disabled").addClass("button");
        roundOver();
    });

//game function
    function game() {
        
        
        if (target === false && dealerStand === false) {
            $("#hit").removeClass("button").addClass("disabled");
            $("#stay").removeClass("button").addClass("disabled");
            //$(".roundsWon h2").replaceWith("<h2>Dealer's turn!</h2>");
            dealer();          
        };
        if (dealerStand === true) {
            updateScores();
            winConditions();
        };

        if (pHasAce === true) {
            checkAces();
        }
        if (dHasAce === true) {
            checkAces();
        }
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
                win.html(dealerBustMessage);
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

    function checkAces() {
        console.log("checkAces");
        console.log(pHandVal, dHandVal);
        for (let i = 0; i < playerHand.length; i++) {
            if (playerHand[i].value === 11 && pHandVal > 21) {
                pHandVal -= 10;
                playerHand[i].value = 1;
                pHasAce = false;
            }
            updateScores();
        }
        for (let i = 0; i < dealerHand.length; i++) {
            if (dealerHand[i].value === 11 && dHandVal > 21) {
                dHandVal -= 10;
                dealerHand[i].value = 1;
                dHasAce = false;
            }
            updateScores();
        }
    }

    function flipCard() {
        $("#dealerCards img").last().removeClass("flipped").addClass("unflipped");
        $("#dealerCards .unflipped ").attr("src", `assets/${dealerHand[0].suit}-${dealerHand[0].face}.svg`);
        updateScores();
    }

    function updateScores() {
        //referencing https://github.com/jacquelynmarcella/blackjack/blob/master/js/main.js
        //line 69 && associated logic
        //Was having a difficult time getting scores to update on button press, without adding multiplicatively.
        //Initial attempts at logic remain commented out below.
        //Just as documentation of my uh....  process. 
        
        //attempt 3
        pHandVal = 0;
        dHandVal = 0;

        for (let i = 0; i < playerHand.length; i++) {
            pHandVal += playerHand[i].value;
            $(pVal).text("Current Hand Value: " + pHandVal);
        }
        if ($("#dealerCards img").hasClass("flipped")) {
            
            for (let i = 1; i < dealerHand.length; i++) {
                dHandVal += dealerHand[i].value;
            }
            $(dVal).text("Current Hand Value: " + dHandVal);
        } else {
            for (let i = 0; i < dealerHand.length; i++) {
                dHandVal += dealerHand[i].value;  
            }
            $(dVal).text("Current Hand Value: " + dHandVal);
        }
        
        
        //attempt #2
        /*for (let i = 0; i < playerHand.length; i++) {
            if (playerHand[i].value === 1 ) {
                pHasAce = true;
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
                dHasAce = true;
                if (dHandVal + 11 > 21) {
                    dealerHand[i].value = 1;
                } else {
                    dealerHand[i].value = 11;
                }
            } 
            dHandVal += dealerHand[i].value;
            $(dVal).text("Current Hand Value: " + dHandVal);
        }; */

        //attempt #1
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
//card logic

    //create deck
    function createDeck() { 

        /* suits: 4
           point values: ace = 1 or 11, numbers = 2-10, face cards = 10 */
        for (let suit in suits) { // loop through suits
            for (let i = 1; i < 14; i++) { // for each suit, loop through numbers
                let card = { // create card object, assign properties
                    suit: suits[suit],
                    face: i,
                    value: i
                }
                
                deck.push(card); //add each card object to deck array
            }
            
        };

       for (let card in deck) { 
//check face cards and assign appropriate point value
//assign face cards with appropriate names: Jack, Queen, King, Ace(?)
            switch (deck[card].value) {
                case 1:
                    deck[card].face = "ACE";
                    deck[card].value = 11;
                    break;
                case 11:
                    deck[card].face = "JACK";
                    deck[card].value = 10;
                    break;
                case 12:
                    deck[card].face = "QUEEN";
                    deck[card].value = 10;
                    break;
                case 13:
                    deck[card].face = "KING";
                    deck[card].value = 10;
                    break;
            };
        }; 

        if (deck.length === 52) { //check if deck is full
            
            deckVal = true;
        }

        if (deckVal === true) { //shuffle deck if deck is full
            shuffleDeck();
        }
        
    };

    //make sure deck values are randomized
    function shuffleDeck() {
        for (let i = 0; i < deck.length; i++) {
            let random = Math.floor(Math.random() * deck.length);
            let current = deck[i]; //current card
            deck[i] = deck[random]; //replace current card with random card
            deck[random] = current; //replace random card with current card
        };
        shuffled = true;
        
        game();
        
    };

    //deal cards
    function playerDeal() {            
            let pCard = deck.pop(); //could use .shift() instead of .pop(), didn't figure it matters
            let cardImg = $('<img>');
            let pIndex = playerHand.length;
            playerHand.push(pCard); //add card to player hand
            cardImg.attr("src", `assets/${playerHand[pIndex].suit}-${playerHand[pIndex].face}.svg`);
            cardImg.prependTo("#playerCards");
            if (pCard.value === 11) {
                pHasAce = true;
            }
            
            updateScores();
    };

    function dealerDeal() {   
            let dCard = deck.pop();
            let cardImg = $("<img>");
            let dIndex = dealerHand.length;
            dealerHand.push(dCard);

            if (dIndex === 0) {
                cardImg.attr("class", "flipped");
                cardImg.attr("src", "assets/cardBack.jpeg");
            } else {
                cardImg.attr("src", `assets/${dealerHand[dIndex].suit}-${dealerHand[dIndex].face}.svg`);
            }
            cardImg.prependTo("#dealerCards");
            if (dCard.value === 11) {
                dHasAce = true;
            }
            if (dHasAce) {
                checkAces();
            }
            
            updateScores();
    }

    function dealTimer(i) {
            if (i % 2 === 0) { //alternate player and dealer dealing
                setTimeout(function() {
                    playerDeal();
                    
                }, i * 200);
                
            } else {
                setTimeout(function() {
                    dealerDeal();
                    
                }, i * 200);
                
        };
    }
    
    /*function cardImg() {
        for (let i = 0; i < dealerHand.length; i++) {
            let card = dealerHand[i];
            console.log(card);
            
            let cardImg = $("<img>");
            
            if (i === 0) {
                $("#dealerCards img").addClass("flipped");
                cardImg.attr("src", "assets/cardBack.jpeg");
            } else {
                cardImg.attr("src", `assets/${card.suit}-${card.face}.svg`);
            }
            cardImg.prependTo("#dealerCards");
        };
        for (let i = 0; i < playerHand.length; i++) {
            let card = playerHand[i];

            let cardImg = $("<img>");
            
            cardImg.attr("src", `assets/${card.suit}-${card.face}.svg`);
            cardImg.prependTo("#playerCards");
        } 
        if (i === 0) {
            let flippedCard = $("<img>");
            flippedCard.attr("src", "assets/cardBack.jpeg");
            return flippedCard;
        } else {
            let cardImg = $("<img>");
            cardImg.attr("src", `assets/${card.suit}-${card.face}.svg`);
            return cardImg;
        }
    }*/

    //hit
    function hit() {

        playerDeal();
        game();

        if (pHandVal > 21) {
            let lose = $("<h3>");
            lose.html(playerBustMessage);
            $(".roundsWon h3").replaceWith(lose);
            flipCard();
            stand();
        }
    }

    //stand
    function stand() {
        playerStand = true;
        target = false; //set target to dealer
        game();
    }

//dealer logic
    function dealer() {
        let turn = $("<h3>");
        if (dHandVal <= 17 && pHandVal <= 21) {
            //unsure if timeout is the best way to do this
            //but it works
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



    //Might be the best movie ever made
        let buffer = [];
        let code = ['v','e','g','a','s']
    $(document).on('keydown', function(e) {
        
        switch (e.key) {
            case 'v':
                buffer.push('v')
                break;
            case 'e':
                buffer.push('e')
                break;
            case 'g':
                buffer.push('g')
                break;
            case 'a':
                buffer.push('a')
                break;
            case 's':
                buffer.push('s')
                break;
        }
    });

    function egg() {       
        buffer = buffer.join('');
        code = code.join('');
        if (buffer === code) {
            window.location.replace("https://youtu.be/CEeqCbEFIJw"); //tried to do this as an alert popup, found out that doesn't work
        } else {
            buffer = [];
            code = ['v','e','g','a','s'];
        }
    };

    $(document).on('keydown', function(e) {
        if (e.key === '1') {
            egg();
        }
    });

    // ========================================= //
    // Thanks to:                                //
    // My family, testing and support            //
    // Peter, excellent duck and friend          //
    // Klaus, you know what you did              //
    // Ryo, letting me rant at you               //
    // Nibby, not really a wanker                //
    // ========================================= //
