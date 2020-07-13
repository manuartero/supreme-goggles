const { name, version } = require("./package.json");
const { generateHero } = require("./src/generator");

console.info(`${name} v${version}`);

for (let i = 0; i < 50; i++) {
  const hero = generateHero({});
  console.info(hero);
}
