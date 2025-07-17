import {
  AST_NODE_TYPES,
  TSESLint as eslint,
  TSESTree as es,
} from '@typescript-eslint/utils';
import {
  getTypeServices,
  hasTypeAnnotation,
  isArrowFunctionExpression,
  isFunctionExpression,
  isIdentifier,
  isMemberExpression,
  isObjectExpression,
  isProperty,
} from '../eslint-etc';

import { ESLintUtils } from '@typescript-eslint/utils';

function isParenthesised(
  sourceCode: Readonly<eslint.SourceCode>,
  node: es.Node,
) {
  const before = sourceCode.getTokenBefore(node);
  const after = sourceCode.getTokenAfter(node);
  return (
    before &&
    after &&
    before.value === '(' &&
    before.range[1] <= node.range[0] &&
    after.value === ')' &&
    after.range[0] >= node.range[1]
  );
}

const defaultOptions: readonly {
  allowExplicitAny?: boolean;
}[] = [];

export const explicitAnyId = 'explicitAny';
export const implicitAnyId = 'implicitAny';
export const narrowedId = 'narrowed';
export const suggestExplicitUnknownId = 'suggestExplicitUnknown';
export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      url: 'https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-implicit-any-catch.md',
      description:
        'Forbids implicit `any` error parameters in `catchError` operators.',
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      [explicitAnyId]: 'Explicit `any` in `catchError`.',
      [implicitAnyId]: 'Implicit `any` in `catchError`.',
      [narrowedId]: 'Error type must be `unknown` or `any`.',
      [suggestExplicitUnknownId]:
        'Use `unknown` instead, this will force you to explicitly and safely assert the type is correct.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          allowExplicitAny: {
            type: 'boolean',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
  name: 'no-implicit-any-catch',
  defaultOptions,
  create: (context) => {
    const [config = {}] = context.options;
    const { allowExplicitAny = false } = config;
    const { couldBeObservable } = getTypeServices(context);
    const sourceCode = context.sourceCode;

    function checkCallback(callback: es.Node) {
      if (
        isArrowFunctionExpression(callback) ||
        isFunctionExpression(callback)
      ) {
        const [param, secondParam] = callback.params;
        if (!param) {
          return;
        }
        if (hasTypeAnnotation(param)) {
          const { typeAnnotation } = param;
          const {
            typeAnnotation: { type },
          } = typeAnnotation;
          if (type === AST_NODE_TYPES.TSAnyKeyword) {
            if (allowExplicitAny) {
              return;
            }
            function fix(fixer: eslint.RuleFixer) {
              return fixer.replaceText(typeAnnotation, ': unknown');
            }
            context.report({
              fix,
              messageId: explicitAnyId,
              node: param,
              suggest: [
                {
                  messageId: suggestExplicitUnknownId,
                  fix,
                },
              ],
            });
          } else if (type !== AST_NODE_TYPES.TSUnknownKeyword) {
            function fix(fixer: eslint.RuleFixer) {
              return fixer.replaceText(typeAnnotation, ': unknown');
            }
            context.report({
              messageId: narrowedId,
              node: param,
              suggest: [
                {
                  messageId: suggestExplicitUnknownId,
                  fix,
                },
              ],
            });
          }
        } else {
          function fix(fixer: eslint.RuleFixer) {
            if (secondParam) {
              if (isParenthesised(sourceCode, param)) {
                return fixer.insertTextAfter(param, ': unknown');
              }
              const tokenBefore = sourceCode.getTokenBefore(param);
              const tokenAfter = sourceCode.getTokenAfter(secondParam);
              if (
                tokenBefore &&
                tokenBefore.value === '(' &&
                tokenAfter &&
                tokenAfter.value === ')'
              ) {
                const paramsText = `${sourceCode.getText(param)}: unknown, ${sourceCode.getText(secondParam)}`;
                return fixer.replaceTextRange(
                  [tokenBefore.range[0], tokenAfter.range[1]],
                  `(${paramsText})`,
                );
              } else {
                const paramsText = `${sourceCode.getText(param)}: unknown, ${sourceCode.getText(secondParam)}`;
                return fixer.replaceTextRange(
                  [param.range[0], secondParam.range[1]],
                  `(${paramsText})`,
                );
              }
            } else {
              if (isParenthesised(sourceCode, param)) {
                return fixer.insertTextAfter(param, ': unknown');
              }
              return [
                fixer.insertTextBefore(param, '('),
                fixer.insertTextAfter(param, ': unknown)'),
              ];
            }
          }
          context.report({
            fix,
            messageId: implicitAnyId,
            node: param,
            ...(secondParam && callback.params.length === 2
              ? {} // No suggestions for two-parameter case (arrow or function)
              : {
                  suggest: [
                    {
                      messageId: suggestExplicitUnknownId,
                      fix,
                    },
                  ],
                }),
          });
        }
      }
    }

    return {
      "CallExpression[callee.name='catchError']": (node: es.CallExpression) => {
        const [callback] = node.arguments;
        if (!callback) {
          return;
        }
        checkCallback(callback);
      },
      "CallExpression[callee.property.name='subscribe'],CallExpression[callee.name='tap']":
        (node: es.CallExpression) => {
          const { callee } = node;
          if (isMemberExpression(callee) && !couldBeObservable(callee.object)) {
            return;
          }
          const [observer, callback] = node.arguments;
          if (callback) {
            checkCallback(callback);
          } else if (observer && isObjectExpression(observer)) {
            const errorProperty = observer.properties.find(
              (property) =>
                isProperty(property) &&
                isIdentifier(property.key) &&
                property.key.name === 'error',
            ) as es.Property;
            if (errorProperty) {
              checkCallback(errorProperty.value);
            }
          }
        },
    };
  },
});
