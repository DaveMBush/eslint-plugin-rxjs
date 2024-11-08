/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-etc
 */

import { TSESTree as es } from '@typescript-eslint/utils';

export function getParent(node: es.Node): es.Node | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (node as any).parent;
}
