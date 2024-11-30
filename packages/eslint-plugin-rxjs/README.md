# eslint-plugin-rxjs

![NPM Version](https://img.shields.io/npm/v/%40smarttools%2Feslint-plugin-rxjs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![CI](https://github.com/DaveMBush/eslint-plugin-rxjs/actions/workflows/ci.yml/badge.svg)

An upgrade of [eslint-plugin-rxjs](https://github.com/cartant/eslint-plugin-rxjs) to support modern TypeScript and ESLint. ie, Flat Config as well as legacy config.

Since some rules have better implementations in other more generic ESLint packages, they have been removed and noted here as to the appropriate replacements.

The tests have been upgraded to use standard TypeScript and ESLint test helpers.

All existing unit tests pass.

This plugin now works with both Flat Config and Legacy Config. Pay attention to the example below.

## Install

Install the ESLint TypeScript parser using npm:

``` bash
npm install @typescript-eslint/parser --save-dev
```

Install the package using npm:

``` bash
npm install @smarttools/eslint-plugin-rxjs --save-dev
```

Configure the `parser` and the `parserOptions` for ESLint. Here, I use a `.eslintrc.js` file for the configuration:

### Flat Config

``` js
const rxjs = require('@smarttools/eslint-plugin-rxjs');

module.exports = [{
  files: ['**/*'],
  plugins: {
    rxjs,
  },
},{
  files: ['**/*.ts'],
  // languageOptions here
  rules: {
    'rxjs/no-async-subscribe': 'error',
    ...etc.
  },
}];
```

### Legacy Config

``` js
const { join } = require("path");
module.exports = {
  parser: "@typescript-eslint/parser",
  // parserOptions here
  plugins: ["@smarttools/rxjs"],
  extends: [],
  rules: {
    "@smarttools/rxjs/no-async-subscribe": "error",
    ...etc.
  }
};
```

Or, using the `recommended` configuration:

### Flat Config

``` js
const rxjs = require('@smarttools/eslint-plugin-rxjs');

module.exports = [
  ...rxjs.configs.recommended.rules,
  {
    files: ['**/*.ts'],
    plugins: {
      rxjs,
    },
  },
  // additional rules
];
```

### Legacy Config

``` js
const { join } = require("path");
module.exports = {
  parser: "@typescript-eslint/parser",
  // parserOptions here
  extends: ["plugin:@smarttools/rxjs/recommended-legacy"],
};

```

## Rules

The package includes the following rules.

Rules marked with ✅ are recommended and rules marked with 🔧 have fixers.

| Rule | Description | | |
| --- | --- | --- | --- |
| [`ban-observables`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/ban-observables.md) | Forbids the use of banned observables. | | |
| [`ban-operators`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/ban-operators.md) | Forbids the use of banned operators. | | |
| [`finnish`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/finnish.md) | Enforces the use of Finnish notation. | | |
| [`just`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/just.md) | Enforces the use of a `just` alias for `of`. | | 🔧 |
| [`no-async-subscribe`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-async-subscribe.md) | Forbids passing `async` functions to `subscribe`. | ✅ | |
| [`no-compat`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-compat.md) | Forbids importation from locations that depend upon `rxjs-compat`. | | |
| [`no-connectable`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-connectable.md) | Forbids operators that return connectable observables. | | |
| [`no-create`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-create.md) | Forbids the calling of `Observable.create`. | ✅ | |
| [`no-cyclic-action`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-cyclic-action.md) | Forbids effects and epics that re-emit filtered actions. | | |
| [`no-explicit-generics`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-explicit-generics.md) | Use [@typescript-eslint/no-unnecessary-type-arguments](https://typescript-eslint.io/rules/no-unnecessary-type-arguments/) instead.  | | |
| [`no-exposed-subjects`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-exposed-subjects.md) | Forbids exposed  (i.e. non-private) subjects. | | |
| [`no-finnish`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-finnish.md) | Forbids the use of Finnish notation. | | |
| [`no-ignored-error`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-ignored-error.md) | Forbids the calling of `subscribe` without specifying an error handler. | | |
| [`no-ignored-notifier`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-ignored-notifier.md) | Forbids observables not composed from the `repeatWhen` or `retryWhen` notifier. | ✅ | |
| [`no-ignored-observable`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-ignored-observable.md) | Forbids the ignoring of observables returned by functions. | | |
| [`no-ignored-replay-buffer`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-ignored-replay-buffer.md) | Forbids using `ReplaySubject`, `publishReplay` or `shareReplay` without specifying the buffer size. | ✅ | |
| [`no-ignored-subscribe`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-ignored-subscribe.md) | Forbids the calling of `subscribe` without specifying arguments. | | |
| [`no-ignored-subscription`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-ignored-subscription.md) | Forbids ignoring the subscription returned by `subscribe`. | | |
| [`no-ignored-takewhile-value`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-ignored-takewhile-value.md) | Forbids ignoring the value within `takeWhile`. | ✅ | |
| [`no-implicit-any-catch`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-implicit-any-catch.md) | Like the [`no-implicit-any-catch` rule](https://github.com/typescript-eslint/typescript-eslint/pull/2202) in `@typescript-eslint/eslint-plugin`, but for the `catchError` operator instead of `catch` clauses. | ✅ | 🔧 |
| [`no-index`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-index.md) | Forbids the importation from index modules - for the reason, see [this issue](https://github.com/ReactiveX/rxjs/issues/4230). | ✅ | |
| [`no-internal`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-internal.md) | Forbids the importation of internals. | ✅ | 🔧 |
| [`no-nested-subscribe`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-nested-subscribe.md) | Forbids the calling of `subscribe` within a `subscribe` callback. | ✅ | |
| [`no-redundant-notify`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-redundant-notify.md) | Forbids redundant notifications from completed or errored observables. | ✅ | |
| [`no-sharereplay`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-sharereplay.md) | Forbids using the `shareReplay` operator. | ✅ | |
| [`no-subclass`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-subclass.md) | Forbids subclassing RxJS classes. | | |
| [`no-subject-unsubscribe`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-subject-unsubscribe.md) | Forbids calling the `unsubscribe` method of a subject instance. | ✅ | |
| [`no-subject-value`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-subject-value.md) | Forbids accessing the `value` property of a `BehaviorSubject` instance. | | |
| [`no-subscribe-handlers`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-subscribe-handlers.md) | Forbids the passing of handlers to `subscribe`. | | |
| [`no-topromise`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-topromise.md) | Forbids the use of the `toPromise` method. | | |
| [`no-unbound-methods`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-unbound-methods.md) | Forbids the passing of unbound methods. | ✅ | |
| [`no-unsafe-catch`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-unsafe-catch.md) | Forbids unsafe `catchError` usage in effects and epics. | | |
| [`no-unsafe-first`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-unsafe-first.md) | Forbids unsafe `first`/`take` usage in effects and epics. | | |
| [`no-unsafe-subject-next`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-unsafe-subject-next.md) | Forbids unsafe optional `next` calls. | ✅ | |
| [`no-unsafe-switchmap`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-unsafe-switchmap.md) | Forbids unsafe `switchMap` usage in effects and epics. | | |
| [`no-unsafe-takeuntil`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-unsafe-takeuntil.md) | Forbids the application of operators after `takeUntil`. | ✅ | |
| [`prefer-observer`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/prefer-observer.md) | Forbids the passing separate handlers to `subscribe` and `tap`. | | 🔧 |
| [`suffix-subjects`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/suffix-subjects.md) | Enforces the use of a suffix in subject identifiers. | | |
| [`throw-error`](https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/throw-error.md) | Enforces the passing of `Error` values to error notifications. | | |
