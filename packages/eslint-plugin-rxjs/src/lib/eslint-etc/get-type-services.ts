import {
  ESLintUtils,
  TSESLint,
  TSESTree as es,
} from '@typescript-eslint/utils';
import * as tsutilsEtc from '../tsutils-etc';
import ts from 'typescript';
import { isArrowFunctionExpression, isFunctionDeclaration } from './is';

interface TypeServices {
  couldBeBehaviorSubject: (node: es.Node) => boolean;
  couldBeError: (node: es.Node) => boolean;
  couldBeFunction: (node: es.Node) => boolean;
  couldBeMonoTypeOperatorFunction: (node: es.Node) => boolean;
  couldBeObservable: (node: es.Node) => boolean;
  couldBeSubject: (node: es.Node) => boolean;
  couldBeSubscription: (node: es.Node) => boolean;
  couldBeType: (
    node: es.Node,
    name: string | RegExp,
    qualified?: { name: RegExp },
  ) => boolean;
  couldReturnObservable: (node: es.Node) => boolean;
  couldReturnType: (
    node: es.Node,
    name: string | RegExp,
    qualified?: { name: RegExp },
  ) => boolean;
  getType: (node: es.Node) => ts.Type | undefined;
  isAny: (node: es.Node) => boolean;
  isReferenceType: (node: es.Node) => boolean;
  isUnknown: (node: es.Node) => boolean;
  typeChecker: ts.TypeChecker;
}

export function getTypeServices<
  TMessageIds extends string,
  TOptions extends unknown[],
>(
  context: TSESLint.RuleContext<TMessageIds, Readonly<TOptions>>,
): TypeServices {
  const services = ESLintUtils.getParserServices(context);
  const { esTreeNodeToTSNodeMap, program } = services;
  const typeChecker = program.getTypeChecker();

  const getType = (node: es.Node) => {
    const tsNode = esTreeNodeToTSNodeMap.get(node);
    if (!tsNode) {
      return undefined;
    }

    const type = typeChecker.getTypeAtLocation(tsNode);
    if (!type) {
      return undefined;
    }
    return type;
  };

  const couldBeType = (
    node: es.Node,
    name: string | RegExp,
    qualified?: { name: RegExp },
  ) => {
    const type = getType(node);
    if (!type) {
      return false;
    }

    const result = tsutilsEtc.couldBeType(
      type,
      name,
      qualified ? { ...qualified, typeChecker } : undefined,
    );
    return result;
  };

  const couldReturnType = (
    node: es.Node,
    name: string | RegExp,
    qualified?: { name: RegExp },
  ) => {
    let tsTypeNode: ts.Node | undefined;
    const tsNode = esTreeNodeToTSNodeMap.get(node);
    if (
      ts.isArrowFunction(tsNode) ||
      ts.isFunctionDeclaration(tsNode) ||
      ts.isMethodDeclaration(tsNode) ||
      ts.isFunctionExpression(tsNode)
    ) {
      tsTypeNode = tsNode.type ?? tsNode.body;
    } else if (
      ts.isCallSignatureDeclaration(tsNode) ||
      ts.isMethodSignature(tsNode)
    ) {
      tsTypeNode = tsNode.type;
    }
    const result = Boolean(
      tsTypeNode &&
        tsutilsEtc.couldBeType(
          typeChecker.getTypeAtLocation(tsTypeNode),
          name,
          qualified ? { ...qualified, typeChecker } : undefined,
        ),
    );
    return result;
  };

  return {
    couldBeBehaviorSubject: (node: es.Node) =>
      couldBeType(node, 'BehaviorSubject'),
    couldBeError: (node: es.Node) => couldBeType(node, 'Error'),
    couldBeFunction: (node: es.Node) => {
      if (isArrowFunctionExpression(node) || isFunctionDeclaration(node)) {
        return true;
      }
      const type = getType(node);
      if (!type) {
        return false;
      }
      return tsutilsEtc.couldBeFunction(type);
    },
    couldBeMonoTypeOperatorFunction: (node: es.Node) =>
      couldBeType(node, 'MonoTypeOperatorFunction'),
    couldBeObservable: (node: es.Node) => couldBeType(node, 'Observable'),
    couldBeSubject: (node: es.Node) => couldBeType(node, 'Subject'),
    couldBeSubscription: (node: es.Node) => couldBeType(node, 'Subscription'),
    couldBeType,
    couldReturnObservable: (node: es.Node) =>
      couldReturnType(node, 'Observable'),
    couldReturnType,
    getType,
    isAny: (node: es.Node) => {
      const type = getType(node);
      if (!type) {
        return false;
      }
      return tsutilsEtc.isAny(type);
    },
    isReferenceType: (node: es.Node) => {
      const type = getType(node);
      if (!type) {
        return false;
      }
      return tsutilsEtc.isReferenceType(type);
    },
    isUnknown: (node: es.Node) => {
      const type = getType(node);
      if (!type) {
        return false;
      }
      return tsutilsEtc.isUnknown(type);
    },
    typeChecker,
  };
}
