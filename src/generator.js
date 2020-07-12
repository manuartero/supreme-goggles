const { read } = require("./yaml-reader");
const { randomPick } = require("./random");

const chooseCountry = () => "USA";

const chooseGenre = () => randomPick(["male", "female"]);

const chooseRealName = ({ genre, country }) => {
  const names = read(`names/${country.toLowerCase()}`);
  const givenName = randomPick(names[genre]);
  const familyName = randomPick(names["family"]);
  return `${givenName} ${familyName}`;
};

const generateHero = (opts) => {
  const country = chooseCountry();
  const genre = chooseGenre();
  const realName = chooseRealName({ country, genre });
  return { country, genre, realName };
};

module.exports = { generateHero };
