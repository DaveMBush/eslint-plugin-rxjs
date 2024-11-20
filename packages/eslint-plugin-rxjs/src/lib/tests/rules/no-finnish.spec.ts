import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/no-finnish';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('no-finnish', rule, {
  valid: [
    `
      // without $
      import { Observable, of } from "rxjs";

      const someObservable = of(0);
      const someObject = { someKey: someObservable };
      const { someKey: anotherObservable } = someObject;
      const [{ someKey: yetAnotherObservable }] = [someObject];

      const someEmptyObject = {};
      const someOtherObject = { ...someEmptyObject, someKey: someObservable };
      const { someKey } = someOtherObject;
      const { someKey: someRenamedKey } = someOtherObject;

      const someArray = [someObservable];
      const [someElement] = someArray;
      someArray.forEach(function (element: Observable<any>): void {});
      someArray.forEach((element: Observable<any>) => {});

      function someFunction(someParam: Observable<any>): Observable<any> { return someParam; }
      const someArrowFunction = (someParam: Observable<any>): Observable<any> => someParam;

      class SomeClass {
        someProperty: Observable<any>;
        constructor(someParam: Observable<any>) {}
        get someGetter(): Observable<any> { throw new Error("Some error."); }
        set someSetter(someParam: Observable<any>) {}
        someMethod(someParam: Observable<any>): Observable<any> { return someParam; }
      }

      interface SomeInterface {
        someProperty: Observable<any>;
        someMethod(someParam: Observable<any>): Observable<any>;
        new (someParam: Observable<any>);
        (someParam: Observable<any>): void;
      }
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'variables with $ a',
      messageId,
      annotatedSource: `
        // variables with $
        import { Observable, of } from "rxjs";
        const someObservable$ = of(0);
              ~~~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'variables with $ b',
      messageId,
      annotatedSource: `
        // variables with $
        import { Observable, of } from "rxjs";
        const someObservable = of(0);
        const someObject = { someKey$: someObservable };
                             ~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'variables with $ c',
      messageId,
      annotatedSource: `
        // variables with $
        import { Observable, of } from "rxjs";
        const someObservable = of(0);
        const someObject = { someKey: someObservable };
        const { someKey } = someObject;
        const { someKey: anotherObservable$ } = someObject;
                         ~~~~~~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'variables with $ d',
      messageId,
      annotatedSource: `
        // variables with $
        import { Observable, of } from "rxjs";
        const someObservable = of(0);
        const someObject = { someKey: someObservable };
        const { someKey } = someObject;
        const { someKey: anotherObservable } = someObject;
        const [{ someKey: yetAnotherObservable$ }] = [someObject];
                          ~~~~~~~~~~~~~~~~~~~~~
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'objects with $ a',
      messageId,
      annotatedSource: `
        // objects with $
        import { Observable, of } from "rxjs";
        const someObservable$ = of(0);
              ~~~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'objects with $ b',
      messageId,
      annotatedSource: `
        // objects with $
        import { Observable, of } from "rxjs";
        const someObservable = of(0);
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey$: someObservable };
                                                 ~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'objects with $ c',
      messageId,
      annotatedSource: `
        // objects with $
        import { Observable, of } from "rxjs";
        const someObservable = of(0);
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey: someObservable };
        const { someKey } = someObject;
        const { someKey: someRenamedKey$ } = someObject;
                         ~~~~~~~~~~~~~~~
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'arrays with $ a',
      messageId,
      annotatedSource: `
        // arrays with $
        import { Observable, of } from "rxjs";
        const someObservable$ = of(0);
              ~~~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'arrays with $ b',
      messageId,
      annotatedSource: `
        // arrays with $
        import { Observable, of } from "rxjs";
        const someObservable = of(0);
        const someArray = [someObservable];
        const [someElement$] = someArray;
               ~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'arrays with $ c',
      messageId,
      annotatedSource: `
        // arrays with $
        import { Observable, of } from "rxjs";
        const someObservable = of(0);
        const someArray = [someObservable];
        const [someElement] = someArray;
        someArray.forEach(function (element$: Observable<any>): void {});
                                    ~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'arrays with $ d',
      messageId,
      annotatedSource: `
        // arrays with $
        import { Observable, of } from "rxjs";
        const someObservable = of(0);
        const someArray = [someObservable$];
        const [someElement] = someArray;
        someArray.forEach((element$: Observable<any>) => {});
                           ~~~~~~~~
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'functions with $ a',
      messageId,
      annotatedSource: `
        // functions with $
        import { Observable } from "rxjs";
        function someFunction$(someParam: Observable<any>): Observable<any> { return someParam$; }
                 ~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'functions with $ b',
      messageId,
      annotatedSource: `
        // functions with $
        import { Observable } from "rxjs";
        function someFunction(someParam$: Observable<any>): Observable<any> { return someParam$; }
                              ~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'functions with $ c',
      messageId,
      annotatedSource: `
        // functions with $
        import { Observable } from "rxjs";
        const someArrowFunction$ = (someParam: Observable<any>): Observable<any> => someParam$;
              ~~~~~~~~~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'functions with $ d',
      messageId,
      annotatedSource: `
        // functions with $
        import { Observable } from "rxjs";
        const someArrowFunction = (someParam$: Observable<any>): Observable<any> => someParam$;
                                   ~~~~~~~~~~
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'class with $ a',
      messageId,
      annotatedSource: `
        // class with $
        import { Observable } from "rxjs";
        class SomeClass {
          someProperty$: Observable<any>;
          ~~~~~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'class with $ b',
      messageId,
      annotatedSource: `
        // class with $
        import { Observable } from "rxjs";
        class SomeClass {
          constructor(someParam$: Observable<any>) {}
                      ~~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'class with $ c',
      messageId,
      annotatedSource: `
        // class with $
        import { Observable } from "rxjs";
        class SomeClass {
          get someGetter$(): Observable<any> { throw new Error("Some error."); }
              ~~~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'class with $ d',
      messageId,
      annotatedSource: `
        // class with $
        import { Observable } from "rxjs";
        class SomeClass {
          set someSetter$(someParam: Observable<any>) {}
              ~~~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'class with $ e',
      messageId,
      annotatedSource: `
        // class with $
        import { Observable } from "rxjs";
        class SomeClass {
          set someSetter(someParam$: Observable<any>) {}
                         ~~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'class with $ f',
      messageId,
      annotatedSource: `
        // class with $
        import { Observable } from "rxjs";
        class SomeClass {
          someMethod$(someParam: Observable<any>): Observable<any> { return someParam; }
          ~~~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'class with $ g',
      messageId,
      annotatedSource: `
        // class with $
        import { Observable } from "rxjs";
        class SomeClass {
          someMethod(someParam$: Observable<any>): Observable<any> { return someParam; }
                     ~~~~~~~~~~
        }
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'interface with $ a',
      messageId,
      annotatedSource: `
        // interface with $
        import { Observable } from "rxjs";
        interface SomeInterface {
          someProperty$: Observable<any>;
          ~~~~~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'interface with $ b',
      messageId,
      annotatedSource: `
        // interface with $
        import { Observable } from "rxjs";
        interface SomeInterface {
          someMethod$(someParam: Observable<any>): Observable<any>;
          ~~~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'interface with $ c',
      messageId,
      annotatedSource: `
        // interface with $
        import { Observable } from "rxjs";
        interface SomeInterface {
          someMethod(someParam$: Observable<any>): Observable<any>;
                     ~~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'interface with $ d',
      messageId,
      annotatedSource: `
        // interface with $
        import { Observable } from "rxjs";
        interface SomeInterface {
          new (someParam$: Observable<any>);
               ~~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'interface with $ e',
      messageId,
      annotatedSource: `
        // interface with $
        import { Observable } from "rxjs";
        interface SomeInterface {
          (someParam$: Observable<any>): void;
           ~~~~~~~~~~
        }
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'functions and methods not returning observables a',
      messageId,
      annotatedSource: `
        // functions and methods not returning observables
        import { Observable } from "rxjs";

        function someFunction(someParam$: Observable<any>): void {}
                              ~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'functions and methods not returning observables b',
      messageId,
      annotatedSource: `
        // functions and methods not returning observables
        import { Observable } from "rxjs";

        class SomeClass {
          someMethod(someParam$: Observable<any>): void {}
                     ~~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'functions and methods not returning observables c',
      messageId,
      annotatedSource: `
        // functions and methods not returning observables
        import { Observable } from "rxjs";

        interface SomeInterface {
          someMethod(someParam$: Observable<any>): void;
                     ~~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'functions and methods not returning observables d',
      messageId,
      annotatedSource: `
        // functions and methods not returning observables
        import { Observable } from "rxjs";

        interface SomeInterface {
          (someParam$: Observable<any>): void;
           ~~~~~~~~~~
        }
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'functions and methods with non-observable parameters a',
      messageId,
      annotatedSource: `
        // functions and methods with non-observable parameters
        import { Observable, of } from "rxjs";

        function someFunction$(someValue: any): Observable<any> { return of(someValue); }
                 ~~~~~~~~~~~~~

      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'functions and methods with non-observable parameters b',
      messageId,
      annotatedSource: `
        // functions and methods with non-observable parameters
        import { Observable, of } from "rxjs";

        class SomeClass {
          someMethod$(someValue: any): Observable<any> { return of(someValue); }
          ~~~~~~~~~~~
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'functions and methods with non-observable parameters c',
      messageId,
      annotatedSource: `
        // functions and methods with non-observable parameters
        import { Observable, of } from "rxjs";

        interface SomeInterface {
          someMethod$(someValue: any): Observable<any>;
          ~~~~~~~~~~~
          (someValue: any): Observable<any>;
        }
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'functions and methods with array destructuring a',
      messageId,
      annotatedSource: `
        // functions and methods with array destructuring
        import { Observable } from "rxjs";

        function someFunction([someParam$]: Observable<any>[]): void {}
                               ~~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'functions and methods with array destructuring b',
      messageId,
      annotatedSource: `
        // functions and methods with array destructuring
        import { Observable } from "rxjs";

        class SomeClass {
          someMethod([someParam$]: Observable<any>[]): void {}
                      ~~~~~~~~~~
        }
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'functions and methods with object destructuring a',
      messageId,
      annotatedSource: `
        // functions and methods with object destructuring
        import { Observable } from "rxjs";

        function someFunction({ source$ }: Record<string, Observable<any>>): void {}
                                ~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'functions and methods with object destructuring b',
      messageId,
      annotatedSource: `
        // functions and methods with object destructuring
        import { Observable } from "rxjs";

        class SomeClass {
          someMethod({ source$ }: Record<string, Observable<any>>): void {}
                       ~~~~~~~
        }
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'parameter property',
      messageId,
      annotatedSource: `
        // parameter property
        import { Observable } from "rxjs";

        class SomeClass {
          constructor(public someProp$: Observable<any>) {}
                             ~~~~~~~~~
        }
      `,
    }),
  ],
});
