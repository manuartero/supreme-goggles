const { read } = require("./yaml-reader");
const { randomGenerator } = require("./random");

const random = randomGenerator();

const chooseCountry = () =>
  random.pick([
    { key: "USA", weight: 1000 },
    { key: "JAPAN", weight: 50 },
    { key: "SPAIN", weight: 50 },
    { key: "RUSSIA", weight: 50 },
  ]).key;

const chooseGenre = () => random.pick(["male", "female"]);

const chooseRealName = ({ genre, country }) => {
  const names = read(`names/${country.toLowerCase()}`);
  const givenName = random.pick(names[genre]);
  const familyName = random.pick(names["family"]);
  return `${givenName} ${familyName}`;
};

const generateHero = (opts) => {
  const country = chooseCountry();
  const genre = chooseGenre();
  const realName = chooseRealName({ country: "usa", genre });
  return { country, genre, realName };
};

module.exports = { generateHero };
