/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-tap';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester();

ruleTester.run("no-tap", rule, {
  valid: [
    `
      // no tap
      import { of } from "rxjs";
      import { map } from "rxjs/operators";
      const ob = of(1).pipe(
        map(x => x * 2)
      );
    `,
    `
      // no tap with shallow import
      import { map, of } from "rxjs";
      const ob = of(1).pipe(
        map(x => x * 2)
      );
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'tap',
      messageId,
      annotatedSource: `
        // tap
        import { of } from "rxjs";
        import { map, tap } from "rxjs/operators";
                      ~~~
        const ob = of(1).pipe(
          map(x => x * 2),
          tap(value => console.log(value))
        );
      `
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'tap with shallow import',
      messageId,
      annotatedSource: `
        // tap with shallow import
        import { map, of, tap } from "rxjs";
                          ~~~
        const ob = of(1).pipe(
          map(x => x * 2),
          tap(value => console.log(value))
        );
      `
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'tap alias',
      messageId,
      annotatedSource: `
        // tap alias
        import { of } from "rxjs";
        import { map, tap as tapAlias } from "rxjs/operators";
                      ~~~
        const ob = of(1).pipe(
          map(x => x * 2),
          tapAlias(value => console.log(value))
        );
      `
    }),
  ],
});
