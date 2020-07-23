/**
 * "Mulberry32 is a simple generator with a 32-bit state, but is extremely fast and has good quality"
 * @see https://stackoverflow.com/a/47593316/1614677
 * @param {number} seed
 * @return {number} (0,1)
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
  const seed = randomSeed || Math.random() * 100000000000;
  const random = mulberry32(seed);

  const number = (low, high) => Math.floor(random() * (high - low + 1) + low);

  const play = (bet) => number(1, 100) <= bet.split("%")[0];

  /**
   * @param {Array<number>} weights
   * @param {number}
   * @return {number}
   */
  const chooseWeightedIndex = (weights) => {
    let acc = 0;
    // if the weights are [5, 30, 10],
    // this would build an array containing [5, 35, 45], and acc=45
    const ranges = weights.map((weight) => (acc += weight));

    const selectedValue = random() * acc;

    // If the selected value is within one of the ranges, that's our choice!
    for (let index = 0; index < ranges.length; index++) {
      if (selectedValue < ranges[index]) {
        return index;
      }
    }
    // If nothing was chosen, all weights were 0 or something went wrong.
    return -1;
  };

  /**
   * @param {Array<any>} arr
   * @param {string?} weightKey
   */
  const pick = (arr, weightKey = "weight") => {
    if (!arr || arr.length <= 0) {
      return null;
    }
    if (typeof arr[0] !== "object") {
      return arr[number(0, arr.length - 1)];
    }
    const weights = arr
      .filter(
        (item) => (item[weightKey] !== undefined ? item[weightKey] : 1) > 0
      )
      .map((item) => item[weightKey] || 1);
    const selectedIndex = chooseWeightedIndex(weights);

    return selectedIndex >= 0 ? arr[selectedIndex] : null;
  };

  /**
   *
   * @param {number} min
   * @param {number} max
   * @param {number?} skew
   * @see https://stackoverflow.com/a/49434653/1614677
   */
  const normal = (min, max, { skew, round } = { skew: 1, round: true }) => {
    let u = random(); // (0,1)
    let v = random(); // (0,1)

    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1

    if (num > 1 || num < 0) {
      // resample between 0 and 1 if out of range
      num = normal(min, max, skew);
    }
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return round ? Math.round(num) : num;
  };

  return {
    normal,
    number,
    pick,
    play,
    random,
    seed,
  };
};

module.exports = { randomGenerator };
