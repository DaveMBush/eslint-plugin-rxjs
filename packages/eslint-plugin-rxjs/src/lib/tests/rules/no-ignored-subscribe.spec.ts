/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-ignored-subscribe';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run("no-ignored-subscribe", rule, {
  valid: [
    {
      code: `
        // not ignored
        import { of } from "rxjs";

        const observable = of([1, 2]);
        observable.subscribe(value => console.log(value));
      `,
    },
    {
      code: `
        // subject not ignored
        import { Subject } from "rxjs";

        const subject = new Subject<any>();
        subject.subscribe(value => console.log(value));
      `,
    },
    {
      code: `
        // not ignored non-arrow
        import { of } from "rxjs";

        function log(value) {
          console.log(value)
        }

        const observable = of([1, 2]);
        observable.subscribe(log);
      `,
    },
    {
      code: `
        // https://github.com/cartant/eslint-plugin-rxjs/issues/61
        const whatever = {
          subscribe(callback?: (value: unknown) => void) {}
        };
        whatever.subscribe();
      `,
    },
    {
      code: `
        // https://github.com/cartant/eslint-plugin-rxjs/issues/69
        import { Subscribable } from "rxjs";
        declare const subscribable: Subscribable<unknown>;
        subscribable.subscribe((value) => console.log(value));
      `,
    },
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'ignored',
      messageId,
      annotatedSource: `
        // ignored
        import { of } from "rxjs";

        const observable = of([1, 2]);
        observable.subscribe();
                   ~~~~~~~~~
      `
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subject ignored',
      messageId,
      annotatedSource: `
        // subject ignored
        import { Subject } from "rxjs";

        const subject = new Subject<any>();
        subject.subscribe();
                ~~~~~~~~~
      `
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subscribable ignored',
      messageId,
      annotatedSource: `
        // https://github.com/cartant/eslint-plugin-rxjs/issues/69
        import { Subscribable } from "rxjs";
        declare const subscribable: Subscribable<unknown>;
        subscribable.subscribe();
                     ~~~~~~~~~
      `
    }),
  ],
});
