"use client";

/** Forgot password - Figma `54:20254` (Forgot Password Page - Desktop). Step 1 of 3. */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail } from "lucide-react";
import {
  AuthAside,
  AuthCard,
  AuthCardFooter,
  AuthLayout,
  AuthStepper,
  AuthSubmit,
} from "@/components/auth/AuthLayout";
import { AuthField, FormAlert } from "@/components/auth/AuthFields";
import { Input } from "@/components/ui/input";
import { apiErrorMessage } from "@/lib/api";
import { useForgotPassword } from "@/lib/hooks";
import { AUTH_CONTROL, writeResetEmail } from "@/lib/auth-flow";
import { emailField } from "@/lib/auth-schemas";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: emailField(),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { mutate: forgotPassword, isPending } = useForgotPassword();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    setError("");
    forgotPassword(data.email, {
      onSuccess: () => {
        // Carry the address forward: the verify and reset screens have no
        // email field, per the design.
        writeResetEmail(data.email);
        toast.success("Reset code sent to your email!");
        navigate("/verifyresetcode");
      },
      onError: (err) =>
        setError(apiErrorMessage(err, "Failed to send reset code. Please try again.")),
    });
  };

  return (
    <AuthLayout aside={<AuthAside variant="steps" activeStep={1} />}>
      <AuthCard title="Forgot Password?" subtitle="No worries, we'll send you a reset code">
        <div className="flex flex-col gap-8">
          <AuthStepper activeStep={1} />

          {error && <FormAlert>{error}</FormAlert>}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
            <AuthField id="email" label="Email Address" icon={Mail} error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                autoComplete="email"
                disabled={isPending}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={AUTH_CONTROL.input}
                {...register("email")}
              />
            </AuthField>

            <AuthSubmit pending={isPending} pendingLabel="Sending code...">
              Send Reset Code
            </AuthSubmit>
          </form>

          <AuthCardFooter>
            Remember your password?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </AuthCardFooter>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
