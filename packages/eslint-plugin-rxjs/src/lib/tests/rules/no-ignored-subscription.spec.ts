/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-ignored-subscription';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run("no-ignored-subscription", rule, {
  valid: [
    `
      // const and add
      import { of } from "rxjs";
      const a = of(42).subscribe();
      a.add(of(42).subscribe());
    `,
    `
      // let
      import { Subscription } from "rxjs";
      let b: Subscription;
      b = of(42).subscribe();
    `,
    `
      // array element
      import { of } from "rxjs";
      const c = [of(42).subscribe()];
    `,
    `
      // object property
      import { of } from "rxjs";
      const d = { subscription: of(42).subscribe() };
    `,
    `
      // subscriber
      import { of, Subscriber } from "rxjs";
      const subscriber = new Subscriber<number>();
      of(42).subscribe(subscriber);
    `,
    `
      // https://github.com/cartant/eslint-plugin-rxjs/issues/61
      const whatever = {
        subscribe(callback?: (value: unknown) => void) {}
      };
      whatever.subscribe(() => {});
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'ignored',
      messageId,
      annotatedSource: `
        // ignored
        import { of } from "rxjs";
        of(42).subscribe();
               ~~~~~~~~~
      `
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'ignored subject',
      messageId,
      annotatedSource: `
        import { Subject } from "rxjs";
        const s = new Subject<any>()
        s.subscribe();
          ~~~~~~~~~
      `
    }),
  ],
});
