/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { RuleTester } from '@typescript-eslint/rule-tester';
import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-async-subscribe';
import { testCheckConfig } from './type-check';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run("no-async-subscribe", rule, {
  valid: [
    `
      // sync arrow function
      import { of } from "rxjs";

      of("a").subscribe(() => {});
    `,
    `
      // sync function
      import { of } from "rxjs";

      of("a").subscribe(function() {});
    `,
    {
      code: `
      // https://github.com/cartant/eslint-plugin-rxjs/issues/46
      import React, { FC } from "react";
      const SomeComponent: FC<{}> = () => <span>some component</span>;
      const someElement = <SomeComponent />;
    `,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
    `
      // https://github.com/cartant/eslint-plugin-rxjs/issues/61
      const whatever = {
        subscribe(next?: (value: unknown) => void) {}
      };
      whatever.subscribe(async () => { await 42; });
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'async arrow function',
      annotatedSource: `
        // async arrow function
        import { of } from "rxjs";

        of("a").subscribe(async () => {
                          ~~~~~
          return await "a";
        });
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'async function',
      annotatedSource: `
        // async function
        import { of } from "rxjs";

        of("a").subscribe(async function() {
                          ~~~~~
          return await "a";
        });
      `,
    }),
  ],
});
