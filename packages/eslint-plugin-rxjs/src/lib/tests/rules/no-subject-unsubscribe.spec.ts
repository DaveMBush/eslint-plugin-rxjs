import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-subject-unsubscribe';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('no-subject-unsubscribe', rule, {
  valid: [
    `
      // unsubscribe Subject subscription
      import { Subject } from "rxjs";
      const a = new Subject<number>();
      const asub = a.subscribe();
      asub.unsubscribe();
    `,
    `
      // unsubscribe AsyncSubject subscription
      import { AsyncSubject } from "rxjs";
      const a = new AsyncSubject<number>();
      const asub = a.subscribe();
      asub.unsubscribe();
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'Subject',
      messageId,
      annotatedSource: `
        // unsubscribe Subject
        import { Subject } from "rxjs";
        const b = new Subject<number>();
        b.unsubscribe();
          ~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'AsyncSubject',
      messageId,
      annotatedSource: `
        // unsubscribe AsyncSubject
        import { AsyncSubject } from "rxjs";
        const b = new AsyncSubject<number>();
        b.unsubscribe();
          ~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'Subject',
      messageId,
      annotatedSource: `
        // compose Subject
        import { Subject, Subscription } from "rxjs";
        const csub = new Subscription();
        const c = new Subject<number>();
        csub.add(c);
                 ~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'AsyncSubject',
      messageId,
      annotatedSource: `
        // compose AsyncSubject
        import { AsyncSubject, Subscription } from "rxjs";
        const csub = new Subscription();
        const c = new AsyncSubject<number>();
        csub.add(c);
                 ~
      `,
    }),
  ],
});
