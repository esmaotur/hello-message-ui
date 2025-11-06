const { defineConfig } = require("cypress");
const createBundler = require("@cypress/webpack-preprocessor");
const webpack = require("webpack");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          webpackOptions: {
            resolve: { extensions: [".js"] },
            module: {
              rules: [
                {
                  test: /\.feature$/,
                  use: [
                    {
                      loader: "@badeball/cypress-cucumber-preprocessor/webpack",
                      options: config,
                    },
                  ],
                },
              ],
            },
            plugins: [new webpack.DefinePlugin({})],
          },
        })
      );

      return config;
    },
    specPattern: "cypress/e2e/**/*.feature",
    supportFile: "cypress/support/e2e.js",
    chromeWebSecurity: false,
  },
});
