/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-ignored-observable';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run("no-ignored-observable", rule, {
  valid: [
    `
      // not ignored
      import { Observable, of } from "rxjs";

      function functionSource() {
        return of(42);
      }

      function sink(source: Observable<number>) {
      }

      const a = functionSource();
      sink(functionSource());
    `,
    `
      // not ignored arrow
      import { Observable, of } from "rxjs";

      const arrowSource = () => of(42);

      function sink(source: Observable<number>) {
      }

      const a = arrowSource();
      sink(arrowSource());
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'ignored',
      messageId,
      annotatedSource: `
        // ignored
        import { Observable, of } from "rxjs";

        function functionSource() {
          return of(42);
        }

        functionSource();
        ~~~~~~~~~~~~~~~~
      `
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'ignored arrow',
      messageId,
      annotatedSource: `
        // ignored arrow
        import { Observable, of } from "rxjs";

        const arrowSource = () => of(42);

        arrowSource();
        ~~~~~~~~~~~~~
      `
    }),
  ],
});
