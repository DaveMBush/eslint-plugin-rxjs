import { Linter } from '@typescript-eslint/utils/ts-eslint';

export = {
  plugins: ['@smarttools/rxjs'],
  name: '@smarttools/rxjs/legacy-recommended',
  rules: {
    '@smarttools/rxjs/no-async-subscribe': 'error',
    '@smarttools/rxjs/no-create': 'error',
    '@smarttools/rxjs/no-ignored-notifier': 'error',
    '@smarttools/rxjs/no-ignored-replay-buffer': 'error',
    '@smarttools/rxjs/no-ignored-takewhile-value': 'error',
    '@smarttools/rxjs/no-implicit-any-catch': 'error',
    '@smarttools/rxjs/no-index': 'error',
    '@smarttools/rxjs/no-internal': 'error',
    '@smarttools/rxjs/no-nested-subscribe': 'error',
    '@smarttools/rxjs/no-redundant-notify': 'error',
    '@smarttools/rxjs/no-sharereplay': ['error', { allowConfig: true }],
    '@smarttools/rxjs/no-subject-unsubscribe': 'error',
    '@smarttools/rxjs/no-unbound-methods': 'error',
    '@smarttools/rxjs/no-unsafe-subject-next': 'error',
    '@smarttools/rxjs/no-unsafe-takeuntil': 'error',
  } as Linter.RulesRecord,
};
