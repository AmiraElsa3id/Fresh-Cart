"use client";

/** Verify reset code - Figma `54:22665` (Reset Verify Code - Desktop). Step 2 of 3. */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AuthAside,
  AuthCard,
  AuthLayout,
  AuthStepper,
  AuthSubmit,
} from "@/components/auth/AuthLayout";
import { AuthField, FormAlert } from "@/components/auth/AuthFields";
import { Input } from "@/components/ui/input";
import { apiErrorMessage } from "@/lib/api";
import { useForgotPassword, useVerifyResetCode } from "@/lib/hooks";
import { AUTH_CONTROL, readResetEmail } from "@/lib/auth-flow";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const verifyResetCodeSchema = z.object({
  resetCode: z
    .string()
    .length(6, "Reset code must be 6 digits")
    .regex(/^\d+$/, "Reset code must be 6 digits"),
});

type VerifyResetCodeFormData = z.infer<typeof verifyResetCodeSchema>;

export function VerifyResetCodePage() {
  const navigate = useNavigate();
  const { mutate: verifyResetCode, isPending } = useVerifyResetCode();
  const { mutate: resend, isPending: isResending } = useForgotPassword();
  const [error, setError] = useState("");

  // The design shows the address in the subtitle (54:22750) because the reset
  // step has no email field either.
  const email = readResetEmail();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyResetCodeFormData>({
    resolver: zodResolver(verifyResetCodeSchema),
    defaultValues: { resetCode: "" },
  });

  const onSubmit = (data: VerifyResetCodeFormData) => {
    setError("");
    verifyResetCode(data.resetCode, {
      onSuccess: () => {
        toast.success("Code verified successfully!");
        navigate("/resetpassword");
      },
      onError: (err) =>
        setError(apiErrorMessage(err, "Invalid or expired code. Please try again.")),
    });
  };

  const onResend = () => {
    if (!email) {
      navigate("/forgetpassword");
      return;
    }
    setError("");
    resend(email, {
      onSuccess: () => toast.success("A new code is on its way."),
      onError: (err) => setError(apiErrorMessage(err, "Could not resend the code. Try again.")),
    });
  };

  return (
    <AuthLayout aside={<AuthAside variant="steps" activeStep={2} />}>
      <AuthCard
        title="Check Your Email"
        subtitle={
          email ? (
            <>
              Enter the 6-digit code sent to <span className="font-semibold text-ink">{email}</span>
            </>
          ) : (
            "Enter the 6-digit code we emailed you"
          )
        }
      >
        <div className="flex flex-col gap-8">
          <AuthStepper activeStep={2} />

          {error && <FormAlert>{error}</FormAlert>}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
            <AuthField
              id="resetCode"
              label="Verification Code"
              error={errors.resetCode?.message}
              action={
                <button
                  type="button"
                  onClick={onResend}
                  disabled={isResending}
                  className="cursor-pointer text-sm font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isResending ? "Sending..." : "Resend Code"}
                </button>
              }
            >
              <Input
                id="resetCode"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="••••••"
                maxLength={6}
                disabled={isPending}
                aria-invalid={errors.resetCode ? "true" : "false"}
                aria-describedby={errors.resetCode ? "resetCode-error" : undefined}
                className={cn(
                  AUTH_CONTROL.input,
                  "text-center font-mono text-lg tracking-[0.5em] placeholder:tracking-[0.5em]"
                )}
                {...register("resetCode")}
              />
            </AuthField>

            <AuthSubmit pending={isPending} pendingLabel="Verifying...">
              Verify Code
            </AuthSubmit>

            <p className="text-center text-sm text-slate-500">
              Wrong address?{" "}
              <Link to="/forgetpassword" className="font-semibold text-primary hover:underline">
                Change email address
              </Link>
            </p>
          </form>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
