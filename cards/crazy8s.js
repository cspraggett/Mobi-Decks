const {Deck, Player} = require('./classes/classes');

class CrazyPlayer extends Player {
  constructor(deckObject, position) {
    super(deckObject, 8);
    this.position = position;
  }

  recieveCards(cards) {
    this._hand = this._hand.concat(cards);
  }

}

class game {
  constructor() {
    this.deck = new Deck(52);
    this.deck.shuffle();
    this.player1 = new CrazyPlayer(this.deck);
    this.player2 = new CrazyPlayer(this.deck);
    this.currentPlayer = 0;
    this.faceUpCard = this.deck.deal(1);
  }

  // set faceUpCard() {
  //   this.faceUpCard = card;
  // }

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

  checkIfCardValid(card) {
    return this.translateCard(card).value === this.translateCard(this.faceUpCard).suit ||
     this.translateCard(card).suit === this.translateCard(this.faceUpCard).suit;
  }

  takeTopCard(player) {
    player.recieveCards(this.deck.deal(1));
  }

  pickUp2(player) {
    player.recieveCards(this.deck.deal(2));
  }

  showCards(cards) {
    return cards.map(curr => this.translateCard(curr));
  }

}
const g = new game();

console.log(g.showCards(g.player1._hand));
g.pickUp2(g.player1);
console.log(g.showCards(g.player1._hand));
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
