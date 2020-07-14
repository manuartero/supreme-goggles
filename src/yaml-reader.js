const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const definePath = (relativeName) =>
  path.join(process.cwd(), ...relativeName.split("."));

/**
 * @param {string} relativeName "resources.countries"
 */
const listFileNames = (relativeName) => {
  try {
    const path = definePath(relativeName);
    const files = fs.readdirSync(path);
    return files.map((file) => file.split(".")[0]);
  } catch (err) {
    throw {
      what: "LISTING FILES IN FOLDER",
      when: `relativeName: ${relativeName}`,
      where: __filename,
      err,
    };
  }
};

/**
 * @param {string} relativeName "resources.countries.alabama"
 */
const read = (relativeName) => {
  try {
    const path = definePath(relativeName);
    const file = fs.readFileSync(path + ".yaml", "utf8");
    const doc = yaml.safeLoad(file);
    return doc;
  } catch (err) {
    throw {
      what: "READING YAML",
      when: `relativeName: ${relativeName}`,
      where: __filename,
      err,
    };
  }
};

module.exports = { read, listFileNames };
