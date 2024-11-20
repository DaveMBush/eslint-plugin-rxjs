import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-nested-subscribe';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('no-nested-subscribe', rule, {
  valid: [
    `
      // not nested in next argument
      import { Observable } from "rxjs";
      of(47).subscribe(value => {
        console.log(value);
      })
    `,
    `
      // not nested in observer properties
      import { Observable } from "rxjs";
      of(47).subscribe({
        next: value => console.log(value),
        error: value => console.log(value),
        complete: () => console.log(value)
      })
    `,
    `
      // not nested in observer methods
      import { Observable } from "rxjs";
      of(47).subscribe({
        next(value) { console.log(value); },
        error(value) { console.log(value); },
        complete() { console.log(value); }
      })
    `,
    `
      // prototype property
      import { Observable } from "rxjs";
      const observableSubscribe = Observable.prototype.subscribe;
      expect(Observable.prototype.subscribe).to.equal(observableSubscribe);
    `,
    `
      // https://github.com/cartant/eslint-plugin-rxjs/issues/38
      import {of} from "rxjs";
      of(3).subscribe(result => {
        const test = result as boolean;
        if(test > 1) {
          console.log(test);
        }
      });
    `,
    `
      // https://github.com/cartant/eslint-plugin-rxjs/issues/61
      const whatever = {
        subscribe(callback?: (value: unknown) => void) {}
      };
      whatever.subscribe(() => {
        whatever.subscribe(() => {})
      });
    `,
    `
      // https://github.com/cartant/eslint-plugin-rxjs/issues/67
      import { Observable, of } from "rxjs";
      new Observable<number>(subscriber => {
        of(42).subscribe(subscriber);
      }).subscribe();
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'nested in next argument',
      messageId,
      annotatedSource: `
        // nested in next argument
        import { of } from "rxjs";
        of("foo").subscribe(
          value => of("bar").subscribe()
                             ~~~~~~~~~
        );
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'nested in next property',
      messageId,
      annotatedSource: `
        // nested in next property
        import { of } from "rxjs";
        of("foo").subscribe({
          next: value => of("bar").subscribe()
                                   ~~~~~~~~~
        });
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'nested in next method',
      messageId,
      annotatedSource: `
        // nested in next method
        import { of } from "rxjs";
        of("foo").subscribe({
          next(value) { of("bar").subscribe(); }
                                  ~~~~~~~~~
        });
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'nested in error argument',
      messageId,
      annotatedSource: `
        // nested in error argument
        import { of } from "rxjs";
        of("foo").subscribe(
          undefined,
          error => of("bar").subscribe()
                             ~~~~~~~~~
        );
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'nested in error property',
      messageId,
      annotatedSource: `
        // nested in error property
        import { of } from "rxjs";
        of("foo").subscribe({
          error: error => of("bar").subscribe()
                                    ~~~~~~~~~
        });
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'nested in error method',
      messageId,
      annotatedSource: `
        // nested in error method
        import { of } from "rxjs";
        of("foo").subscribe({
          error(error) { of("bar").subscribe(); }
                                   ~~~~~~~~~
        });
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'nested in complete argument',
      messageId,
      annotatedSource: `
        // nested in complete argument
        import { of } from "rxjs";
        of("foo").subscribe(
          undefined,
          undefined,
          () => of("bar").subscribe()
                          ~~~~~~~~~
        );
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'nested in complete property',
      messageId,
      annotatedSource: `
        // nested in complete property
        import { of } from "rxjs";
        of("foo").subscribe({
          complete: () => of("bar").subscribe()
                                    ~~~~~~~~~
        });
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'nested in complete method',
      messageId,
      annotatedSource: `
        // nested in complete method
        import { of } from "rxjs";
        of("foo").subscribe({
          complete() { of("bar").subscribe(); }
                                 ~~~~~~~~~
        });
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'nested in Subscribable',
      messageId,
      annotatedSource: `
        // https://github.com/cartant/eslint-plugin-rxjs/issues/69
        import { Subscribable } from "rxjs";
        declare const subscribable: Subscribable<unknown>;
        subscribable.subscribe(
          () => subscribable.subscribe()
                             ~~~~~~~~~
        );
      `,
    }),
  ],
});
