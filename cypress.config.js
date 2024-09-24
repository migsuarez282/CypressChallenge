const { defineConfig } = require('cypress');
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
const getCompareSnapshotPlugin = require('cypress-image-diff-js/plugin');

module.exports = defineConfig({
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'https://automationexercise.com/',
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      return getCompareSnapshotPlugin(on, config);
  }
  },
  experimentalWebKitSupport: true
});
