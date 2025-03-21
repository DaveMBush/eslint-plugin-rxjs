import * as ts from 'typescript';
import { couldBeType } from './could-be-type.function';

export function couldBeFunction(type: ts.Type): boolean {
  return (
    type.getCallSignatures().length > 0 ||
    couldBeType(type, 'Function') ||
    couldBeType(type, 'ArrowFunction') ||
    couldBeType(type, ts.InternalSymbolName.Function)
  );
}
