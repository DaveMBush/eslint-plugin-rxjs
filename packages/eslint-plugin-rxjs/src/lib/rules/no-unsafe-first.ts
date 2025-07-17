import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices, isCallExpression, isIdentifier } from '../eslint-etc';

import { defaultObservable } from '../constants';
import { ESLintUtils } from '@typescript-eslint/utils';

const defaultOptions: readonly {
  observable?: string;
}[] = [];

export const messageId = 'forbidden';
export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      url: 'https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-unsafe-first.md',
      description: 'Forbids unsafe `first`/`take` usage in effects and epics.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]:
        'Unsafe first and take usage in effects and epics are forbidden.',
    },
    schema: [
      {
        properties: {
          observable: { type: 'string' },
        },
        type: 'object',
        description: `An optional object with an optional \`observable\` property. The property can be specified as a regular expression string and is used to identify the action observables from which effects and epics are composed.`,
      },
    ],
    type: 'problem',
  },
  name: 'no-unsafe-first',
  defaultOptions,
  create: (context) => {
    const invalidOperatorsRegExp = /^(take|first)$/;

    const [config = {}] = context.options;
    const { observable = defaultObservable } = config;
    const observableRegExp = new RegExp(observable);

    const { couldBeObservable } = getTypeServices(context);
    const nodes: es.CallExpression[] = [];

    function checkNode(node: es.CallExpression) {
      if (!node.arguments || !couldBeObservable(node)) {
        return;
      }

      node.arguments.forEach((arg) => {
        if (isCallExpression(arg) && isIdentifier(arg.callee)) {
          if (invalidOperatorsRegExp.test(arg.callee.name)) {
            context.report({
              messageId,
              node: arg.callee,
            });
          }
        }
      });
    }

    return {
      [`CallExpression[callee.property.name='pipe'][callee.object.name=${observableRegExp}]`]:
        (node: es.CallExpression) => {
          if (nodes.push(node) === 1) {
            checkNode(node);
          }
        },
      [`CallExpression[callee.property.name='pipe'][callee.object.name=${observableRegExp}]:exit`]:
        () => {
          nodes.pop();
        },
      [`CallExpression[callee.property.name='pipe'][callee.object.property.name=${observableRegExp}]`]:
        (node: es.CallExpression) => {
          if (nodes.push(node) === 1) {
            checkNode(node);
          }
        },
      [`CallExpression[callee.property.name='pipe'][callee.object.property.name=${observableRegExp}]:exit`]:
        () => {
          nodes.pop();
        },
    };
  },
});
