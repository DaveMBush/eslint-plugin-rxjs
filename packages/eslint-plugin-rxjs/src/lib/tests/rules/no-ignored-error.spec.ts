import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-ignored-error';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('no-ignored-error', rule, {
  valid: [
    `
      // noop
      import { of } from "rxjs";
      const observable = of([1, 2]);
      observable.subscribe(() => {}, () => {});
    `,
    `
      // subject
      import { Subject } from "rxjs";
      const subject = new Subject<any>();
      const observable = of([1, 2]);
      observable.subscribe(subject);
    `,
    `
      // https://github.com/cartant/eslint-plugin-rxjs/issues/61
      const whatever = {
        subscribe(
          next?: (value: unknown) => void,
          error?: (error: unknown) => void
        ) {}
      };
      whatever.subscribe();
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'arrow next ignored error',
      messageId,
      annotatedSource: `
        // arrow next ignored error
        import { of } from "rxjs";
        const observable = of([1, 2]);
        observable.subscribe(() => {});
                   ~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'variable next ignored error',
      messageId,
      annotatedSource: `
        // variable next ignored error
        import { of } from "rxjs";
        const observable = of([1, 2]);
        const next = () => {};
        observable.subscribe(next);
                   ~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subject arrow next ignored error',
      messageId,
      annotatedSource: `
        // subject arrow next ignored error
        import { Subject } from "rxjs";
        const subject = new Subject<any>();
        subject.subscribe(() => {});
                ~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subject variable next ignored error',
      messageId,
      annotatedSource: `
        // subject variable next ignored error
        import { Subject } from "rxjs";
        const next = () => {};
        const subject = new Subject<any>();
        subject.subscribe(next);
                ~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'https://github.com/cartant/eslint-plugin-rxjs/issues/60 a',
      messageId,
      annotatedSource: `
        // https://github.com/cartant/eslint-plugin-rxjs/issues/60
        import { Observable } from "rxjs"
        interface ISomeExtension {
          sayHi(): void
        }
        function subscribeObservable<T>(obs: Observable<T>) {
          return obs.subscribe((v: T) => {})
                     ~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'https://github.com/cartant/eslint-plugin-rxjs/issues/60 b',
      messageId,
      annotatedSource: `
        // https://github.com/cartant/eslint-plugin-rxjs/issues/60
        import { Observable } from "rxjs"
        interface ISomeExtension {
          sayHi(): void
        }
        function subscribeObservableWithExtension<T>(obs: Observable<T> & ISomeExtension) {
          return obs.subscribe((v: T) => {})
                     ~~~~~~~~~
        }
      `,
    }),
  ],
});
