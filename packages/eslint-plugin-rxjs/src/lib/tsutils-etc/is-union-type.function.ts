import * as tsutils from 'ts-api-utils';
import * as ts from 'typescript';

export function isUnionType(type: ts.Type): type is ts.UnionType {
  return tsutils.isTypeFlagSet(type, ts.TypeFlags.Union);
}
