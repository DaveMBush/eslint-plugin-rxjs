import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, {
  forbiddenId,
  forbiddenWithoutConfigId,
} from '../../rules/no-sharereplay';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('no-sharereplay', rule, {
  valid: [
    {
      code: `
        // config allowed refCount
        const shared = of(42).pipe(
          shareReplay({ refCount: true })
        );`,
    },
    {
      code: `
        // config allowed no refCount
        const shared = of(42).pipe(
          shareReplay({ refCount: false })
        );`,
    },
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'no arguments',
      messageId: forbiddenId,
      annotatedSource: `
        // no arguments
        const shared = of(42).pipe(
          shareReplay()
          ~~~~~~~~~~~
        );
      `,
      options: [{ allowConfig: false }],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'config allowed no arguments',
      messageId: forbiddenWithoutConfigId,
      annotatedSource: `
        // config allowed no arguments
        const shared = of(42).pipe(
          shareReplay()
          ~~~~~~~~~~~
        );
      `,
      options: [{ allowConfig: true }],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'one argument',
      messageId: forbiddenWithoutConfigId,
      annotatedSource: `
        // one argument
        const shared = of(42).pipe(
          shareReplay(1)
          ~~~~~~~~~~~
        );
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'two arguments',
      messageId: forbiddenWithoutConfigId,
      annotatedSource: `
        // two arguments
        const shared = of(42).pipe(
          shareReplay(1, 100)
          ~~~~~~~~~~~
        );
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'three arguments',
      messageId: forbiddenWithoutConfigId,
      annotatedSource: `
        // three arguments
        const shared = of(42).pipe(
          shareReplay(1, 100, asapScheduler)
          ~~~~~~~~~~~
        );
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'config argument refCount',
      messageId: forbiddenId,
      annotatedSource: `
        // config argument refCount
        const shared = of(42).pipe(
          shareReplay({ refCount: true })
          ~~~~~~~~~~~
        );
      `,
      options: [{ allowConfig: false }],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'config argument no refCount',
      messageId: forbiddenId,
      annotatedSource: `
        // config argument no refCount
        const shared = of(42).pipe(
          shareReplay({ refCount: false })
          ~~~~~~~~~~~
        );
      `,
      options: [{ allowConfig: false }],
    }),
  ],
});
