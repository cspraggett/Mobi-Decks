const {assert} = require('chai');
const {shuffle, compareHands} = require('../cards/cards');

describe(cards, () => {
  it('Shuffle should return an array different than what it was given', () => {
    const initialArray = [1,2,3,4];
    assert.deepEqual(shuffle(initialArray), !initialArray);
  });
});
