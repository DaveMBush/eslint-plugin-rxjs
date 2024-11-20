import { TSESTree as es, TSESLint as eslint } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

export const forbiddenId = 'forbidden';
export const suggestId = 'suggest';

export default ESLintUtils.RuleCreator(() => __filename)({
  meta: {
    docs: {
      description: 'Forbids the importation of internals.',
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      [forbiddenId]: 'RxJS imports from internal are forbidden.',
      [suggestId]: 'Import from a non-internal location.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-internal',
  defaultOptions: [],
  create: (context) => {
    function getReplacement(location: string) {
      const match = location.match(/^\s*('|")/);
      if (!match) {
        return undefined;
      }
      const [, quote] = match;
      if (/^['"]rxjs\/internal\/ajax/.test(location)) {
        return `${quote}rxjs/ajax${quote}`;
      }
      if (/^['"]rxjs\/internal\/observable\/dom\/fetch/.test(location)) {
        return `${quote}rxjs/fetch${quote}`;
      }
      if (/^['"]rxjs\/internal\/observable\/dom\/webSocket/i.test(location)) {
        return `${quote}rxjs/webSocket${quote}`;
      }
      if (/^['"]rxjs\/internal\/observable/.test(location)) {
        return `${quote}rxjs${quote}`;
      }
      if (/^['"]rxjs\/internal\/operators/.test(location)) {
        return `${quote}rxjs/operators${quote}`;
      }
      if (/^['"]rxjs\/internal\/scheduled/.test(location)) {
        return `${quote}rxjs${quote}`;
      }
      if (/^['"]rxjs\/internal\/scheduler/.test(location)) {
        return `${quote}rxjs${quote}`;
      }
      if (/^['"]rxjs\/internal\/testing/.test(location)) {
        return `${quote}rxjs/testing${quote}`;
      }
      return undefined;
    }

    return {
      [String.raw`ImportDeclaration Literal[value=/^rxjs\u002finternal/]`]: (
        node: es.Literal,
      ) => {
        const replacement = getReplacement(node.raw);
        if (replacement) {
          function fix(fixer: eslint.RuleFixer) {
            return fixer.replaceText(node, replacement as string);
          }
          context.report({
            fix,
            messageId: forbiddenId,
            node,
            suggest: [{ fix, messageId: suggestId }],
          });
        } else {
          context.report({
            messageId: forbiddenId,
            node,
          });
        }
      },
    };
  },
});
