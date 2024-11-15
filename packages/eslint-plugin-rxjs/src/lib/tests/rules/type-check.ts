import { RuleTesterConfig } from '@typescript-eslint/rule-tester';

import path from 'path';
export const testCheckConfig = {
  languageOptions: {
    parserOptions: {
      parser: '@typescript-eslint/parser',
      projectService: {
        allowDefaultProject: [
          '*.ts','*.tsx'
        ],
      },
      project: path.join(__dirname, '../../../../tsconfig.lib.json'),
      tsconfigRootDir: path.join(__dirname, '../../../../'),
    },
  },
} as RuleTesterConfig
