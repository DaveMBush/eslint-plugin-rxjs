import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-redundant-notify';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('no-redundant-notify', rule, {
  valid: [
    `
      // observable next + complete
      import { Observable } from "rxjs";
      const observable = new Observable<number>(observer => {
        observer.next(42);
        observer.complete();
      })
    `,
    `
      // observable next + error
      import { Observable } from "rxjs";
      const observable = new Observable<number>(observer => {
        observer.next(42);
        observer.error(new Error("Kaboom!"));
      })
    `,
    `
      // subject next + complete
      import { Subject } from "rxjs";
      const subject = new Subject<number>();
      subject.next(42);
      subject.complete();
    `,
    `
      // subject next + error
      import { Subject } from "rxjs";
      const subject = new Subject<number>();
      subject.next(42);
      subject.error(new Error("Kaboom!"));
    `,
    `
      // different names with error
      import { Subject } from "rxjs";
      const a = new Subject<number>();
      const b = new Subject<number>();
      a.error(new Error("Kaboom!"));
      b.error(new Error("Kaboom!"));
    `,
    `
      // different names with complete
      import { Subject } from "rxjs";
      const a = new Subject<number>();
      const b = new Subject<number>();
      a.complete();
      b.complete();
    `,
    `
      // non-observer
      import { Subject } from "rxjs";
      const subject = new Subject<number>();
      subject.error(new Error("Kaboom!"));
      console.error(new Error("Kaboom!"));
    `,
    `
      // multiple subjects
      import { Subject } from "rxjs";
      class SomeClass {
        private a = new Subject<number>();
        private b = new Subject<number>();
        someMethod() {
          this.a.complete();
          this.b.next();
          this.b.complete();
        }
      }
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'observable complete + next',
      messageId: messageId,
      annotatedSource: `
        // observable complete + next
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.complete();
          observer.next(42);
                   ~~~~
        })
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'observable complete + complete',
      messageId: messageId,
      annotatedSource: `
        // observable complete + complete
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.complete();
          observer.complete();
                   ~~~~~~~~
        })
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'observable complete + error',
      messageId: messageId,
      annotatedSource: `
        // observable complete + error
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.complete();
          observer.error(new Error("Kaboom!"));
                   ~~~~~
        })
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'observable error + next',
      messageId: messageId,
      annotatedSource: `
        // observable error + next
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.error(new Error("Kaboom!"));
          observer.next(42);
                   ~~~~
        })
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'observable error + complete',
      messageId: messageId,
      annotatedSource: `
        // observable error + complete
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.error(new Error("Kaboom!"));
          observer.complete();
                   ~~~~~~~~
        })
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'observable error + error',
      messageId: messageId,
      annotatedSource: `
        // observable error + error
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.error(new Error("Kaboom!"));
          observer.error(new Error("Kaboom!"));
                   ~~~~~
        });
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subject complete + next',
      messageId: messageId,
      annotatedSource: `
        // subject complete + next
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.complete();
        subject.next(42);
                ~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subject complete + complete',
      messageId: messageId,
      annotatedSource: `
        // subject complete + complete
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.complete();
        subject.complete();
                ~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subject complete + error',
      messageId: messageId,
      annotatedSource: `
        // subject complete + error
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.complete();
        subject.error(new Error("Kaboom!"));
                ~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subject error + next',
      messageId: messageId,
      annotatedSource: `
        // subject error + next
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.error(new Error("Kaboom!"));
        subject.next(42);
                ~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subject error + complete',
      messageId: messageId,
      annotatedSource: `
        // subject error + complete
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.error(new Error("Kaboom!"));
        subject.complete();
                ~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'subject error + error',
      messageId: messageId,
      annotatedSource: `
        // subject error + error
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.error(new Error("Kaboom!"));
        subject.error(new Error("Kaboom!"));
                ~~~~~
      `,
    }),
  ],
});
