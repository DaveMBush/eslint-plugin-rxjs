import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import rule, { messageId } from '../../rules/throw-error';
import { testCheckConfig } from './type-check';
import { RuleTester } from '@typescript-eslint/rule-tester';
const ruleTester = new RuleTester(testCheckConfig);

ruleTester.run('throw-error', rule, {
  valid: [
    `
      // throw Error
      const a = () => { throw new Error("error"); };
    `,
    `
      // throw DOMException
      const a = () => { throw new DOMException("error"); };
    `,
    `
      // throw any
      const a = () => { throw "error" as any };
    `,
    `
      // throw returned any
      const a = () => { throw errorMessage(); };

      function errorMessage(): any {
        return "error";
      }
    `,
    `
      // throwError Error
      import { throwError } from "rxjs";

      const ob1 = throwError(new Error("Boom!"));
    `,
    `
      // throwError DOMException
      import { throwError } from "rxjs";

      const ob1 = throwError(new DOMException("Boom!"));
    `,
    `
      // throwError any
      import { throwError } from "rxjs";

      const ob1 = throwError("Boom!" as any);
    `,
    `
      // throwError returned any
      import { throwError } from "rxjs";

      const ob1 = throwError(errorMessage());

      function errorMessage(): any {
        return "error";
      }
    `,
    `
      // throwError unknown
      import { throwError } from "rxjs";

      const ob1 = throwError("Boom!" as unknown);
    `,
    `
      // throwError returned unknown
      import { throwError } from "rxjs";

      const ob1 = throwError(errorMessage());

      function errorMessage(): unknown {
        return "error";
      }
    `,
    `
      // throwError Error with factory
      import { throwError } from "rxjs";

      const ob1 = throwError(() => new Error("Boom!"));
    `,
    `
      // throwError DOMException with factory
      import { throwError } from "rxjs";

      const ob1 = throwError(() => new DOMException("Boom!"));
    `,
    `
      // throwError any with factory
      import { throwError } from "rxjs";

      const ob1 = throwError(() => "Boom!" as any);
    `,
    `
      // throwError returned any with factory
      import { throwError } from "rxjs";

      const ob1 = throwError(() => errorMessage());

      function errorMessage(): any {
        return "error";
      }
    `,
    `
      // no signature
      // There will be no signature for callback and
      // that should not effect an internal error.
      declare const callback: Function;
      callback();
    `,
    `
      https://github.com/cartant/rxjs-tslint-rules/issues/85
      try {
        throw new Error("error");
      } catch (error: any) {
        throw error;
      }
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'throw string',
      messageId,
      annotatedSource: `
        const a = () => { throw "error"; };
                                ~~~~~~~ [forbidden]
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'throw returned string',
      messageId,
      annotatedSource: `
        // throw returned string
        const a = () => { throw errorMessage(); };
                                ~~~~~~~~~~~~~~ [forbidden]

        function errorMessage() {
          return "error";
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'throw string variable',
      messageId,
      annotatedSource: `
        // throw string variable
        const errorMessage = "Boom!";

        const a = () => { throw errorMessage; };
                                ~~~~~~~~~~~~ [forbidden]
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'throwError string',
      messageId,
      annotatedSource: `
        // throwError string
        import { throwError } from "rxjs";

        const ob1 = throwError("Boom!");
                               ~~~~~~~ [forbidden]
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'throwError returned string',
      messageId,
      annotatedSource: `
        // throwError returned string
        import { throwError } from "rxjs";

        const ob1 = throwError(errorMessage());
                               ~~~~~~~~~~~~~~ [forbidden]

        function errorMessage() {
          return "Boom!";
        }
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'throw string',
      messageId,
      annotatedSource: `
        https://github.com/cartant/rxjs-tslint-rules/issues/86
        const a = () => { throw "error"; };
                                ~~~~~~~ [forbidden]
        const b = () => { throw new Error("error"); };
        const c = () => {
          throw Object.assign(
            new Error("Not Found"),
            { code: "NOT_FOUND" }
          );
        };
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'throwError string with factory',
      messageId,
      annotatedSource: `
        // throwError string with factory
        import { throwError } from "rxjs";

        const ob1 = throwError(() => "Boom!");
                               ~~~~~~~~~~~~~ [forbidden]
      `,
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'throwError returned string with factory',
      messageId,
      annotatedSource: `
        // throwError returned string with factory
        import { throwError } from "rxjs";

        const ob1 = throwError(() => errorMessage());
                               ~~~~~~~~~~~~~~~~~~~~ [forbidden]

        function errorMessage() {
          return "Boom!";
        }
      `,
    }),
  ],
});
