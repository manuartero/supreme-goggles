const { name, version } = require("./package.json");
const { read } = require("./src/yaml-reader");

console.info(`${name} v${version}`);
console.info(read("names/usa"));
