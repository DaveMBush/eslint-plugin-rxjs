const rxjs = require('@smarttools/eslint-plugin-rxjs');
const typescriptEslintParser = require('@typescript-eslint/parser');

module.exports = [
  rxjs.configs.recommended,
  {
    files: ['**/*.ts'],
    plugins: {
      rxjs,
    },
  },
  {
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
];
