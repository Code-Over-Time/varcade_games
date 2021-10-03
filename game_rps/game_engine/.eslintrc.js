module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: ["eslint:recommended", "standard"],
  rules: {
    "linebreak-style": ["error", "unix"]
  },
  parserOptions: {
    ecmaVersion: 12
  }
}
