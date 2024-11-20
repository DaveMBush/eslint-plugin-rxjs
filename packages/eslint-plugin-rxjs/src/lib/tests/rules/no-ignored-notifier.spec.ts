import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-ignored-notifier';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('no-ignored-notifier', rule, {
  valid: [
    `
      // repeatWhen not ignored
      import { of } from "rxjs";
      import { repeatWhen } from "rxjs/operators";

      const source = of(42);

      const a = source.pipe(
        repeatWhen(notifications => notifications)
      );

      const b = source.pipe(
        repeatWhen(
          function (notifications) {
            return notifications;
          }
        )
      );
    `,
    `
      // retryWhen not ignored
      import { of } from "rxjs";
      import { retryWhen } from "rxjs/operators";

      const source = of(42);

      const g = source.pipe(
        retryWhen(errors => errors)
      );

      const h = source.pipe(
        retryWhen(
          function (errors) {
            return errors;
          }
        )
      );
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'repeatWhen ignored parameter',
      messageId,
      annotatedSource: `
        import { of, range } from "rxjs";
        import { repeatWhen } from "rxjs/operators";

        const source = of(42);

        const c = source.pipe(
          repeatWhen(notifications => range(0, 3))
          ~~~~~~~~~~
        );
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'repeatWhen no parameter',
      messageId,
      annotatedSource: `
        import { of, range } from "rxjs";
        import { repeatWhen } from "rxjs/operators";

        const source = of(42);

        const c = source.pipe(
          repeatWhen(() => range(0, 3))
          ~~~~~~~~~~
        );
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'repeatWhen non-arrow ignored parameter',
      messageId,
      annotatedSource: `
        import { of, range } from "rxjs";
        import { repeatWhen } from "rxjs/operators";

        const source = of(42);

        const c = source.pipe(
          repeatWhen(
          ~~~~~~~~~~
            function (notifications) {
              return range(0, 3);
            }
          )
        );
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'repeatWhen non-arrow no parameter',
      messageId,
      annotatedSource: `
        import { of, range } from "rxjs";
        import { repeatWhen } from "rxjs/operators";

        const source = of(42);

        const c = source.pipe(
          repeatWhen(
          ~~~~~~~~~~
            function () {
              return range(0, 3);
            }
          )
        );
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'retryWhen ignored parameter',
      messageId,
      annotatedSource: `
        // retryWhen ignored parameter
        import { of } from "rxjs";
        import { retryWhen } from "rxjs/operators";

        const source = of(42);

        const h = source.pipe(
          retryWhen(errors => range(0, 3))
          ~~~~~~~~~
        );
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'retryWhen no parameter',
      messageId,
      annotatedSource: `
        // retryWhen no parameter
        import { of } from "rxjs";
        import { retryWhen } from "rxjs/operators";

        const source = of(42);

        const h = source.pipe(
          retryWhen(() => range(0, 3))
          ~~~~~~~~~
        );
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'retryWhen non-arrow ignored parameter',
      messageId,
      annotatedSource: `
        // retryWhen non-arrow ignored parameter
        import { of } from "rxjs";
        import { retryWhen } from "rxjs/operators";

        const source = of(42);

        const h = source.pipe(
          retryWhen(
          ~~~~~~~~~
            function (errors) {
              return range(0, 3);
            }
          )
        );
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'retryWhen non-arrow no parameter',
      messageId,
      annotatedSource: `
        // retryWhen non-arrow no parameter
        import { of } from "rxjs";
        import { retryWhen } from "rxjs/operators";

        const source = of(42);

        const h = source.pipe(
          retryWhen(
          ~~~~~~~~~
            function () {
              return range(0, 3);
            }
          )
        );
      `,
    }),
  ],
});
