module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true
  },
  extends: ['standard', 'plugin:vue/recommended'],
  overrides: [
    {
      files: ['*.test.js'],
      rules: {
        'no-unused-expressions': 'off'
      }
    }
  ]
}
