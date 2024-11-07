/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from '@typescript-eslint/utils';
import { getParent, isArrayExpression, isObjectExpression } from 'eslint-etc';
import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';

const rule = ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      description: 'Forbids explicit generic type arguments.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: 'Explicit generic type arguments are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-explicit-generics',
  defaultOptions: [],
  create: (context) => {
    function report(node: es.Node) {
      context.report({
        messageId: 'forbidden',
        node,
      });
    }

    function checkBehaviorSubjects(node: es.Node) {
      const parent = getParent(node) as es.NewExpression;
      const {
        arguments: [value],
      } = parent;
      if (isArrayExpression(value) || isObjectExpression(value)) {
        return;
      }
      report(node);
    }

    function checkNotifications(node: es.Node) {
      const parent = getParent(node) as es.NewExpression;
      const {
        arguments: [, value],
      } = parent;
      if (isArrayExpression(value) || isObjectExpression(value)) {
        return;
      }
      report(node);
    }

    return {
      "CallExpression[callee.property.name='pipe'] > CallExpression[typeParameters.params.length > 0] > Identifier":
        report,
      "NewExpression[typeParameters.params.length > 0] > Identifier[name='BehaviorSubject']":
        checkBehaviorSubjects,
      'CallExpression[typeParameters.params.length > 0] > Identifier[name=/^(from|of)$/]':
        report,
      "NewExpression[typeParameters.params.length > 0][arguments.0.value='N'] > Identifier[name='Notification']":
        checkNotifications,
    };
  },
});

export = rule;
