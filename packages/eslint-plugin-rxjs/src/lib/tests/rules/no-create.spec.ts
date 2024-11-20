import { RuleTester } from '@typescript-eslint/rule-tester';
import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-create';
import { testCheckConfig } from './type-check';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('no-create', rule, {
  valid: [],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'create',
      annotatedSource: `
        // create
        import { Observable, Observer } from "rxjs";

        const ob = Observable.create((observer: Observer<string>) => {
                              ~~~~~~
            observer.next("Hello, world.");
            observer.complete();
            return () => {};
        });
      `,
    }),
  ],
});
