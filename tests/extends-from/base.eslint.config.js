module.exports = {
  extends: ['plugin:@smarttools/rxjs/recommended'],
  rules: {
    '@smarttools/rxjs/finnish': [
      'warn',
      {
        functions: false,
        methods: false,
        names: {
          '^(canActivate|canActivateChild|canDeactivate|canLoad|intercept|resolve|validate|store|_store)$':
            false,
        },
        parameters: false,
        properties: false,
        strict: false,
        types: {
          '^EventEmitter$': false,
        },
        variables: true,
      },
    ],
    '@smarttools/rxjs/suffix-subjects': [
      'warn',
      {
        parameters: false,
        properties: false,
        suffix: '$$',
        variables: true,
      },
    ],
    '@smarttools/rxjs/no-nested-subscribe': ['warn'],
    '@smarttools/rxjs/no-implicit-any-catch': ['off'],
    '@smarttools/rxjs/no-unsafe-takeuntil': [
      'warn',
      {
        alias: ['untilDestroyed'],
      },
    ],
    '@smarttools/rxjs/no-async-subscribe': 'warn',
  },
};
