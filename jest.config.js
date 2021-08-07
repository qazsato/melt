module.exports = {
  setupFiles: ['./test/jsdom-polyfill.js'],
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/assets/scripts/**/*.js',
    'src/**/*.vue'
  ],
  testPathIgnorePatterns: ['/node_modules/', '/release-builds/'],
  moduleNameMapper: {
    '^@config(.*)$': '<rootDir>/config$1'
  }
}
