import { TSESTree as es } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';

export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      description: 'Enforces the use of a `just` alias for `of`.',
    },
    fixable: 'code',
    hasSuggestions: false,
    messages: {
      [messageId]: 'Use just alias.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'just',
  defaultOptions: [],
  create: (context) => {
    return {
      "ImportDeclaration[source.value='rxjs'] > ImportSpecifier[imported.name='of']":
        (node: es.ImportSpecifier) => {
          // import declaration has been renamed
          if (
            node.local.range[0] !== node.imported.range[0] &&
            node.local.range[1] !== node.imported.range[1]
          ) {
            return;
          }

          context.report({
            messageId,
            node,
            fix: (fixer) => fixer.replaceTextRange(node.range, 'of as just'),
          });

          const [ofImport] = context.sourceCode.getDeclaredVariables(node);
          ofImport.references.forEach((ref) => {
            context.report({
              messageId,
              node: ref.identifier,
              fix: (fixer) =>
                fixer.replaceTextRange(ref.identifier.range, 'just'),
            });
          });
        },
    };
  },
});
