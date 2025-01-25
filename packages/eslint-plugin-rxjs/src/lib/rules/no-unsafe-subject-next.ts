import { TSESTree as es } from '@typescript-eslint/utils';
import {
  getParserServices,
  getTypeServices,
  isMemberExpression,
} from '../eslint-etc';

import * as tsutils from 'ts-api-utils';
import { couldBeType, isReferenceType, isUnionType } from '../tsutils-etc';
import * as ts from 'typescript';
import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'forbidden';
export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      description: 'Forbids unsafe optional `next` calls.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: 'Unsafe optional next calls are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-unsafe-subject-next',
  defaultOptions: [],
  create: (context) => {
    const { esTreeNodeToTSNodeMap } = getParserServices(context);
    const { typeChecker } = getTypeServices(context);
    return {
      [`CallExpression[callee.property.name='next']`]: (
        node: es.CallExpression,
      ) => {
        if (node.arguments.length === 0 && isMemberExpression(node.callee)) {
          const type = typeChecker.getTypeAtLocation(
            esTreeNodeToTSNodeMap.get(node.callee.object),
          );
          if (isReferenceType(type) && couldBeType(type, 'Subject')) {
            const [typeArg] = typeChecker.getTypeArguments(type);
            if (tsutils.isTypeFlagSet(typeArg, ts.TypeFlags.Any)) {
              return;
            }
            if (tsutils.isTypeFlagSet(typeArg, ts.TypeFlags.Unknown)) {
              return;
            }
            if (tsutils.isTypeFlagSet(typeArg, ts.TypeFlags.Void)) {
              return;
            }
            if (
              isUnionType(typeArg) &&
              typeArg.types.some((t) =>
                tsutils.isTypeFlagSet(t, ts.TypeFlags.Void),
              )
            ) {
              return;
            }
            context.report({
              messageId: 'forbidden',
              node: node.callee.property,
            });
          }
        }
      },
    };
  },
});
