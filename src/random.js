const randomInt = (low, high) =>
  Math.floor(Math.random() * (high - low + 1) + low);

/**
 * @param {Array<any>} arr
 */
const randomPick = (arr) => arr[randomInt(0, arr.length - 1)];

module.exports = { randomInt, randomPick };
