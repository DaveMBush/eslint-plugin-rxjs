const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const join = require('path').join;
const rxjs = require('@smarttools/eslint-plugin-rxjs');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  {
    ignores: ['**/dist'],
  },
  {
    plugins: {
      '@smarttools/rxjs': rxjs,
    },
  },
  ...compat
    .config({
      extends: ['./base.eslint.config.js'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts'],
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        parserOptions: {
          project: join(__dirname, './tsconfig.json'),
        },
      },
      rules: {
        ...config.rules,
      },
    })),
];
