const {getDefaultConfig, mergeConfig} = require('metro-config');

const config = {};

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  return mergeConfig(defaultConfig, config);
})();
