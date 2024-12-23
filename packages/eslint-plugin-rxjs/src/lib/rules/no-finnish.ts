import { TSESTree as es } from '@typescript-eslint/utils';
import {
  getLoc,
  getParent,
  getParserServices,
  getTypeServices,
} from '../eslint-etc';

import { ESLintUtils } from '@typescript-eslint/utils';
export const messageId = 'forbidden';
export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      description: 'Forbids the use of Finnish notation.',
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      [messageId]: 'Finnish notation is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-finnish',
  defaultOptions: [],
  create: (context) => {
    const { esTreeNodeToTSNodeMap } = getParserServices(context);
    const { couldBeObservable, couldReturnObservable } =
      getTypeServices(context);

    function checkNode(nameNode: es.Node, typeNode?: es.Node) {
      if (
        couldBeObservable(typeNode || nameNode) ||
        couldReturnObservable(typeNode || nameNode)
      ) {
        const tsNode = esTreeNodeToTSNodeMap.get(nameNode);
        if (/[$]+$/.test(tsNode.getText())) {
          context.report({
            loc: getLoc(tsNode),
            messageId,
          });
        }
      }
    }

    return {
      'ArrayPattern > Identifier[name=/[$]+$/]': (node: es.Identifier) =>
        checkNode(node),
      'ArrowFunctionExpression > Identifier[name=/[$]+$/]': (
        node: es.Identifier,
      ) => {
        const parent = getParent(node) as es.ArrowFunctionExpression;
        if (node !== parent.body) {
          checkNode(node);
        }
      },
      'PropertyDefinition[key.name=/[$]+$/] > Identifier': (
        node: es.Identifier,
      ) => checkNode(node, getParent(node)),
      'FunctionDeclaration > Identifier[name=/[$]+$/]': (
        node: es.Identifier,
      ) => {
        const parent = getParent(node) as es.FunctionDeclaration;
        if (node === parent.id) {
          checkNode(node, parent);
        } else {
          checkNode(node);
        }
      },
      'FunctionExpression > Identifier[name=/[$]+$/]': (
        node: es.Identifier,
      ) => {
        const parent = getParent(node) as es.FunctionExpression;
        if (node === parent.id) {
          checkNode(node, parent);
        } else {
          checkNode(node);
        }
      },
      'MethodDefinition[key.name=/[$]+$/]': (node: es.MethodDefinition) =>
        checkNode(node.key, node),
      'ObjectExpression > Property[computed=false][key.name=/[$]+$/]': (
        node: es.Property,
      ) => checkNode(node.key),
      'ObjectPattern > Property[value.name=/[$]+$/]': (node: es.Property) =>
        checkNode(node.value),
      'TSCallSignatureDeclaration > Identifier[name=/[$]+$/]': (
        node: es.Node,
      ) => checkNode(node),
      'TSConstructSignatureDeclaration > Identifier[name=/[$]+$/]': (
        node: es.Node,
      ) => checkNode(node),
      'TSParameterProperty > Identifier[name=/[$]+$/]': (node: es.Identifier) =>
        checkNode(node),
      'TSPropertySignature > Identifier[name=/[$]+$/]': (node: es.Identifier) =>
        checkNode(node, getParent(node)),
      'TSMethodSignature > Identifier[name=/[$]+$/]': (node: es.Identifier) => {
        const parent = getParent(node) as any;
        if (node === parent.key) {
          checkNode(node, parent);
        } else {
          checkNode(node);
        }
      },
      'VariableDeclarator[id.name=/[$]+$/]': (node: es.VariableDeclarator) =>
        checkNode(node.id, node.init ?? node),
    };
  },
});
