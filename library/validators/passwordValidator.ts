import { Validator } from "./validator";
import { Result } from "../results/result";
import { FailedResult } from "../results/failedResult";
import { SuccessfulResult } from "../results/successfulResult";

export class PasswordValidator extends Validator {
    public static readonly lessThanMinimumLengthPattern: RegExp = /^.{0,7}$/;;

    public static readonly noNumberPattern: RegExp = /^(?!.*\d).*$/;

    public static readonly noLowercasePattern: RegExp = /^(?!.*[a-z]).*$/;

    public static readonly noUppercasePattern: RegExp = /^(?!.*[A-Z]).*$/;

    public static readonly noSymbolPattern: RegExp = /^(?!.*[!@#$%^&*(),.?":{}|<>]).*$/;

    public static readonly hasWhitespacePattern: RegExp = /.*\s.*/;

    public constructor() {
        super();
    }

    public async validate(value: string): Promise<Result> {
        if (value === undefined || value === null || typeof value !== 'string') {
            return new FailedResult(`Argument(s) must be of type string`);
        }

        if (PasswordValidator.lessThanMinimumLengthPattern.test(value)) {
            return new FailedResult(`Passwords Must Contain At Least 8 Characters`);
        
        } else if (PasswordValidator.noLowercasePattern.test(value)) {
            return new FailedResult(`Passwords Must Contain At Least 1 Lowercase Character`);

        } else if (PasswordValidator.noUppercasePattern.test(value)) {
            return new FailedResult(`Passwords Must Contain At Least 1 Uppercase Character`);
        
        } else if (PasswordValidator.noNumberPattern.test(value)) {
            return new FailedResult(`Passwords Must Contain At Least 1 Number`);

        } else if (PasswordValidator.noSymbolPattern.test(value)) {
            return new FailedResult(`Passwords Must Contain At Least 1 Symbol`);

        } else if (PasswordValidator.hasWhitespacePattern.test(value)) {
            return new FailedResult(`Passwords Must nNot Contain spaces`);
        }

        return new SuccessfulResult();
    }
}
