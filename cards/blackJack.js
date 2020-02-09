const translater = {
  0: 'AC',
  1: '2C',
  2: '3C',
  3: '4C',
  4: '5C',
  5: '6C',
  6: '7C',
  7: '8C',
  8: '9C',
  9: '10C',
  10: 'JC',
  11: 'QC',
  12: 'KC',
  13: 'AS',
  14: '2S',
  15: '3S',
  16: '4S',
  17: '5S',
  18: '6S',
  19: '7S',
  20: '8S',
  21: '9S',
  22: '10S',
  23: 'JS',
  24: 'QS',
  25: 'KS',
  26: 'AH',
  27: '2H',
  28: '3H',
  29: '4H',
  30: '5H',
  31: '6H',
  32: '7H',
  33: '8H',
  34: '9H',
  35: '10H',
  36: 'JH',
  37: 'QH',
  38: 'KH',
  39: 'AD',
  40: '2D',
  41: '3D',
  42: '4D',
  43: '5D',
  44: '6D',
  45: '7D',
  46: '8D',
  47: '9D',
  48: '10D',
  49: 'JD',
  50: 'QD',
  51: 'KD'
};

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// const deal = deck=> {

// }

const deck = ([...Array(52).keys()]);
shuffle(deck);
let j = 1;
for (const i of deck) {
  console.log(j++, translater[i]);
}
