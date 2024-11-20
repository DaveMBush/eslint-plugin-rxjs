import { RuleTester } from '@typescript-eslint/rule-tester';
import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/just';

const ruleTester = new RuleTester();

ruleTester.run('just', rule, {
  valid: [
    `
      // non-RxJS of
      function foo(): void {
        function of(): void {}
        of();
      }

      function bar(of: Function): void {
        of();
      }

      function baz(): void {
        const of = () => {};
        of();
      }
    `,
    `
      // aliased as bar
      import { of as bar } from "rxjs";

      const a = bar("a");
    `,
    `
      // aliased as of
      import { of as of } from "rxjs";

      const a = of("a");
    `,
  ],
  invalid: [
    {
      code: `
        import { of } from "rxjs";
        const a = of("a");
      `,
      output: `
        import { of as just } from "rxjs";
        const a = just("a");
      `,
      errors: [
        {
          messageId: 'forbidden',
        },
        {
          messageId: 'forbidden',
        },
      ],
    },
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'imported of',
      annotatedSource: `
        // imported of
        import { of } from "rxjs";
                 ~~// keep space for fixer
      `,
      annotatedOutput: `
        // imported of
        import { of as just } from "rxjs";
                 // keep space for fixer
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'imported of with non-RxJS of',
      annotatedSource: `
        // imported of with non-RxJS of
        import { of } from "rxjs";
                 ~~// keep space for fixer

        function foo(): void {
        function of(): void {}
          of();
        }

        function bar(of: Function): void {
          of();
        }

        function baz(): void {
          const of = () => {};
          of();
        }
      `,
      annotatedOutput: `
        // imported of with non-RxJS of
        import { of as just } from "rxjs";
                 // keep space for fixer

        function foo(): void {
        function of(): void {}
          of();
        }

        function bar(of: Function): void {
          of();
        }

        function baz(): void {
          const of = () => {};
          of();
        }
      `,
    }),
  ],
});
