const {shuffle, compareHands, verifyBid, initializeHands} = require('./cards');

const {dealer, player1, player2} = initializeHands();
shuffle(player1.hand);
shuffle(player2.hand);
// console.log(player1.hand, player2.hand);

let handNumber = 0;
player1.currentBid = player1.hand[handNumber];
player2.currentBid = player2.hand[handNumber];
dealer.currentCard = dealer.hand[handNumber];
compareHands(player1, player2, dealer);
console.log('hand#', handNumber);
console.log('player1:', player1);
console.log('player2:', player2);
console.log('dealer:', dealer);

handNumber = 1;
player1.currentBid = player1.hand[handNumber];
player2.currentBid = player2.hand[handNumber];
dealer.currentCard = dealer.hand[handNumber];
compareHands(player1, player2, dealer);
console.log('hand#', handNumber);
console.log('player1:', player1);
console.log('player2:', player2);
console.log('dealer:', dealer);
// (async function loop() {
//   for (let handNumber = 0; handNumber < 13; handNumber++) {
//     player1.currentBid = player1.hand[handNumber];
//     player2.currentBid = player2.hand[handNumber];
//     dealer.currentCard = dealer.hand[handNumber];
//     await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
//     // await new Promise((resolve, reject) => {
//     //   compareHands(player1, player2, dealer);
//     //   resolve('data');
//     // })
//     // .then(data => {
//     compareHands(player1, player2, dealer);
//     console.log('hand#', handNumber);
//     console.log('player1:', player1);
//     console.log('player2:', player2);
//     console.log('dealer:', dealer);
//     // })
//     // .catch(err => {
//     //   console.error(err);
//     // })
//     // .finally(() => {
//     //   console.log('in finally');
//     //   handNumber++;
//     //   console.log('hand number:',handNumber);
//     // });
//   }
// });
console.log('this is the end!');
