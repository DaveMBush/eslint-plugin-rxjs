/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es, AST_NODE_TYPES } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';

export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      description: 'Forbids explicit generic type arguments in certain contexts.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: 'Explicit generic type arguments are forbidden in this context.',
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

    function isAllowedTypeArgument(node: es.TSTypeParameterInstantiation): boolean {
      return node.params.some(param =>
        param.type === AST_NODE_TYPES.TSArrayType ||
        param.type === AST_NODE_TYPES.TSTypeLiteral ||
        isComplexType(param) ||
        isNonInferableType(param) ||
        isExplicitlyDifferentType(param, node)
      );
    }

    function isComplexType(param: es.TypeNode): boolean {
      return param.type === AST_NODE_TYPES.TSUnionType ||
             param.type === AST_NODE_TYPES.TSIntersectionType ||
             (param.type === AST_NODE_TYPES.TSTypeReference && param.typeName.type === AST_NODE_TYPES.TSQualifiedName);
    }

    function isNonInferableType(param: es.TypeNode): boolean {
      // A heuristic to determine if a type is non-inferable
      // This can be expanded based on specific needs
      return param.type === AST_NODE_TYPES.TSTypeReference && param.typeName.type === AST_NODE_TYPES.Identifier;
    }

    function isExplicitlyDifferentType(param: es.TypeNode, node: es.TSTypeParameterInstantiation): boolean {
      if (param.type === AST_NODE_TYPES.TSTypeReference) {
        const typeName = param.typeName;
        if (typeName.type === AST_NODE_TYPES.Identifier) {
          const parent = node.parent as es.NewExpression | es.CallExpression;
          const calleeName = (parent.callee as es.Identifier).name;

          // Allow explicit generics for Notification when the argument types do not match
          if (calleeName === 'Notification') {
            const argumentTypes = parent.arguments.map(arg => {
              if (arg.type === AST_NODE_TYPES.Literal) {
                return typeof (arg as es.Literal).value;
              }
              return arg.type;
            });

            // Check if the argument types do not match the expected 'number' type
            if (argumentTypes.some(type => type !== 'number')) {
              return true;
            }
          }
        }
      }
      return false;
    }

    return {
      'CallExpression > TSTypeParameterInstantiation': (node: es.TSTypeParameterInstantiation) => {
        const parent = node.parent as es.CallExpression;
        const calleeName = (parent.callee as es.Identifier).name;

        if (['scan', 'from', 'of'].includes(calleeName) && !isAllowedTypeArgument(node)) {
          report(node);
        }
      },
      'NewExpression > TSTypeParameterInstantiation': (node: es.TSTypeParameterInstantiation) => {
        const parent = node.parent as es.NewExpression;
        const calleeName = (parent.callee as es.Identifier).name;

        if (['BehaviorSubject', 'Notification'].includes(calleeName) && !isAllowedTypeArgument(node)) {
          report(node);
        }
      },
    };
  },
});
