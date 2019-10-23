"use strict";

//create a new vue instance
let vm = new Vue({
    el: "#app",
    data() {
        return {
            player: [], // player hands
            dealer: [], // dealer hands
            deck: [], // deck
            playing: false,
            suits: ["c", "s", "h", "d"], //the different suits of the deck
            ranks: ["a", "2", "3", "4", "5", "6", "7", "8", "9", "t", "j", "q", "k"],
            cardback: "poker-back",
            score: 0,
            msgStr: "",
            msgColor: "info"
        };
    },

    //Calculates the player's and dealers score
    computed: {
        playerScore() {
            return this.calcScore(this.player);
        },
        dealerScore() {
            return this.calcScore(this.dealer);
        }
    },
    mounted() {
        this.deal();
    },
    //creates a new deck and uses suits and ranks  
    methods: {
        newDeck() {
            this.deck = [];
            this.suits.forEach(function (suit) {
                this.ranks.forEach(function (rank) {
                    this.deck.push(suit + rank);
                }, this);
            }, this);
            this.deck = this.shuffle(this.deck);
        },
        //shuffle the deck
        shuffle(v) {
            for (
                var j, x, i = v.length;
                i;
                j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x
            );
            return v;
        },
        //hit function to add another card to the player.
        hit() {
            //if the game is not playing display "Click deal to restart"
            if (!this.playing) {
                this.msg("Click <strong>Deal</strong> button to restart.");
                return;
            }
            //If the player's Score is less than or equal to 21
            if (this.playerScore <= 21) this.player.push(this.deck.pop());
            //If the player's score is greater than 21 then display the message
            if (this.playerScore > 21)
                this.msg("<strong>Player</strong> have busted", "warning");
        },
        //This function controls if the user wants to stay at their number.
        stand() {
            //If the game is not playing/ done display this message
            if (!this.playing) {
                this.msg("Click <strong>Deal</strong> button to restart.");
                return;
            }
            //if the player's score is less than or 21 while dealer score is less than 17 
            if (this.playerScore <= 21)
                while (
                    this.dealerScore < 17 ||
                    this.dealerScore < Math.min(this.playerScore, 21)
                )
                    this.dealer.push(this.deck.pop());
            this.playing = false;

            //the player wins if their score is less than or equal to 21 and the dealer's score is less than the player's or is over 21
            let playerWin =
                (this.playerScore <= 21 && this.dealerScore < this.playerScore) ||
                this.dealerScore > 21;
            //if the player wins add a point to their total score and display a message say the player. Else minus a point from the player's score and display that the dealer won.
            if (playerWin) {
                this.score++;
                this.msg("<strong>Player</strong> wins.", "success");
            } else {
                this.score--;
                this.msg("<strong>Dealer</strong> wins.", "danger");
            }
        },
        //this function deals the cars to dealer and player 
        deal() {
            this.newDeck();
            this.player = [];
            this.dealer = [];
            for (let i = 0; i < 2; i++) {
                this.player.push(this.deck.pop());
                this.dealer.push(this.deck.pop());
            }

            if (this.playing) {
                this.score--;
                this.msg(
                    "<strong>Player</strong> lose. <strong>Hit</strong> or <strong>stand</strong>?",
                    "success"
                );
            } else {
                this.playing = true;
                this.msg("<strong>Hit</strong> or <strong>stand</strong>?");
            }
        },
        //this function calculates the score of the cards
        calcScore(hands) {
            let score = 0;
            let ace = false;
            hands.forEach(function (card) {
                score += Math.min(10, this.ranks.indexOf(card[1]) + 1);
                if (card[1] == "a") ace = true;
            }, this);
            if (ace && score <= 11) score += 10;
            if (score < 21 && hands.length > 4) score = 21;
            return score;
        },
        msg(str, color = "info") {
            this.msgStr = str;
            this.msgColor = color;
        }
    }
});
