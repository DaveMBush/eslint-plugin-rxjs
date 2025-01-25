import * as tsutils from 'tsutils';
import * as ts from 'typescript';

export function isAny(type: ts.Type): boolean {
  return tsutils.isTypeFlagSet(type, ts.TypeFlags.Any);
}
