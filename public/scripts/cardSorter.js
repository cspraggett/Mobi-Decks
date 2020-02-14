const translateCard = function(card) {
  const translater = {
    0: {n: 0, value: 'A', suit: 'club'},
    1: {n: 1, value: '2', suit: 'club'},
    2: {n: 2, value: '3', suit: 'club'},
    3: {n: 3, value: '4', suit: 'club'},
    4: {n: 4, value: '5', suit: 'club'},
    5: {n: 5, value: '6', suit: 'club'},
    6: {n: 6, value: '7', suit: 'club'},
    7: {n: 7, value: '8', suit: 'club'},
    8: {n: 8, value: '9', suit: 'club'},
    9: {n: 9, value: '10', suit: 'club'},
    10: {n: 10, value: 'J', suit: 'club'},
    11: {n: 11, value: 'Q', suit: 'club'},
    12: {n: 12, value: 'K', suit: 'club'},
    13: {n: 0, value: 'A', suit: 'spade'},
    14: {n: 1, value: '2', suit: 'spade'},
    15: {n: 2, value: '3', suit: 'spade'},
    16: {n: 3, value: '4', suit: 'spade'},
    17: {n: 4, value: '5', suit: 'spade'},
    18: {n: 5, value: '6', suit: 'spade'},
    19: {n: 6, value: '7', suit: 'spade'},
    20: {n: 7, value: '8', suit: 'spade'},
    21: {n: 8, value: '9', suit: 'spade'},
    22: {n: 9, value: '10', suit: 'spade'},
    23: {n: 10, value: 'J', suit: 'spade'},
    24: {n: 11, value: 'Q', suit: 'spade'},
    25: {n: 12, value: 'K', suit: 'spade'},
    26: {n: 0, value: 'A', suit: 'heart'},
    27: {n: 1, value: '2', suit: 'heart'},
    28: {n: 2, value: '3', suit: 'heart'},
    29: {n: 3, value: '4', suit: 'heart'},
    30: {n: 4, value: '5', suit: 'heart'},
    31: {n: 5, value: '6', suit: 'heart'},
    32: {n: 6, value: '7', suit: 'heart'},
    33: {n: 7, value: '8', suit: 'heart'},
    34: {n: 8, value: '9', suit: 'heart'},
    35: {n: 9, value: '10', suit: 'heart'},
    36: {n: 10, value: 'J', suit: 'heart'},
    37: {n: 11, value: 'Q', suit: 'heart'},
    38: {n: 12, value: 'K', suit: 'heart'},
    39: {n: 0, value: 'A', suit: 'diamond'},
    40: {n: 1, value: '2', suit: 'diamond'},
    41: {n: 2, value: '3', suit: 'diamond'},
    42: {n: 3, value: '4', suit: 'diamond'},
    43: {n: 4, value: '5', suit: 'diamond'},
    44: {n: 5, value: '6', suit: 'diamond'},
    45: {n: 6, value: '7', suit: 'diamond'},
    46: {n: 7, value: '8', suit: 'diamond'},
    47: {n: 8, value: '9', suit: 'diamond'},
    48: {n: 9, value: '10', suit: 'diamond'},
    49: {n: 10, value: 'J', suit: 'diamond'},
    50: {n: 11, value: 'Q', suit: 'diamond'},
    51: {n: 12, value: 'K', suit: 'diamond'}
  };
  return translater[card];
}

const reverser = function(suit, val) {
  const reverse = {
    'club': {
      'A': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, '10': 9, 'J': 10, 'Q': 11, 'K': 12
    },
    'spade': {
      'A': 13, '2': 14, '3': 15, '4': 16, '5': 17, '6': 18, '7': 19, '8': 20, '9': 21, '10': 22, 'J': 23, 'Q': 24, 'K': 25
    },
    'heart': {
      'A': 26, '2': 27, '3': 28, '4': 29, '5': 30, '6': 31, '7': 32, '8': 33, '9': 34, '10': 35, 'J': 36, 'Q': 37, 'K': 38
    },
    'diamond': {
      'A': 39, '2': 40, '3': 41, '4': 42, '5': 43, '6': 44, '7': 45, '8': 46, '9': 47, '10': 48, 'J': 49, 'Q': 50, 'K': 51
    }
  }
  return reverse[suit][val];
};
