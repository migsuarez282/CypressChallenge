const { defineConfig } = require('cypress');
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
const getCompareSnapshotPlugin = require('cypress-image-diff-js/plugin');

module.exports = defineConfig({
  retries: 2,
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'https://www.laboratoriodetesting.com',
    viewportWidth: 1280,
    viewportHeight: 720,
   
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      return getCompareSnapshotPlugin(on, config);
  },
  defaultCommandTimeout: 10000,
  },
  experimentalWebKitSupport: true
});