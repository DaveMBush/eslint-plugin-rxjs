/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { RuleTester } from '@typescript-eslint/rule-tester';
import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { shouldBeFinnishMessageId, shouldNotBeFinnishMessageId } from '../../rules/finnish';
import { testCheckConfig } from './type-check';

const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('finnish', rule, {
  valid: [
    {
      code: `
        // with $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);

        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey$: someObservable$ };
        const { someKey$ } = someObject;
        const { someKey$: someRenamedKey$ } = someObject;

        const someArray = [someObservable$];
        const [someElement$] = someArray;
        someArray.forEach(function (element$: Observable<any>): void {});
        someArray.forEach((element$: Observable<any>) => {});

        function someFunction$(someParam$: Observable<any>): Observable<any> { return someParam; }

        class SomeClass {
          someProperty$: Observable<any>;
          constructor (someParam$: Observable<any>) {}
          get someGetter$(): Observable<any> { throw new Error("Some error."); }
          set someSetter$(someParam$: Observable<any>) {}
          someMethod$(someParam$: Observable<any>): Observable<any> { return someParam; }
        }

        interface SomeInterface {
          someProperty$: Observable<any>;
          someMethod$(someParam$: Observable<any>): Observable<any>;
          new (someParam$: Observable<any>);
          (someParam$: Observable<any>): void;
        }
      `,
      options: [{}],
    },
    {
      code: `
        // optional variable with $
        import { Observable, of } from "rxjs";

        const someOptionalObservable$: Observable<any> | undefined = of();
      `,
      options: [{}],
    },
    {
      code: `
        // default angular whitelist
        import { Observable, of, Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}

        class Something {
          public somethingChanged: EventEmitter<any>;
          public canActivate(): Observable<any> { return of(); }
          public canActivateChild(): Observable<any> { return of(); }
          public canDeactivate(): Observable<any> { return of(); }
          public canLoad(): Observable<any> { return of(); }
          public intercept(): Observable<any> { return of(); }
          public resolve(): Observable<any> { return of(); }
          public validate(): Observable<any> { return of(); }
        }
      `,
      options: [{}],
    },
    {
      code: `
        // strict default angular whitelist
        import { Observable, of, Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}

        class Something {
          public somethingChanged: EventEmitter<any>;
          public canActivate(): Observable<any> { return of(); }
          public canActivateChild(): Observable<any> { return of(); }
          public canDeactivate(): Observable<any> { return of(); }
          public canLoad(): Observable<any> { return of(); }
          public intercept(): Observable<any> { return of(); }
          public resolve(): Observable<any> { return of(); }
          public validate(): Observable<any> { return of(); }
        }
      `,
      options: [{ strict: true }],
    },
    {
      code: `
        // explicit whitelist
        import { Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}
        let eventEmitter: EventEmitter<any> | undefined;
      `,
      options: [
        {
          types: {
            '^EventEmitter$': false,
          },
        },
      ],
    },
    {
      code: `
        // strict explicit whitelist
        import { Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}
        let eventEmitter: EventEmitter<any> | undefined;
      `,
      options: [
        {
          strict: true,
          types: {
            '^EventEmitter$': false,
          },
        },
      ],
    },
    {
      code: `
        // functions without $, but not enforced
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];
        function someFunction(someParam$: Observable<any>): Observable<any> { return someParam$; }
      `,
      options: [{ functions: false }],
    },
    {
      code: `
        // methods without $, but not enforced
        import { Observable } from "rxjs";

        class SomeClass {
          someMethod(someParam$: Observable<any>): Observable<any> { return someParam$; }
        }

        interface SomeInterface {
          someMethod(someParam$: Observable<any>): Observable<any>;
        }
      `,
      options: [{ methods: false }],
    },
    {
      code: `
        // parameters without $, but not enforced
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];
        someArray.forEach(function (element: Observable<any>): void {});
        someArray.forEach((element: Observable<any>) => {});

        function someFunction$(someParam: Observable<any>): Observable<any> { return someParam; }

        class SomeClass {
          constructor(someParam: Observable<any>) {}
          set someSetter$(someParam: Observable<any>) {}
          someMethod$(someParam: Observable<any>): Observable<any> { return someParam; }
        }

        interface SomeInterface {
          someMethod$(someParam: Observable<any>): Observable<any>;
          new (someParam$: Observable<any>);
          (someParam$: Observable<any>): void;
        }
      `,
      options: [{ parameters: false }],
    },
    {
      code: `
        // properties without $, but not enforced
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey: someObservable$ };

        class SomeClass {
          someProperty: Observable<any>;
          get someGetter(): Observable<any> { throw new Error("Some error."); }
          set someSetter(someParam$: Observable<any>) {}
        }

        interface SomeInterface {
          someProperty: Observable<any>;
        }
      `,
      options: [{ properties: false }],
    },
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'optional variable without $',
      annotatedSource: `
        // optional variable without $
        import { Observable, of } from "rxjs";

        const someOptionalObservable: Observable<any> | undefined = of();
              ~~~~~~~~~~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'explicit whitelist',
      annotatedSource: `
        // explicit whitelist
        import { of, Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}
        let eventEmitter: EventEmitter<any>;
        const foreign = of(1);

        class SomeSubject<T> extends Subject<T> {}
        let someSubject: SomeSubject<any>;
        const finnish = of(1);
              ~~~~~~~
      `,
      options: [
        {
          names: {
            '^finnish$': true,
            '^foreign$': false,
          },
          types: {
            '^EventEmitter$': false,
            '^SomeSubject$': false,
          },
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'explicit whitelist',
      annotatedSource: `
        // explicit whitelist
        import { of, Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}
        let eventEmitter: EventEmitter<any>;
        const foreign = of(1);

        class SomeSubject<T> extends Subject<T> {}
        let someSubject: SomeSubject<any>;
            ~~~~~~~~~~~
        const finnish = of(1);
      `,
      options: [
        {
          names: {
            '^finnish$': false,
            '^foreign$': false,
          },
          types: {
            '^EventEmitter$': false,
            '^SomeSubject$': true,
          },
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'explicit whitelist optional variable',
      annotatedSource: `
        // explicit whitelist optional variable
        import { Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}
        let eventEmitter: EventEmitter<any> | undefined;

        class SomeSubject<T> extends Subject<T> {}
        let someSubject: SomeSubject<any> | undefined;
            ~~~~~~~~~~~
      `,
      options: [
        {
          types: {
            '^EventEmitter$': false,
            '^SomeSubject$': true,
          },
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'functions without $',
      annotatedSource: `
        // functions without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];
        function someFunction(someParam$: Observable<any>): Observable<any> { return someParam$; }
                 ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'interface methods without $',
      annotatedSource: `
        // interface methods without $
        import { Observable } from "rxjs";

        interface SomeInterface {
          someMethod(someParam$: Observable<any>): Observable<any>;
          ~~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'class methods without $',
      annotatedSource: `
        // class methods without $
        import { Observable } from "rxjs";

        class SomeClass {
          someMethod(someParam$: Observable<any>): Observable<any> { return someParam$; }
          ~~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'forEach anonymous function parameters without $',
      annotatedSource: `
        // forEach anonymous function parameters without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];
        someArray.forEach(function (element: Observable<any>): void {});
                                    ~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'array.forEach fat arrow function parameters without $',
      annotatedSource: `
        // array.forEach fat arrow function parameters without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];
        someArray.forEach((element: Observable<any>) => {});
                           ~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'anonymous function parameters without $',
      annotatedSource: `
        // parameters without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];

        function someFunction$(someParam: Observable<any>): Observable<any> { return someParam; }
                               ~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'class constructor parameters without $',
      annotatedSource: `
        // parameters without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];

        class SomeClass {
          constructor(someParam: Observable<any>) {}
                      ~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'class setter parameters without $',
      annotatedSource: `
        // parameters without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];

        class SomeClass {
          set someSetter$(someParam: Observable<any>) {}
                          ~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'class method parameters without $',
      annotatedSource: `
        // parameters without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];

        class SomeClass {
          someMethod$(someParam: Observable<any>): Observable<any> { return someParam; }
                      ~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'interface method parameters without $',
      annotatedSource: `
        // parameters without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];

        interface SomeInterface {
          someMethod$(someParam: Observable<any>): Observable<any>;
                      ~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'interface method parameters without $',
      annotatedSource: `
        // parameters without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];

        interface SomeInterface {
          new (someParam: Observable<any>);
               ~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'interface fat arrow function parameters without $',
      annotatedSource: `
        // parameters without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];

        interface SomeInterface {
          (someParam: Observable<any>): void;
           ~~~~~~~~~
        }
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'object properties without $',
      annotatedSource: `
        // properties without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey: someObservable$ };
                                                 ~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'class field properties without $',
      annotatedSource: `
        // properties without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someEmptyObject = {};

        class SomeClass {
          someProperty: Observable<any>;
          ~~~~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'class property properties without $',
      annotatedSource: `
        // properties without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someEmptyObject = {};

        class SomeClass {
          get someGetter(): Observable<any> { throw new Error("Some error."); }
              ~~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'class setter properties without $',
      annotatedSource: `
        // properties without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someEmptyObject = {};

        class SomeClass {
          set someSetter(someParam$: Observable<any>) {}
              ~~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'interface field properties without $',
      annotatedSource: `
        // properties without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someEmptyObject = {};

        interface SomeInterface {
          someProperty: Observable<any>;
          ~~~~~~~~~~~~
        }
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'const variables without $',
      annotatedSource: `
        // variables without $
        import { Observable, of } from "rxjs";

        const someObservable = of(0);
              ~~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'object field variables without $',
      annotatedSource: `
        // variables without $
        import { Observable, of } from "rxjs";

        const someEmptyObject = {};
        const someObservable$ = of(0);
        const someObject = { ...someEmptyObject, someKey: someObservable$ };
                                                 ~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'array destructuring variables without $',
      annotatedSource: `
        // variables without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);

        const someArray = [someObservable$];
        const [someElement] = someArray;
               ~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'variables without $, but not enforced',
      annotatedSource: `
        // variables without $, but not enforced
        import { Observable, of } from "rxjs";

        const someObservable = of(0);
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey: someObservable };
                                                 ~~~~~~~
        const { someKey } = someObject;
        const { someKey: someRenamedKey } = someObject;
        const someArray = [someObservable];
        const [someElement] = someArray;
      `,
      options: [{ variables: false }],
    }),

    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'function not returning observables',
      annotatedSource: `
        // functions and methods not returning observables
        import { Observable } from "rxjs";

        function someFunction(someParam: Observable<any>): void {}
                              ~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'methods not returning observables',
      annotatedSource: `
        // functions and methods not returning observables
        import { Observable } from "rxjs";

        class SomeClass {
          someMethod(someParam: Observable<any>): void {}
                     ~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'interface methods not returning observables',
      annotatedSource: `
        // functions and methods not returning observables
        import { Observable } from "rxjs";

        interface SomeInterface {
          someMethod(someParam: Observable<any>): void;
                     ~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'interface anonymous methods not returning observables',
      annotatedSource: `
        // functions and methods not returning observables
        import { Observable } from "rxjs";

        interface SomeInterface {
          (someParam: Observable<any>): void;
           ~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'functions with non-observable parameters',
      annotatedSource: `
        // functions with non-observable parameters
        import { Observable, of } from "rxjs";

        function someFunction(someValue: any): Observable<any> { return of(someValue); }
                 ~~~~~~~~~~~~ [shouldBeFinnish]
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'class method with non-observable parameters',
      annotatedSource: `
        // functions and methods with non-observable parameters
        import { Observable, of } from "rxjs";

        class SomeClass {
          someMethod(someValue: any): Observable<any> { return of(someValue); }
          ~~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'interface methods with non-observable parameters',
      annotatedSource: `
        // functions and methods with non-observable parameters
        import { Observable, of } from "rxjs";

        interface SomeInterface {
          someMethod(someValue: any): Observable<any>;
          ~~~~~~~~~~
          (someValue: any): Observable<any>;
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'functions with array destructuring',
      annotatedSource: `
        // functions with array destructuring
        import { Observable } from "rxjs";

        function someFunction([someParam]: Observable<any>[]): void {}
                               ~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'methods with array destructuring',
      annotatedSource: `
        // methods with array destructuring
        import { Observable } from "rxjs";

        class SomeClass {
          someMethod([someParam]: Observable<any>[]): void {}
                      ~~~~~~~~~
        }
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'functions with object destructuring',
      annotatedSource: `
        // functions with object destructuring
        import { Observable } from "rxjs";

        function someFunction({ source }: Record<string, Observable<any>>): void {}
                                ~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'methods with object destructuring',
      annotatedSource: `
        // methods with object destructuring
        import { Observable } from "rxjs";

        class SomeClass {
          someMethod({ source }: Record<string, Observable<any>>): void {}
                       ~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldBeFinnishMessageId,
      description: 'parameter property',
      annotatedSource: `
        // parameter property
        import { Observable } from "rxjs";

        class SomeClass {
          constructor(public someProp: Observable<any>) {}
                             ~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      messageId: shouldNotBeFinnishMessageId,
      description: 'non-Observable variable with $',
      annotatedSource: `
        // non-Observable variable with $
        const answer$ = 42;
              ~~~~~~~
      `,
      options: [{ strict: true }],
    }),
  ],
});
