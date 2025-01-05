import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-ignored-replay-buffer';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester();

ruleTester.run('no-ignored-replay-buffer', rule, {
  valid: [
    `
      // ReplaySubject not ignored
      import { ReplaySubject } from "rxjs";

      const a = new ReplaySubject<string>(1);
      const b = new Thing(new ReplaySubject<number>(1));
    `,
    `
      // publishReplay not ignored
      import { of } from "rxjs";
      import { publishReplay } from "rxjs/operators";

      const a = of(42).pipe(publishReplay(1));
    `,
    `
      // shareReplay not ignored
      import { of } from "rxjs";
      import { shareReplay } from "rxjs/operators";

      const a = of(42).pipe(shareReplay(1));
    `,
    `
      // shareReplay with config not ignored
      import { interval, shareReplay } from "rxjs";
      interval(1000).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    `,
    `
      // namespace ReplaySubject not ignored
      import * as Rx from "rxjs";

      const a = new Rx.ReplaySubject<string>(1);
      const b = new Thing(new Rx.ReplaySubject<number>(1));
    `,
    `
      // namespace publishReplay not ignored
      import * as Rx from "rxjs";
      import { publishReplay } from "rxjs/operators";

      const a = Rx.of(42).pipe(publishReplay(1));
    `,
    `
      // namespace shareReplay not ignored
      import * as Rx from "rxjs";
      import { shareReplay } from "rxjs/operators";

      const a = Rx.of(42).pipe(shareReplay(1));
    `,
    `
      // namespace shareReplay with config not ignored
      import * as Rx from "rxjs";
      import { shareReplay } from "rxjs/operators";
      const a = Rx.of(42).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    `,
    `
      // namespace class not ignored
      import * as Rx from "rxjs";

      class Mock {
        private valid: Rx.ReplaySubject<number>;
        constructor(){
          this.valid = new Rx.ReplaySubject<number>(1);
        }
      }
    `,
    `
        // shareReplay with config not ignored
        import { interval, shareReplay } from "rxjs";
        interval(1000).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'ReplaySubject ignored a',
      messageId,
      annotatedSource: `
        import { ReplaySubject } from "rxjs";

        const a = new ReplaySubject<string>();
                      ~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'ReplaySubject ignored b',
      messageId,
      annotatedSource: `
        import { ReplaySubject } from "rxjs";

        const b = new Thing(new ReplaySubject<number>());
                                ~~~~~~~~~~~~~
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'publishReplay ignored',
      messageId,
      annotatedSource: `
        import { of } from "rxjs";
        import { publishReplay } from "rxjs/operators";

        const a = of(42).pipe(publishReplay());
                              ~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'shareReplay ignored',
      messageId,
      annotatedSource: `
        import { of } from "rxjs";
        import { shareReplay } from "rxjs/operators";

        const a = of(42).pipe(shareReplay());
                              ~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'shareReplay with config ignored',
      messageId,
      annotatedSource: `
        // shareReplay with config ignored
        import { of, shareReplay } from "rxjs";
        const a = of(42).pipe(shareReplay({ refCount: true }));
                              ~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'shareReplay with config ignored',
      messageId,
      annotatedSource: `
        import { interval, shareReplay } from "rxjs";

        interval(1000).pipe(shareReplay({ refCount: true }));
                            ~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'namespace ReplaySubject ignored a',
      messageId,
      annotatedSource: `
        import * as Rx from "rxjs";

        const a = new Rx.ReplaySubject<string>();
                         ~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'namespace ReplaySubject ignored b',
      messageId,
      annotatedSource: `
        import * as Rx from "rxjs";

        const b = new Thing(new Rx.ReplaySubject<number>());
                                   ~~~~~~~~~~~~~
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'namespace publishReplay ignored',
      messageId,
      annotatedSource: `
        import * as Rx from "rxjs";
        import { publishReplay } from "rxjs/operators";

        const a = Rx.of(42).pipe(publishReplay());
                                 ~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'namespace shareReplay ignored',
      messageId,
      annotatedSource: `
        import * as Rx from "rxjs";
        import { shareReplay } from "rxjs/operators";

        const a = Rx.of(42).pipe(shareReplay());
                                 ~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'namespace shareReplay with config ignored',
      messageId,
      annotatedSource: `
        import * as Rx from "rxjs";

        const a = Rx.of(42).pipe(Rx.shareReplay({ refCount: true }));
                                    ~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'namespace class ignored',
      messageId,
      annotatedSource: `
        import * as Rx from "rxjs";

        class Mock {
          private invalid: Rx.ReplaySubject<number>;
          constructor(){
            this.invalid = new Rx.ReplaySubject<number>();
                                  ~~~~~~~~~~~~~
          }
        }
      `,
    }),
  ],
});
