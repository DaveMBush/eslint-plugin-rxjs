import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../eslint-etc';

import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';
export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      url: 'https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-ignored-subscribe.md',
      description:
        'Forbids the calling of `subscribe` without specifying arguments.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: 'Calling subscribe without arguments is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-subscribe',
  defaultOptions: [],
  create: (context) => {
    const { couldBeObservable, couldBeType } = getTypeServices(context);

    return {
      "CallExpression[arguments.length = 0][callee.property.name='subscribe']":
        (node: es.CallExpression) => {
          const callee = node.callee as es.MemberExpression;
          if (
            couldBeObservable(callee.object) ||
            couldBeType(callee.object, 'Subscribable')
          ) {
            context.report({
              messageId,
              node: callee.property,
            });
          }
        },
    };
  },
});
