module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['./test/jsdom-polyfill.js'],
  moduleFileExtensions: ['ts', 'js', 'json', 'vue'],
  transform: {
    '^.+\\.ts$': '<rootDir>/node_modules/ts-jest',
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/assets/scripts/**/*.ts',
    'src/utils/**/*.ts',
    'src/**/*.vue'
  ],
  testPathIgnorePatterns: ['/node_modules/', '/release-builds/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@config(.*)$': '<rootDir>/config$1'
  }
}
