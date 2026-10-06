/**
 * Shared Zod pieces for the account forms.
 *
 * These screens validate the same three things - an email address, an Egyptian
 * mobile number, and a new password - and they had already drifted apart:
 * signup and reset demanded 8 characters with a number and a symbol, while the
 * profile password change was still on the old flat 6-character rule. Keeping
 * the rule here is what stops that drifting again.
 *
 * Screens own their own object schemas (each has its own fields and copy); only
 * the fields and cross-field rules that genuinely repeat are shared.
 */

import { z } from "zod";

/** The single definition of the password policy. */
export const PASSWORD_POLICY = {
  min: 8,
  /** bcrypt ignores anything past 72 bytes, so silently truncating is worse. */
  max: 72,
  requiresNumber: true,
  requiresSymbol: true,
} as const;

export const PASSWORD_HINT = `Must be at least ${PASSWORD_POLICY.min} characters with numbers and symbols`;

/** The app targets the Egyptian market, so this is the only phone format accepted. */
export const PHONE_REGEX = /^01[0-9]{9}$/;

export const emailField = (message = "Please enter a valid email address") =>
  z.string().trim().min(1, "Email is required").email(message);

export const phoneField = (message = "Please enter a valid Egyptian phone number") =>
  z.string().trim().min(1, "Phone number is required").regex(PHONE_REGEX, message);

/**
 * A new-password field. `label` distinguishes the screens so the messages read
 * "New password must be at least 8 characters" on the profile screen.
 */
export function passwordField(label = "Password") {
  let field = z
    .string()
    .min(1, `${label} is required`)
    .min(PASSWORD_POLICY.min, `${label} must be at least ${PASSWORD_POLICY.min} characters`)
    .max(PASSWORD_POLICY.max, `${label} must be at most ${PASSWORD_POLICY.max} characters`);

  if (PASSWORD_POLICY.requiresNumber) {
    field = field.regex(/\d/, `${label} must include a number`);
  }
  if (PASSWORD_POLICY.requiresSymbol) {
    field = field.regex(/[^\w\s]/, `${label} must include a symbol`);
  }

  return field;
}

/**
 * Builds an object schema and adds the `password === confirmation` cross-field
 * check, so the message and the error path stay consistent across screens.
 *
 * Each screen also requires its confirmation field in its own right, so an empty
 * pair fails on the confirm field rather than silently passing the comparison.
 *
 *     const schema = refinePasswordMatch({ password: passwordField(), rePassword: ... }, "password", "rePassword");
 */
export function refinePasswordMatch<Shape extends z.ZodRawShape, Key extends keyof Shape & string>(
  shape: Shape,
  passwordKey: Key,
  confirmKey: Key,
) {
  return z
    .object(shape)
    .refine((data) => data[passwordKey] === data[confirmKey], {
      message: "Passwords don't match",
      path: [confirmKey],
    });
}
