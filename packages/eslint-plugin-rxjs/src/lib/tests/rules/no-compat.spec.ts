import { RuleTester } from '@typescript-eslint/rule-tester';
import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-compat';
const ruleTester = new RuleTester();

ruleTester.run('no-compat', rule, {
  valid: [
    `import { Observable } from "rxjs";`,
    `import { ajax } from "rxjs/ajax";`,
    `import { fromFetch } from "rxjs/fetch";`,
    `import { concatMap } from "rxjs/operators";`,
    `import { TestScheduler } from "rxjs/testing";`,
    `import { webSocket } from "rxjs/webSocket";`,
    `import * as prefixedPackage from "rxjs-prefixed-package";`,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'Rx import',
      annotatedSource: `
        import * as Rx from "rxjs/Rx";
                            ~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'Rx import',
      annotatedSource: `
        import { Observable } from "rxjs/Observable";
                                   ~~~~~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'Rx import',
      annotatedSource: `
        import { Subject } from "rxjs/Subject";
                                ~~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'Rx import',
      annotatedSource: `
        import { merge } from "rxjs/observable/merge";
                              ~~~~~~~~~~~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'Rx import',
      annotatedSource: `
        import { merge } from "rxjs/operator/merge";
                              ~~~~~~~~~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'Rx import',
      annotatedSource: `
        import { asap } from "rxjs/scheduler/asap";
                             ~~~~~~~~~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'Rx import',
      annotatedSource: `
        import "rxjs/add/observable/merge";
               ~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId,
      description: 'Rx import',
      annotatedSource: `
        import "rxjs/add/operator/mergeMap";
               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
    }),
  ],
});
