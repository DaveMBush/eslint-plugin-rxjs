import { RuleTester } from '@typescript-eslint/rule-tester';
import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/ban-operators';

const ruleTester = new RuleTester();

ruleTester.run('ban-operators', rule, {
  valid: [
    {
      code: `import { concat, merge as m, mergeMap as mm } from "rxjs/operators";`,
    },
    {
      code: `import { concat, merge as m, mergeMap as mm } from "rxjs";`,
    },
    {
      // This won't effect errors, because only imports from "rxjs/operators"
      // are checked. To support banning operators from "rxjs", it'll need to
      // check types.
      code: `import { concat, merge as m, mergeMap as mm } from "rxjs";`,
      options: [
        {
          concat: true,
          merge: true,
          mergeMap: false,
        },
      ],
    },
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      messageId,
      data: {
        name: 'concat',
        explanation: '',
      },
      description: 'forbidden operators',
      annotatedSource: `
        import { concat, merge as m, mergeMap as mm } from "rxjs/operators";
                 ~~~~~~
      `,
      options: [
        {
          concat: true,
          merge: false,
          mergeMap: false,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      data: {
        name: 'merge',
        explanation: '',
      },
      description: 'forbidden operators',
      annotatedSource: `
        import { concat, merge as m, mergeMap as mm } from "rxjs/operators";
                         ~~~~~
      `,
      options: [
        {
          concat: false,
          merge: true,
          mergeMap: false,
        },
      ],
    }),
  ],
});
