import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/prefer-observer';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('prefer-observer', rule, {
  valid: [
    {
      code: `
        // allow-next
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
          value => console.log(value)
        );

        source.subscribe({
          next(value) { console.log(value); }
        });
        source.subscribe({
          next: value => console.log(value)
        });

        source.pipe(tap(
          value => console.log(value)
        )).subscribe();

        source.pipe(tap({
          next(value) { console.log(value); }
        })).subscribe();
        source.pipe(tap({
          next: value => console.log(value)
        })).subscribe();
      `,
      options: [{ allowNext: true }],
    },
    {
      code: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe();
        source.subscribe(
          value => console.log(value)
        );

        source.subscribe({
          next(value) { console.log(value); }
        });
        source.subscribe({
          error(error) { console.log(error); }
        });
        source.subscribe({
          complete() { console.log("complete"); }
        });
        source.subscribe({
          next(value) { console.log(value); },
          error(error) { console.log(error); },
          complete() { console.log("complete"); }
        });

        source.subscribe({
          next: value => console.log(value)
        });
        source.subscribe({
          error: error => console.log(error)
        });
        source.subscribe({
          complete: () => console.log("complete")
        });
        source.subscribe({
          next: value => console.log(value),
          error: error => console.log(error),
          complete: () => console.log("complete")
        });

        source.pipe(tap(
          value => console.log(value)
        )).subscribe();

        source.pipe(tap({
          next(value) { console.log(value); }
        })).subscribe();
        source.pipe(tap({
          error(error) { console.log(error); }
        })).subscribe();
        source.pipe(tap({
          complete() { console.log("complete"); }
        })).subscribe();
        source.pipe(tap({
          next(value) { console.log(value); },
          error(error) { console.log(error); },
          complete() { console.log("complete"); }
        })).subscribe();

        source.pipe(tap({
          next: value => console.log(value)
        })).subscribe();
        source.pipe(tap({
          error: error => console.log(error)
        })).subscribe();
        source.pipe(tap({
          complete: () => console.log("complete")
        })).subscribe();
        source.pipe(tap({
          next: value => console.log(value),
          error: error => console.log(error),
          complete: () => console.log("complete")
        })).subscribe();
      `,
      options: [{}],
    },
    {
      code: `
        // disallow-next
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe({
          next(value) { console.log(value); }
        });
        source.subscribe({
          next: value => console.log(value)
        });

        source.pipe(tap({
          next(value) { console.log(value); }
        })).subscribe();
        source.pipe(tap({
          next: value => console.log(value)
        })).subscribe();
      `,
      options: [{ allowNext: false }],
    },
    {
      code: `
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextObserver = {
          next: (value: number) => { console.log(value); }
        };
        const source = of(42);

        source.subscribe(nextObserver);
        source.pipe(tap(nextObserver));
      `,
      options: [{}],
    },
    {
      code: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe();
        source.subscribe(
          function (value) { console.log(value); }
        );
        source.pipe(tap(
          function (value) { console.log(value); }
        )).subscribe();
      `,
      options: [{}],
    },
    {
      code: `
        // https://github.com/cartant/eslint-plugin-rxjs/issues/61
        const whatever = {
          pipe(...value: unknown[]) {},
          subscribe(callback?: (value: unknown) => void) {}
        };
        whatever.pipe(() => {});
        whatever.subscribe(() => {});
      `,
      options: [{ allowNext: false }],
    },
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'default a',
      messageId,
      annotatedSource: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~//
          value => console.log(value),
          error => console.log(error)
        );
      `,
      annotatedOutput: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { next: value => console.log(value), error: error => console.log(error) }
        );
      `,
      suggestions: [
        {
          messageId,
          output: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { next: value => console.log(value), error: error => console.log(error) }
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'default b',
      messageId,
      annotatedSource: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~//
          value => console.log(value),
          error => console.log(error),
          () => console.log("complete")
        );
      `,
      annotatedOutput: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { next: value => console.log(value), error: error => console.log(error), complete: () => console.log("complete") }
        );
      `,
      suggestions: [
        {
          messageId,
          output: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { next: value => console.log(value), error: error => console.log(error), complete: () => console.log("complete") }
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'default c',
      messageId,
      annotatedSource: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~//
          value => console.log(value),
          undefined,
          () => console.log("complete")
        );
      `,
      annotatedOutput: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { next: value => console.log(value), complete: () => console.log("complete") }
        );
      `,
      suggestions: [
        {
          messageId,
          output: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { next: value => console.log(value), complete: () => console.log("complete") }
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'default d',
      messageId,
      annotatedSource: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~//
          undefined,
          error => console.log(error)
        );
      `,
      annotatedOutput: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { error: error => console.log(error) }
        );
      `,
      suggestions: [
        {
          messageId,
          output: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { error: error => console.log(error) }
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'default e',
      messageId,
      annotatedSource: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~//
          undefined,
          error => console.log(error),
          () => console.log("complete")
        );
      `,
      annotatedOutput: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { error: error => console.log(error), complete: () => console.log("complete") }
        );
      `,
      suggestions: [
        {
          messageId,
          output: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { error: error => console.log(error), complete: () => console.log("complete") }
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'default f',
      messageId,
      annotatedSource: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~//
          undefined,
          undefined,
          () => console.log("complete")
        );
      `,
      annotatedOutput: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { complete: () => console.log("complete") }
        );
      `,
      suggestions: [
        {
          messageId,
          output: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { complete: () => console.log("complete") }
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'default g',
      messageId,
      annotatedSource: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~//
          value => console.log(value),
          error => console.log(error)
        )).subscribe();
      `,
      annotatedOutput: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { next: value => console.log(value), error: error => console.log(error) }
        )).subscribe();
      `,
      suggestions: [
        {
          messageId,
          output: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { next: value => console.log(value), error: error => console.log(error) }
        )).subscribe();
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'default h',
      messageId,
      annotatedSource: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~//
          value => console.log(value),
          error => console.log(error),
          () => console.log("complete")
        )).subscribe();
      `,
      annotatedOutput: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { next: value => console.log(value), error: error => console.log(error), complete: () => console.log("complete") }
        )).subscribe();
      `,
      suggestions: [
        {
          messageId,
          output: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { next: value => console.log(value), error: error => console.log(error), complete: () => console.log("complete") }
        )).subscribe();
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'default i',
      messageId,
      annotatedSource: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~//
          value => console.log(value),
          undefined,
          () => console.log("complete")
        )).subscribe();
      `,
      annotatedOutput: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { next: value => console.log(value), complete: () => console.log("complete") }
        )).subscribe();
      `,
      suggestions: [
        {
          messageId,
          output: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { next: value => console.log(value), complete: () => console.log("complete") }
        )).subscribe();
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'default j',
      messageId,
      annotatedSource: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~//
          undefined,
          error => console.log(error)
        )).subscribe();
      `,
      annotatedOutput: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { error: error => console.log(error) }
        )).subscribe();
      `,
      suggestions: [
        {
          messageId,
          output: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { error: error => console.log(error) }
        )).subscribe();
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'default k',
      messageId,
      annotatedSource: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~//
          undefined,
          error => console.log(error),
          () => console.log("complete")
        )).subscribe();
      `,
      annotatedOutput: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { error: error => console.log(error), complete: () => console.log("complete") }
        )).subscribe();
      `,
      suggestions: [
        {
          messageId,
          output: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { error: error => console.log(error), complete: () => console.log("complete") }
        )).subscribe();
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'default l',
      messageId,
      annotatedSource: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~//
          undefined,
          undefined,
          () => console.log("complete")
        )).subscribe();
      `,
      annotatedOutput: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { complete: () => console.log("complete") }
        )).subscribe();
      `,
      suggestions: [
        {
          messageId,
          output: `
        // default
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { complete: () => console.log("complete") }
        )).subscribe();
      `,
        },
      ],
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'disallow-next a',
      messageId,
      annotatedSource: `
        // disallow-next
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~//
          value => console.log(value)
        );
      `,
      options: [{ allowNext: false }],
      annotatedOutput: `
        // disallow-next
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { next: value => console.log(value) }
        );
      `,
      suggestions: [
        {
          messageId,
          output: `
        // disallow-next
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { next: value => console.log(value) }
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'disallow-next b',
      messageId,
      annotatedSource: `
        // disallow-next
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);
        source.pipe(tap(
                    ~~~//
          value => console.log(value)
        )).subscribe();
      `,
      options: [{ allowNext: false }],
      annotatedOutput: `
        // disallow-next
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);
        source.pipe(tap(
                    //
          { next: value => console.log(value) }
        )).subscribe();
      `,
      suggestions: [
        {
          messageId,
          output: `
        // disallow-next
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);
        source.pipe(tap(
                    //
          { next: value => console.log(value) }
        )).subscribe();
      `,
        },
      ],
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'named a',
      messageId,
      annotatedSource: `
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.subscribe(nextArrow);
               ~~~~~~~~~//
      `,
      options: [{ allowNext: false }],
      annotatedOutput: `
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.subscribe({ next: nextArrow });
               //
      `,
      suggestions: [
        {
          messageId,
          output: `
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.subscribe({ next: nextArrow });
               //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'named b',
      messageId,
      annotatedSource: `
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.subscribe(nextNamed);
               ~~~~~~~~~//
      `,
      options: [{ allowNext: false }],
      annotatedOutput: `
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.subscribe({ next: nextNamed });
               //
      `,
      suggestions: [
        {
          messageId,
          output: `
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.subscribe({ next: nextNamed });
               //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'named c',
      messageId,
      annotatedSource: `
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.subscribe(nextNonArrow);
               ~~~~~~~~~//
      `,
      options: [{ allowNext: false }],
      annotatedOutput: `
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.subscribe({ next: nextNonArrow });
               //
      `,
      suggestions: [
        {
          messageId,
          output: `
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.subscribe({ next: nextNonArrow });
               //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'named d',
      messageId,
      annotatedSource: `
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.pipe(tap(nextArrow));
                    ~~~//
      `,
      options: [{ allowNext: false }],
      annotatedOutput: `
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.pipe(tap({ next: nextArrow }));
                    //
      `,
      suggestions: [
        {
          messageId,
          output: `
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.pipe(tap({ next: nextArrow }));
                    //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'named e',
      messageId,
      annotatedSource: `
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.pipe(tap(nextNamed));
                    ~~~//
      `,
      options: [{ allowNext: false }],
      annotatedOutput: `
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.pipe(tap({ next: nextNamed }));
                    //
      `,
      suggestions: [
        {
          messageId,
          output: `
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.pipe(tap({ next: nextNamed }));
                    //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'named f',
      messageId,
      annotatedSource: `
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.pipe(tap(nextNonArrow));
                    ~~~//
      `,
      options: [{ allowNext: false }],
      annotatedOutput: `
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.pipe(tap({ next: nextNonArrow }));
                    //
      `,
      suggestions: [
        {
          messageId,
          output: `
        // named
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;

        const source = of(42);

        source.pipe(tap({ next: nextNonArrow }));
                    //
      `,
        },
      ],
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'non-arrow functions a',
      messageId,
      annotatedSource: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~//
          function (value) { console.log(value); },
          function (error) { console.log(error); }
        );
      `,
      annotatedOutput: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { next: function (value) { console.log(value); }, error: function (error) { console.log(error); } }
        );
      `,
      suggestions: [
        {
          messageId,
          output: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { next: function (value) { console.log(value); }, error: function (error) { console.log(error); } }
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'non-arrow functions b',
      messageId,
      annotatedSource: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~//
          function (value) { console.log(value); },
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        );
      `,
      annotatedOutput: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { next: function (value) { console.log(value); }, error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
        );
      `,
      suggestions: [
        {
          messageId,
          output: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { next: function (value) { console.log(value); }, error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'non-arrow functions c',
      messageId,
      annotatedSource: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~//
          function (value) { console.log(value); },
          undefined,
          function () { console.log("complete"); }
        );
      `,
      annotatedOutput: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { next: function (value) { console.log(value); }, complete: function () { console.log("complete"); } }
        );
      `,
      suggestions: [
        {
          messageId,
          output: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { next: function (value) { console.log(value); }, complete: function () { console.log("complete"); } }
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'non-arrow functions d',
      messageId,
      annotatedSource: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~//
          undefined,
          function (error) { console.log(error); }
        );
      `,
      annotatedOutput: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { error: function (error) { console.log(error); } }
        );
      `,
      suggestions: [
        {
          messageId,
          output: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { error: function (error) { console.log(error); } }
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'non-arrow functions e',
      messageId,
      annotatedSource: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~//
          undefined,
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        );
      `,
      annotatedOutput: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
        );
      `,
      suggestions: [
        {
          messageId,
          output: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'non-arrow functions f',
      messageId,
      annotatedSource: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~//
          undefined,
          undefined,
          function () { console.log("complete"); }
        );
      `,
      annotatedOutput: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { complete: function () { console.log("complete"); } }
        );
      `,
      suggestions: [
        {
          messageId,
          output: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               //
          { complete: function () { console.log("complete"); } }
        );
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'non-arrow functions g',
      messageId,
      annotatedSource: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~//
          function (value) { console.log(value); },
          function (error) { console.log(error); }
        )).subscribe();
      `,
      annotatedOutput: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { next: function (value) { console.log(value); }, error: function (error) { console.log(error); } }
        )).subscribe();
      `,
      suggestions: [
        {
          messageId,
          output: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { next: function (value) { console.log(value); }, error: function (error) { console.log(error); } }
        )).subscribe();
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'non-arrow functions h',
      messageId,
      annotatedSource: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~//
          function (value) { console.log(value); },
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        )).subscribe();
      `,
      annotatedOutput: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { next: function (value) { console.log(value); }, error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
        )).subscribe();
      `,
      suggestions: [
        {
          messageId,
          output: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { next: function (value) { console.log(value); }, error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
        )).subscribe();
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'non-arrow functions i',
      messageId,
      annotatedSource: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~//
          function (value) { console.log(value); },
          undefined,
          function () { console.log("complete"); }
        )).subscribe();
      `,
      annotatedOutput: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { next: function (value) { console.log(value); }, complete: function () { console.log("complete"); } }
        )).subscribe();
      `,
      suggestions: [
        {
          messageId,
          output: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { next: function (value) { console.log(value); }, complete: function () { console.log("complete"); } }
        )).subscribe();
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'non-arrow functions j',
      messageId,
      annotatedSource: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~//
          undefined,
          function (error) { console.log(error); }
        )).subscribe();
      `,
      annotatedOutput: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { error: function (error) { console.log(error); } }
        )).subscribe();
      `,
      suggestions: [
        {
          messageId,
          output: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { error: function (error) { console.log(error); } }
        )).subscribe();
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'non-arrow functions k',
      messageId,
      annotatedSource: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~//
          undefined,
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        )).subscribe();
      `,
      annotatedOutput: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
        )).subscribe();
      `,
      suggestions: [
        {
          messageId,
          output: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
        )).subscribe();
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'non-arrow functions l',
      messageId,
      annotatedSource: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~//
          undefined,
          undefined,
          function () { console.log("complete"); }
        )).subscribe();
      `,
      annotatedOutput: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { complete: function () { console.log("complete"); } }
        )).subscribe();
      `,
      suggestions: [
        {
          messageId,
          output: `
        // non-arrow functions
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    //
          { complete: function () { console.log("complete"); } }
        )).subscribe();
      `,
        },
      ],
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'a',
      messageId,
      annotatedSource: `
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe(fn, fn, fn);
               ~~~~~~~~~//
      `,
      annotatedOutput: `
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe({ next: fn, error: fn, complete: fn });
               //
      `,
      suggestions: [
        {
          messageId,
          output: `
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe({ next: fn, error: fn, complete: fn });
               //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'b',
      messageId,
      annotatedSource: `
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe(fn, null, fn);
               ~~~~~~~~~//
      `,
      annotatedOutput: `
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe({ next: fn, complete: fn });
               //
      `,
      suggestions: [
        {
          messageId,
          output: `
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe({ next: fn, complete: fn });
               //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'c',
      messageId,
      annotatedSource: `
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe(null, undefined, fn);
               ~~~~~~~~~//
      `,
      annotatedOutput: `
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe({ complete: fn });
               //
      `,
      suggestions: [
        {
          messageId,
          output: `
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe({ complete: fn });
               //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'd',
      messageId,
      annotatedSource: `
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe(undefined, fn);
               ~~~~~~~~~//
      `,
      annotatedOutput: `
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe({ error: fn });
               //
      `,
      suggestions: [
        {
          messageId,
          output: `
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe({ error: fn });
               //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'e',
      messageId,
      annotatedSource: `
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe(undefined, fn, null);
               ~~~~~~~~~//
      `,
      annotatedOutput: `
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe({ error: fn });
               //
      `,
      suggestions: [
        {
          messageId,
          output: `
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe({ error: fn });
               //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'f',
      messageId,
      annotatedSource: `
        import { of } from "rxjs";
        const fn = () => {};

        // super wrong
        of(42).subscribe(undefined, fn, fn, fn, fn, fn, fn);
               ~~~~~~~~~//
      `,
      annotatedOutput: `
        import { of } from "rxjs";
        const fn = () => {};

        // super wrong
        of(42).subscribe({ error: fn, complete: fn });
               //
      `,
      suggestions: [
        {
          messageId,
          output: `
        import { of } from "rxjs";
        const fn = () => {};

        // super wrong
        of(42).subscribe({ error: fn, complete: fn });
               //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'tap a',
      messageId,
      annotatedSource: `
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap(fn, fn, fn));
                    ~~~//
      `,
      annotatedOutput: `
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap({ next: fn, error: fn, complete: fn }));
                    //
      `,
      suggestions: [
        {
          messageId,
          output: `
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap({ next: fn, error: fn, complete: fn }));
                    //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'tap b',
      messageId,
      annotatedSource: `
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap(fn, null, fn));
                    ~~~//
      `,
      annotatedOutput: `
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap({ next: fn, complete: fn }));
                    //
      `,
      suggestions: [
        {
          messageId,
          output: `
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap({ next: fn, complete: fn }));
                    //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'tap c',
      messageId,
      annotatedSource: `
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap(null, undefined, fn));
                    ~~~//
      `,
      annotatedOutput: `
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap({ complete: fn }));
                    //
      `,
      suggestions: [
        {
          messageId,
          output: `
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap({ complete: fn }));
                    //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'tap d',
      messageId,
      annotatedSource: `
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap(undefined, fn));
                    ~~~//
      `,
      annotatedOutput: `
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap({ error: fn }));
                    //
      `,
      suggestions: [
        {
          messageId,
          output: `
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap({ error: fn }));
                    //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'tap e',
      messageId,
      annotatedSource: `
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap(undefined, fn, null));
                    ~~~//
      `,
      annotatedOutput: `
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap({ error: fn }));
                    //
      `,
      suggestions: [
        {
          messageId,
          output: `
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap({ error: fn }));
                    //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'tap f',
      messageId,
      annotatedSource: `
        import { of, tap } from "rxjs";
        const fn = () => {};

        // super wrong
        of(42).pipe(tap(undefined, fn, fn, fn, fn, fn, fn));
                    ~~~//
      `,
      annotatedOutput: `
        import { of, tap } from "rxjs";
        const fn = () => {};

        // super wrong
        of(42).pipe(tap({ error: fn, complete: fn }));
                    //
      `,
      suggestions: [
        {
          messageId,
          output: `
        import { of, tap } from "rxjs";
        const fn = () => {};

        // super wrong
        of(42).pipe(tap({ error: fn, complete: fn }));
                    //
      `,
        },
      ],
    }),
  ],
});
