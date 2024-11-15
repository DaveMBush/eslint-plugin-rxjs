/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { RuleTester } from '@typescript-eslint/rule-tester';
import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-explicit-generics';
import { testCheckConfig } from './type-check';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('no-explicit-generics', rule, {
  valid: [
    {
      code: `
        // without type arguments
        import { BehaviorSubject, from, of, Notification } from "rxjs";
        import { scan } from "rxjs/operators";
        const a = of(42, 54);
        const b1 = a.pipe(
          scan((acc: string, value: number) => acc + value, "")
        );
        const b2 = a.pipe(
          scan((acc, value): string => acc + value, "")
        );
        const c = new BehaviorSubject(42);
        const d = from([42, 54]);
        const e = of(42, 54);
        const f = new Notification("N", 42);
        // These no longer work and would conflict with
        // the typechecker if they were allowed.
        //const g = new Notification<number>("E", undefined, "Kaboom!");
        //const h = new Notification<number>("C");`,
    },
    {
      code: `
        // with array and object literals
        import { BehaviorSubject, Notification } from "rxjs";
        const a = new BehaviorSubject<number[]>([42]);
        const b = new BehaviorSubject<number[]>([]);
        const c = new BehaviorSubject<{ answer: number }>({ answer: 42 });
        const d = new BehaviorSubject<{ answer?: number }>({});
        const e = new Notification<number[]>("N", [42]);
        const f = new Notification<number[]>("N", []);
        const g = new Notification<{ answer: number }>("N", { answer: 42 });
        const h = new Notification<{ answer?: number }>("N", {});
      `,
    },
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'scan with type arguments',
      annotatedSource: `
        // scan with type arguments
        import { scan, of } from "rxjs";
        const a = of(42, 54);
        const b = a.pipe(
          scan<number, string>((acc, value) => acc + value, "")
              ~~~~~~~~~~~~~~~~
        );
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'BehaviorSubject with type arguments',
      annotatedSource: `
        // BehaviorSubject with type arguments
        import { BehaviorSubject } from "rxjs";
        const b = new BehaviorSubject<number>(42);
                                     ~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'from with type arguments',
      annotatedSource: `
        // from with type arguments
        import { from } from "rxjs";
        const f = from<number>([42, 54]);
                      ~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'of with type arguments',
      annotatedSource: `
        // of with type arguments
        import { of } from "rxjs";
        const o = of<number>(42, 54);
                    ~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'Notification with type arguments',
      annotatedSource: `
        // Notification with type arguments
        import { Notification } from "rxjs";
        const n = new Notification<number>("N", 42);
                                  ~~~~~~~~
      `,
    }),
  ],
});
