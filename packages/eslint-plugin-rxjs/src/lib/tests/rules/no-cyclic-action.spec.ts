/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { RuleTester } from '@typescript-eslint/rule-tester';
import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-cyclic-action';
import { testCheckConfig } from './type-check';
const ruleTester = new RuleTester(testCheckConfig);

const setup = `
  import { Observable, of } from "rxjs";
  import { mapTo } from "rxjs/operators";

  type Action<T extends string> = { type: T };
  type ActionOfType<T> = T extends string ? Action<T> : never;

  function ofType<T extends readonly string[]>(...types: T): (source: Observable<Action<string>>) => Observable<ActionOfType<T[number]>> {
    return source => source as any;
  }

  type Actions = Observable<Action<string>>;
  const actions = of<Action<string>>();

  const SOMETHING = "SOMETHING";
  const SOMETHING_ELSE = "SOMETHING_ELSE";
`.replace(/\n/g, "");

ruleTester.run('no-cyclic-action', rule, {
  valid: [
    {
      code: `
        // effect SOMETHING to SOMETHING_ELSE
        ${setup}
        const a = actions.pipe(ofType("SOMETHING"), mapTo({ type: "SOMETHING_ELSE" as const }));
        const b = actions.pipe(ofType("SOMETHING"), mapTo({ type: SOMETHING_ELSE } as const));
        const c = actions.pipe(ofType(SOMETHING), mapTo({ type: "SOMETHING_ELSE" as const }));
        const d = actions.pipe(ofType(SOMETHING), mapTo({ type: SOMETHING_ELSE } as const));
      `,
    },
    {
      code: `
        // epic SOMETHING to SOMETHING_ELSE
        ${setup}
        const a = (action$: Actions) => action$.pipe(ofType("SOMETHING"), mapTo({ type: "SOMETHING_ELSE" as const }));
        const b = (action$: Actions) => action$.pipe(ofType("SOMETHING"), mapTo({ type: SOMETHING_ELSE } as const));
        const c = (action$: Actions) => action$.pipe(ofType(SOMETHING), mapTo({ type: "SOMETHING_ELSE" as const }));
        const d = (action$: Actions) => action$.pipe(ofType(SOMETHING), mapTo({ type: SOMETHING_ELSE } as const));
      `,
    },
    {
      code: `
        // https://github.com/cartant/eslint-plugin-rxjs/issues/54
        ${setup}
        const a = actions.pipe(ofType("SOMETHING"), map(() => {}));
      `,
    },
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'effect SOMETHING to SOMETHING a',
      annotatedSource: `
        ${setup}
        const a = actions.pipe(ofType("SOMETHING"), mapTo({ type: "SOMETHING" as const }));
                  ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'effect SOMETHING to SOMETHING b',
      annotatedSource: `
        ${setup}
        const b = actions.pipe(ofType("SOMETHING"), mapTo({ type: SOMETHING } as const));
                  ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'effect SOMETHING to SOMETHING c',
      annotatedSource: `
        ${setup}
        const c = actions.pipe(ofType(SOMETHING), mapTo({ type: "SOMETHING" as const }));
                  ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'effect SOMETHING to SOMETHING d',
      annotatedSource: `
        ${setup}
        const d = actions.pipe(ofType(SOMETHING), mapTo({ type: SOMETHING } as const));
                  ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'epic SOMETHING to SOMETHING a',
      annotatedSource: `
        ${setup}
        const a = (action$: Actions) => action$.pipe(ofType("SOMETHING"), mapTo({ type: "SOMETHING" as const }));
                                        ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'epic SOMETHING to SOMETHING b',
      annotatedSource: `
        ${setup}
        const b = (action$: Actions) => action$.pipe(ofType("SOMETHING"), mapTo({ type: SOMETHING } as const));
                                        ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'epic SOMETHING to SOMETHING c',
      annotatedSource: `
        ${setup}
        const c = (action$: Actions) => action$.pipe(ofType(SOMETHING), mapTo({ type: "SOMETHING" as const }));
                                        ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'epic SOMETHING to SOMETHING d',
      annotatedSource: `
        ${setup}
        const d = (action$: Actions) => action$.pipe(ofType(SOMETHING), mapTo({ type: SOMETHING } as const));
                                        ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'effect SOMETHING | SOMETHING_ELSE to SOMETHING a',
      annotatedSource: `
        // effect SOMETHING | SOMETHING_ELSE to SOMETHING
        ${setup}
        const a = actions.pipe(ofType("SOMETHING", "SOMETHING_ELSE"), mapTo({ type: "SOMETHING" as const }));
                  ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'effect SOMETHING | SOMETHING_ELSE to SOMETHING b',
      annotatedSource: `
        // effect SOMETHING | SOMETHING_ELSE to SOMETHING
        ${setup}
        const b = actions.pipe(ofType("SOMETHING", "SOMETHING_ELSE"), mapTo({ type: SOMETHING } as const));
                  ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'effect SOMETHING | SOMETHING_ELSE to SOMETHING c',
      annotatedSource: `
        // effect SOMETHING | SOMETHING_ELSE to SOMETHING c
        ${setup}
        const c = actions.pipe(ofType(SOMETHING, SOMETHING_ELSE), mapTo({ type: "SOMETHING" as const }));
                  ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'effect SOMETHING | SOMETHING_ELSE to SOMETHING d',
      annotatedSource: `
        // effect SOMETHING | SOMETHING_ELSE to SOMETHING d
        ${setup}
        const d = actions.pipe(ofType(SOMETHING, SOMETHING_ELSE), mapTo({ type: SOMETHING } as const));
                  ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'epic SOMETHING | SOMETHING_ELSE to SOMETHING a',
      annotatedSource: `
        // epic SOMETHING | SOMETHING_ELSE to SOMETHING
        ${setup}
        const a = (action$: Actions) => action$.pipe(ofType("SOMETHING", "SOMETHING_ELSE"), mapTo({ type: "SOMETHING" as const }));
                                        ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'epic SOMETHING | SOMETHING_ELSE to SOMETHING b',
      annotatedSource: `
        // epic SOMETHING | SOMETHING_ELSE to SOMETHING
        ${setup}
        const b = (action$: Actions) => action$.pipe(ofType("SOMETHING", "SOMETHING_ELSE"), mapTo({ type: SOMETHING } as const));
                                        ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'epic SOMETHING | SOMETHING_ELSE to SOMETHING c',
      annotatedSource: `
        // epic SOMETHING | SOMETHING_ELSE to SOMETHING
        ${setup}
        const c = (action$: Actions) => action$.pipe(ofType(SOMETHING, SOMETHING_ELSE), mapTo({ type: "SOMETHING" as const }));
                                        ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'epic SOMETHING | SOMETHING_ELSE to SOMETHING d',
      annotatedSource: `
        // epic SOMETHING | SOMETHING_ELSE to SOMETHING
        ${setup}
        const d = (action$: Actions) => action$.pipe(ofType(SOMETHING, SOMETHING_ELSE), mapTo({ type: SOMETHING } as const));
                                        ~~~~~~~~~~~~
      `,
    }),
  ],
});
