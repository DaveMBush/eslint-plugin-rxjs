import { RuleTester } from '@typescript-eslint/rule-tester';
import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/macro';
import { testCheckConfig } from './type-check';
const ruleTester = new RuleTester();

ruleTester.run('macro', rule, {
  valid: [
    `
      // no macro; no RxJS
      import { foo } from "bar";
    `,
    `
      // macro; RxJS imports
      import "babel-plugin-rxjs-tools/macro";
      import { of } from "rxjs";
    `,
    `
      // macro; pipe
      import "babel-plugin-rxjs-tools/macro";
      import { foo, goo } from "bar";
      const hoo = foo.pipe(goo());
    `,
    `
      // macro; subscribe
      import "babel-plugin-rxjs-tools/macro";
      import { foo } from "bar";
      foo.subscribe();
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'no macro; RxJS imports',
      annotatedSource: `
// no macro; RxJS imports
import { of } from "rxjs";
~~~~~~~~~~~~~~~~~~~~~~~~~~// keep space for fixer
`,
      annotatedOutput: `
// no macro; RxJS imports
import "babel-plugin-rxjs-tools/macro";
import { of } from "rxjs";
// keep space for fixer
`,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'no macro; pipe',
      annotatedSource: `
// no macro; pipe
import { foo, goo } from "bar";
const hoo = foo.pipe(goo());
            ~~~~~~~~// keep space for fixer
`,
      annotatedOutput: `
// no macro; pipe
import "babel-plugin-rxjs-tools/macro";
import { foo, goo } from "bar";
const hoo = foo.pipe(goo());
            // keep space for fixer
`,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'no macro; subscribe',
      annotatedSource: `
// no macro; subscribe
import { foo } from "bar";
foo.subscribe();
~~~~~~~~~~~~~// keep space for fixer
`,
      annotatedOutput: `
// no macro; subscribe
import "babel-plugin-rxjs-tools/macro";
import { foo } from "bar";
foo.subscribe();
// keep space for fixer
`,
    }),
  ],
});
