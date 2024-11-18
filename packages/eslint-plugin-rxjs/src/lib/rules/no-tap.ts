/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';
export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    deprecated: true,
    docs: {
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
