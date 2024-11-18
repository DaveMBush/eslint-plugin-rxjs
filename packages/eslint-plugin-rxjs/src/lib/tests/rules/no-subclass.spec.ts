/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-subclass';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('no-subclass', rule, {
  valid: [
    `
      // non-RxJS Observable
      class Observable<T> { t: T; }
      class StringObservable extends Observable<string> {}
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'Observable A',
      messageId,
      annotatedSource: `
        // Observable
        import { Observable } from "rxjs";
        class GenericObservable<T> extends Observable<T> {}
                                           ~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'Observable b',
      messageId,
      annotatedSource: `
        // Observable
        import { Observable } from "rxjs";
        class StringObservable extends Observable<string> {}
                                       ~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'Subject A',
      messageId,
      annotatedSource: `
        // Subject
        import { Subject } from "rxjs";
        class GenericSubject<T> extends Subject<T> {}
                                        ~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'Subject B',
      messageId,
      annotatedSource: `
        // Subject
        import { Subject } from "rxjs";
        class StringSubject extends Subject<string> {}
                                    ~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'Subscriber A',
      messageId,
      annotatedSource: `
        // Subscriber
        import { Subscriber } from "rxjs";
        class GenericSubscriber<T> extends Subscriber<T> {}
                                           ~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'Subscriber B',
      messageId,
      annotatedSource: `
        // Subscriber
        import { Subscriber } from "rxjs";
        class StringSubscriber extends Subscriber<string> {}
                                       ~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'AsyncSubject a',
      messageId,
      annotatedSource: `
        // AsyncSubject
        import { AsyncSubject } from "rxjs";
        class GenericAsyncSubject<T> extends AsyncSubject<T> {}
                                             ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'AsyncSubject b',
      messageId,
      annotatedSource: `
        // AsyncSubject
        import { AsyncSubject } from "rxjs";
        class StringAsyncSubject extends AsyncSubject<string> {}
                                         ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'BehaviorSubject a',
      messageId,
      annotatedSource: `
        // BehaviorSubject
        import { BehaviorSubject } from "rxjs";
        class GenericBehaviorSubject<T> extends BehaviorSubject<T> {}
                                                ~~~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'BehaviorSubject b',
      messageId,
      annotatedSource: `
        // BehaviorSubject
        import { BehaviorSubject } from "rxjs";
        class StringBehaviorSubject extends BehaviorSubject<string> {}
                                            ~~~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'ReplaySubject a',
      messageId,
      annotatedSource: `
        // ReplaySubject
        import { ReplaySubject } from "rxjs";
        class GenericReplaySubject<T> extends ReplaySubject<T> {}
                                              ~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'ReplaySubject b',
      messageId,
      annotatedSource: `
        // ReplaySubject
        import { ReplaySubject } from "rxjs";
        class StringReplaySubject extends ReplaySubject<string> {}
                                          ~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'Scheduler',
      messageId,
      annotatedSource: `
        // Scheduler
        import { Scheduler } from "rxjs/internal/Scheduler";
        class AnotherScheduler extends Scheduler {}
                                       ~~~~~~~~~
      `,
    }),
  ],
});
