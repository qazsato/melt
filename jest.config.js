module.exports = {
  setupFiles: ['./tests/unit/jsdom-polyfill.js'],
  preset: '@vue/cli-plugin-unit-jest/presets/typescript',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  transformIgnorePatterns: [],
}
