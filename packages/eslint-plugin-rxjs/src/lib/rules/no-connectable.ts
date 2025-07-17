import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../eslint-etc';
import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';
export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      url: 'https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-connectable.md',
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
