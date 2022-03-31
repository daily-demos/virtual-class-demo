const packageJson = require('./package.json');

module.exports = {
  env: {
    PROJECT_TITLE: packageJson.description,
  },
};
