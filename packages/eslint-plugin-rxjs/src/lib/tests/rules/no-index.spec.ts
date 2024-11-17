/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-index';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester();

ruleTester.run('no-index', rule, {
  valid: [
    `
      // no index double quote
      import { Observable } from "rxjs";
      import { map } from "rxjs/operators";
      import { TestScheduler } from "rxjs/testing";
      import { WebSocketSubject } from "rxjs/webSocket";
    `,
    `
      // no index single quote
      import { Observable } from 'rxjs';
      import { map } from 'rxjs/operators';
      import { TestScheduler } from 'rxjs/testing';
      import { WebSocketSubject } from 'rxjs/webSocket';
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'index double quote a',
      messageId,
      annotatedSource: `
        // index double quote
        import { Observable } from "rxjs/index";
                                   ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'index double quote b',
      messageId,
      annotatedSource: `
        // index double quote
        import { map } from "rxjs/operators/index";
                            ~~~~~~~~~~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'index double quote c',
      messageId,
      annotatedSource: `
        // index double quote
        import { TestScheduler } from "rxjs/testing/index";
                                      ~~~~~~~~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'index double quote d',
      messageId,
      annotatedSource: `
        // index double quote
        import { WebSocketSubject } from "rxjs/webSocket/index";
                                         ~~~~~~~~~~~~~~~~~~~~~~
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'index single quote a',
      messageId,
      annotatedSource: `
        // index single quote
        import { Observable } from 'rxjs/index';
                                   ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'index single quote b',
      messageId,
      annotatedSource: `
        // index single quote
        import { map } from 'rxjs/operators/index';
                            ~~~~~~~~~~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'index single quote c',
      messageId,
      annotatedSource: `
        // index single quote
        import { TestScheduler } from 'rxjs/testing/index';
                                      ~~~~~~~~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'index single quote d',
      messageId,
      annotatedSource: `
        // index single quote
        import { WebSocketSubject } from 'rxjs/webSocket/index';
                                         ~~~~~~~~~~~~~~~~~~~~~~
      `,
    }),
  ],
});
