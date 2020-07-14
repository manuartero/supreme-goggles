const { read } = require("./yaml-reader");
const { randomGenerator } = require("./random");

const random = randomGenerator();

const keyWithIcon = ({ key, icon }) => `${key} ${icon}`;

const chooseHeroClass = () => {
  const heroClasses = read("hero-class");
  return random.pick(heroClasses);
};

const chooseHabilities = ({ heroClass }) => {
  if (heroClass.key === "Sidekick") {
    return [];
  }
  const numberOfHabilities = random.pick([
    { key: 1, weight: 10 },
    { key: 2, weight: 8 },
    { key: 3, weight: 1 },
  ]).key;

  const habilities = [];
  while (habilities.length < numberOfHabilities) {
    const hability = random.pick(heroClass.habilities);
    // avoid duplicates
    if (habilities.filter((e) => e.key === hability.key).length <= 0) {
      habilities.push(hability);
    }
  }
  return habilities;
};

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
  const heroClass = chooseHeroClass();
  const habilities = chooseHabilities({ heroClass });
  const country = chooseCountry();
  const genre = chooseGenre();
  const realName = chooseRealName({ country: "usa", genre });
  return {
    country,
    genre,
    realName,
    heroClass: keyWithIcon(heroClass),
    habilities: habilities.map(keyWithIcon),
  };
};

module.exports = { generateHero };
