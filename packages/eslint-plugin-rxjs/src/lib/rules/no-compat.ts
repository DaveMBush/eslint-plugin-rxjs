import { TSESTree as es } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';

export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      url: 'https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-compat.md',
      description:
        'Forbids importation from locations that depend upon `rxjs-compat`.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: "'rxjs-compat'-dependent import locations are forbidden.",
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-compat',
  defaultOptions: [],
  create: (context) => {
    return {
      [String.raw`ImportDeclaration Literal[value=/^rxjs\u002f/]:not(Literal[value=/^rxjs\u002f(ajax|fetch|operators|testing|webSocket)/])`]:
        (node: es.Literal) => {
          context.report({
            messageId,
            node,
          });
        },
    };
  },
});
