import { RuleTester } from '@typescript-eslint/rule-tester';
import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/ban-observables';

const ruleTester = new RuleTester();

ruleTester.run('ban-observables', rule, {
  valid: [
    {
      code: `import { concat, merge as m, mergeMap as mm } from "rxjs/operators";`,
    },
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      messageId,
      data: {
        name: 'of',
        explanation: '',
      },
      description: 'forbidden observables',
      annotatedSource: `
        import { of, Observable as o, Subject } from "rxjs";
                 ~~
      `,
      options: [
        {
          of: true,
          Observable: false,
          Subject: false,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      data: {
        name: 'Observable',
        explanation: '',
      },
      description: 'forbidden observables',
      annotatedSource: `
        import { of, Observable as o, Subject } from "rxjs";
                     ~~~~~~~~~~
      `,
      options: [
        {
          of: false,
          Observable: true,
          Subject: false,
        },
      ],
    }),
  ],
});
