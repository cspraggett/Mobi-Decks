const {Deck, Player} = require('./classes/classes');

class warPlayer extends Player {
  constructor(deckObject) {
    super(deckObject, 26);
  }
  addToHand(p1Cards, p2Cards) {
    this._hand.concat(p1Cards);
    this._hand.concat(p2Cards);
  }

  playCard() {
    return this._hand.shift();
  }

  playCardWar() {
    let ret = this.hand.slice(0, 4);
    this.hand.splice(0, 4);
  }
}

const compareCards = ((p1Card, p2Card) => {
  if (p1Card > p2Card) {
    p1.addToHand(p1Card);
    p1.addToHand(p2Card);
  } else if (p2Card > p1Card) {
    p2.addToHand(p1Card);
    p2.addToHand(p2Card);
  } else {

  }
});

const deck = new Deck(52);
deck.shuffle();
console.log(deck._deck);
const p1 = new warPlayer(deck, 26);
const p2 = new warPlayer(deck, 26);
console.log('player1:',p1);
console.log('player2:',p2);

while (p1._hand && p2._hand) {

}
