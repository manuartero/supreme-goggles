/**
 * "Mulberry32 is a simple generator with a 32-bit state, but is extremely fast and has good quality"
 * @see https://stackoverflow.com/a/47593316/1614677
 * @param {number} seed
 */
const mulberry32 = (seed) => {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * @param {number} randomSeed
 */
const randomGenerator = (randomSeed) => {
  const seed = randomSeed || Math.random();
  const generator = mulberry32(seed);

  const number = (low, high) =>
    Math.floor(generator() * (high - low + 1) + low);

  /**
   * @param {Array<any>} arr
   */
  const pick = (arr) => arr[number(0, arr.length - 1)];

  return {
    seed,
    number,
    pick,
  };
};

module.exports = { randomGenerator };
