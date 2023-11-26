/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // テスト実行エラーになるため無視する
    '^@liradb2000/markdown-it-mermaid$': '<rootDir>/tests/markdown-it-mock.js',
    '\\.css$': '<rootDir>/tests/style-mock.js',
  },
  setupFiles: ['./tests/jsdom-polyfill.js'],
}
