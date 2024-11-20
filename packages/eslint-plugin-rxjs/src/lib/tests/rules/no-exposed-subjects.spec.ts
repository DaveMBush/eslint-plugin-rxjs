import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, {
  forbiddenId,
  forbiddenAllowProtectedId,
} from '../../rules/no-exposed-subjects';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('no-exposed-subjects', rule, {
  valid: [
    `
      // variable
      import { Subject } from 'rxjs';

      const variable = new Subject<void>();
    `,
    `
      // parameter and return type
      import { Subject } from 'rxjs';

      function foo(a$: Subject<any>): Subject<any> {
        return a$;
      }
    `,
    `
      // private
      import { Observable, Subject } from 'rxjs';

      class Mock {
        private a = new Subject<void>();
        private readonly b = new Subject<void>();
        private c: number;

        constructor(
          private d: Subject<any>,
          private e: Observable<any>,
          f: Subject<any>,
        ) {}

        get g(): number {
          return this.age;
        }

        set g(newNum: number) {
          this._age = newNum;
        }

        private h(): Subject<any> {
          return new Subject<any>();
        }
      }
    `,
    {
      code: `
        // allowed protected
        import { Subject } from 'rxjs';

        class Mock {
          protected a = new Subject<void>();

          constructor(
            protected b: Subject<any>,
          ){}

          protected get c(): Subject<any> {
            return this._submitSubject$;
          }

          protected set c(a: Subject<any>) {
            this._submitSubject$ = set$;
          }

          protected d(): Subject<any> {
            return new Subject<any>();
          }
        }
      `,
      options: [{ allowProtected: true }],
    },
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'public and protected a',
      messageId: forbiddenId,
      annotatedSource: `
        // public and protected
        import { Subject } from 'rxjs';

        class Mock {
          public a = new Subject<void>();
                 ~
        }
      `,
      data: {
        subject: 'a',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'public and protected b',
      messageId: forbiddenId,
      annotatedSource: `
        // public and protected
        import { Subject } from 'rxjs';

        class Mock {
          protected b = new Subject<void>();
                    ~
        }
      `,
      data: {
        subject: 'b',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'public and protected c',
      messageId: forbiddenId,
      annotatedSource: `
        // public and protected
        import { Subject } from 'rxjs';

        class Mock {
          c = new Subject<any>();
          ~
        }
      `,
      data: {
        subject: 'c',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'public and protected d',
      messageId: forbiddenId,
      annotatedSource: `
        // public and protected
        import { Subject } from 'rxjs';

        class Mock {
          public readonly d = new Subject<void>();
                          ~
        }
      `,
      data: {
        subject: 'd',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'public and protected e',
      messageId: forbiddenId,
      annotatedSource: `
        // public and protected
        import { Subject } from 'rxjs';

        class Mock {
          readonly e = new Subject<void>();
                   ~
        }
      `,
      data: {
        subject: 'e',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'public and protected via constructor a',
      messageId: forbiddenId,
      annotatedSource: `
        // public and protected via constructor
        import { Subject } from 'rxjs';

        class Mock {
          constructor(
            public a: Subject<any>,
                   ~
            private b: Subject<any>,
          ) {}
        }
      `,
      data: {
        subject: 'a',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'public and protected via constructor b',
      messageId: forbiddenId,
      annotatedSource: `
        // public and protected via constructor
        import { Subject } from 'rxjs';

        class Mock {
          constructor(
            private a: Subject<any>,
            protected b: Subject<any>,
                      ~
          ) {}
        }
      `,
      data: {
        subject: 'b',
      },
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'public via getter/setter get',
      messageId: forbiddenId,
      annotatedSource: `
        // public via getter/setter
        import { Subject } from 'rxjs';

        class Mock {
          get a(): Subject<any> {
              ~
            return this._submitSubject$;
          }

          private set a(a: Subject<any>) {
            this._submitSubject$ = set$;
          }
        }
      `,
      data: {
        subject: 'a',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'public via getter/setter set',
      messageId: forbiddenId,
      annotatedSource: `
        // public via getter/setter
        import { Subject } from 'rxjs';

        class Mock {
          private get a(): Subject<any> {
            return this._submitSubject$;
          }

          set a(a: Subject<any>) {
              ~
            this._submitSubject$ = set$;
          }
        }
      `,
      data: {
        subject: 'a',
      },
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'public return type a',
      messageId: forbiddenId,
      annotatedSource: `
        // public return type
        import { Subject } from 'rxjs';

        class Mock {
          public a(): Subject<any> {
                 ~
            return new Subject<any>();
          }

          private b(): Subject<any> {
            return new Subject<any>();
          }
        }
      `,
      data: {
        subject: 'a',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'public return type b',
      messageId: forbiddenId,
      annotatedSource: `
        // public return type
        import { Subject } from 'rxjs';

        class Mock {
          private a(): Subject<any> {
            return new Subject<any>();
          }

          b(): Subject<any> {
          ~
            return new Subject<any>();
          }
        }
      `,
      data: {
        subject: 'b',
      },
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'public but allow protected a',
      messageId: forbiddenAllowProtectedId,
      annotatedSource: `
        // public but allow protected a
        import { Subject } from 'rxjs';

        class Mock {
          public a = new Subject<void>();
                 ~

          constructor(
            private b: Subject<any>,
          ) {}
        }
      `,
      options: [{ allowProtected: true }],
      data: {
        subject: 'a',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'public but allow protected b',
      messageId: forbiddenAllowProtectedId,
      annotatedSource: `
        // public but allow protected
        import { Subject } from 'rxjs';

        class Mock {
          private a = new Subject<void>();

          constructor(
            public b: Subject<any>,
                   ~
          ) {}

        }
      `,
      options: [{ allowProtected: true }],
      data: {
        subject: 'b',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'public but allow protected c-get',
      messageId: forbiddenAllowProtectedId,
      annotatedSource: `
        // public but allow protected
        import { Subject } from 'rxjs';

        class Mock {

          get c(): Subject<any> {
              ~
            return this._submitSubject$;
          }
        }
      `,
      options: [{ allowProtected: true }],
      data: {
        subject: 'c',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'public but allow protected c-set',
      messageId: forbiddenAllowProtectedId,
      annotatedSource: `
        // public but allow protected
        import { Subject } from 'rxjs';

        class Mock {
          set c(a: Subject<any>) {
              ~
            this._submitSubject$ = set$;
          }

        }
      `,
      options: [{ allowProtected: true }],
      data: {
        subject: 'c',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'public but allow protected d',
      messageId: forbiddenAllowProtectedId,
      annotatedSource: `
        // public but allow protected
        import { Subject } from 'rxjs';

        class Mock {
          d(): Subject<any> {
          ~
            return new Subject<any>();
          }
        }
      `,
      options: [{ allowProtected: true }],
      data: {
        subject: 'd',
      },
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'EventEmitter c',
      messageId: forbiddenId,
      annotatedSource: `
        // EventEmitter
        import { Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}

        class Something {
          public a: EventEmitter<any>;
          protected b: EventEmitter<any>;
          public c: Subject<any>;
                 ~
        }
      `,
      data: {
        subject: 'c',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'EventEmitter d',
      messageId: forbiddenId,
      annotatedSource: `
        // EventEmitter
        import { Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}

        class Something {
          public a: EventEmitter<any>;
          protected b: EventEmitter<any>;
          protected d: Subject<any>;
                    ~
        }
      `,
      data: {
        subject: 'd',
      },
    }),

    convertAnnotatedSourceToFailureCase({
      description:
        'https://github.com/cartant/eslint-plugin-rxjs/issues/91 getfoo',
      messageId: forbiddenId,
      annotatedSource: `
        // https://github.com/cartant/eslint-plugin-rxjs/issues/91
        import { Subject } from "rxjs";

        class AppComponent {
          private foo$: Subject<unknown>;
          public getFoo(): Subject<unknown> {
                 ~~~~~~
            return this.foo$;
          }
        }
      `,
      data: {
        subject: 'getFoo',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'https://github.com/cartant/eslint-plugin-rxjs/issues/91 foo$',
      messageId: forbiddenId,
      annotatedSource: `
        // https://github.com/cartant/eslint-plugin-rxjs/issues/91
        import { Subject } from "rxjs";

        class AppComponent {
          public foo$: Subject<unknown>;
                 ~~~~
        }
      `,
      data: {
        subject: 'foo$',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'https://github.com/cartant/eslint-plugin-rxjs/issues/91 bar$',
      messageId: forbiddenId,
      annotatedSource: `
        // https://github.com/cartant/eslint-plugin-rxjs/issues/91
        import { Subject } from "rxjs";

        class AppComponent {
          public bar$ = new Subject<unknown>();
                 ~~~~
        }
      `,
      data: {
        subject: 'bar$',
      },
    }),
  ],
});
