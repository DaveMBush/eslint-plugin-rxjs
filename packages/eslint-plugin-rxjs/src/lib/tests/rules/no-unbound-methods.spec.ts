/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-unbound-methods';
import { testCheckConfig } from './type-check';
import { RuleTester, ValidTestCase, InvalidTestCase } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

interface Tests {
  valid: (ValidTestCase<any> | string)[];
  invalid: InvalidTestCase<any, any>[];
}

const arrowTests: Tests = {
  valid: [
    `
      // arrows
      import { NEVER, Observable, of, Subscription, throwError } from "rxjs";
      import { catchError, map, takeUntil } from "rxjs/operators";

      function userland<T>(selector: (t: T) => T) { return map(selector); }

      class Something {
        someObservable = NEVER;
        constructor() {
          const ob = of(1).pipe(
            map(value => this.map(value)),
            userland(value => this.map(value)),
            takeUntil(this.someObservable),
            catchError(error => this.catchError(error))
          ).subscribe(
            value => this.next(value),
            error => this.error(error),
            () => this.complete()
          );
          const subscription = new Subscription(() => this.tearDown);
          subscription.add(() => this.tearDown);
        }
        catchError(error: any): Observable<never> { return throwError(error); }
        complete(): void {}
        error(error: any): void {}
        map<T>(t: T): T { return t; }
        next<T>(t: T): void {}
        tearDown(): void {}
      }
    `,
  ],
  invalid: [],
};

const boundTests: Tests = {
  valid: [
    `
      // bound
      import { NEVER, Observable, of, Subscription, throwError } from "rxjs";
      import { catchError, map, takeUntil } from "rxjs/operators";

      function userland<T>(selector: (t: T) => T) { return map(selector); }

      class Something {
        someObservable = NEVER;
        constructor() {
          const ob = of(1).pipe(
            map(this.map.bind(this)),
            userland(this.map.bind(this)),
            takeUntil(this.someObservable),
            catchError(this.catchError.bind(this))
          ).subscribe(
            this.next.bind(this),
            this.error.bind(this),
            this.complete.bind(this)
          );
          const subscription = new Subscription(this.tearDown.bind(this));
          subscription.add(this.tearDown.bind(this));
        }
        catchError(error: any): Observable<never> { return throwError(error); }
        complete(): void {}
        error(error: any): void {}
        map<T>(t: T): T { return t; }
        next<T>(t: T): void {}
        tearDown(): void {}
      }
    `,
  ],
  invalid: [],
};

const deepTests: Tests = {
  valid: [],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'deep a',
      messageId,
      annotatedSource: `
        // deep
        import { Observable, of, throwError, NEVER } from "rxjs";
        import { catchError, map, takeUntil } from "rxjs/operators";

        function userland<T>(selector: (t: T) => T) { return map(selector); }

        class Something {
          deep = {
            catchError(error: any): Observable<never> { return throwError(error); },
            complete(): void {},
            error(error: any): void {},
            map<T>(t: T): T { return t; },
            next<T>(t: T): void {},
          }
          someObservable = NEVER;
          constructor() {
            const ob = of(1).pipe(
              map(this.deep.map),
                  ~~~~~~~~~~~~~
            ).subscribe(
            );
          }
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'deep b',
      messageId,
      annotatedSource: `
        // deep
        import { Observable, of, throwError, NEVER } from "rxjs";
        import { catchError, map, takeUntil } from "rxjs/operators";

        function userland<T>(selector: (t: T) => T) { return map(selector); }

        class Something {
          deep = {
            catchError(error: any): Observable<never> { return throwError(error); },
            complete(): void {},
            error(error: any): void {},
            map<T>(t: T): T { return t; },
            next<T>(t: T): void {},
          }
          someObservable = NEVER;
          constructor() {
            const ob = of(1).pipe(
              userland(this.deep.map),
                       ~~~~~~~~~~~~~
            ).subscribe(
            );
          }
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'deep c',
      messageId,
      annotatedSource: `
        // deep
        import { Observable, of, throwError, NEVER } from "rxjs";
        import { catchError, map, takeUntil } from "rxjs/operators";

        function userland<T>(selector: (t: T) => T) { return map(selector); }

        class Something {
          deep = {
            catchError(error: any): Observable<never> { return throwError(error); },
            complete(): void {},
            error(error: any): void {},
            map<T>(t: T): T { return t; },
            next<T>(t: T): void {},
          }
          someObservable = NEVER;
          constructor() {
            const ob = of(1).pipe(
              takeUntil(this.someObservable),
              catchError(this.deep.catchError)
                         ~~~~~~~~~~~~~~~~~~~~
            ).subscribe(
            );
          }
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'deep d',
      messageId,
      annotatedSource: `
        // deep
        import { Observable, of, throwError, NEVER } from "rxjs";
        import { catchError, map, takeUntil } from "rxjs/operators";

        function userland<T>(selector: (t: T) => T) { return map(selector); }

        class Something {
          deep = {
            catchError(error: any): Observable<never> { return throwError(error); },
            complete(): void {},
            error(error: any): void {},
            map<T>(t: T): T { return t; },
            next<T>(t: T): void {},
          }
          someObservable = NEVER;
          constructor() {
            const ob = of(1).pipe(
            ).subscribe(
              this.deep.next,
              ~~~~~~~~~~~~~~
            );
          }
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'deep e',
      messageId,
      annotatedSource: `
        // deep
        import { Observable, of, throwError, NEVER } from "rxjs";
        import { catchError, map, takeUntil } from "rxjs/operators";

        function userland<T>(selector: (t: T) => T) { return map(selector); }

        class Something {
          deep = {
            catchError(error: any): Observable<never> { return throwError(error); },
            complete(): void {},
            error(error: any): void {},
            map<T>(t: T): T { return t; },
            next<T>(t: T): void {},
          }
          someObservable = NEVER;
          constructor() {
            const ob = of(1).pipe(
            ).subscribe(
              this.deep.error,
              ~~~~~~~~~~~~~~~
            );
          }
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'deep f',
      messageId,
      annotatedSource: `
        // deep
        import { Observable, of, throwError, NEVER } from "rxjs";
        import { catchError, map, takeUntil } from "rxjs/operators";

        function userland<T>(selector: (t: T) => T) { return map(selector); }

        class Something {
          deep = {
            catchError(error: any): Observable<never> { return throwError(error); },
            complete(): void {},
            error(error: any): void {},
            map<T>(t: T): T { return t; },
            next<T>(t: T): void {},
          }
          someObservable = NEVER;
          constructor() {
            const ob = of(1).pipe(
            ).subscribe(
              this.deep.complete
              ~~~~~~~~~~~~~~~~~~
            );
          }
        }
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'deep teardowns a',
      messageId,
      annotatedSource: `
        // deep teardowns
        import { Subscription } from "rxjs";
        import { takeUntil } from "rxjs/operators";

        class Something {
          deep = {
            tearDown(): void {}
          }
          constructor() {
            const subscription = new Subscription(this.deep.tearDown);
                                                  ~~~~~~~~~~~~~~~~~~
          }
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'deep teardowns b',
      messageId,
      annotatedSource: `
        // deep teardowns
        import { Subscription } from "rxjs";
        import { takeUntil } from "rxjs/operators";

        class Something {
          deep = {
            tearDown(): void {}
          }
          constructor() {
            const subscription = new Subscription();
            subscription.add(this.deep.tearDown);
                             ~~~~~~~~~~~~~~~~~~
          }
        }
      `,
    }),
  ],
};

const staticTests: Tests = {
  valid: [
    `
      // static
      import { NEVER, Observable, of, Subscription, throwError } from "rxjs";
      import { catchError, map, takeUntil } from "rxjs/operators";

      function userland<T>(selector: (t: T) => T) { return map(selector); }

      class Something {
        someObservable = NEVER;
        constructor() {
          const ob = of(1).pipe(
            map(Something.map),
            userland(Something.map),
            takeUntil(this.someObservable),
            catchError(Something.catchError)
          ).subscribe(
            Something.next,
            Something.error,
            Something.complete
          );
          const subscription = new Subscription(Something.tearDown);
          subscription.add(Something.tearDown);
        }
        static catchError(error: any): Observable<never> { return throwError(error); }
        static complete(): void {}
        static error(error: any): void {}
        static map<T>(t: T): T { return t; }
        static next<T>(t: T): void {}
        static tearDown(): void {}
      }
    `,
  ],
  invalid: [],
};

const unboundTests: Tests = {
  valid: [
    `
      // unbound observable
      import { NEVER, of } from "rxjs";
      import { takeUntil } from "rxjs/operators";

      class Something {
        someObservable = NEVER;
        constructor() {
          const ob = of(1).pipe(
            takeUntil(this.someObservable),
          ).subscribe(console.log);
        }
      }
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'unbound operator arguments a',
      messageId,
      annotatedSource: `
        // unbound operator arguments
        import { Observable, of, throwError } from "rxjs";
        import { catchError, map, takeUntil } from "rxjs/operators";

        function userland<T>(selector: (t: T) => T) { return map(selector); }

        class Something {
          constructor() {
            const ob = of(1).pipe(
              map(this.map),
                  ~~~~~~~~
            )
          }
          map<T>(t: T): T { return t; }
          catchError(error: any): Observable<never> { return throwError(error); }
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'unbound operator arguments b',
      messageId,
      annotatedSource: `
        // unbound operator arguments
        import { Observable, of, throwError } from "rxjs";
        import { catchError, map, takeUntil } from "rxjs/operators";

        function userland<T>(selector: (t: T) => T) { return map(selector); }

        class Something {
          constructor() {
            const ob = of(1).pipe(
              userland(this.map),
                       ~~~~~~~~
            )
          }
          map<T>(t: T): T { return t; }
          catchError(error: any): Observable<never> { return throwError(error); }
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'unbound operator arguments c',
      messageId,
      annotatedSource: `
        // unbound operator arguments
        import { Observable, of, throwError } from "rxjs";
        import { catchError, map, takeUntil } from "rxjs/operators";

        function userland<T>(selector: (t: T) => T) { return map(selector); }

        class Something {
          constructor() {
            const ob = of(1).pipe(
              catchError(this.catchError)
                         ~~~~~~~~~~~~~~~
            )
          }
          map<T>(t: T): T { return t; }
          catchError(error: any): Observable<never> { return throwError(error); }
        }
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'unbound subscribe arguments c',
      messageId,
      annotatedSource: `
        // unbound subscribe arguments
        import { of } from "rxjs";

        class Something {
          constructor() {
            const ob = of(1).subscribe(
              this.complete,
              ~~~~~~~~~~~~~
            );
          }
          next<T>(t: T): void {}
          error(error: any): void {}
          complete(): void {}
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'unbound subscribe arguments',
      messageId,
      annotatedSource: `
        // unbound subscribe arguments a
        import { of } from "rxjs";

        class Something {
          constructor() {
            const ob = of(1).subscribe(
              this.next,
              ~~~~~~~~~
            );
          }
          next<T>(t: T): void {}
          error(error: any): void {}
          complete(): void {}
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'unbound subscribe arguments b',
      messageId,
      annotatedSource: `
        // unbound subscribe arguments
        import { of } from "rxjs";

        class Something {
          constructor() {
            const ob = of(1).subscribe(
              this.error,
              ~~~~~~~~~~
            );
          }
          next<T>(t: T): void {}
          error(error: any): void {}
          complete(): void {}
        }
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'unbound teardowns a',
      messageId,
      annotatedSource: `
        // unbound teardowns
        import { Subscription } from "rxjs";

        class Something {
          constructor() {
            const subscription = new Subscription(this.tearDown);
                                                  ~~~~~~~~~~~~~
          }
          tearDown(): void {}
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'unbound teardowns b',
      messageId,
      annotatedSource: `
        // unbound teardowns
        import { Subscription } from "rxjs";

        class Something {
          constructor() {
            const subscription = new Subscription();
            subscription.add(this.tearDown);
                             ~~~~~~~~~~~~~
          }
          tearDown(): void {}
        }
      `,
    }),
  ],
};

ruleTester.run("no-unbound-methods", rule, {
  valid: [
    ...arrowTests.valid,
    ...boundTests.valid,
    ...deepTests.valid,
    ...staticTests.valid,
    ...unboundTests.valid,
  ],
  invalid: [
    ...arrowTests.invalid,
    ...boundTests.invalid,
    ...deepTests.invalid,
    ...staticTests.invalid,
    ...unboundTests.invalid,
  ],
});
