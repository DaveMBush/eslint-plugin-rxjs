import { TSESTree as es } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';
export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    deprecated: true,
    docs: {
      url: 'https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-tap.md',
      description: 'Forbids the use of the `tap` operator.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: 'The tap operator is forbidden.',
    },
    replacedBy: ['ban-operators'],
    schema: [],
    type: 'problem',
  },
  name: 'no-tap',
  defaultOptions: [],
  create: (context) => {
    return {
      [String.raw`ImportDeclaration[source.value=/^rxjs(\u002foperators)?$/] > ImportSpecifier[imported.name='tap']`]:
        (node: es.ImportSpecifier) => {
          const { loc } = node;
          context.report({
            messageId,
            loc: {
              ...loc,
              end: {
                ...loc.start,
                column: loc.start.column + 3,
              },
            },
          });
        },
    };
  },
});
