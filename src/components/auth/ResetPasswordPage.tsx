"use client";

/** Reset password - Figma `54:23995` (Reset Password - Desktop). Step 3 of 3. */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock } from "lucide-react";
import {
  AuthAside,
  AuthCard,
  AuthLayout,
  AuthStepper,
  AuthSubmit,
} from "@/components/auth/AuthLayout";
import { AuthPasswordField, FormAlert } from "@/components/auth/AuthFields";
import { apiErrorMessage } from "@/lib/api";
import { useResetPassword } from "@/lib/hooks";
import { clearResetEmail, readResetEmail } from "@/lib/auth-flow";
import { passwordField, refinePasswordMatch } from "@/lib/auth-schemas";
import { toast } from "sonner";

const resetPasswordSchema = refinePasswordMatch(
  {
    newPassword: passwordField("New password"),
    confirmPassword: z.string().trim().min(1, "Please confirm your new password"),
  },
  "newPassword",
  "confirmPassword",
);

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { mutate: resetPassword, isPending } = useResetPassword();
  const [error, setError] = useState("");

  // The design has no email field here (24:24096 has only the two password
  // inputs), so the address has to come from the step that collected it.
  const email = readResetEmail();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    setError("");
    resetPassword(
      { email, newPassword: data.newPassword },
      {
        onSuccess: () => {
          clearResetEmail();
          toast.success("Password reset successfully! Sign in with your new password.");
          navigate("/login");
        },
        onError: (err) =>
          setError(apiErrorMessage(err, "Failed to reset password. Please try again.")),
      }
    );
  };

  return (
    <AuthLayout aside={<AuthAside variant="steps" activeStep={3} />}>
      <AuthCard
        title="Create New Password"
        subtitle="Your new password must be different from previous passwords"
      >
        <div className="flex flex-col gap-8">
          <AuthStepper activeStep={3} />

          {error && <FormAlert>{error}</FormAlert>}

          {/* Deep-linking straight to this step leaves no address on record, and
              the API needs one to identify the account. */}
          {!email ? (
            <div className="text-center">
              <p className="text-[#4A5565]">
                This page needs the email address the reset code was sent to.
              </p>
              <Link
                to="/forgetpassword"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-lg font-semibold text-white hover:bg-primary-dark"
              >
                Start over
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
              <AuthPasswordField
                id="newPassword"
                label="New Password"
                icon={Lock}
                error={errors.newPassword?.message}
                placeholder="Enter new password"
                inputProps={{
                  autoComplete: "new-password",
                  disabled: isPending,
                  ...register("newPassword"),
                }}
              />

              <AuthPasswordField
                id="confirmPassword"
                label="Confirm Password"
                icon={Lock}
                error={errors.confirmPassword?.message}
                placeholder="Confirm new password"
                inputProps={{
                  autoComplete: "new-password",
                  disabled: isPending,
                  ...register("confirmPassword"),
                }}
              />

              <AuthSubmit pending={isPending} pendingLabel="Resetting password...">
                Reset Password
              </AuthSubmit>
            </form>
          )}
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
