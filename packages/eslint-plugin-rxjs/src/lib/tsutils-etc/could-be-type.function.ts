import * as ts from 'typescript';
import { couldImplement } from './could-implement.function';
import { isIntersectionType } from './is-intersection-type.function';
import { isReferenceType } from './is-reference-type.function';
import { isType } from './is-type.function';
import { isUnionType } from './is-union-type.function';

export function couldBeType(
  type: ts.Type,
  name: string | RegExp,
  qualified?: {
    name: RegExp;
    typeChecker: ts.TypeChecker;
  },
): boolean {
  if (isReferenceType(type)) {
    type = type.target;
  }

  if (isType(type, name, qualified)) {
    return true;
  }

  if (isIntersectionType(type) || isUnionType(type)) {
    return type.types.some((t) => couldBeType(t, name, qualified));
  }

  const baseTypes = type.getBaseTypes();
  if (baseTypes && baseTypes.some((t) => couldBeType(t, name, qualified))) {
    return true;
  }

  if (couldImplement(type, name, qualified)) {
    return true;
  }
  return false;
}
