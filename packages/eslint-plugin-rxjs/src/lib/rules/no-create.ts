/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from '@typescript-eslint/utils';
import { getParent, getTypeServices } from '../eslint-etc';
import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';

export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      description: 'Forbids the calling of `Observable.create`.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: 'Observable.create is forbidden; use new Observable.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-create',
  defaultOptions: [],
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);

    return {
      "CallExpression > MemberExpression[object.name='Observable'] > Identifier[name='create']":
        (node: es.Identifier) => {
          const memberExpression = getParent(node) as es.MemberExpression;
          if (couldBeObservable(memberExpression.object)) {
            context.report({
              messageId,
              node,
            });
          }
        },
    };
  },
});
