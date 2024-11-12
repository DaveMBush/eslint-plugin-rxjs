/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from '@typescript-eslint/utils';
import { getParent, getTypeServices } from '../eslint-etc';
import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';

export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      description: 'Forbids passing `async` functions to `subscribe`.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: 'Passing async functions to subscribe is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-async-subscribe',
  defaultOptions: [],
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);

    function checkNode(
      node: es.FunctionExpression | es.ArrowFunctionExpression,
    ) {
      const parentNode = getParent(node) as es.CallExpression;
      const callee = parentNode.callee as es.MemberExpression;

      if (couldBeObservable(callee.object)) {
        const { loc } = node;
        // only report the `async` keyword
        const asyncLoc = {
          ...loc,
          end: {
            ...loc.start,
            column: loc.start.column + 5,
          },
        };

        context.report({
          messageId,
          loc: asyncLoc,
        });
      }
    }
    return {
      "CallExpression[callee.property.name='subscribe'] > FunctionExpression[async=true]":
        checkNode,
      "CallExpression[callee.property.name='subscribe'] > ArrowFunctionExpression[async=true]":
        checkNode,
    };
  },
});
