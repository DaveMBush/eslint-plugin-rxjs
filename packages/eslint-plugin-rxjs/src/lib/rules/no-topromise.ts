/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../eslint-etc';

import { ESLintUtils } from '@typescript-eslint/utils';

const rule = ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      description: 'Forbids the use of the `toPromise` method.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: 'The toPromise method is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-topromise',
  defaultOptions: [],
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);
    return {
      [`MemberExpression[property.name="toPromise"]`]: (
        node: es.MemberExpression,
      ) => {
        if (couldBeObservable(node.object)) {
          context.report({
            messageId: 'forbidden',
            node: node.property,
          });
        }
      },
    };
  },
});

export { rule as noToPromise };

