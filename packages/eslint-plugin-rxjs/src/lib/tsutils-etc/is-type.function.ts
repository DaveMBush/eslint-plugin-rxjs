import * as ts from 'typescript';

export function isType(
  type: ts.Type,
  name: string | RegExp,
  qualified?: {
    name: RegExp;
    typeChecker: ts.TypeChecker;
  },
): boolean {
  if (!type.symbol) {
    return false;
  }
  if (
    qualified &&
    !qualified.name.test(
      qualified.typeChecker.getFullyQualifiedName(type.symbol),
    )
  ) {
    return false;
  }
  return typeof name === 'string'
    ? type.symbol.name === name
    : Boolean(type.symbol.name.match(name));
}
