/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-subscribe-handlers';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run("no-subscribe-handlers", rule, {
  valid: [
    {
      code: `
        // ignored
        import { of } from "rxjs";

        const observable = of([1, 2]);
        observable.subscribe();
      `,
    },
    {
      code: `
        // subject ignored
        import { Subject } from "rxjs";

        const subject = new Subject<any>();
        subject.subscribe();
      `,
    },
    {
      code: `
        import { Subscribable } from "rxjs";
        declare const subscribable: Subscribable<unknown>;
        subscribable.subscribe();
      `,
    },
    {
      code: `
        const whatever = {
          subscribe(callback?: (value: unknown) => void) {}
        };
        whatever.subscribe();
      `,
    },
    {
      code: `
        const whatever = {
          subscribe(callback?: (value: unknown) => void) {}
        };
        whatever.subscribe(console.log);
      `,
    },
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'of',
      messageId,
      annotatedSource: `
        // not ignored
        import { of } from "rxjs";

        const observable = of([1, 2]);
        observable.subscribe(value => console.log(value));
                   ~~~~~~~~~
      `
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subject',
      messageId,
      annotatedSource: `
        // subject not ignored
        import { Subject } from "rxjs";

        const subject = new Subject<any>();
        subject.subscribe(value => console.log(value));
                ~~~~~~~~~
      `
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'non-arrow',
      messageId,
      annotatedSource: `
        // not ignored non-arrow
        import { of } from "rxjs";

        function log(value) {
          console.log(value)
        }

        const observable = of([1, 2]);
        observable.subscribe(log);
                   ~~~~~~~~~
      `
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'Subscribable',
      messageId,
      annotatedSource: `
        import { Subscribable } from "rxjs";
        declare const subscribable: Subscribable<unknown>;
        subscribable.subscribe((value) => console.log(value));
                     ~~~~~~~~~
      `
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'object',
      messageId,
      annotatedSource: `
        import { Subscribable } from "rxjs";
        declare const subscribable: Subscribable<unknown>;
        subscribable.subscribe({
                     ~~~~~~~~~
          next: (value) => console.log(value)
        });
      `
    }),
  ],
});
