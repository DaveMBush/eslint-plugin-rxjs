import { TSESTree as es } from '@typescript-eslint/utils';
import { getParent, getTypeServices } from '../eslint-etc';

import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';
export default ESLintUtils.RuleCreator(
  () => 'https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-ignored-subscription.md'
)({
  meta: {
    docs: {
      description: 'Forbids ignoring the subscription returned by `subscribe`.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: 'Ignoring returned subscriptions is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-subscription',
  defaultOptions: [],
  create: (context) => {
    const { couldBeObservable, couldBeType } = getTypeServices(context);

    return {
      "ExpressionStatement > CallExpression > MemberExpression[property.name='subscribe']":
        (node: es.MemberExpression) => {
          if (couldBeObservable(node.object)) {
            const callExpression = getParent(node) as es.CallExpression;
            if (
              callExpression.arguments.length === 1 &&
              couldBeType(callExpression.arguments[0], 'Subscriber')
            ) {
              return;
            }
            context.report({
              messageId,
              node: node.property,
            });
          }
        },
    };
  },
});
