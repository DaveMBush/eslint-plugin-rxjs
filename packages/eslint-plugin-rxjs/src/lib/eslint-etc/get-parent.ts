import { TSESTree as es } from '@typescript-eslint/utils';

export function getParent(node: es.Node): es.Node | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (node as any).parent;
}
