import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../eslint-etc';

import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';
export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      url: 'https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-topromise.md',
      description: 'Forbids the use of the `toPromise` method.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: 'The toPromise method is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-topromise',
  defaultOptions: [],
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);
    return {
      [`MemberExpression[property.name="toPromise"]`]: (
        node: es.MemberExpression,
      ) => {
        if (couldBeObservable(node.object)) {
          context.report({
            messageId,
            node: node.property,
          });
        }
      },
    };
  },
});
