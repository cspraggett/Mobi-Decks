// testing information load in at socket.js

const game1 = {
  dealer: {id: 0, phase: 0, hand: [...Array(13).keys()], heldCard: [], currentCard: "" },
  player1: {id: 1, hand: [...Array(13).keys()], wonBids: [], score: 0, socketID: "", currentBid: ""},
  player2: {id: 2, hand: [...Array(13).keys()], wonBids: [], score: 0, socketID: "", currentBid: ""}
};

module.exports = { game1 };
