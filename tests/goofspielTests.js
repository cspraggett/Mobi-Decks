const assert = require('chai').assert;
const {shuffle, compareHands} = require('../cards/cards').default;

describe('cards', () => {
  it('Shuffle should return an array different than what it was given', () => {
    const initialArray = [1,2,3,4];
    assert.deepEqual(cards.shuffle(initialArray), !initialArray);
  });
});
