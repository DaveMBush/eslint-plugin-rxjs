/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-etc
 */

import {
  ESLintUtils,
  TSESLint,
  TSESTree as es,
} from '@typescript-eslint/utils';
import * as tsutils from 'tsutils-etc';
import ts from 'typescript';
import { isArrowFunctionExpression, isFunctionDeclaration } from './is';

export function getTypeServices<
  TMessageIds extends string,
  TOptions extends unknown[],
>(context: TSESLint.RuleContext<TMessageIds, Readonly<TOptions>>) {
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

    const result = tsutils.couldBeType(
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
        tsutils.couldBeType(
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
      return tsutils.couldBeFunction(type);
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
      return tsutils.isAny(type);
    },
    isReferenceType: (node: es.Node) => {
      const type = getType(node);
      if (!type) {
        return false;
      }
      return tsutils.isReferenceType(type);
    },
    isUnknown: (node: es.Node) => {
      const type = getType(node);
      if (!type) {
        return false;
      }
      return tsutils.isUnknown(type);
    },
    typeChecker,
  };
}
