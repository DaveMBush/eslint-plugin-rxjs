import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/suffix-subjects';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('suffix-subjects', rule, {
  valid: [
    {
      code: `
      // with default suffix
      import { Subject } from "rxjs";

      const subject = new Subject<any>();
      const someSubject = new Subject<any>();

      const someObject = {
        subject: new Subject<any>(),
        someSubject: new Subject<any>()
      };

      function someFunction(
        subject: Subject<any>,
        someSubject: Subject<any>
      ) {
        console.log(subject, someSubject);
      }

      class SomeClass {
        subject = new Subject<any>();
        someSubject = new Subject<void>();

        constructor(private ctorSubject: Subject<any>) {}

        someMethod(someSubject: Subject<any>): Subject<any> {
          return someSubject;
        }

        get anotherSubject(): Subject<any> {
          return this.subject;
        }
        set anotherSubject(someSubject: Subject<any>) {
          this.someSubject = someSubject;
        }
      }

      interface SomeInterface {
        subject: Subject<any>;
        someSubject: Subject<any>;
        someMethod(someSubject: Subject<any>): Subject<any>;
        new (someSubject: Subject<any>);
        (someSubject: Subject<any>): void;
      }
    `,
      options: [{}],
    },
    {
      code: `
      // with default suffix and $
      import { Subject } from "rxjs";

      const subject$ = new Subject<any>();
      const someSubject$ = new Subject<any>();

      const someObject = {
        subject$: new Subject<any>(),
        someSubject$: new Subject<any>()
      };

      function someFunction(
        subject$: Subject<any>,
        someSubject$: Subject<any>
      ) {
        console.log(subject$, someSubject$);
      }

      class SomeClass {
        subject$ = new Subject<any>();
        someSubject$ = new Subject<void>();

        constructor(private ctorSubject$: Subject<any>) {}

        someMethod(someSubject$: Subject<any>): Subject<any> {
          return someSubject$;
        }

        get anotherSubject$(): Subject<any> {
          return this.subject$;
        }
        set anotherSubject$(someSubject$: Subject<any>) {
          this.someSubject$ = someSubject$;
        }
      }

      interface SomeInterface {
        subject$: Subject<any>;
        someSubject$: Subject<any>;
        someMethod(someSubject$: Subject<any>): Subject<any>;
        new (someSubject$: Subject<any>);
        (someSubject$: Subject<any>): void;
      }
    `,
      options: [{}],
    },
    {
      code: `
      // with explicit suffix
      import { Subject } from "rxjs";

      const sub = new Subject<any>();
      const someSub = new Subject<any>();

      const someObject = {
        sub: new Subject<any>(),
        someSub: new Subject<any>()
      };

      function someFunction(
        sub: Subject<any>,
        someSub: Subject<any>
      ) {
        console.log(sub, someSub);
      }

      class SomeClass {
        sub = new Subject<any>();
        someSub = new Subject<void>();

        constructor(private ctorSub: Subject<any>) {}

        someMethod(someSub: Subject<any>): Subject<any> {
          return someSub;
        }

        get anotherSub(): Subject<any> {
          return this.sub;
        }
        set anotherSub(someSub: Subject<any>) {
          this.someSub = someSub;
        }
      }

      interface SomeInterface {
        sub: Subject<any>;
        someSub: Subject<any>;
        someMethod(someSub: Subject<any>): Subject<any>;
        new (someSub: Subject<any>);
        (someSub: Subject<any>): void;
      }
    `,
      options: [{ suffix: 'Sub' }],
    },
    {
      code: `
      // with explicit suffix and $
      import { Subject } from "rxjs";

      const sub$ = new Subject<any>();
      const someSub$ = new Subject<any>();

      const someObject = {
        sub$: new Subject<any>(),
        someSub$: new Subject<any>()
      };

      function someFunction(
        sub$: Subject<any>,
        someSub$: Subject<any>
      ) {
        console.log(sub$, someSub$);
      }

      class SomeClass {
        sub$ = new Subject<any>();
        someSub$ = new Subject<void>();

        constructor(private ctorSub$: Subject<any>) {}

        someMethod(someSub$: Subject<any>): Subject<any> {
          return someSub$;
        }

        get anotherSub$(): Subject<any> {
          return this.sub$;
        }
        set anotherSub$(someSub$: Subject<any>) {
          this.someSub$ = someSub$;
        }
      }

      interface SomeInterface {
        sub$: Subject<any>;
        someSub$: Subject<any>;
        someMethod(someSub$: Subject<any>): Subject<any>;
        new (someSub$: Subject<any>);
        (someSub$: Subject<any>): void;

      }
    `,
      options: [{ suffix: 'Sub' }],
    },
    {
      code: `
      // with EventEmitter
      import { Subject } from "rxjs";

      class EventEmitter<T> extends Subject<T> {}
      const emitter = new EventEmitter<any>();
    `,
      options: [{}],
    },
    {
      code: `
      // with explicit non-enforced type
      import { Subject } from "rxjs";

      class Thing<T> extends Subject<T> {}
      const thing = new Thing<any>();
    `,
      options: [
        {
          types: {
            '^Thing$': false,
          },
        },
      ],
    },
    {
      code: `
        // https://github.com/cartant/rxjs-tslint-rules/issues/88
        import { RouterStateSerializer } from '@ngrx/router-store';
        import { Params, RouterStateSnapshot } from '@angular/router';

        /**
         * The RouterStateSerializer takes the current RouterStateSnapshot
         * and returns any pertinent information needed. The snapshot contains
         * all information about the state of the router at the given point in time.
         * The entire snapshot is complex and not always needed. In this case, you only
         * need the URL and query parameters from the snapshot in the store. Other items could be
         * returned such as route parameters and static route data.
         */
        export interface RouterStateUrl {
          url: string;
          queryParams: Params;
        }

        export class CustomRouterStateSerializer implements RouterStateSerializer<RouterStateUrl> {
          serialize(routerState: RouterStateSnapshot): RouterStateUrl {
            const { url } = routerState;
            const queryParams = routerState.root.queryParams;

            return { url, queryParams };
          }
        }
      `,
    },
    {
      code: `
        // variables without suffix, but not enforced
        import { Subject } from "rxjs";

        const one = new Subject<any>();
        const some = new Subject<any>();
      `,
      options: [{ variables: false }],
    },
    {
      code: `
        // BehaviorSubject with default suffix
        import { BehaviorSubject } from "rxjs";

        const subject = new BehaviorSubject<number>(42);
        const someSubject = new BehaviorSubject<number>(54);
      `,
    },
    {
      code: `
        // MySubject with default suffix
        import { Subject } from "rxjs";
        class MySubject extends Subject {}

        const subject = new MySubject<number>();
        const mySubject = new MySubject<number>();
      `,
    },
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without suffix a',
      messageId,
      annotatedSource: `
        // parameters without suffix
        import { Subject } from "rxjs";

        function someFunction(
          one: Subject<any>,
          ~~~//
        ) {
          console.log(one, some);
        }
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without suffix b',
      messageId,
      annotatedSource: `
        // parameters without suffix
        import { Subject } from "rxjs";

        function someFunction(
          some: Subject<any>
          ~~~~
        ) {
          console.log(one, some);
        }

      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without suffix c',
      messageId,
      annotatedSource: `
        // parameters without suffix
        import { Subject } from "rxjs";

        class SomeClass {
          constructor(ctor: Subject<any>) {}
                      ~~~~
        }
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without suffix d',
      messageId,
      annotatedSource: `
        // parameters without suffix
        import { Subject } from "rxjs";

        class SomeClass {
          someMethod(some: Subject<any>): Subject<any> {
                     ~~~~
            return some;
          }
        }
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without suffix e',
      messageId,
      annotatedSource: `
        // parameters without suffix
        import { Subject } from "rxjs";

        class SomeClass {
          get another(): Subject<any> {
              ~~~~~~~
            return this.ctor;
          }
        }
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without suffix f',
      messageId,
      annotatedSource: `
        // parameters without suffix
        import { Subject } from "rxjs";

        class SomeClass {
          set another(someSubject: Subject<any>) {
              ~~~~~~~
            this.ctor = some;
          }
        }
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without suffix g',
      messageId,
      annotatedSource: `
        // parameters without suffix
        import { Subject } from "rxjs";

        class SomeClass {
          set anotherSubject(some: Subject<any>) {
                             ~~~~
            this.ctor = some;
          }
        }
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without suffix h',
      messageId,
      annotatedSource: `
        // parameters without suffix
        import { Subject } from "rxjs";

        interface SomeInterface {
          someMethod(some: Subject<any>): Subject<any>;
                     ~~~~
        }
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without suffix i',
      messageId,
      annotatedSource: `
        // parameters without suffix
        import { Subject } from "rxjs";

        interface SomeInterface {
          new (some: Subject<any>);
               ~~~~
        }
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without suffix j',
      messageId,
      annotatedSource: `
        // parameters without suffix
        import { Subject } from "rxjs";

        interface SomeInterface {
          (some: Subject<any>): void;
           ~~~~
        }
      `,
      data: { suffix: 'Subject' },
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'parameters without suffix, but not enforced a',
      messageId,
      annotatedSource: `
        // parameters without suffix, but not enforced
        import { Subject } from "rxjs";

        function someFunction(
          one: Subject<any>,
          some: Subject<any>
        ) {
          console.log(one, some);
        }

        class SomeClass {
          constructor(ctor: Subject<any>) {}

          someMethod(some: Subject<any>): Subject<any> {
            return some;
          }

          get another(): Subject<any> {
              ~~~~~~~
            return this.ctor;
          }
        }

        interface SomeInterface {
          someMethod(some: Subject<any>): Subject<any>;
          new (some: Subject<any>);
          (some: Subject<any>): void;
        }
      `,
      options: [{ parameters: false }],
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without suffix, but not enforced b',
      messageId,
      annotatedSource: `
        // parameters without suffix, but not enforced
        import { Subject } from "rxjs";

        function someFunction(
          one: Subject<any>,
          some: Subject<any>
        ) {
          console.log(one, some);
        }

        class SomeClass {
          constructor(ctor: Subject<any>) {}

          someMethod(some: Subject<any>): Subject<any> {
            return some;
          }

          set another(some: Subject<any>) {
              ~~~~~~~
            this.ctor = some;
          }
        }

        interface SomeInterface {
          someMethod(some: Subject<any>): Subject<any>;
          new (some: Subject<any>);
          (some: Subject<any>): void;
        }
      `,
      options: [{ parameters: false }],
      data: { suffix: 'Subject' },
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'parameters without explicit suffix a',
      messageId,
      annotatedSource: `
        // parameters without explicit suffix
        import { Subject } from "rxjs";

        function someFunction(
          one: Subject<any>,
          ~~~
        ) {
          console.log(one, some);
        }
      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without explicit suffix b',
      messageId,
      annotatedSource: `
        // parameters without explicit suffix
        import { Subject } from "rxjs";

        function someFunction(
          some: Subject<any>
          ~~~~
        ) {
          console.log(one, some);
        }
      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without explicit suffix c',
      messageId,
      annotatedSource: `
        // parameters without explicit suffix
        import { Subject } from "rxjs";

        class SomeClass {
          constructor(ctor: Subject<any>) {}
                      ~~~~

        }
      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without explicit suffix d',
      messageId,
      annotatedSource: `
        // parameters without explicit suffix
        import { Subject } from "rxjs";

        class SomeClass {
          someMethod(some: Subject<any>): Subject<any> {
                     ~~~~
            return some;
          }
        }

      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without explicit suffix e',
      messageId,
      annotatedSource: `
        // parameters without explicit suffix
        import { Subject } from "rxjs";

        class SomeClass {
          get another(): Subject<any> {
              ~~~~~~~
            return this.ctor;
          }
        }
      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without explicit suffix f',
      messageId,
      annotatedSource: `
        // parameters without explicit suffix
        import { Subject } from "rxjs";

        class SomeClass {
          set another(someSub: Subject<any>) {
              ~~~~~~~
            this.ctor = someSub;
          }
        }

      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without explicit suffix g',
      messageId,
      annotatedSource: `
        // parameters without explicit suffix
        import { Subject } from "rxjs";

        class SomeClass {
          set anotherSub(some: Subject<any>) {
                         ~~~~
            this.ctor = some;
          }
        }
      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without explicit suffix h',
      messageId,
      annotatedSource: `
        // parameters without explicit suffix
        import { Subject } from "rxjs";

        interface SomeInterface {
          someMethod(some: Subject<any>): Subject<any>;
                     ~~~~
        }
      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without explicit suffix i',
      messageId,
      annotatedSource: `
        // parameters without explicit suffix
        import { Subject } from "rxjs";

        interface SomeInterface {
          new (some: Subject<any>);
               ~~~~
        }
      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'parameters without explicit suffix j',
      messageId,
      annotatedSource: `
        // parameters without explicit suffix
        import { Subject } from "rxjs";

        interface SomeInterface {
          (some: Subject<any>): void;
           ~~~~
        }
      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'properties without suffix a',
      messageId,
      annotatedSource: `
        // properties without suffix
        import { Subject } from "rxjs";

        const someObject = {
          one: new Subject<any>(),
          ~~~
        };
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'properties without suffix b',
      messageId,
      annotatedSource: `
        // properties without suffix
        import { Subject } from "rxjs";

        const someObject = {
          some: new Subject<any>()
          ~~~~
        };
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'properties without suffix c',
      messageId,
      annotatedSource: `
        // properties without suffix
        import { Subject } from "rxjs";

        class SomeClass {
          one = new Subject<any>();
          ~~~
        }
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'properties without suffix d',
      messageId,
      annotatedSource: `
        // properties without suffix
        import { Subject } from "rxjs";

        class SomeClass {
          some = new Subject<void>();
          ~~~~
        }
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'properties without suffix e',
      messageId,
      annotatedSource: `
        // properties without suffix
        import { Subject } from "rxjs";

        class SomeClass {
          get another(): Subject<any> {
              ~~~~~~~
            return this.subject;
          }
        }
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'properties without suffix f',
      messageId,
      annotatedSource: `
        // properties without suffix
        import { Subject } from "rxjs";

        class SomeClass {
          set another(someSubject: Subject<any>) {
              ~~~~~~~
            this.some = someSubject;
          }
        }
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'properties without suffix g',
      messageId,
      annotatedSource: `
        // properties without suffix
        import { Subject } from "rxjs";

        class SomeClass {
          set anotherSubject(some: Subject<any>) {
                             ~~~~
            this.some = some;
          }
        }
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'properties without suffix h',
      messageId,
      annotatedSource: `
        // properties without suffix
        import { Subject } from "rxjs";

        interface SomeInterface {
          one: Subject<any>;
          ~~~
        }
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'properties without suffix i',
      messageId,
      annotatedSource: `
        // properties without suffix
        import { Subject } from "rxjs";

        interface SomeInterface {
          some: Subject<any>;
          ~~~~
        }
      `,
      data: { suffix: 'Subject' },
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'properties without suffix, but not enforced',
      messageId,
      annotatedSource: `
        // properties without suffix, but not enforced
        import { Subject } from "rxjs";

        const someObject = {
          one: new Subject<any>(),
          some: new Subject<any>()
        };

        class SomeClass {
          one = new Subject<any>();
          some = new Subject<void>();

          get another(): Subject<any> {
            return this.subject;
          }
          set another(some: Subject<any>) {
                      ~~~~
            this.some = some;
          }
        }

        interface SomeInterface {
          one: Subject<any>;
          some: Subject<any>;
        }
      `,
      options: [{ properties: false }],
      data: { suffix: 'Subject' },
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'properties without explicit suffix a',
      messageId,
      annotatedSource: `
        // properties without explicit suffix
        import { Subject } from "rxjs";

        const someObject = {
          one: new Subject<any>(),
          ~~~
        };
      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'properties without explicit suffix b',
      messageId,
      annotatedSource: `
        // properties without explicit suffix
        import { Subject } from "rxjs";

        const someObject = {
          some: new Subject<any>()
          ~~~~
        };
      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'properties without explicit suffix c',
      messageId,
      annotatedSource: `
        // properties without explicit suffix
        import { Subject } from "rxjs";

        class SomeClass {
          one = new Subject<any>();
          ~~~
        }
      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'properties without explicit suffix d',
      messageId,
      annotatedSource: `
        // properties without explicit suffix
        import { Subject } from "rxjs";

        class SomeClass {
          some = new Subject<void>();
          ~~~~
        }
      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'properties without explicit suffix e',
      messageId,
      annotatedSource: `
        // properties without explicit suffix
        import { Subject } from "rxjs";

        class SomeClass {
          get another(): Subject<any> {
              ~~~~~~~
            return this.subject;
          }
        }
      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'properties without explicit suffix f',
      messageId,
      annotatedSource: `
        // properties without explicit suffix
        import { Subject } from "rxjs";

        class SomeClass {
          set another(someSub: Subject<any>) {
              ~~~~~~~
            this.some = someSub;
          }
        }
      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'properties without explicit suffix g',
      messageId,
      annotatedSource: `
        // properties without explicit suffix
        import { Subject } from "rxjs";

        class SomeClass {
          set anotherSub(some: Subject<any>) {
                         ~~~~
            this.some = some;
          }
        }
      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'properties without explicit suffix h',
      messageId,
      annotatedSource: `
        // properties without explicit suffix
        import { Subject } from "rxjs";

        interface SomeInterface {
          one: Subject<any>;
          ~~~
        }
      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'properties without explicit suffix i',
      messageId,
      annotatedSource: `
        // properties without explicit suffix
        import { Subject } from "rxjs";

        interface SomeInterface {
          some: Subject<any>;
          ~~~~
        }
      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'variables without suffix a',
      messageId,
      annotatedSource: `
        // variables without suffix
        import { Subject } from "rxjs";

        const one = new Subject<any>();
              ~~~
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'variables without suffix b',
      messageId,
      annotatedSource: `
        // variables without suffix
        import { Subject } from "rxjs";

        const some = new Subject<any>();
              ~~~~
      `,
      data: { suffix: 'Subject' },
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'variables without explicit suffix a',
      messageId,
      annotatedSource: `
        // variables without explicit suffix
        import { Subject } from "rxjs";

        const one = new Subject<any>();
              ~~~
      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'variables without explicit suffix b',
      messageId,
      annotatedSource: `
        // variables without explicit suffix
        import { Subject } from "rxjs";

        const some = new Subject<any>();
              ~~~~
      `,
      options: [{ suffix: 'Sub' }],
      data: { suffix: 'Sub' },
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'functions and methods with array destructuring a',
      messageId,
      annotatedSource: `
        // functions and methods with array destructuring
        import { Subject } from "rxjs";

        function someFunction([someParam]: Subject<any>[]): void {}
                               ~~~~~~~~~
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'functions and methods with array destructuring b',
      messageId,
      annotatedSource: `
        // functions and methods with array destructuring
        import { Subject } from "rxjs";

        class SomeClass {
          someMethod([someParam]: Subject<any>[]): void {}
                      ~~~~~~~~~
        }
      `,
      data: { suffix: 'Subject' },
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'functions and methods with object destructuring a',
      messageId,
      annotatedSource: `
        // functions and methods with object destructuring
        import { Subject } from "rxjs";

        function someFunction({ source }: Record<string, Subject<any>>): void {}
                                ~~~~~~
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'functions and methods with object destructuring b',
      messageId,
      annotatedSource: `
        // functions and methods with object destructuring
        import { Subject } from "rxjs";

        class SomeClass {
          someMethod({ source }: Record<string, Subject<any>>): void {}
                       ~~~~~~
        }
      `,
      data: { suffix: 'Subject' },
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'parameter property',
      messageId,
      annotatedSource: `
        // parameter property
        import { Subject } from "rxjs";

        class SomeClass {
          constructor(public some: Subject<any>) {}
                             ~~~~
        }
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'BehaviorSubject without suffix',
      messageId,
      annotatedSource: `
        // BehaviorSubject without suffix
        import { BehaviorSubject } from "rxjs";

        const source = new BehaviorSubject<number>(42);
              ~~~~~~
      `,
      data: { suffix: 'Subject' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'BehaviorSubject with $$ suffix a',
      messageId,
      annotatedSource: `
        // BehaviorSubject with $$ suffix
        // https://github.com/cartant/eslint-plugin-rxjs/issues/88
        import { BehaviorSubject } from "rxjs";

        const subject$ = new BehaviorSubject<number>(42);
              ~~~~~~~~
      `,
      options: [{ suffix: '$$' }],
      data: { suffix: '$$' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'BehaviorSubject with $$ suffix b',
      messageId,
      annotatedSource: `
        // BehaviorSubject with $$ suffix
        // https://github.com/cartant/eslint-plugin-rxjs/issues/88
        import { BehaviorSubject } from "rxjs";

        const someSubject$ = new BehaviorSubject<number>(54);
              ~~~~~~~~~~~~
      `,
      options: [{ suffix: '$$' }],
      data: { suffix: '$$' },
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'Property with $$ suffix',
      messageId,
      annotatedSource: `
        // Property with $$ suffix
        // https://github.com/cartant/eslint-plugin-rxjs/issues/88#issuecomment-1020645186
        import { Subject } from "rxjs";

        class SomeClass {
          public someProperty$: Subject<unknown>;
                 ~~~~~~~~~~~~~
        }
      `,
      options: [{ suffix: '$$' }],
      data: { suffix: '$$' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'MySubject without suffix',
      messageId,
      annotatedSource: `
        // MySubject without suffix
        import { Subject } from "rxjs";
        class MySubject<T> extends Subject<T> {}

        const source = new MySubject<number>();
              ~~~~~~
      `,
      data: { suffix: 'Subject' },
    }),
  ],
});
