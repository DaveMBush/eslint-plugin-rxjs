import { TSESTree as es } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

const defaultOptions: readonly {
  allowConfig?: boolean;
}[] = [];

export const forbiddenId = 'forbidden';
export const forbiddenWithoutConfigId = 'forbiddenWithoutConfig';

export default ESLintUtils.RuleCreator(
  () => 'https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-sharereplay.md'
)({
  meta: {
    docs: {
      description: 'Forbids using the `shareReplay` operator.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: 'shareReplay is forbidden.',
      forbiddenWithoutConfig:
        'shareReplay is forbidden unless a config argument is passed.',
    },
    schema: [
      {
        properties: {
          allowConfig: { type: 'boolean' },
        },
        type: 'object',
        additionalProperties: false,
      },
    ],
    type: 'problem',
  },
  name: 'no-sharereplay',
  defaultOptions,
  create: (context) => {
    const [config = {}] = context.options;
    const { allowConfig = true } = config;
    return {
      "CallExpression[callee.name='shareReplay']": (
        node: es.CallExpression,
      ) => {
        let report = true;
        if (allowConfig) {
          report =
            node.arguments.length !== 1 ||
            node.arguments[0].type !== 'ObjectExpression';
        }
        if (report) {
          context.report({
            messageId: allowConfig ? 'forbiddenWithoutConfig' : 'forbidden',
            node: node.callee,
          });
        }
      },
    };
  },
});
