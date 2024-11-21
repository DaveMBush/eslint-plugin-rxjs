import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId, RuleOptions } from '../../rules/no-unsafe-switchmap';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

const setup = `
  import { EMPTY, Observable, of } from "rxjs";
  import { switchMap, tap } from "rxjs/operators";

  function ofType<T>(type: string, ...moreTypes: string[]): (source: Observable<T>) => Observable<T> {
    return source => source;
  }

  type Actions = Observable<any>;
  const actions = of({});

  const GET_SOMETHING = "GET_SOMETHING";
  const PUT_SOMETHING = "PUT_SOMETHING";
  const GetSomething = GET_SOMETHING;
  const PutSomething = PUT_SOMETHING;
`.replace(/\n/g, '');

ruleTester.run('no-unsafe-switchmap', rule, {
  valid: [
    {
      code: `
        // effect GET string
        ${setup}
        const pipedGetEffect = actions.pipe(ofType("GET_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
        const pipedMoreGetEffect = actions.pipe(ofType("DO_SOMETHING", "GET_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
      `,
    },
    {
      code: `
        // epic GET string
        ${setup}
        const pipedGetEpic = (action$: Actions) => action$.pipe(ofType("GET_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
        const pipedMoreGetEpic = (action$: Actions) => action$.pipe(ofType("DO_SOMETHING", "GET_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
      `,
    },
    {
      code: `
        // effect GET symbol
        ${setup}
        const pipedSymbolGetEffect = actions.pipe(ofType(GET_SOMETHING), tap(() => {}), switchMap(() => EMPTY));
        const pipedOfTypeCamelCaseGetEffect = actions.pipe(ofType(GetSomething), tap(() => {}), switchMap(() => EMPTY));
      `,
    },
    {
      code: `
        // matching allow in options
        ${setup}
        const fooEffect = actions.pipe(ofType("FOO"), tap(() => {}), switchMap(() => EMPTY));
      `,
      options: <RuleOptions>[
        {
          allow: ['FOO'],
        },
      ],
    },
    {
      code: `
        // non-matching disallow in options
        ${setup}
        const barEffect = actions.pipe(ofType("BAR"), tap(() => {}), switchMap(() => EMPTY));
        const bazEffect = actions.pipe(ofType("BAZ"), tap(() => {}), switchMap(() => EMPTY));
      `,
      options: <RuleOptions>[
        {
          disallow: ['FOO'],
        },
      ],
    },
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'effect PUT string a',
      messageId,
      annotatedSource: `
        // effect PUT string
        ${setup}
        const pipedPutEffect = actions.pipe(ofType("PUT_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
                                                                                    ~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'effect PUT string b',
      messageId,
      annotatedSource: `
        // effect PUT string
        ${setup}
        const pipedMorePutEffect = actions.pipe(ofType("DO_SOMETHING", "PUT_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
                                                                                                        ~~~~~~~~~
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'epic PUT string a',
      messageId,
      annotatedSource: `
        // epic PUT string
        ${setup}
        const pipedPutEpic = (action$: Actions) => action$.pipe(ofType("PUT_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
                                                                                                        ~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'epic PUT string b',
      messageId,
      annotatedSource: `
        // epic PUT string
        ${setup}
        const pipedMorePutEpic = (action$: Actions) => action$.pipe(ofType("DO_SOMETHING", "PUT_SOMETHING"), tap(() => {}), switchMap(() => EMPTY));
                                                                                                                            ~~~~~~~~~
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'effect PUT symbol a',
      messageId,
      annotatedSource: `
        // effect PUT symbol
        ${setup}
        const pipedSymbolPutEffect = actions.pipe(ofType(PUT_SOMETHING), tap(() => {}), switchMap(() => EMPTY));
                                                                                        ~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'effect PUT symbol b',
      messageId,
      annotatedSource: `
        // effect PUT symbol
        ${setup}
        const pipedOfTypeCamelCasePutEffect = actions.pipe(ofType(PutSomething), tap(() => {}), switchMap(() => EMPTY));
                                                                                                ~~~~~~~~~
      `,
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'non-matching allow in options a',
      messageId,
      annotatedSource: `
        // non-matching allow in options
        ${setup}
        const barEffect = actions.pipe(ofType("BAR"), tap(() => {}), switchMap(() => EMPTY));
                                                                     ~~~~~~~~~
      `,
      options: <RuleOptions>[
        {
          allow: ['FOO'],
        },
      ],
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'non-matching allow in options b',
      messageId,
      annotatedSource: `
        // non-matching allow in options
        ${setup}
        const bazEffect = actions.pipe(ofType("BAZ"), tap(() => {}), switchMap(() => EMPTY));
                                                                     ~~~~~~~~~
      `,
      options: <RuleOptions>[
        {
          allow: ['FOO'],
        },
      ],
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'matching disallow in options',
      messageId,
      annotatedSource: `
        // matching disallow in options
        ${setup}
        const fooEffect = actions.pipe(ofType("FOO"), tap(() => {}), switchMap(() => EMPTY));
                                                                     ~~~~~~~~~
      `,
      options: <RuleOptions>[
        {
          disallow: ['FOO'],
        },
      ],
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'https://github.com/cartant/rxjs-tslint-rules/issues/50',
      messageId,
      annotatedSource: `
        // https://github.com/cartant/rxjs-tslint-rules/issues/50 a
        import { EMPTY, Observable, of } from "rxjs";
        import { switchMap, tap } from "rxjs/operators";

        function ofType<T>(type: string, ...moreTypes: string[]): (source: Observable<T>) => Observable<T> {
          return source => source;
        }

        const actions = of({});
        const that = { actions };

        const Actions = {
          types: {
            GET_SOMETHING: "GET_SOMETHING",
            PUT_SOMETHING: "PUT_SOMETHING",
            GetSomething: GET_SOMETHING,
            PutSomething: PUT_SOMETHING
          }
        };

        const pipedSymbolGetEffect = actions.pipe(ofType(Actions.types.GET_SOMETHING), tap(() => {}), switchMap(() => EMPTY));
        const pipedSymbolPutEffect = actions.pipe(ofType(Actions.types.PUT_SOMETHING), tap(() => {}), switchMap(() => EMPTY));
                                                                                                      ~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'https://github.com/cartant/rxjs-tslint-rules/issues/50 b',
      messageId,
      annotatedSource: `
        // https://github.com/cartant/rxjs-tslint-rules/issues/50
        import { EMPTY, Observable, of } from "rxjs";
        import { switchMap, tap } from "rxjs/operators";

        function ofType<T>(type: string, ...moreTypes: string[]): (source: Observable<T>) => Observable<T> {
          return source => source;
        }

        const actions = of({});
        const that = { actions };

        const Actions = {
          types: {
            GET_SOMETHING: "GET_SOMETHING",
            PUT_SOMETHING: "PUT_SOMETHING",
            GetSomething: GET_SOMETHING,
            PutSomething: PUT_SOMETHING
          }
        };

        const pipedSymbolGetEffect = that.actions.pipe(ofType(Actions.types.GET_SOMETHING), tap(() => {}), switchMap(() => EMPTY));
        const pipedSymbolPutEffect = that.actions.pipe(ofType(Actions.types.PUT_SOMETHING), tap(() => {}), switchMap(() => EMPTY));
                                                                                                           ~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'https://github.com/cartant/rxjs-tslint-rules/issues/50 c',
      messageId,
      annotatedSource: `
        // https://github.com/cartant/rxjs-tslint-rules/issues/50
        import { EMPTY, Observable, of } from "rxjs";
        import { switchMap, tap } from "rxjs/operators";

        function ofType<T>(type: string, ...moreTypes: string[]): (source: Observable<T>) => Observable<T> {
          return source => source;
        }

        const actions = of({});
        const that = { actions };

        const Actions = {
          types: {
            GET_SOMETHING: "GET_SOMETHING",
            PUT_SOMETHING: "PUT_SOMETHING",
            GetSomething: GET_SOMETHING,
            PutSomething: PUT_SOMETHING
          }
        };

        const pipedOfTypeCamelCaseGetEffect = actions.pipe(ofType(Actions.types.GetSomething), tap(() => {}), switchMap(() => EMPTY));
        const pipedOfTypeCamelCasePutEffect = actions.pipe(ofType(Actions.types.PutSomething), tap(() => {}), switchMap(() => EMPTY));
                                                                                                              ~~~~~~~~~
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'https://github.com/cartant/rxjs-tslint-rules/issues/50 d',
      messageId,
      annotatedSource: `
        // https://github.com/cartant/rxjs-tslint-rules/issues/50
        import { EMPTY, Observable, of } from "rxjs";
        import { switchMap, tap } from "rxjs/operators";

        function ofType<T>(type: string, ...moreTypes: string[]): (source: Observable<T>) => Observable<T> {
          return source => source;
        }

        const actions = of({});
        const that = { actions };

        const Actions = {
          types: {
            GET_SOMETHING: "GET_SOMETHING",
            PUT_SOMETHING: "PUT_SOMETHING",
            GetSomething: GET_SOMETHING,
            PutSomething: PUT_SOMETHING
          }
        };

        const pipedOfTypeCamelCaseGetEffect = that.actions.pipe(ofType(Actions.types.GetSomething), tap(() => {}), switchMap(() => EMPTY));
        const pipedOfTypeCamelCasePutEffect = that.actions.pipe(ofType(Actions.types.PutSomething), tap(() => {}), switchMap(() => EMPTY));
                                                                                                                   ~~~~~~~~~
      `,
    }),
  ],
});
