import { AST_NODE_TYPES, TSESTree as es } from '@typescript-eslint/utils';

import { ESLintUtils } from '@typescript-eslint/utils';

// Thanks to JaxonWinzierl for helping with the fix for the config
// https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/12/files#diff-8a9cff9aa21d1a4600766e85f1493aa81fa30c4902d6110c21173d00536393ed

export const messageId = 'forbidden';
export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      url: 'https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-ignored-replay-buffer.md',
      description:
        'Forbids using `ReplaySubject`, `publishReplay` or `shareReplay` without specifying the buffer size.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: 'Ignoring the buffer size is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-replay-buffer',
  defaultOptions: [],
  create: (context) => {
    function checkShareReplayConfig(
      node: es.Identifier,
      shareReplayConfigArg: es.ObjectExpression,
    ) {
      if (
        !shareReplayConfigArg.properties.some(
          (p) =>
            p.type === AST_NODE_TYPES.Property &&
            p.key.type === AST_NODE_TYPES.Identifier &&
            p.key.name === 'bufferSize',
        )
      ) {
        context.report({
          messageId: 'forbidden',
          node,
        });
      }
    }

    function checkNode(
      node: es.Identifier,
      { arguments: args }: es.NewExpression | es.CallExpression,
    ) {
      if (!args || args.length === 0) {
        context.report({
          messageId: 'forbidden',
          node,
        });
      }

      if (node.name === 'shareReplay' && args?.length === 1) {
        const arg = args[0];
        if (arg.type === AST_NODE_TYPES.ObjectExpression) {
          checkShareReplayConfig(node, arg);
        }
      }
    }

    return {
      "NewExpression > Identifier[name='ReplaySubject']": (
        node: es.Identifier,
      ) => {
        const newExpression = node.parent as es.NewExpression;
        checkNode(node, newExpression);
      },
      "NewExpression > MemberExpression > Identifier[name='ReplaySubject']": (
        node: es.Identifier,
      ) => {
        const memberExpression = node.parent as es.MemberExpression;
        const newExpression = memberExpression.parent as es.NewExpression;
        checkNode(node, newExpression);
      },
      'CallExpression > Identifier[name=/^(publishReplay|shareReplay)$/]': (
        node: es.Identifier,
      ) => {
        const callExpression = node.parent as es.CallExpression;
        checkNode(node, callExpression);
      },
      'CallExpression > MemberExpression > Identifier[name=/^(publishReplay|shareReplay)$/]':
        (node: es.Identifier) => {
          const memberExpression = node.parent as es.MemberExpression;
          const callExpression = memberExpression.parent as es.CallExpression;
          checkNode(node, callExpression);
        },
    };
  },
});
