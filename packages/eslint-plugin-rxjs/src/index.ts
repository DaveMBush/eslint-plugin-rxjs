import { Linter } from '@typescript-eslint/utils/ts-eslint';

import banObservables from './lib/rules/ban-observables';
import banOperators from './lib/rules/ban-operators';
import finnish from './lib/rules/finnish';
import just from './lib/rules/just';
import macro from './lib/rules/macro';
import noAsyncSubscribe from './lib/rules/no-async-subscribe';
import noCompat from './lib/rules/no-compat';
import noConnectable from './lib/rules/no-connectable';
import noCreate from './lib/rules/no-create';
import noCyclicAction from './lib/rules/no-cyclic-action';
import noExposedSubjects from './lib/rules/no-exposed-subjects';
import noFinnish from './lib/rules/no-finnish';
import noIgnoredError from './lib/rules/no-ignored-error';
import noIgnoredNotifier from './lib/rules/no-ignored-notifier';
import noIgnoredObservable from './lib/rules/no-ignored-observable';
import noIgnoredReplayBuffer from './lib/rules/no-ignored-replay-buffer';
import noIgnoredSubscribe from './lib/rules/no-ignored-subscribe';
import noIgnoredSubscription from './lib/rules/no-ignored-subscription';
import noIgnoredTakeWhileValue from './lib/rules/no-ignored-takewhile-value';
import noImplicitAnyCatch from './lib/rules/no-implicit-any-catch';
import noIndex from './lib/rules/no-index';
import noInternal from './lib/rules/no-internal';
import noNestedSubscribe from './lib/rules/no-nested-subscribe';
import noRedundantNotify from './lib/rules/no-redundant-notify';
import noShareReplay from './lib/rules/no-sharereplay';
import noSubclass from './lib/rules/no-subclass';
import noSubjectUnsubscribe from './lib/rules/no-subject-unsubscribe';
import noSubjectValue from './lib/rules/no-subject-value';
import noSubscribeHandlers from './lib/rules/no-subscribe-handlers';
import noTap from './lib/rules/no-tap';
import noToPromise from './lib/rules/no-topromise';
import noUnboundMethods from './lib/rules/no-unbound-methods';
import noUnsafeCatch from './lib/rules/no-unsafe-catch';
import noUnsafeFirst from './lib/rules/no-unsafe-first';
import noUnsafeSubjectNext from './lib/rules/no-unsafe-subject-next';
import noUnsafeSwitchMap from './lib/rules/no-unsafe-switchmap';
import noUnsafeTakeUntil from './lib/rules/no-unsafe-takeuntil';
import preferObserver from './lib/rules/prefer-observer';
import suffixSubjects from './lib/rules/suffix-subjects';
import throwError from './lib/rules/throw-error';

const { name, version } = require('../package.json') as { name: string; version: string; }

export const meta = {
  name,
  version,
} satisfies Linter.PluginMeta;

const rules = {
  'ban-observables': banObservables,
  'ban-operators': banOperators,
  'finnish': finnish,
  'just': just,
  'macro': macro,
  'no-async-subscribe': noAsyncSubscribe,
  'no-compat': noCompat,
  'no-connectable': noConnectable,
  'no-create': noCreate,
  'no-cyclic-action': noCyclicAction,
  'no-exposed-subjects': noExposedSubjects,
  'no-finnish': noFinnish,
  'no-ignored-error': noIgnoredError,
  'no-ignored-notifier': noIgnoredNotifier,
  'no-ignored-observable': noIgnoredObservable,
  'no-ignored-replay-buffer': noIgnoredReplayBuffer,
  'no-ignored-subscribe': noIgnoredSubscribe,
  'no-ignored-subscription': noIgnoredSubscription,
  'no-ignored-takewhile-value': noIgnoredTakeWhileValue,
  'no-implicit-any-catch': noImplicitAnyCatch,
  'no-index': noIndex,
  'no-internal': noInternal,
  'no-nested-subscribe': noNestedSubscribe,
  'no-redundant-notify': noRedundantNotify,
  'no-sharereplay': noShareReplay,
  'no-subclass': noSubclass,
  'no-subject-unsubscribe': noSubjectUnsubscribe,
  'no-subject-value': noSubjectValue,
  'no-subscribe-handlers': noSubscribeHandlers,
  'no-tap': noTap,
  'no-to-promise': noToPromise,
  'no-unbound-methods': noUnboundMethods,
  'no-unsafe-catch': noUnsafeCatch,
  'no-unsafe-first': noUnsafeFirst,
  'no-unsafe-subject-next': noUnsafeSubjectNext,
  'no-unsafe-switchmap': noUnsafeSwitchMap,
  'no-unsafe-takeuntil': noUnsafeTakeUntil,
  'prefer-observer': preferObserver,
  'suffix-subjects': suffixSubjects,
  'throw-error': throwError,
} satisfies Linter.PluginRules;

export default { meta, rules } satisfies Linter.Plugin;
