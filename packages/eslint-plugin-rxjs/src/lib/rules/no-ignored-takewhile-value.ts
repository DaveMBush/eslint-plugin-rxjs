import { TSESTree as es } from '@typescript-eslint/utils';
import {
  isArrayPattern,
  isIdentifier,
  isImport,
  isObjectPattern,
} from '../eslint-etc';

import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';
export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      description: 'Forbids ignoring the value within `takeWhile`.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: 'Ignoring the value within takeWhile is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-takewhile-value',
  defaultOptions: [],
  create: (context) => {
    function checkNode(
      expression: es.ArrowFunctionExpression | es.FunctionExpression,
    ) {
      const scope = context.sourceCode.getScope(expression);
      if (!isImport(scope, 'takeWhile', /^rxjs\/?/)) {
        return;
      }
      let ignored = true;
      const [param] = expression.params;
      if (param) {
        if (isIdentifier(param)) {
          const variable = scope.variables.find(
            ({ name }) => name === param.name,
          );
          if (variable && variable.references.length > 0) {
            ignored = false;
          }
        } else if (isArrayPattern(param)) {
          ignored = false;
        } else if (isObjectPattern(param)) {
          ignored = false;
        }
      }
      if (ignored) {
        context.report({
          messageId,
          node: expression,
        });
      }
    }

    return {
      "CallExpression[callee.name='takeWhile'] > ArrowFunctionExpression": (
        node: es.ArrowFunctionExpression,
      ) => checkNode(node),
      "CallExpression[callee.name='takeWhile'] > FunctionExpression": (
        node: es.FunctionExpression,
      ) => checkNode(node),
    };
  },
});
