import { TSESTree as es } from '@typescript-eslint/utils';
import { getParent, getTypeServices } from '../eslint-etc';

import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';
export default ESLintUtils.RuleCreator(
  () => 'https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-ignored-error.md'
)({
  meta: {
    docs: {
      description:
        'Forbids the calling of `subscribe` without specifying an error handler.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: 'Calling subscribe without an error handler is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-error',
  defaultOptions: [],
  create: (context) => {
    const { couldBeObservable, couldBeFunction } = getTypeServices(context);

    function hasErrorHandler(arg: es.Node): boolean {
      if (arg.type === 'ObjectExpression') {
        return arg.properties.some(
          (prop) =>
            prop.type === 'Property' &&
            'name' in prop.key &&
            prop.key.name === 'error',
        );
      }
      return false;
    }

    return {
      "CallExpression[arguments.length > 0] > MemberExpression > Identifier[name='subscribe']":
        (node: es.Identifier) => {
          const memberExpression = getParent(node) as es.MemberExpression;
          const callExpression = getParent(
            memberExpression,
          ) as es.CallExpression;

          const [firstArg] = callExpression.arguments;

          if (
            couldBeObservable(memberExpression.object) &&
            ((callExpression.arguments.length < 2 &&
              couldBeFunction(firstArg)) ||
              (firstArg.type === 'ObjectExpression' &&
                !hasErrorHandler(firstArg)))
          ) {
            context.report({
              messageId,
              node,
            });
          }
        },
    };
  },
});
