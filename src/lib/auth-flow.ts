/**
 * Shared config for the five auth screens.
 *
 * All values are lifted from Figma file 7GOjynvDWj2Lnbb4IKjbXK. Node ids are
 * noted per section so the source of truth stays traceable.
 *
 *   Login             24:6713
 *   Sign up           24:4988
 *   Forgot Password   54:20254
 *   Reset Verify Code 54:22665
 *   Reset Password    54:23995
 *
 * The designs carry no email field on the verify or reset steps - the verify
 * subtitle reads "Enter the 6-digit code sent to <address>" (54:22750), which
 * only works if the address is carried through the flow. So the email is kept in
 * sessionStorage rather than re-asked for.
 */

/** The three steps of the password-reset flow, per the card stepper at 54:20340. */
export const RESET_STEPS = [
  { id: "email", label: "Email Verification" },
  { id: "verify", label: "Secure Reset" },
  { id: "reset", label: "Encrypted" },
] as const;

export type ResetStepId = (typeof RESET_STEPS)[number]["id"];

const RESET_EMAIL_KEY = "freshcart.resetEmail";

export function readResetEmail(): string {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(RESET_EMAIL_KEY) ?? "";
}

export function writeResetEmail(email: string): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(RESET_EMAIL_KEY, email);
}

export function clearResetEmail(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(RESET_EMAIL_KEY);
}

/**
 * Design geometry, kept here so all five screens stay on one grid.
 *
 * The Figma auth grid (24:6754) is 1280px wide with a 48px gutter, giving two
 * 616px columns; the card's own padding is 48px (54:20330) leaving 520px of
 * content. The aside panel is a fixed 384px tall (24:6756, 54:20288).
 */
export const AUTH_LAYOUT = {
  /** 1280px = 2 x 616px + 48px gutter */
  grid: "mx-auto grid w-full max-w-[1280px] items-center gap-12 lg:grid-cols-2",
  aside: "hidden lg:flex lg:flex-col lg:text-center",
  panel: "w-full text-center",
  /** 384px in the design; the login art is 616x384, so lock the ratio too. */
  panelHeight: "h-96",
  card: "flex flex-col gap-8 rounded-2xl bg-white p-6 shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.1),0px_20px_25px_-5px_rgba(0,0,0,0.1)] sm:p-8 lg:p-12",
} as const;

/** Input and button sizing, from `input#email` (54:20360) and `button.w-full` (54:20364). */
export const AUTH_CONTROL = {
  /** 13px top + 14px bottom padding around a 16px line lands at 52px. */
  height: "h-[52px]",
  // The design draws a 2px `#E5E7EB` field border, but that is 1.24:1 on white
  // and the field outline effectively vanishes. `border-input` resolves to the
  // accessible grey (3.63:1) defined in index.css; the 2px weight and 12px
  // radius still match the design.
  input:
    "h-[52px] rounded-xl border-2 border-input bg-white pl-12 pr-4 text-base font-normal text-ink placeholder:text-ink/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25",
  /** `padding: 13px 16px 14px 48px` - the 48px clears a leading icon. */
  inputWithAction:
    "h-[52px] rounded-xl border-2 border-input bg-white pl-12 pr-12 text-base font-normal text-ink placeholder:text-ink/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25",
  submit:
    "h-[52px] w-full rounded-xl bg-primary text-lg font-semibold text-white shadow-[0px_4px_6px_-2px_rgba(22,163,74,0.35)] hover:bg-primary-dark",
  label: "mb-2 block text-sm font-semibold text-ink",
} as const;

/** The two lines of the "FreshCart" wordmark used in every card header (24:6786). */
export const AUTH_BRAND = { fresh: "Fresh", cart: "Cart" } as const;
