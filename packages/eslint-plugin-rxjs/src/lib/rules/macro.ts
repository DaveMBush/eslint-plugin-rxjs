import { TSESLint as eslint, TSESTree as es } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

export const messageId = 'macro';
export default ESLintUtils.RuleCreator(
  () => 'https://github.com/DaveMBush/eslint-plugin-rxjs/blob/main/packages/eslint-plugin-rxjs/docs/rules/macro.md'
)({
  meta: {
    docs: {
      description: 'Enforces the use of the RxJS Tools Babel macro.',
    },
    fixable: 'code',
    hasSuggestions: false,
    messages: {
      [messageId]: 'Use the RxJS Tools Babel macro.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'macro',
  defaultOptions: [],
  create: (context) => {
    let hasFailure = false;
    let hasMacroImport = false;
    let program: es.Program | undefined = undefined;

    function fix(fixer: eslint.RuleFixer) {
      return fixer.insertTextBefore(
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        program!,
        `import "babel-plugin-rxjs-tools/macro";\n`,
      );
    }

    return {
      'CallExpression[callee.property.name=/^(pipe|subscribe)$/]': (
        node: es.CallExpression,
      ) => {
        if (hasFailure || hasMacroImport) {
          return;
        }
        hasFailure = true;
        context.report({
          fix,
          messageId,
          node: node.callee,
        });
      },
      "ImportDeclaration[source.value='babel-plugin-rxjs-tools/macro']": (
        node: es.ImportDeclaration,
      ) => {
        hasMacroImport = true;
      },
      [String.raw`ImportDeclaration[source.value=/^rxjs(\u002f|$)/]`]: (
        node: es.ImportDeclaration,
      ) => {
        if (hasFailure || hasMacroImport) {
          return;
        }
        hasFailure = true;
        context.report({
          fix,
          messageId: 'macro',
          node,
        });
      },
      Program: (node: es.Program) => {
        program = node;
      },
    };
  },
});
