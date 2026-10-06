"use client";

/**
 * Form primitives for the auth screens, so the label / icon / error pattern
 * that repeats across every field is written once.
 *
 * Geometry follows `input#email` (54:20360) and `input#password` (54:24101):
 * 52px tall, 12px radius, 2px `#E5E7EB` border, 48px of left padding to clear
 * a 20px icon sitting at 16px, and 48px of right padding for the reveal toggle.
 */

import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";
import { AlertCircle, Eye, EyeOff, type LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AUTH_CONTROL } from "@/lib/auth-flow";
import { PASSWORD_POLICY } from "@/lib/auth-schemas";
import { cn } from "@/lib/utils";

type InputProps = ComponentProps<typeof Input>;

/* ------------------------------------------------------------ error banner */

export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <Alert variant="destructive" role="alert">
      <AlertCircle className="size-4" aria-hidden="true" />
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}

/* -------------------------------------------------------------- text field */

interface AuthFieldProps {
  id: string;
  label: string;
  icon?: LucideIcon;
  /** Right-aligned control on the label row, e.g. a "Forgot password?" link. */
  action?: ReactNode;
  error?: string;
  hint?: string;
  /** Rendered under the control, e.g. the signup password-strength meter. */
  footer?: ReactNode;
  children: ReactNode;
}

export function AuthField({
  id,
  label,
  icon: Icon,
  action,
  error,
  hint,
  footer,
  children,
}: AuthFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id} className={AUTH_CONTROL.label}>
          {label}
        </Label>
        {action}
      </div>

      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
        )}
        {children}
      </div>

      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-500">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-slate-500">
          {hint}
        </p>
      ) : null}

      {footer}
    </div>
  );
}

/* ------------------------------------------------------------ password field */

interface AuthPasswordFieldProps {
  id: string;
  label: string;
  icon?: LucideIcon;
  action?: ReactNode;
  error?: string;
  hint?: string;
  footer?: ReactNode;
  placeholder?: string;
  autoComplete?: InputProps["autoComplete"];
  /** Spread react-hook-form's `register()` result here. */
  inputProps?: InputProps;
}

export function AuthPasswordField({
  id,
  label,
  icon,
  action,
  error,
  hint,
  footer,
  placeholder = "Enter your password",
  autoComplete = "current-password",
  inputProps,
}: AuthPasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <AuthField
      id={id}
      label={label}
      icon={icon}
      action={action}
      error={error}
      hint={hint}
      footer={footer}
    >
      <Input
        id={id}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={describedBy}
        className={AUTH_CONTROL.inputWithAction}
        {...inputProps}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-controls={id}
        aria-pressed={visible}
        aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
      >
        {visible ? (
          <EyeOff className="size-5" aria-hidden="true" />
        ) : (
          <Eye className="size-5" aria-hidden="true" />
        )}
      </button>
    </AuthField>
  );
}

/* --------------------------------------------------------- password strength */

const STRENGTH = [
  { label: "Weak", bar: "bg-red-500", text: "text-red-500" },
  { label: "Fair", bar: "bg-amber-500", text: "text-amber-600" },
  { label: "Good", bar: "bg-lime-500", text: "text-lime-600" },
  { label: "Strong", bar: "bg-primary", text: "text-primary" },
] as const;

/**
 * 24:5147 - a segmented bar labelled "Password strength: <level>".
 *
 * The thresholds are read from `PASSWORD_POLICY` so the meter cannot drift away
 * from what the Zod schema actually enforces - if the rule changes, both change.
 * The fourth segment rewards length beyond the minimum, which the schema does
 * not require, so it never blocks submission.
 */
export function PasswordStrength({ value, hint }: { value: string; hint?: string }) {
  const checks = [
    value.length >= PASSWORD_POLICY.min,
    PASSWORD_POLICY.requiresNumber && /\d/.test(value),
    PASSWORD_POLICY.requiresSymbol && /[^\w\s]/.test(value),
    value.length >= PASSWORD_POLICY.min + 4,
  ];
  // `hasInput` is separate from the score: a short password scores 0 but is
  // still typed, and should read "Weak" rather than "nothing entered".
  const hasInput = value.length > 0;
  const filled = hasInput ? checks.filter(Boolean).length : 0;
  // Four checks but four labels, so a score of 4 has to land on the last label
  // rather than falling off the end.
  const level = STRENGTH[Math.min(filled, STRENGTH.length - 1)];

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#4A5565]">Password strength:</span>
        <span className={cn("font-medium", hasInput ? level.text : "text-slate-400")}>
          {hasInput ? level.label : "—"}
        </span>
      </div>
      <div
        className="mt-1.5 flex gap-1"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={STRENGTH.length}
        aria-valuenow={filled}
        aria-valuetext={hasInput ? `${level.label} password` : "No password entered"}
      >
        {STRENGTH.map((step, i) => (
          <span
            key={step.label}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < filled ? step.bar : "bg-[#E5E7EB]"
            )}
          />
        ))}
      </div>
      {hint && <p className="mt-1.5 text-sm text-slate-500">{hint}</p>}
    </div>
  );
}
