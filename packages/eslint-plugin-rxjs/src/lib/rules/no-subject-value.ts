import { TSESTree as es } from '@typescript-eslint/utils';
import { getParent, getTypeServices } from '../eslint-etc';

import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';
export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      url: 'https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-subject-value.md',
      description:
        'Forbids accessing the `value` property of a `BehaviorSubject` instance.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]:
        'Accessing the value property of a BehaviorSubject is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-subject-value',
  defaultOptions: [],
  create: (context) => {
    const { couldBeBehaviorSubject } = getTypeServices(context);

    return {
      'Identifier[name=/^(value|getValue)$/]': (node: es.Identifier) => {
        const parent = getParent(node);

        if (!parent || !('object' in parent)) {
          return;
        }

        if (couldBeBehaviorSubject(parent.object)) {
          context.report({
            messageId,
            node,
          });
        }
      },
    };
  },
});
