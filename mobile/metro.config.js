const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

// Use wrapWithReanimatedMetroConfig only if reanimated is used, but for now standard config is safer
module.exports = mergeConfig(getDefaultConfig(__dirname), config);
