import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices, isCallExpression, isIdentifier } from '../eslint-etc';
import ts from 'typescript';
import { defaultObservable } from '../constants';
import { ESLintUtils } from '@typescript-eslint/utils';

function isTypeReference(type: ts.Type): type is ts.TypeReference {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- legacy code
  return Boolean((type as any).target);
}

export const messageId = 'forbidden';

const defaultOptions: readonly {
  observable?: string;
}[] = [];

export default ESLintUtils.RuleCreator(
  () => 'https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/no-cyclic-action.md'
)({
  meta: {
    docs: {
      description: 'Forbids effects and epics that re-emit filtered actions.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]:
        'Effects and epics that re-emit filtered actions are forbidden.',
    },
    schema: [
      {
        properties: {
          observable: { type: 'string' },
        },
        type: 'object',
        description: `An optional object with an optional \`observable\` property. The property can be specified as a regular expression string and is used to identify the action observables from which effects and epics are composed.`,
        additionalProperties: false,
      },
    ],
    type: 'problem',
  },
  name: 'no-cyclic-action',
  defaultOptions,
  create: (context) => {
    const [config = {}] = context.options;
    const { observable = defaultObservable } = config;
    const observableRegExp = new RegExp(observable);

    const { getType, typeChecker } = getTypeServices(context);

    function checkNode(pipeCallExpression: es.CallExpression) {
      const operatorCallExpression = pipeCallExpression.arguments.find(
        (arg) =>
          isCallExpression(arg) &&
          isIdentifier(arg.callee) &&
          arg.callee.name === 'ofType',
      );
      if (!operatorCallExpression) {
        return;
      }
      const operatorType = getType(operatorCallExpression);
      if (!operatorType) {
        return;
      }
      const [signature] = typeChecker.getSignaturesOfType(
        operatorType,
        ts.SignatureKind.Call,
      );
      if (!signature) {
        return;
      }
      const operatorReturnType =
        typeChecker.getReturnTypeOfSignature(signature);
      if (!isTypeReference(operatorReturnType)) {
        return;
      }
      const [operatorElementType] =
        typeChecker.getTypeArguments(operatorReturnType);
      if (!operatorElementType) {
        return;
      }
      const pipeType = getType(pipeCallExpression);
      if (!pipeType || !isTypeReference(pipeType)) {
        return;
      }
      const [pipeElementType] = typeChecker.getTypeArguments(pipeType);
      if (!pipeElementType) {
        return;
      }

      const operatorActionTypes = getActionTypes(operatorElementType);
      const pipeActionTypes = getActionTypes(pipeElementType);
      for (const actionType of operatorActionTypes) {
        if (pipeActionTypes.includes(actionType)) {
          context.report({
            messageId,
            node: pipeCallExpression.callee,
          });
          return;
        }
      }
    }

    function getActionTypes(type: ts.Type): string[] {
      if (type.isUnion()) {
        const memberActionTypes: string[] = [];
        for (const memberType of type.types) {
          memberActionTypes.push(...getActionTypes(memberType));
        }
        return memberActionTypes;
      }
      const symbol = typeChecker.getPropertyOfType(type, 'type');
      if (!symbol || !symbol.valueDeclaration) {
        return [];
      }
      const actionType = typeChecker.getTypeOfSymbolAtLocation(
        symbol,
        symbol.valueDeclaration,
      );
      return [typeChecker.typeToString(actionType)];
    }

    return {
      [`CallExpression[callee.property.name='pipe'][callee.object.name=${observableRegExp}]`]:
        checkNode,
      [`CallExpression[callee.property.name='pipe'][callee.object.property.name=${observableRegExp}]`]:
        checkNode,
    };
  },
});
