import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-ignored-takewhile-value';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('no-ignored-takewhile-value', rule, {
  valid: [
    `
      // function
      import { Observable } from "rxjs";
      import { takeWhile } from "rxjs/operators";

      class Something {
        constructor(private _source: Observable<string>) {
          _source.pipe(
            takeWhile(function (value) { return value; })
          ).subscribe();
        }
      };
    `,
    `
      // arrow function
      import { Observable } from "rxjs";
      import { takeWhile } from "rxjs/operators";

      class Something {
        constructor(private _source: Observable<string>) {
          _source.pipe(
            takeWhile(value => value)
          ).subscribe();
        }
      };
    `,
    `
      // arrow function with block
      import { Observable } from "rxjs";
      import { takeWhile } from "rxjs/operators";

      class Something {
        constructor(private _source: Observable<string>) {
          _source.pipe(
            takeWhile(value => { return value; })
          ).subscribe();
        }
      };
    `,
    `
      // https://github.com/cartant/eslint-plugin-rxjs/issues/75
      import {
        equals,
        takeWhile,
        toPairs,
      } from 'remeda'

      return takeWhile(
        sizesAsArray,
        ([_, width]) => w.innerWidth >= width,
      )
    `,
    `
      // https://github.com/cartant/eslint-plugin-rxjs/issues/93
      import { Observable } from "rxjs";
      import { takeWhile } from "rxjs/operators";

      class Something {
        constructor(private _source: Observable<{ name: string }>) {
          _source.pipe(
            takeWhile(({ name }) => name)
          ).subscribe();
        }
      };
    `,
    `
      // Array destructuring
      import { Observable } from "rxjs";
      import { takeWhile } from "rxjs/operators";

      class Something {
        constructor(private _source: Observable<string[]>) {
          _source.pipe(
            takeWhile(([name]) => name)
          ).subscribe();
        }
      };
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'function without value',
      messageId,
      annotatedSource: `
        // function without value
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(function (value) { return false; })
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            ).subscribe();
          }
        };
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'function without parameter',
      messageId,
      annotatedSource: `
        // function without parameter
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(function () { return false; })
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            ).subscribe();
          }
        };
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'arrow function without value',
      messageId,
      annotatedSource: `
        // arrow function without value
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(value => false)
                        ~~~~~~~~~~~~~~
            ).subscribe();
          }
        };
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'arrow function without parameter',
      messageId,
      annotatedSource: `
        // arrow function without parameter
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(() => false)
                        ~~~~~~~~~~~
            ).subscribe();
          }
        };
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'arrow function with block without value',
      messageId,
      annotatedSource: `
        // arrow function with block without value
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(value => { return false; })
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~
            ).subscribe();
          }
        };
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'arrow function with block without parameter',
      messageId,
      annotatedSource: `
        // arrow function with block without parameter
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(() => { return false; })
                        ~~~~~~~~~~~~~~~~~~~~~~~
            ).subscribe();
          }
        };
      `,
    }),
  ],
});
