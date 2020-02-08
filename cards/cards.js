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
  if (p1.currentBid > p2.currentBid) {
    p1.wonBids.push(dealer.hand.shift());
  } else if (p2.currentBid > p1.currentBid) {
    p2.wonBids.push(dealer.hand.shift());

  } else {
    dealer.heldCard.push(dealer.currentCard);
  }
  removeElement(p1.hand, p1.currentBid);
  removeElement(p2.hand, p2.currentBid);
});

const player1 = {hand: [...Array(13).keys()], wonBids: [], score: 0, socketID: '', currentBid: ''};
const player2 = {hand: [...Array(13).keys()], wonBids: [], score: 0, socketID: '', currentBid: ''};
const dealer = {hand: shuffle([...Array(13).keys()]), heldCard: [], currentCard: ''};

console.log('player1:',player1.hand);
console.log('player2:',player2.hand);
console.log('dealer:',dealer.hand[0]);
player1.currentBid = 4;
player2.currentBid = 3;
dealer.currentCard = dealer.hand[0];
compareHands(player1, player2, dealer);
console.log('player1:', player1.hand);
console.log('player1 bids:', player1.wonBids);
console.log('player2:', player2.hand);
console.log('dealer:', dealer.hand);

