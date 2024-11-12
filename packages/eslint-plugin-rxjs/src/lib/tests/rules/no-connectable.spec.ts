/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { RuleTester } from '@typescript-eslint/rule-tester';
import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-connectable';
import { testCheckConfig } from './type-check';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run("no-connectable", rule, {
  valid: [
    {
      code: `
        // multicast with selector
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          multicast(new Subject(), p => p)
        );`,
    },
    {
      code: `
        // multicast with factory and selector
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          multicast(() => new Subject(), p => p)
        );`,
    },
    {
      code: `
        // multicast with selector variable
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const selector = p => p;
        const result = of(42).pipe(
          multicast(() => new Subject(), selector)
        );`,
    },
    {
      code: `
        // publish with selector
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          publish(p => p)
        );`,
    },
    {
      code: `
        // publishReplay with selector
        import { of, Subject } from "rxjs";
        import { publishReplay } from "rxjs/operators";
        const result = of(42).pipe(
          publishReplay(1, p => p)
        )`,
    },
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'publish',
      annotatedSource: `
        // publish
        import { of, Subject } from "rxjs";
        import { publish } from "rxjs/operators";
        const result = of(42).pipe(
          publish()
          ~~~~~~~
        );
      `
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'publishBehavior',
      annotatedSource: `
        // publishBehavior
        import { of, Subject } from "rxjs";
        import { publishBehavior } from "rxjs/operators";
        const result = of(42).pipe(
          publishBehavior(1)
          ~~~~~~~~~~~~~~~
        );
      `
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'publishLast',
      annotatedSource: `
        // publishLast
        import { of, Subject } from "rxjs";
        import { publishLast } from "rxjs/operators";
        const result = of(42).pipe(
          publishLast()
          ~~~~~~~~~~~
        );
      `
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'publishReplay',
      annotatedSource: `
        // publishReplay
        import { of, Subject } from "rxjs";
        import { publishReplay } from "rxjs/operators";
        const result = of(42).pipe(
          publishReplay(1)
          ~~~~~~~~~~~~~
        );
      `
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'multicast',
      annotatedSource: `
        // multicast
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          multicast(new Subject<number>())
          ~~~~~~~~~
        );
      `
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'multicast with factory',
      annotatedSource: `
        // multicast with factory
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          multicast(() => new Subject<number>())
          ~~~~~~~~~
        );
      `
    }),
  ],
});
