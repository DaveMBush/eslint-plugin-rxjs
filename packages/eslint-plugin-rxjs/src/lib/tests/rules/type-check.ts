import { RuleTesterConfig } from '@typescript-eslint/rule-tester';

import path from 'path';

export const testCheckConfig = {
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: [
          'file.ts',
          'react.tsx',
        ],
      },
      project: './tsconfig.lib.json',
      tsconfigRootDir: path.join(__dirname, '../../../../'),
    },
  },
} as RuleTesterConfig
