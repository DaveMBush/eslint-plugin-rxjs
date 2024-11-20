import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-subject-value';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('no-subject-value', rule, {
  valid: [
    `
      // no value
      import { BehaviorSubject } from "rxjs";
      const subject = new BehaviorSubject<number>(1);
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'value property',
      messageId,
      annotatedSource: `
        // value property
        import { BehaviorSubject } from "rxjs";
        const subject = new BehaviorSubject<number>(1);
        console.log(subject.value);
                            ~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'getValue method',
      messageId,
      annotatedSource: `
        // getValue method
        import { BehaviorSubject } from "rxjs";
        const subject = new BehaviorSubject<number>(1);
        console.log(subject.getValue());
                            ~~~~~~~~
      `,
    }),
  ],
});
