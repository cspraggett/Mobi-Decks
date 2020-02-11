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
    this.currentPlayer = 0;
    this.faceUpCard = null;
  }

  takeTopCard(player) {
    player.recieveCards(this.deck.deal(1));
  }

  pickUp2(player) {
    player.recieveCards(this.deck.deal(2));
  }
}
const dealer = new game();
console.log(dealer);
console.log(dealer.deck._deck.length);

const player1 = new CrazyPlayer(dealer
  .deck);
const player2 = new CrazyPlayer(dealer
  .deck);

console.log(player1);
console.log(player2);
console.log(dealer);
console.log(dealer.deck._deck.length);
dealer.pickUp2(player1);
console.log(player1);
console.log(dealer);
console.log(dealer.deck._deck.length);
