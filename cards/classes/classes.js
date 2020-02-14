class Deck {
  constructor(numCards) {
    this._deck = [...Array(numCards).keys()];
  }

  shuffle() {
    for (let i = this._deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._deck[i], this._deck[j]] = [this._deck[j], this._deck[i]];
    }
  }

  static shuffle(cards) {
    console.log(typeof cards);
    console.log(cards);
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  static removeFirst(deck) {
    deck.shift();
    return deck;
  }

  static removeInnerCard(c, deck) {
    console.log('in remove:', c, deck)
    console.log(typeof c)
    console.log(typeof deck[0])
    deck =  deck.filter(cur => cur !== c);
    return deck;
  }

  deal(numCards) {
    const ret = this._deck.slice(0, numCards);
    this._deck.splice(0, numCards);
    return ret;
  }

}

class Player {
  constructor(deckObject, numOfCards) {
    this._hand = deckObject.deal(numOfCards);
  }
  get id() {
    return this.id;
  }
}

class GoofPlayer extends Player {
  constructor(deckObject) {
    super(deckObject, 13);
    this._currentBid = null;
    this._wonBids = [];
    this.convertHand();
  }

  convertHand() {
    this._hand = this._hand.map(curr => curr % 13);
  }

  get score() {
    return this._wonBids.reduce((prev, curr) => prev + (curr + 1), 0);
  }

  get currentBid() {
    return this._currentBid;
  }

  set currentBid(card) {
    this._currentBid = card;
  }

  addToWonBids(card) {
    this._wonBids.push(card);
  }

  updateHand() {
    this._hand = Deck.removeInnerCard(this._currentBid, this._hand);
  }

  verifyBid() {
    return this._hand.includes(this._currentBid);
  }
}

class GoofDealer {
  constructor(deckObject) {
    this._hand = this.getHand(deckObject);
    this.convertHand();
  }

  getHand(deckObject) {
    const ret = deckObject.deal(13);
    return Deck.shuffle(ret);
  }

  convertHand() {
    this._hand = this._hand.map(curr => curr % 13);
  }

  get currentCard() {
    return this._hand[0];
  }

  removeCurrent() {
    this._hand = Deck.removeFirst(this._hand);
  }
}

const compareHands = ((player1, player2, dealer) => {
  player1.currentBid > player2.currentBid ? player1.addToWonBids(dealer.currentCard) : player2.currentBid > player1.currentBid ? player2.addToWonBids(dealer.currentCard) : undefined;
  player1.updateHand();
  player2.updateHand();
  dealer.removeCurrent();
});

module.exports = {Deck, GoofDealer, Player, GoofPlayer, compareHands};
