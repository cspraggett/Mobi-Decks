const {Deck, Player} = require('./classes/classes');

class CrazyPlayer extends Player {
  constructor(deckObject, position) {
    super(deckObject, 8);
    this.position = position;
  }

  recieveCards(cards) {
    this._hand = this._hand.concat(cards);
  }

  removePlayedCards(player, cards) {
    console.log('rem played card:', player._hand, cards.length);
    for (const card of cards) {
      player._hand = Deck.removeInnerCard(card, player._hand);
    }
  }

}

class game {
  constructor() {
    this.deck = new Deck(52);
    this.deck.shuffle();
    this.players = [];
    this.players[0] = new CrazyPlayer(this.deck);
    this.players[1] = new CrazyPlayer(this.deck);
    this.currentPlayer = 0;
    this.faceUpCard = [this.deck.deal(1)];
    this.runOf2 = 0;
  }

  changeFaceUpCard(card) {
    console.log('this is the card',card)
    //this.faceUpCard = Array.card.push(this.faceUpCard);
    this.faceUpCard.unshift(card);
  }

  addToDeck() {
    this.deck.push(this.faceUpCard);
  }

  translateCard(card) {
    const translater = {
      0: {value: 'A', suit: 'C'},
      1: {value: '2', suit: 'C'},
      2: {value: '3', suit: 'C'},
      3: {value: '4', suit: 'C'},
      4: {value: '5', suit: 'C'},
      5: {value: '6', suit: 'C'},
      6: {value: '7', suit: 'C'},
      7: {value: '8', suit: 'C'},
      8: {value: '9', suit: 'C'},
      9: {value: '10', suit: 'C'},
      11: {value: 'Q', suit: 'C'},
      12: {value: 'K', suit: 'C'},
      10: {value: 'J', suit: 'C'},
      13: {value: 'A', suit: 'S'},
      14: {value: '2', suit: 'S'},
      15: {value: '3', suit: 'S'},
      16: {value: '4', suit: 'S'},
      17: {value: '5', suit: 'S'},
      18: {value: '6', suit: 'S'},
      19: {value: '7', suit: 'S'},
      20: {value: '8', suit: 'S'},
      21: {value: '9', suit: 'S'},
      22: {value: '10', suit: 'S'},
      23: {value: 'J', suit: 'S'},
      24: {value: 'Q', suit: 'S'},
      25: {value: 'K', suit: 'S'},
      26: {value: 'A', suit: 'H'},
      27: {value: '2', suit: 'H'},
      28: {value: '3', suit: 'H'},
      29: {value: '4', suit: 'H'},
      30: {value: '5', suit: 'H'},
      31: {value: '6', suit: 'H'},
      32: {value: '7', suit: 'H'},
      33: {value: '8', suit: 'H'},
      34: {value: '9', suit: 'H'},
      35: {value: '10', suit: 'H'},
      36: {value: 'J', suit: 'H'},
      37: {value: 'Q', suit: 'H'},
      38: {value: 'K', suit: 'H'},
      39: {value: 'A', suit: 'D'},
      40: {value: '2', suit: 'D'},
      41: {value: '3', suit: 'D'},
      42: {value: '4', suit: 'D'},
      43: {value: '5', suit: 'D'},
      44: {value: '6', suit: 'D'},
      45: {value: '7', suit: 'D'},
      46: {value: '8', suit: 'D'},
      47: {value: '9', suit: 'D'},
      48: {value: '10', suit: 'D'},
      49: {value: 'J', suit: 'D'},
      50: {value: 'Q', suit: 'D'},
      51: {value: 'K', suit: 'D'}
    };
    return translater[card];
  }

  showCards(cards) {
    return cards.map(curr => this.translateCard(curr));
  }

  displayCards(cards) {
    cards.forEach(curr => {
      // console.log(this.translateCard(curr), curr);
    });
  }

  checkIfCardValid(card) {
    return this.translateCard(card).value === this.translateCard(this.faceUpCard).value ||
     this.translateCard(card).suit === this.translateCard(this.faceUpCard).suit;
  }

  checkMultipleCards(cards) {
    return cards.every(this.checkIfCardValid);
  }

  checkIfMove(player) {
    for (const card of this.players[player]) {
      if (this.checkIfCardValid(card) || this.translateCard(card).value === '8') {
        return true;
      }
      return false;
    }
  }

  takeTopCard(player) {
    player.recieveCards(this.deck.deal(1));
  }

  pickUpCards(player, num) {
    player.recieveCards(this.deck.deal(num));
  }

  moveFaceUpToDeck() {
    this.deck = this.faceUpCard.filter(value => this.faceUpCard[0] !== value);
  }

  makeMove(frontEndObject) {
    console.log('makeMove initiated');
    console.log('deck start:', this.deck._deck, this.deck._deck.length);
    console.log('current player card:', frontEndObject.cards);
    if (this.deck._deck.length === 0) {
      console.log('if there are cards in deck');
      this.moveFaceUpToDeck();
    }
    if (frontEndObject.pickUp) {
      console.log('--pick up--')
      this.takeTopCard(this.players[frontEndObject.player]);
      if (!this.checkIfMove(this.players[frontEndObject.player])) {
        console.log('checking for valid move');
        this.currentPlayer = ((frontEndObject.player + 1) % 2);
        return;
      }
    }
    if (this.checkIfCardValid(frontEndObject.cards[0])) {
      console.log('checking if card is valid');
      if (this.translateCard(frontEndObject.cards[0]).value === '2') {
        console.log('if 2 is down')
        this.runOf2 += frontEndObject.cards.length;
        this.pickUpCards(this.players[(frontEndObject.player + 1) % 2], 2 * this.runOf2);
      } else {
        console.log('if 2 is not down')
        this.runOf2 = 0;
      }
      console.log('about to exit:', this.players[0]._hand);
      this.changeFaceUpCard(frontEndObject.cards[frontEndObject.cards.length - 1]);
      this.players[frontEndObject.player].removePlayedCards(this.players[frontEndObject.player], frontEndObject.cards);
      this.currentPlayer = ((frontEndObject.player + 1) % 2);
      console.log(this.players[0]._hand);
      console.log(this.players[1]._hand);
      console.log('deck start:', this.deck._deck, this.deck._deck.length);
      console.log('face up:', this.faceUpCard);
    } else {
      console.log('invalid');
    }
    // console.log('p1:', g.players[0]._hand);
    // console.log('p2:', g.players[1]._hand);
  }

}

// debugger;
// const g = new game();

// const frontEndObject = {player: 0, cards: [0], newSuit: null};

// console.log(g.showCards(g.players[0]._hand));
// g.pickUpCards(g.players[0], 2);
// console.log(g.showCards(g.players[0]._hand));
// console.log(g.showCards(g.player1._hand));
// console.log(g.showCards(g.deck._deck));

// console.log(g);

// g.pickUp2(g.player1);

// console.log(g);
// console.log(dealer);
// console.log(dealer.deck._deck.length);

// const player1 = new CrazyPlayer(dealer
//   .deck);
// const player2 = new CrazyPlayer(dealer
//   .deck);

// console.log(player1);
// console.log(player2);
// console.log(dealer);
// console.log(dealer.deck._deck.length);
// dealer.pickUp2(player1);
// console.log(player1);
// console.log(dealer);
// console.log(dealer.deck._deck.length);

// for (let i = 0; i < player1._hand.length; i++) {
//   console.log(dealer.translateCard(player1._hand[i]));
// }

module.exports = { game };
