
// class cards {
//   constructor() {
//     this.deck = [...Array(52).keys()];
//   }

//   }
// }
const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const player1 = {hand: [...Array(13).keys()], wonBids: []};
const player2 = {hand: [...Array(13).keys()], wonBids: []};
const dealer = {hand: shuffle([...Array(13).keys()])};
// const c = new cards();
console.log('player1:',player1.hand);
console.log('player2:',player2.hand);
console.log('dealer:',dealer.hand[0]);

