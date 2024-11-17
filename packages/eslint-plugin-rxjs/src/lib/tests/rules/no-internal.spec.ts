/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { forbiddenId, suggestId } from '../../rules/no-internal';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester();

ruleTester.run('no-internal', rule, {
  valid: [
    `
      // no internal double quote
      import { concat } from "rxjs";
      import { map } from "rxjs/operators";
    `,
    `
      // no internal single quote
      import { concat } from 'rxjs';
      import { map } from 'rxjs/operators';
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'internal double quote a',
      messageId: forbiddenId,
      annotatedSource: `
        // internal double quote
        import { concat } from "rxjs/internal/observable/concat";
                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
      `,
      annotatedOutput: `
        // internal double quote
        import { concat } from "rxjs";
                               //
      `,
      suggestions: [
        {
          messageId: suggestId,
          output: `
        // internal double quote
        import { concat } from "rxjs";
                               //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'internal double quote b',
      messageId: forbiddenId,
      annotatedSource: `
        // internal double quote
        import { map } from "rxjs/internal/operators/map";
                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
      `,
      annotatedOutput: `
        // internal double quote
        import { map } from "rxjs/operators";
                            //
      `,
      suggestions: [
        {
          messageId: suggestId,
          output: `
        // internal double quote
        import { map } from "rxjs/operators";
                            //
      `,
        },
      ],
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'internal single quote a',
      messageId: forbiddenId,
      annotatedSource: `
        // internal single quote
        import { concat } from 'rxjs/internal/observable/concat';
                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
      `,
      annotatedOutput: `
        // internal single quote
        import { concat } from 'rxjs';
                               //
      `,
      suggestions: [
        {
          messageId: suggestId,
          output: `
        // internal single quote
        import { concat } from 'rxjs';
                               //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'internal single quote b',
      messageId: forbiddenId,
      annotatedSource: `
        // internal single quote
        import { map } from 'rxjs/internal/operators/map';
                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
      `,
      annotatedOutput: `
        // internal single quote
        import { map } from 'rxjs/operators';
                            //
      `,
      suggestions: [
        {
          messageId: suggestId,
          output: `
        // internal single quote
        import { map } from 'rxjs/operators';
                            //
      `,
        },
      ],
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'internal ajax',
      messageId: forbiddenId,
      annotatedSource: `
        // internal ajax
        import { ajax } from "rxjs/internal/observable/ajax/ajax";
                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
      `,
      annotatedOutput: `
        // internal ajax
        import { ajax } from "rxjs";
                             //
      `,
      suggestions: [
        {
          messageId: suggestId,
          output: `
        // internal ajax
        import { ajax } from "rxjs";
                             //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'internal fetch',
      messageId: forbiddenId,
      annotatedSource: `
        // internal fetch
        import { fromFetch } from "rxjs/internal/observable/dom/fetch";
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
      `,
      annotatedOutput: `
        // internal fetch
        import { fromFetch } from "rxjs/fetch";
                                  //
      `,
      suggestions: [
        {
          messageId: suggestId,
          output: `
        // internal fetch
        import { fromFetch } from "rxjs/fetch";
                                  //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'internal webSocket',
      messageId: forbiddenId,
      annotatedSource: `
        // internal webSocket
        import { webSocket } from "rxjs/internal/observable/dom/webSocket";
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
      `,
      annotatedOutput: `
        // internal webSocket
        import { webSocket } from "rxjs/webSocket";
                                  //
      `,
      suggestions: [
        {
          messageId: suggestId,
          output: `
        // internal webSocket
        import { webSocket } from "rxjs/webSocket";
                                  //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'internal observable',
      messageId: forbiddenId,
      annotatedSource: `
        // internal observable
        import { concat } from "rxjs/internal/observable/concat";
                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
      `,
      annotatedOutput: `
        // internal observable
        import { concat } from "rxjs";
                               //
      `,
      suggestions: [
        {
          messageId: suggestId,
          output: `
        // internal observable
        import { concat } from "rxjs";
                               //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'internal operator',
      messageId: forbiddenId,
      annotatedSource: `
        // internal operator
        import { map } from "rxjs/internal/operators/map";
                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
      `,
      annotatedOutput: `
        // internal operator
        import { map } from "rxjs/operators";
                            //
      `,
      suggestions: [
        {
          messageId: suggestId,
          output: `
        // internal operator
        import { map } from "rxjs/operators";
                            //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'internal scheduled',
      messageId: forbiddenId,
      annotatedSource: `
        // internal scheduled
        import { scheduled } from "rxjs/internal/scheduled/scheduled";
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
      `,
      annotatedOutput: `
        // internal scheduled
        import { scheduled } from "rxjs";
                                  //
      `,
      suggestions: [
        {
          messageId: suggestId,
          output: `
        // internal scheduled
        import { scheduled } from "rxjs";
                                  //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'internal scheduler',
      messageId: forbiddenId,
      annotatedSource: `
        // internal scheduler
        import { asap } from "rxjs/internal/scheduler/asap";
                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
      `,
      annotatedOutput: `
        // internal scheduler
        import { asap } from "rxjs";
                             //
      `,
      suggestions: [
        {
          messageId: suggestId,
          output: `
        // internal scheduler
        import { asap } from "rxjs";
                             //
      `,
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'internal testing',
      messageId: forbiddenId,
      annotatedSource: `
        // internal testing
        import { TestScheduler } from "rxjs/internal/testing/TestScheduler";
                                      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
      `,
      annotatedOutput: `
        // internal testing
        import { TestScheduler } from "rxjs/testing";
                                      //
      `,
      suggestions: [
        {
          messageId: suggestId,
          output: `
        // internal testing
        import { TestScheduler } from "rxjs/testing";
                                      //
      `,
        },
      ],
    }),
  ],
});
