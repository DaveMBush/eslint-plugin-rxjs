import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, {
  explicitAnyId,
  implicitAnyId,
  narrowedId,
  suggestExplicitUnknownId,
} from '../../rules/no-implicit-any-catch';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('no-implicit-any-catch', rule, {
  valid: [
    {
      code: `
        // arrow; no parameter
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(() => console.error("Whoops!"))
        );
      `,
    },
    {
      code: `
        // non-arrow; no parameter
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function () { console.error("Whoops!"); })
        );
      `,
    },
    {
      code: `
        // arrow; explicit unknown; default option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: unknown) => console.error(error))
        );
      `,
    },
    {
      code: `
        // non-arrow; explicit unknown; default option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: unknown) { console.error(error); })
        );
      `,
    },
    {
      code: `
        // arrow; explicit unknown; explicit option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: unknown) => console.error(error))
        );
      `,
      options: [{ allowExplicitAny: false }],
    },
    {
      code: `
        // non-arrow; explicit unknown; explicit option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: unknown) { console.error(error); })
        );
      `,
      options: [{ allowExplicitAny: false }],
    },
    {
      code: `
        // arrow; explicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: any) => console.error(error))
        );
      `,
      options: [{ allowExplicitAny: true }],
    },
    {
      code: `
        // non-arrow; explicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: any) { console.error(error); })
        );
      `,
      options: [{ allowExplicitAny: true }],
    },
    {
      code: `
        // subscribe; arrow; explicit unknown; default option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: unknown) => console.error(error)
        );
      `,
    },
    {
      code: `
        // subscribe; arrow; explicit any
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: any) => console.error(error)
        );
      `,
      options: [{ allowExplicitAny: true }],
    },
    {
      code: `
        // subscribe observer; arrow; explicit unknown; default option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: unknown) => console.error(error)
        });
      `,
    },
    {
      code: `
        // subscribe observer; arrow; explicit any
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: any) => console.error(error)
        });
      `,
      options: [{ allowExplicitAny: true }],
    },
    {
      code: `
        // tap; arrow; explicit unknown; default option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: unknown) => console.error(error)
        ));
      `,
    },
    {
      code: `
        // tap; arrow; explicit any
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: any) => console.error(error)
        ));
      `,
      options: [{ allowExplicitAny: true }],
    },
    {
      code: `
        // tap observer; arrow; explicit unknown; default option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: unknown) => console.error(error)
        }));
      `,
    },
    {
      code: `
        // tap observer; arrow; explicit any
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: any) => console.error(error)
        }));
      `,
      options: [{ allowExplicitAny: true }],
    },
    {
      code: `
        // https://github.com/cartant/eslint-plugin-rxjs/issues/61
        const whatever = {
          subscribe(
            next?: (value: unknown) => void,
            error?: (error: unknown) => void
          ) {}
        };
        whatever.subscribe(() => {}, (error) => {});
      `,
      options: [{}],
    },
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'arrow; implicit any',
      messageId: implicitAnyId,
      annotatedSource: `
        // arrow; implicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error) => console.error(error))
                      ~~~~~//
        );
      `,
      annotatedOutput: `
        // arrow; implicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: unknown) => console.error(error))
                      //
        );
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // arrow; implicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: unknown) => console.error(error))
                      //
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'arrow; no parentheses; implicit any',
      messageId: implicitAnyId,
      annotatedSource: `
        // arrow; no parentheses; implicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(error => console.error(error))
                     ~~~~~//
        );
      `,
      annotatedOutput: `
        // arrow; no parentheses; implicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: unknown) => console.error(error))
                     //
        );
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // arrow; no parentheses; implicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: unknown) => console.error(error))
                     //
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'non-arrow; implicit any',
      messageId: implicitAnyId,
      annotatedSource: `
        // non-arrow; implicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error) { console.error(error); })
                               ~~~~~//
          );
      `,
      annotatedOutput: `
        // non-arrow; implicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: unknown) { console.error(error); })
                               //
          );
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // non-arrow; implicit any
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: unknown) { console.error(error); })
                               //
          );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'arrow; explicit any; default option',
      messageId: explicitAnyId,
      annotatedSource: `
        // arrow; explicit any; default option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: any) => console.error(error))
                      ~~~~~~~~~~//
        );
        `,
      annotatedOutput: `
        // arrow; explicit any; default option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: unknown) => console.error(error))
                      //
        );
        `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // arrow; explicit any; default option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: unknown) => console.error(error))
                      //
        );
        `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'non-arrow; explicit any; default option',
      messageId: explicitAnyId,
      annotatedSource: `
        // non-arrow; explicit any; default option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: any) { console.error(error); })
                               ~~~~~~~~~~//
        );
      `,
      annotatedOutput: `
        // non-arrow; explicit any; default option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: unknown) { console.error(error); })
                               //
        );
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // non-arrow; explicit any; default option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: unknown) { console.error(error); })
                               //
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'arrow; explicit any; explicit option',
      messageId: explicitAnyId,
      annotatedSource: `
        // arrow; explicit any; explicit option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: any) => console.error(error))
                      ~~~~~~~~~~//
        );
      `,
      annotatedOutput: `
        // arrow; explicit any; explicit option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: unknown) => console.error(error))
                      //
        );
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // arrow; explicit any; explicit option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: unknown) => console.error(error))
                      //
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'non-arrow; explicit any; explicit option',
      messageId: explicitAnyId,
      annotatedSource: `
        // non-arrow; explicit any; explicit option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: any) { console.error(error); })
                               ~~~~~~~~~~//
        );
      `,
      annotatedOutput: `
        // non-arrow; explicit any; explicit option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: unknown) { console.error(error); })
                               //
        );
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // non-arrow; explicit any; explicit option
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: unknown) { console.error(error); })
                               //
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'arrow; narrowed',
      messageId: narrowedId,
      annotatedSource: `
        // arrow; narrowed
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: string) => console.error(error))
                      ~~~~~~~~~~~~~//
        );
      `,
      suggestions: [
        {
          messageId: suggestExplicitUnknownId,
          output: `
        // arrow; narrowed
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: unknown) => console.error(error))
                      //
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'non-arrow; narrowed',
      messageId: narrowedId,
      annotatedSource: `
        // non-arrow; narrowed
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: string) { console.error(error); })
                               ~~~~~~~~~~~~~//
        );
      `,
      suggestions: [
        {
          messageId: suggestExplicitUnknownId,
          output: `
        // non-arrow; narrowed
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: unknown) { console.error(error); })
                               //
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subscribe; arrow; implicit any',
      messageId: implicitAnyId,
      annotatedSource: `
        // subscribe; arrow; implicit any
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error) => console.error(error)
           ~~~~~//
        );
      `,
      annotatedOutput: `
        // subscribe; arrow; implicit any
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: unknown) => console.error(error)
           //
        );
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // subscribe; arrow; implicit any
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: unknown) => console.error(error)
           //
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subscribe; arrow; no parentheses; implicit any',
      messageId: implicitAnyId,
      annotatedSource: `
        // subscribe; arrow; no parentheses; implicit any
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          error => console.error(error)
          ~~~~~//
        );
      `,
      annotatedOutput: `
        // subscribe; arrow; no parentheses; implicit any
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: unknown) => console.error(error)
          //
        );
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // subscribe; arrow; no parentheses; implicit any
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: unknown) => console.error(error)
          //
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subscribe; arrow; explicit any; default option',
      messageId: explicitAnyId,
      annotatedSource: `
        // subscribe; arrow; explicit any; default option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: any) => console.error(error)
           ~~~~~~~~~~//
        );
      `,
      annotatedOutput: `
        // subscribe; arrow; explicit any; default option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: unknown) => console.error(error)
           //
        );
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // subscribe; arrow; explicit any; default option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: unknown) => console.error(error)
           //
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subscribe; arrow; explicit any; explicit option',
      messageId: explicitAnyId,
      annotatedSource: `
        // subscribe; arrow; explicit any; explicit option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: any) => console.error(error)
           ~~~~~~~~~~//
        );
      `,
      annotatedOutput: `
        // subscribe; arrow; explicit any; explicit option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: unknown) => console.error(error)
           //
        );
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // subscribe; arrow; explicit any; explicit option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: unknown) => console.error(error)
           //
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subscribe; arrow; narrowed',
      messageId: narrowedId,
      annotatedSource: `
        // subscribe; arrow; narrowed
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: string) => console.error(error)
           ~~~~~~~~~~~~~//
        );
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // subscribe; arrow; narrowed
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: unknown) => console.error(error)
           //
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subscribe observer; arrow; implicit any',
      messageId: implicitAnyId,
      annotatedSource: `
        // subscribe observer; arrow; implicit any
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error) => console.error(error)
                  ~~~~~//
        });
      `,
      annotatedOutput: `
        // subscribe observer; arrow; implicit any
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: unknown) => console.error(error)
                  //
        });
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // subscribe observer; arrow; implicit any
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: unknown) => console.error(error)
                  //
        });
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subscribe observer; arrow; no parentheses; implicit any',
      messageId: implicitAnyId,
      annotatedSource: `
        // subscribe observer; arrow; no parentheses; implicit any
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: error => console.error(error)
                 ~~~~~//
        });
      `,
      annotatedOutput: `
        // subscribe observer; arrow; no parentheses; implicit any
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: unknown) => console.error(error)
                 //
        });
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // subscribe observer; arrow; no parentheses; implicit any
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: unknown) => console.error(error)
                 //
        });
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subscribe observer; arrow; explicit any; default option',
      messageId: explicitAnyId,
      annotatedSource: `
        // subscribe observer; arrow; explicit any; default option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: any) => console.error(error)
                  ~~~~~~~~~~//
        });
      `,
      annotatedOutput: `
        // subscribe observer; arrow; explicit any; default option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: unknown) => console.error(error)
                  //
        });
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // subscribe observer; arrow; explicit any; default option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: unknown) => console.error(error)
                  //
        });
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subscribe observer; arrow; explicit any; explicit option',
      messageId: explicitAnyId,
      annotatedSource: `
        // subscribe observer; arrow; explicit any; explicit option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: any) => console.error(error)
                  ~~~~~~~~~~//
        });
      `,
      options: [{ allowExplicitAny: false }],
      annotatedOutput: `
        // subscribe observer; arrow; explicit any; explicit option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: unknown) => console.error(error)
                  //
        });
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // subscribe observer; arrow; explicit any; explicit option
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: unknown) => console.error(error)
                  //
        });
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subscribe observer; arrow; narrowed',
      messageId: narrowedId,
      annotatedSource: `
        // subscribe observer; arrow; narrowed
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: string) => console.error(error)
                  ~~~~~~~~~~~~~//
        });
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // subscribe observer; arrow; narrowed
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: unknown) => console.error(error)
                  //
        });
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'tap; arrow; implicit any',
      messageId: implicitAnyId,
      annotatedSource: `
        // tap; arrow; implicit any
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error) => console.error(error)
           ~~~~~//
        ));
      `,
      annotatedOutput: `
        // tap; arrow; implicit any
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: unknown) => console.error(error)
           //
        ));
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // tap; arrow; implicit any
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: unknown) => console.error(error)
           //
        ));
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'tap; arrow; no parentheses; implicit any',
      messageId: implicitAnyId,
      annotatedSource: `
        // tap; arrow; no parentheses; implicit any
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          error => console.error(error)
          ~~~~~//
        ));
      `,
      annotatedOutput: `
        // tap; arrow; no parentheses; implicit any
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: unknown) => console.error(error)
          //
        ));
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // tap; arrow; no parentheses; implicit any
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: unknown) => console.error(error)
          //
        ));
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'tap; arrow; explicit any; default option',
      messageId: explicitAnyId,
      annotatedSource: `
        // tap; arrow; explicit any; default option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: any) => console.error(error)
           ~~~~~~~~~~//
        ));
      `,
      annotatedOutput: `
        // tap; arrow; explicit any; default option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: unknown) => console.error(error)
           //
        ));
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // tap; arrow; explicit any; default option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: unknown) => console.error(error)
           //
        ));
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'tap; arrow; explicit any; explicit option',
      messageId: explicitAnyId,
      annotatedSource: `
        // tap; arrow; explicit any; explicit option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: any) => console.error(error)
           ~~~~~~~~~~//
        ));
      `,
      options: [{ allowExplicitAny: false }],
      annotatedOutput: `
        // tap; arrow; explicit any; explicit option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: unknown) => console.error(error)
           //
        ));
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // tap; arrow; explicit any; explicit option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: unknown) => console.error(error)
           //
        ));
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'tap; arrow; narrowed',
      messageId: narrowedId,
      annotatedSource: `
        // tap; arrow; narrowed
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: string) => console.error(error)
           ~~~~~~~~~~~~~//
        ));
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // tap; arrow; narrowed
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: unknown) => console.error(error)
           //
        ));
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'tap observer; arrow; implicit any',
      messageId: implicitAnyId,
      annotatedSource: `
        // tap observer; arrow; implicit any
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error) => console.error(error)
                  ~~~~~//
        }));
      `,
      annotatedOutput: `
        // tap observer; arrow; implicit any
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: unknown) => console.error(error)
                  //
        }));
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // tap observer; arrow; implicit any
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: unknown) => console.error(error)
                  //
        }));
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'tap observer; arrow; no parentheses; implicit any',
      messageId: implicitAnyId,
      annotatedSource: `
        // tap observer; arrow; no parentheses; implicit any
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: error => console.error(error)
                 ~~~~~//
        }));
      `,
      annotatedOutput: `
        // tap observer; arrow; no parentheses; implicit any
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: unknown) => console.error(error)
                 //
        }));
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // tap observer; arrow; no parentheses; implicit any
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: unknown) => console.error(error)
                 //
        }));
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'tap observer; arrow; explicit any; default option',
      messageId: explicitAnyId,
      annotatedSource: `
        // tap observer; arrow; explicit any; default option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: any) => console.error(error)
                  ~~~~~~~~~~//
        }));
      `,
      annotatedOutput: `
        // tap observer; arrow; explicit any; default option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: unknown) => console.error(error)
                  //
        }));
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // tap observer; arrow; explicit any; default option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: unknown) => console.error(error)
                  //
        }));
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'tap observer; arrow; explicit any; explicit option',
      messageId: explicitAnyId,
      annotatedSource: `
        // tap observer; arrow; explicit any; explicit option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: any) => console.error(error)
                  ~~~~~~~~~~//
        }));
      `,
      options: [{ allowExplicitAny: false }],
      annotatedOutput: `
        // tap observer; arrow; explicit any; explicit option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: unknown) => console.error(error)
                  //
        }));
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // tap observer; arrow; explicit any; explicit option
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: unknown) => console.error(error)
                  //
        }));
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'tap observer; arrow; narrowed',
      messageId: narrowedId,
      annotatedSource: `
        // tap observer; arrow; narrowed
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: string) => console.error(error)
                  ~~~~~~~~~~~~~//
        }));
      `,
      suggestions: [
        {
          messageId: 'suggestExplicitUnknown',
          output: `
        // tap observer; arrow; narrowed
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: unknown) => console.error(error)
                  //
        }));
      `,
        },
      ],
    }),
  ],
});
