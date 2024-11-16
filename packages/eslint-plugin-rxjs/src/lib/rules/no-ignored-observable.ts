/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../eslint-etc';

import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';
export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      description: 'Forbids the ignoring of observables returned by functions.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: 'Ignoring a returned Observable is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-observable',
  defaultOptions: [],
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);

    return {
      'ExpressionStatement > CallExpression': (node: es.CallExpression) => {
        if (couldBeObservable(node)) {
          context.report({
            messageId,
            node,
          });
        }
      },
    };
  },
});
