/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from '@typescript-eslint/utils';
import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';

const rule = ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      description: 'Enforces the use of a `just` alias for `of`.',
    },
    fixable: 'code',
    hasSuggestions: false,
    messages: {
      forbidden: 'Use just alias.',
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
            messageId: 'forbidden',
            node,
            fix: (fixer) => fixer.replaceTextRange(node.range, 'of as just'),
          });

          const [ofImport] = context.getDeclaredVariables(node);
          ofImport.references.forEach((ref) => {
            context.report({
              messageId: 'forbidden',
              node: ref.identifier,
              fix: (fixer) =>
                fixer.replaceTextRange(ref.identifier.range, 'just'),
            });
          });
        },
    };
  },
});

export = rule;
