const { name, version } = require("./package.json");
const { generateHero } = require("./src/generator");

console.info(`${name} v${version}`);

const generateSomeHeros = (n) => {
  for (let i = 0; i < n; i++) {
    const hero = generateHero({});
    console.info(hero);
  }
};

generateSomeHeros(5);
