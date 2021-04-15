const { RandomGenerator } = require("@manutero/randomjs");
const { read, listFileNames } = require("../yaml-reader");

const {
  sumCompatibleWeights,
  noCompatibilities,
} = require("./compatibilities");

const random = RandomGenerator();

const keyWithIcon = ({ key, icon }) => `${key} ${icon} `;
const keys = (arr) => arr.map((e) => e.key);

const DEFAULT_USA_NAMES = read("resources.countries.default.usa");

const chooseRace = () =>
  random.pickOne([
    { key: "Human", weight: 999 },
    { key: "Extraterrestrial", weight: 1 },
  ]).key;

const chooseAge = () => random.normal(12, 52, { skew: 2, round: true });

const chooseHeroClass = () => {
  const heroClasses = read("resources.hero-class");
  return random.pickOne(heroClasses);
};

const chooseHabilities = ({ heroClass }) => {
  if (heroClass.key === "Sidekick") {
    return [];
  }
  const numberOfHabilities = random.pickOne([
    { key: 1, weight: 10 },
    { key: 2, weight: 8 },
    { key: 3, weight: 1 },
  ]).key;

  const habilities = [];
  while (habilities.length < numberOfHabilities) {
    const hability = random.pickOne(heroClass.habilities);
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
  const country = random.pickOne(countries);
  return read(`resources.countries.${country}`);
};

const simplifyCountry = ({ key }) => (key.includes("USA") ? "USA" : key);

const chooseGenre = ({ race }) => {
  if (race === "Extraterrestrial" && random.play("50%")) {
    return "NA";
  }
  return random.pickOne(["male", "female"]);
};

const chooseRealName = ({ genre, country, race }) => {
  if (race === "Extraterrestrial") {
    const alienNames = read("resources.countries.default.alien");
    return { givenName: random.pickOne(alienNames), familyName: "" };
  }
  const givenName = random.pickOne(country.givenNames[genre]).key;
  const familyName = country.familyNames
    ? random.pickOne(country.familyNames).key
    : random.pickOne(DEFAULT_USA_NAMES.familyNames).key;
  return { givenName, familyName };
};

const chooseInnerDrives = () => {
  const innerDrives = read("resources.inner-drives");
  const drives = [random.pickOne(innerDrives)];
  if (!drives[0].unique && random.play("25%")) {
    const secondDrive = random.pickOne(innerDrives);
    if (!secondDrive.unique && secondDrive.key !== drives[0].key) {
      drives.push(secondDrive);
    }
  }
  return drives;
};

const chooseHeroNameWithArticle = (fileContent) => {
  const name = random.pickOne(fileContent).key;
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
  return random.pickOne(compatibleWeights).key;
};

const chooseHeroNameWithVocative = (keys, fileContent) => {
  const compatibleWeights = sumCompatibleWeights(fileContent, keys);
  if (noCompatibilities(compatibleWeights)) {
    throw {
      what: "CAN'T CREATE A 'VOCATIVE' HERO NAME",
      when: keys,
    };
  }
  const vocative = random.pickOne(compatibleWeights).key;
  let name = random.pickOne(keys).split(" ")[0]; // one word
  if (random.play("10%")) {
    name = name[0];
  }
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
    return random.pickOne(compatibleWeights).key;
  };

  return `${chooseA(fileContent["adjetives"])} ${chooseA(
    fileContent["nouns"]
  )}`;
};

/**
 * @param {Array<string>} keys
 */
const chooseHeroName = (keys) => {
  const algorithim = random.pickOne(listFileNames("resources.names"));
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
