import { TSESTree as es } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';
export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      description: 'Forbids the importation from index modules.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: 'RxJS imports from index modules are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-index',
  defaultOptions: [],
  create: (context) => {
    return {
      [String.raw`ImportDeclaration Literal[value=/^rxjs(?:\u002f\w+)?\u002findex/]`]:
        (node: es.Literal) => {
          context.report({
            messageId,
            node,
          });
        },
    };
  },
});
