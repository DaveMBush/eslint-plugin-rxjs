/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from '@typescript-eslint/utils';
import { getParent } from '../eslint-etc';

import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';
export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      description:
        'Forbids using `ReplaySubject`, `publishReplay` or `shareReplay` without specifying the buffer size.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: 'Ignoring the buffer size is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-replay-buffer',
  defaultOptions: [],
  create: (context) => {
    function checkNode(
      node: es.Node,
      { arguments: args }: { arguments: es.Node[] },
    ) {
      if (!args || args.length === 0) {
        context.report({
          messageId,
          node,
        });
      }
    }

    return {
      "NewExpression > Identifier[name='ReplaySubject']": (
        node: es.Identifier,
      ) => {
        const newExpression = getParent(node) as es.NewExpression;
        checkNode(node, newExpression);
      },
      "NewExpression > MemberExpression > Identifier[name='ReplaySubject']": (
        node: es.Identifier,
      ) => {
        const memberExpression = getParent(node) as es.MemberExpression;
        const newExpression = getParent(memberExpression) as es.NewExpression;
        checkNode(node, newExpression);
      },
      'CallExpression > Identifier[name=/^(publishReplay|shareReplay)$/]': (
        node: es.Identifier,
      ) => {
        const callExpression = getParent(node) as es.CallExpression;
        checkNode(node, callExpression);
      },
    };
  },
});
