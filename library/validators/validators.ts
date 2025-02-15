import { EmailValidator } from "./emailValidator";
import { PasswordValidator } from "./passwordValidator";

export class Validators {
    public static readonly emailValidator: EmailValidator = new EmailValidator();

    public static readonly passwordValidator: PasswordValidator = new PasswordValidator();
}

