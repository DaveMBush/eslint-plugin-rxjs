/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from '@typescript-eslint/utils';
import { getParent, getTypeServices } from 'eslint-etc';
import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';

const rule = ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      description:
        'Forbids accessing the `value` property of a `BehaviorSubject` instance.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden:
        'Accessing the value property of a BehaviorSubject is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-subject-value',
  defaultOptions: [],
  create: (context) => {
    const { couldBeBehaviorSubject } = getTypeServices(context);

    return {
      'Identifier[name=/^(value|getValue)$/]': (node: es.Identifier) => {
        const parent = getParent(node);

        if (!parent || !('object' in parent)) {
          return;
        }

        if (couldBeBehaviorSubject(parent.object)) {
          context.report({
            messageId: 'forbidden',
            node,
          });
        }
      },
    };
  },
});

export = rule;
