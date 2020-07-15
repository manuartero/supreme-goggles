const { read, listFileNames } = require("./yaml-reader");
const { randomGenerator } = require("./random");

const random = randomGenerator();

const keyWithIcon = ({ key, icon }) => `${key} ${icon} `;
const keys = (arr) => arr.map((e) => e.key);

const DEFAULT_NAMES = read("resources.names.default");
const HERO_NAMES = read("resources.hero-names");

const chooseRace = () =>
  random.pick([
    { key: "Human", weight: 999 },
    { key: "Extraterrestrial", weight: 1 },
  ]).key;

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

const chooseCountry = ({ race }) => {
  if (race === "Extraterrestrial") {
    return { key: "NA", icon: "" };
  }
  const countries = listFileNames("resources.countries");
  const country = random.pick(countries);
  return read(`resources.countries.${country}`);
};

const simplifyCountry = ({ key }) => (key.includes("USA") ? "USA" : key);

const chooseGenre = ({ race }) => {
  if (race === "Extraterrestrial" && random.play("50%")) {
    return "NA";
  }
  return random.pick(["male", "female"]);
};

const chooseRealName = ({ genre, country, race }) => {
  if (race === "Extraterrestrial") {
    const alienNames = read("resources.names.alien");
    return { givenName: random.pick(alienNames), familyName: "" };
  }
  const givenName = random.pick(country.givenNames[genre]).key;
  const familyName = country.familyNames
    ? random.pick(country.familyNames).key
    : random.pick(DEFAULT_NAMES.familyNames).key;
  return { givenName, familyName };
};

const chooseInnerDrives = () => {
  const innerDrives = read("resources.inner-drives");
  const drives = [random.pick(innerDrives)];
  if (!drives[0].unique && random.play("25%")) {
    const secondDrive = random.pick(innerDrives);
    if (!secondDrive.unique && secondDrive.key !== drives[0].key) {
      drives.push(secondDrive);
    }
  }
  return drives;
};

const keyValuePair = (obj) => {
  const key = Object.keys(obj)[0];
  const value = obj[key];
  return { key, value };
};

/**
 * @param {Array<string>} keys
 */
const chooseHeroName = (keys) => {
  // console.log(keys);

  const sumCompatibleWeights = (acc, currentValue) => {
    const { compKey, compWeight } = keyValuePair(currentValue);
    if (keys.includes(compKey)) {
      acc += compWeight;
    }
    return acc;
  };

  const heroNamesCandidates = HERO_NAMES.map(({ key, compatibilities }) => {
    const weight = compatibilities.reduce(sumCompatibleWeights, 0);
    return { key, weight };
  });

  // console.log(heroNamesCandidates);
};

const generateHero = (opts) => {
  const race = chooseRace();
  const heroClass = chooseHeroClass();
  const habilities = chooseHabilities({ heroClass });
  const country = chooseCountry({ race });
  const genre = chooseGenre({ race });
  const realName = chooseRealName({ country, genre, race });
  const innerDrives = chooseInnerDrives();
  const nameKeys = [
    race,
    genre,
    simplifyCountry(country),
    heroClass.key,
    ...keys(habilities),
    ...keys(innerDrives),
  ];
  const heroName = random.play("80%") ? chooseHeroName(nameKeys) : realName;

  return {
    race,
    genre,
    country: keyWithIcon(country),
    realName: `${realName.givenName} ${realName.familyName}`,
    heroClass: keyWithIcon(heroClass),
    habilities: habilities.map(keyWithIcon),
    innerDrives: keys(innerDrives),
    heroName,
  };
};

module.exports = { generateHero };
