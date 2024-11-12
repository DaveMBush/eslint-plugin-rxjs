/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-etc
 */

import { RuleTester } from '@typescript-eslint/rule-tester';
import { ParserOptions } from '@typescript-eslint/utils/ts-eslint';
import { resolve } from 'path';

RuleTester.afterAll = mocha.after;

export function createRuleTester({
  filename = './tests/file.tsx',
  project = resolve('./tests/tsconfig.json'),
}: {
  filename?: string;
  // parser?: string;
  project?: string;
} = {}) {
  return function ruleTester({
    typeScript = true,
    types = true,
  }: {
    typeScript?: boolean;
    types?: boolean;
  } = {}) {
    const parserOptions: ParserOptions = {
      ecmaFeatures: { jsx: true },
      ecmaVersion: 2020,
      project: typeScript && types ? project : undefined,
      sourceType: 'module',
    } as const;
    const tester = new RuleTester({
      defaultFilenames: {
        ts: filename,
        tsx: filename,
      },
    });
    const run = tester.run;
    tester.run = (name, rule, { invalid = [], valid = [] }) =>
      run.call(tester, name, rule, {
        invalid: invalid.map((test) => ({
          ...test,
          languageOptions: { parserOptions },
        })),
        valid: valid.map((test) =>
          typeof test === 'string'
            ? { code: test, languageOptions: { parserOptions } }
            : { ...test, languageOptions: { parserOptions } },
        ),
      });
    return tester;
  };
}
