import { TSESTree as es } from '@typescript-eslint/utils';
import { getParent, getTypeServices } from '../eslint-etc';

import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';
export default ESLintUtils.RuleCreator(
  () => 'https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-nested-subscribe.md'
)({
  meta: {
    docs: {
      description:
        'Forbids the calling of `subscribe` within a `subscribe` callback.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: 'Nested subscribe calls are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-nested-subscribe',
  defaultOptions: [],
  create: (context) => {
    const { couldBeObservable, couldBeType } = getTypeServices(context);
    const argumentsMap = new WeakMap<es.Node, void>();
    return {
      [`CallExpression > MemberExpression[property.name='subscribe']`]: (
        node: es.MemberExpression,
      ) => {
        if (
          !couldBeObservable(node.object) &&
          !couldBeType(node.object, 'Subscribable')
        ) {
          return;
        }
        const callExpression = getParent(node) as es.CallExpression;
        let parent = getParent(callExpression);
        while (parent) {
          if (argumentsMap.has(parent)) {
            context.report({
              messageId,
              node: node.property,
            });
            return;
          }
          parent = getParent(parent);
        }
        for (const arg of callExpression.arguments) {
          argumentsMap.set(arg);
        }
      },
    };
  },
});
