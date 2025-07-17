import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../eslint-etc';

import { ESLintUtils } from '@typescript-eslint/utils';
export const messageId = 'forbidden';

export default ESLintUtils.RuleCreator(
  () => 'https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-subclass.md'
)({
  meta: {
    docs: {
      description: 'Forbids sub-classing RxJS classes.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: 'Sub-classing RxJS classes is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-subclass',
  defaultOptions: [],
  create: (context) => {
    const { couldBeType } = getTypeServices(context);

    const queryNames = [
      'AsyncSubject',
      'BehaviorSubject',
      'Observable',
      'ReplaySubject',
      'Scheduler',
      'Subject',
      'Subscriber',
    ];

    return {
      [`ClassDeclaration[superClass.name=/^(${queryNames.join(
        '|',
      )})$/] > Identifier.superClass`]: (node: es.Identifier) => {
        if (
          queryNames.some((name) =>
            couldBeType(node, name, { name: /[/\\]rxjs[/\\]/ }),
          )
        ) {
          context.report({
            messageId: 'forbidden',
            node,
          });
        }
      },
    };
  },
});
