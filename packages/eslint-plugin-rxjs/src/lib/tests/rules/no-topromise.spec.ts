import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-topromise';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('no-topromise', rule, {
  valid: [
    `
      // no toPromise
      import { of, Subject } from "rxjs";
      const a = of("a");
      a.subscribe(value => console.log(value));
    `,
    `
      // non-observable toPromise
      const a = {
        toPromise() {
          return Promise.resolve("a");
        }
      };
      a.toPromise().then(value => console.log(value));
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'observable toPromise',
      messageId,
      annotatedSource: `
        // observable toPromise
        import { of } from "rxjs";
        const a = of("a");
        a.toPromise().then(value => console.log(value));
          ~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subject toPromise',
      messageId,
      annotatedSource: `
        // subject toPromise
        import { Subject } from "rxjs";
        const a = new Subject<string>();
        a.toPromise().then(value => console.log(value));
          ~~~~~~~~~
      `,
    }),
  ],
});
