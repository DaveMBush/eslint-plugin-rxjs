/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-unsafe-first';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

const setup = `
  import { EMPTY, Observable, of } from "rxjs";
  import { first, switchMap, take, tap } from "rxjs/operators";

  function ofType<T>(type: string, ...moreTypes: string[]): (source: Observable<T>) => Observable<T> {
    return source => source;
  }

  type Actions = Observable<any>;
  const actions = of({});
  const actions$ = of({});
  const that = { actions };
`.replace(/\n/g, "");

ruleTester.run("no-unsafe-first", rule, {
  valid: [
    {
      code: `
        // actions nested first
        ${setup}
        const safePipedOfTypeFirstEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(first()))
        );
      `,
    },
    {
      code: `
        // actions nested take
        ${setup}
        const safePipedOfTypeTakeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(take(1)))
        );
      `,
    },
    {
      code: `
        // actions property nested first
        ${setup}
        const safePipedOfTypeFirstEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(first()))
        );
      `,
    },
    {
      code: `
        // actions property nested take
        ${setup}
        const safePipedOfTypeTakeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(take(1)))
        );
      `,
    },
    {
      code: `
        // epic nested first
        ${setup}
        const safePipedOfTypeFirstEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(first()))
        );
      `,
    },
    {
      code: `
        // epic nested take
        ${setup}
        const safePipedOfTypeTakeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(take(1)))
        );
      `,
    },
    {
      code: `
        // non-matching options
        ${setup}
        const safePipedOfTypeFirstEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          first()
        );
      `,
      options: [{ observable: "foo" }],
    },
    {
      code: `
        // mid-identifier action
        ${setup}
        const safe = transactionSource.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          first()
        );
      `,
      options: [{ observable: "foo" }],
    },
    {
      code: `
        // mid-identifier action
        import { of } from "rxjs";
        import { first, tap } from "rxjs/operators";
        const transactionSource = of();
        const safe = transactionSource.pipe(
          tap(() => {}),
          first()
        );
      `,
    },
    {
      code: `
        // https://github.com/cartant/eslint-plugin-rxjs/issues/89
        ${setup}
        const safeEffect$ = actions$.pipe(
          ofType("SAVING"),
          mergeMap(({ entity }) =>
            actions$.pipe(
              ofType("ADDED", "MODIFIED"),
              tap(() => {}),
              first(),
              tap(() => {}),
            ),
          ),
        );
      `,
    },
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'actions first',
      messageId,
      annotatedSource: `
        ${setup}
        const unsafePipedOfTypeFirstEffect = actions$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          first()
          ~~~~~
        );
      `
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'actions take',
      messageId,
      annotatedSource: `
        ${setup}
        const unsafePipedOfTypeTakeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
          ~~~~
        );
      `
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'actions property first',
      messageId,
      annotatedSource: `
        // actions property first
        ${setup}
        const unsafePipedOfTypeFirstEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          first()
          ~~~~~
        );
      `
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'actions property take',
      messageId,
      annotatedSource: `
        // actions property take
        ${setup}
        const unsafePipedOfTypeTakeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
          ~~~~
        );
      `
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'epic first',
      messageId,
      annotatedSource: `
        // epic first
        ${setup}
        const unsafePipedOfTypeFirstEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          first()
          ~~~~~
        );
      `
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'epic take',
      messageId,
      annotatedSource: `
        //epic take
        ${setup}
        const unsafePipedOfTypeTakeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
          ~~~~
        );
      `
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'matching options',
      messageId,
      annotatedSource: `
        // matching options
        ${setup}
        const unsafePipedOfTypeTakeEpic = (foo: Actions) => foo.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
          ~~~~
        );
      `,
      options: [
        {
          observable: "foo",
        },
      ],
    }),
  ],
});
