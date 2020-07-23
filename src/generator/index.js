const { read, listFileNames } = require("../yaml-reader");
const { randomGenerator } = require("../random");
const {
  sumCompatibleWeights,
  noCompatibilities,
} = require("./compatibilities");

const random = randomGenerator();

const keyWithIcon = ({ key, icon }) => `${key} ${icon} `;
const keys = (arr) => arr.map((e) => e.key);

const DEFAULT_USA_NAMES = read("resources.countries.default.usa");

const chooseRace = () =>
  random.pick([
    { key: "Human", weight: 999 },
    { key: "Extraterrestrial", weight: 1 },
  ]).key;

const chooseAge = () => random.normal(12, 52, { skew: 2, round: true });

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
    const alienNames = read("resources.countries.default.alien");
    return { givenName: random.pick(alienNames), familyName: "" };
  }
  const givenName = random.pick(country.givenNames[genre]).key;
  const familyName = country.familyNames
    ? random.pick(country.familyNames).key
    : random.pick(DEFAULT_USA_NAMES.familyNames).key;
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

const chooseHeroNameWithArticle = (fileContent) => {
  const name = random.pick(fileContent).key;
  return `The ${name}`;
};

const chooseSoloHeroName = (keys, fileContent) => {
  const compatibleWeights = sumCompatibleWeights(fileContent, keys);
  if (noCompatibilities(compatibleWeights)) {
    throw {
      what: "CAN'T CREATE A 'SOLO' HERO NAME",
      when: keys,
    };
  }
  return random.pick(compatibleWeights).key;
};

const chooseHeroNameWithVocative = (keys, fileContent) => {
  const compatibleWeights = sumCompatibleWeights(fileContent, keys);
  if (noCompatibilities(compatibleWeights)) {
    throw {
      what: "CAN'T CREATE A 'VOCATIVE' HERO NAME",
      when: keys,
    };
  }
  const vocative = random.pick(compatibleWeights).key;
  let name = random.pick(keys).split(" ")[0]; // first letter
  return `${vocative} ${name}`;
};

const chooseBaseHeroName = (keys, fileContent) => {
  const chooseA = (arr) => {
    const compatibleWeights = sumCompatibleWeights(arr, keys);
    if (noCompatibilities(compatibleWeights)) {
      throw {
        what: "CAN'T CREATE A 'BASE' HERO NAME",
        when: keys,
      };
    }
    return random.pick(compatibleWeights).key;
  };

  return `${chooseA(fileContent["adjetives"])} ${chooseA(
    fileContent["nouns"]
  )}`;
};

/**
 * @param {Array<string>} keys
 */
const chooseHeroName = (keys) => {
  const algorithim = random.pick(listFileNames("resources.names"));
  const fileContent = read(`resources.names.${algorithim}`);
  switch (algorithim) {
    case "article":
      return chooseHeroNameWithArticle(fileContent);
    case "solo":
      return chooseSoloHeroName(keys, fileContent);
    case "vocatives":
      return chooseHeroNameWithVocative(keys, fileContent);
    case "base":
    default:
      return chooseBaseHeroName(keys, fileContent);
  }
};

const generateHero = (opts) => {
  const race = chooseRace();
  const age = chooseAge();
  const heroClass = chooseHeroClass();
  const habilities = chooseHabilities({ heroClass });
  const country = chooseCountry({ race });
  const genre = chooseGenre({ race });
  const realName = chooseRealName({ country, genre, race });
  const innerDrives = chooseInnerDrives();
  const heroKeys = [
    race,
    genre,
    simplifyCountry(country),
    heroClass.key,
    ...keys(habilities),
    ...keys(innerDrives),
  ];
  const heroName = random.play("10%") ? realName : chooseHeroName(heroKeys);

  return {
    race,
    age,
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
