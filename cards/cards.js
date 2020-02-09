class Cards {
  constructor(numCards) {
    this._hands = Array(numCards).keys();
  }
  shuffle() {
    for (let i = this._hand.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._hands[i], this._hands[j]] = [this._hands[j], this._hands[i]];
    }
  }
}

class Player {
  constructor() {
    this._hand = new Cards(13);
    this._wonBids = [];
    this._socketID = null;
    this._currentBid = null;
  }

  get socketID() {
    return this._socketID;
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
    this._hand = this._hand.filter(curr => curr === this._currentBid);
  }

  verifyBid() {
    return this._hand.includes(this._currentBid);
  }

  compareHands(p, card) {
    if (this._currentBid > p._currentBid) {
      this.addToWonBids(card);
      this.
    }
  }
}

class Dealer {
  constructor() {
    this._hand = new Cards(13).shuffle();
    this._currentCard = this.updateCurrentCard();
  }

  get currentCard() {
    return this._currentCard;
  }

  updateCurrentCard() {
    this._currentCard = this._hand.shift();
  }

}

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const removeElement = ((arr, value) => {
  for (const curr of arr) {
    if  (curr === value) {
      arr.splice(arr.indexOf(value), 1);
      break;
    }
  }
  return arr;
});

const compareHands = ((p1, p2, dealer) => {
  if (p1._currentBid > p2._currentBid) {
    p1._wonBids.push(dealer._hand.shift());
  } else if (p2._currentBid > p1._currentBid) {
    p2._wonBids.push(dealer._hand.shift());

  } else {
    dealer.heldCard.push(dealer._currentCard);
  }
  removeElement(p1._hand, p1._currentBid);
  removeElement(p2._hand, p2._currentBid);
});

const verifyBid = (playerObj) => {
  return playerObj._hand.includes(playerObj._currentBid);
};

const initializeHands = () => {
  return {
    dealer:  {_hand: shuffle([...Array(13).keys()]), heldCard: [], _currentCard: null},
    player1: {_hand: [...Array(13).keys()], _wonBids: [], score: 0, _socketID: '', _currentBid: ''},
    player2: {_hand: [...Array(13).keys()], _wonBids: [], score: 0, _socketID: '', _currentBid: ''}
  };
};

// const player1 = {_hand: [...Array(13).keys()], _wonBids: [], score: 0, _socketID: '', _currentBid: ''};
// const player2 = {_hand: [...Array(13).keys()], _wonBids: [], score: 0, _socketID: '', _currentBid: ''};
// const dealer = {_hand: shuffle([...Array(13).keys()]), heldCard: [], _currentCard: null};

// console.log(dealer);

// console.log('player1:',player1._hand);
// console.log('player2:',player2._hand);
// console.log('dealer:',dealer._hand[0]);
// player1._currentBid = 4;
// player2._currentBid = 3;
// dealer._currentCard = dealer._hand[0];
// compareHands(player1, player2, dealer);
// console.log('player1:', player1._hand);
// console.log('player1 bids:', player1._wonBids);
// console.log('player2:', player2._hand);
// console.log('dealer:', dealer._hand);

module.exports = {compareHands, shuffle, verifyBid, initializeHands};
