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
      description: 'Forbids operators that return connectable observables.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: 'Connectable observables are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-connectable',
  defaultOptions: [],
  create: (context) => {
    const { couldBeFunction } = getTypeServices(context);
    return {
      "CallExpression[callee.name='multicast']": (node: es.CallExpression) => {
        if (node.arguments.length === 1) {
          context.report({
            messageId,
            node: node.callee,
          });
        }
      },
      'CallExpression[callee.name=/^(publish|publishBehavior|publishLast|publishReplay)$/]':
        (node: es.CallExpression) => {
          if (!node.arguments.some((arg) => couldBeFunction(arg))) {
            context.report({
              messageId,
              node: node.callee,
            });
          }
        },
    };
  },
});
