/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-unsafe-catch';
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
  const that = { actions };
`.replace(/\n/g, "");

ruleTester.run("no-unsafe-catch", rule, {
  valid: [
    {
      code: `
        // actions with caught
        ${setup}
        const safePipedOfTypeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError((error, caught) => caught)
        );
      `,
    },
    {
      code: `
        // actions property with caught
        ${setup}
        const safePipedOfTypeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError((error, caught) => caught)
        );
      `,
    },
    {
      code: `
        // epic with caught
        ${setup}
        const safePipedOfTypeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError((error, caught) => caught)
        );
      `,
    },
    {
      code: `
        // actions nested
        ${setup}
        const safePipedOfTypeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(catchError(() => EMPTY)))
        );
      `,
    },
    {
      code: `
        // actions property nested
        ${setup}
        const safePipedOfTypeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(catchError(() => EMPTY)))
        );
      `,
    },
    {
      code: `
        // epic nested
        ${setup}
        const safePipedOfTypeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(catchError(() => EMPTY)))
        );
      `,
    },
    {
      code: `
        // non-matching options
        ${setup}
        const effect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          catchError(() => EMPTY)
        );
      `,
      options: [{ observable: "foo" }],
    },
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'unsafe actions',
      messageId,
      annotatedSource: `
        // unsafe actions
        ${setup}
        const unsafePipedOfTypeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError(() => EMPTY)
          ~~~~~~~~~~
        );
      `
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'unsafe actions property',
      messageId,
      annotatedSource: `
        // unsafe actions property
        ${setup}
        const unsafePipedOfTypeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError(() => EMPTY)
          ~~~~~~~~~~
        );
      `
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'unsafe epic',
      messageId,
      annotatedSource: `
        // unsafe epic
        ${setup}
        const unsafePipedOfTypeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError(() => EMPTY)
          ~~~~~~~~~~
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
          catchError(() => EMPTY)
          ~~~~~~~~~~
        );
      `,
      options: [
        {
          observable: "foo",
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'https://github.com/cartant/rxjs-tslint-rules/issues/96',
      messageId,
      annotatedSource: `
        // https://github.com/cartant/rxjs-tslint-rules/issues/96
        import { Observable } from "rxjs";
        import { catchError, map } from "rxjs/operators";

        class SomeComponent {

          actions$: Observable<Action>;

          @Effect()
          initializeAppointments$ = this.actions$.pipe(
            ofType(AppointmentsActions.Type.initialize),
            this.getAppointmentSessionParametersFromURL(),
            this.updateAppointmentSessionIfDeprecated(),
            map(
              (appointmentSession: AppointmentSession) =>
                new AppointmentsActions.initializeSuccess(appointmentSession)
            ),
            catchError(() => of(new AppointmentsActions.initializeError())),
            ~~~~~~~~~~
          );
        }
      `
    }),
  ],
});
