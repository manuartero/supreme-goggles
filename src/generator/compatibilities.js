const keyValuePair = (obj) => {
  const key = Object.keys(obj)[0];
  const value = obj[key];
  return { key, value };
};

/**
 * @param {Array<HeroGenerator.KeyCompatibility>} keyCompatibilities
 * @param {Array<string>} keys
 */
const sumCompatibleWeights = (keyCompatibilities, keys) => {
  const reducer = (acc, currentValue) => {
    const { key: compKey, value: compWeight } = keyValuePair(currentValue);
    if (keys.includes(compKey)) {
      if (!isNaN(compWeight)) {
        acc += compWeight;
      }
    }
    return acc;
  };

  return keyCompatibilities
    .filter(({ constraints = [] }) => {
      return constraints.every((constraint) => keys.includes(constraint));
    })
    .map(({ key, compatibilities }) => {
      const weight =
        compatibilities === undefined ? 1 : compatibilities.reduce(reducer, 0);
      return { key, weight };
    });
};

/**
 * @param {Array} arr
 */
const noCompatibilities = (arr) =>
  !arr || arr === [] || arr.every(({ weight }) => weight < 1);

module.exports = {
  sumCompatibleWeights,
  noCompatibilities,
};
