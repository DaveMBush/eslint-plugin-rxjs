import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../eslint-etc';

import { ESLintUtils } from '@typescript-eslint/utils';
export const messageId = 'forbidden';
export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      description:
        'Forbids calling the `unsubscribe` method of a subject instance.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: 'Calling unsubscribe on a subject is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-subject-unsubscribe',
  defaultOptions: [],
  create: (context) => {
    const { couldBeSubject, couldBeSubscription } = getTypeServices(context);

    return {
      "MemberExpression[property.name='unsubscribe']": (
        node: es.MemberExpression,
      ) => {
        if (couldBeSubject(node.object)) {
          context.report({
            messageId,
            node: node.property,
          });
        }
      },
      "CallExpression[callee.property.name='add'][arguments.length > 0]": (
        node: es.CallExpression,
      ) => {
        const memberExpression = node.callee as es.MemberExpression;
        if (couldBeSubscription(memberExpression.object)) {
          const [arg] = node.arguments;
          if (couldBeSubject(arg)) {
            context.report({
              messageId,
              node: arg,
            });
          }
        }
      },
    };
  },
});
