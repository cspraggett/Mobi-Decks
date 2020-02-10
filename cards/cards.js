class Cards {
  constructor(numCards) {
    this._hands = [...Array(numCards).keys()];
  }

  shuffle() {
    for (let i = this._hands.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._hands[i], this._hands[j]] = [this._hands[j], this._hands[i]];
    }
  }
}

class Player {
  constructor() {
    this._id = null;
    this._hand = this.sethand();
    this._wonBids = [];
    this._socketID = null;
    this._currentBid = null;
  }

  setId(num) {
    this._id = num;
  }

  sethand() {
    const nh = new Cards(13);
    return nh._hands;
  }

  shuffle() {
    for (let i = this._hand.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._hand[i], this._hand[j]] = [this._hand[j], this._hand[i]];
    }
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
    this._hand = this._hand.filter(curr => curr !== this._currentBid);
  }

  verifyBid() {
    return this._hand.includes(this._currentBid);
  }
}



class Dealer {
  constructor() {
    this._hand = this.sethand();
    this._currentCard =  this._hand.shift();
  }

  sethand() {
    const nh = new Cards(13);
    nh.shuffle();
    return nh._hands;
  }

  get currentCard() {
    return this._currentCard;
  }

  updateCurrentCard() {
    this._currentCard = this._hand.shift();
  }

}


const compareHands = ((p1, p2, dealer) => {
  console.log(p1.currentBid > p2.currentBid);
  p1.currentBid > p2.currentBid ? p1.addToWonBids(dealer.currentCard) : p2.currentBid > p1.currentBid ? p2.addToWonBids(dealer.currentCard) : undefined;
  p1.updateHand();
  p2.updateHand();
  dealer.updateCurrentCard();
});

// const d = new Dealer();
// console.log(d);

// const p1 = new Player();
// p1.shuffle();
// const p2 = new Player();
// p2.shuffle();
// console.log('p1:', p1);
// console.log('p2:', p2);

// for (let i = 0; i < 13; i++) {
//   p1.currentBid = (p1._hand[0]);
//   p2.currentBid = (p2._hand[0]);
//   console.log(`---hand #${i}---`);
//   console.log('dealer:', d);
//   compareHands(p1, p2, d);
//   console.log('p1:', p1);
//   console.log('p2:', p2);
//   console.log('\n\n-----------------------\n\n');
// }

// console.log('---end---');
// console.log('dealer', d);
// console.log('player 1:', p1);
// console.log('player 2', p2);

// const shuffle = (arr) => {
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
//   return arr;
// };

// const removeElement = ((arr, value) => {
//   for (const curr of arr) {
//     if  (curr === value) {
//       arr.splice(arr.indexOf(value), 1);
//       break;
//     }
//   }
//   return arr;
// });

// const compareHands = ((p1, p2, dealer) => {
//   if (p1._currentBid > p2._currentBid) {
//     p1._wonBids.push(dealer._hand.shift());
//   } else if (p2._currentBid > p1._currentBid) {
//     p2._wonBids.push(dealer._hand.shift());

//   } else {
//     dealer.heldCard.push(dealer._currentCard);
//   }
//   removeElement(p1._hand, p1._currentBid);
//   removeElement(p2._hand, p2._currentBid);
// });

// const verifyBid = (playerObj) => {
//   return playerObj._hand.includes(playerObj._currentBid);
// };

// const initializeHands = () => {
//   return {
//     dealer:  {_hand: shuffle([...Array(13).keys()]), heldCard: [], _currentCard: null},
//     player1: {_hand: [...Array(13).keys()], _wonBids: [], score: 0, _socketID: '', _currentBid: ''},
//     player2: {_hand: [...Array(13).keys()], _wonBids: [], score: 0, _socketID: '', _currentBid: ''}
//   };
// }



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

module.exports = {compareHands, Dealer, Cards, Player};
