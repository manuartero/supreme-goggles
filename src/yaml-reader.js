const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

/**
 * @param {string} relativeName
 */
const read = (relativeName) => {
  try {
    const filePath = path.join(
      process.cwd(),
      "resources",
      ...relativeName.split("/")
    );
    const file = fs.readFileSync(filePath + ".yaml", "utf8");
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

module.exports = { read };
