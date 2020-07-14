const { read, listFileNames } = require("./yaml-reader");
const { randomGenerator } = require("./random");

const random = randomGenerator();

const keyWithIcon = ({ key, icon }) => `${key} ${icon} `;

const DEFAULT_NAMES = read("resources.names.default");

const chooseHeroClass = () => {
  const heroClasses = read("resources.hero-class");
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

const chooseCountry = () => {
  const countries = listFileNames("resources.countries");
  const country = random.pick(countries);
  const countryObj = read(`resources.countries.${country}`);
  const key = Object.keys(countryObj)[0];
  const icon = countryObj[key].icon || DEFAULT_NAMES.icon;
  return { key, icon, countryInfo: countryObj[key] };
};

const chooseGenre = () => random.pick(["male", "female"]);

const chooseRealName = ({ genre, country }) => {
  const givenName = random.pick(country.countryInfo.givenNames[genre]).key;
  const familyName = country.countryInfo.familyNames
    ? random.pick(country.countryInfo.familyNames).key
    : random.pick(DEFAULT_NAMES.familyNames).key;
  return { givenName, familyName };
};

const generateHero = (opts) => {
  const heroClass = chooseHeroClass();
  const habilities = chooseHabilities({ heroClass });
  const country = chooseCountry();
  const genre = chooseGenre();
  const realName = chooseRealName({ country, genre });
  return {
    country: keyWithIcon(country),
    genre,
    realName: `${realName.givenName} ${realName.familyName}`,
    heroClass: keyWithIcon(heroClass),
    habilities: habilities.map(keyWithIcon),
  };
};

module.exports = { generateHero };
