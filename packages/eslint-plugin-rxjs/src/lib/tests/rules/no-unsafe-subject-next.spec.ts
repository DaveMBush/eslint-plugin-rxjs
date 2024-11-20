import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-unsafe-subject-next';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('no-unsafe-subject-next', rule, {
  valid: [
    {
      code: `
        // number next
        import { Subject } from "rxjs";
        const s = new Subject<number>();
        s.next(42);
      `,
    },
    {
      code: `
        // replay number next
        import { ReplaySubject } from "rxjs";
        const s = new ReplaySubject<number>();
        s.next(42);
      `,
    },
    {
      code: `
        // any next
        import { Subject } from "rxjs";
        const s = new Subject<any>();
        s.next(42);
        s.next();
      `,
    },
    {
      code: `
        // unknown next
        import { Subject } from "rxjs";
        const s = new Subject<unknown>();
        s.next(42);
        s.next();
      `,
    },
    {
      code: `
        // void next
        import { Subject } from "rxjs";
        const s = new Subject<void>();
        s.next();
      `,
    },
    {
      code: `
        // void union next
        import { Subject } from "rxjs";
        const s = new Subject<number | void>();
        s.next(42);
        s.next();
      `,
    },
    {
      code: `
        // https://github.com/cartant/eslint-plugin-rxjs/issues/76
        import { Subject } from "rxjs";
        const s = new Subject();
        s.next();
      `,
    },
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'optional number next',
      messageId,
      annotatedSource: `
        // optional number next
        import { Subject } from "rxjs";
        const s = new Subject<number>();
        s.next();
          ~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'optional replay number next',
      messageId,
      annotatedSource: `
        // optional replay number next
        import { ReplaySubject } from "rxjs";
        const s = new ReplaySubject<number>();
        s.next();
          ~~~~
      `,
    }),
  ],
});
