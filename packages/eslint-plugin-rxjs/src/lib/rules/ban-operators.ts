/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { AST_NODE_TYPES, TSESTree as es } from '@typescript-eslint/utils';
import { stripIndent } from 'common-tags';
import { ESLintUtils } from '@typescript-eslint/utils';

const defaultOptions: readonly Record<string, boolean | string>[] = [];

export const messageId = 'forbidden';

export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      description: 'Forbids the use of banned operators.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: 'RxJS operator is banned: {{name}}{{explanation}}.',
    },
    schema: [
      {
        type: 'object',
        description: stripIndent`
          An object containing keys that are names of operators
          and values that are either booleans or strings containing the explanation for the ban.`,
      },
    ],
    type: 'problem',
  },
  name: 'ban-operators',
  defaultOptions,
  create: (context) => {
    const bans: { explanation: string; regExp: RegExp }[] = [];

    const [config] = context.options;
    if (!config) {
      return {};
    }

    Object.entries(config).forEach(([key, value]) => {
      if (value !== false) {
        bans.push({
          explanation: typeof value === 'string' ? value : '',
          regExp: new RegExp(`^${key}$`),
        });
      }
    });

    function getFailure(name: string) {
      for (let b = 0, length = bans.length; b < length; ++b) {
        const ban = bans[b];
        if (ban.regExp.test(name)) {
          const explanation = ban.explanation ? `: ${ban.explanation}` : '';
          return {
            messageId: 'forbidden',
            data: { name, explanation },
          } as const;
        }
      }
      return undefined;
    }

    return {
      [String.raw`ImportDeclaration[source.value=/^rxjs\u002foperators$/] > ImportSpecifier`]:
        (node: es.ImportSpecifier) => {
          const identifier = node.imported;
          if (identifier.type === AST_NODE_TYPES.Identifier) {
            const failure = getFailure(identifier.name);
            if (failure) {
              context.report({
                ...failure,
                node: identifier,
              });
            }
          }
        },
    };
  },
});
