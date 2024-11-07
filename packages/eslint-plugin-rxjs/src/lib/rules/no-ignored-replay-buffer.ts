/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from '@typescript-eslint/utils';
import { getParent } from 'eslint-etc';
import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';

const rule = ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      description:
        'Forbids using `ReplaySubject`, `publishReplay` or `shareReplay` without specifying the buffer size.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: 'Ignoring the buffer size is forbidden.',
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
          messageId: 'forbidden',
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

export = rule;
