import { TSESTree as es } from '@typescript-eslint/utils';
import {
  getParent,
  getTypeServices,
  isCallExpression,
  isMemberExpression,
} from '../eslint-etc';

import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';
export default ESLintUtils.RuleCreator(
  () => 'https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-unbound-methods.md'
)({
  meta: {
    docs: {
      description: 'Forbids the passing of unbound methods.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: 'Unbound methods are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-unbound-methods',
  defaultOptions: [],
  create: (context) => {
    const { couldBeObservable, couldBeSubscription, getType } =
      getTypeServices(context);
    const nodeMap = new WeakMap<es.Node, void>();

    function mapArguments(node: es.CallExpression | es.NewExpression) {
      node.arguments.filter(isMemberExpression).forEach((arg) => {
        const argType = getType(arg);
        if (argType && argType.getCallSignatures().length > 0) {
          nodeMap.set(arg);
        }
      });
    }

    function isObservableOrSubscription(
      node: es.CallExpression,
      action: (node: es.CallExpression) => void,
    ) {
      if (!isMemberExpression(node.callee)) {
        return;
      }

      if (
        couldBeObservable(node.callee.object) ||
        couldBeSubscription(node.callee.object)
      ) {
        action(node);
      }
    }

    return {
      "CallExpression[callee.property.name='pipe']": (
        node: es.CallExpression,
      ) => {
        isObservableOrSubscription(node, ({ arguments: args }) => {
          args.filter(isCallExpression).forEach(mapArguments);
        });
      },
      'CallExpression[callee.property.name=/^(add|subscribe)$/]': (
        node: es.CallExpression,
      ) => {
        isObservableOrSubscription(node, mapArguments);
      },
      "NewExpression[callee.name='Subscription']": mapArguments,
      ThisExpression: (node: es.ThisExpression) => {
        let parent = getParent(node);
        while (parent) {
          if (nodeMap.has(parent)) {
            context.report({
              messageId,
              node: parent,
            });
            return;
          }
          parent = getParent(parent);
        }
      },
    };
  },
});
