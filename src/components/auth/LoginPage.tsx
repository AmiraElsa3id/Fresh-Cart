"use client";

/** Login - Figma `24:6713` (Login Page - Desktop). */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Mail, ShieldCheck, Star, Users } from "lucide-react";
import {
  AuthAside,
  AuthCard,
  AuthCardFooter,
  AuthDivider,
  AuthLayout,
  AuthSubmit,
  SocialAuthButtons,
} from "@/components/auth/AuthLayout";
import { AuthField, AuthPasswordField, FormAlert } from "@/components/auth/AuthFields";
import { Input } from "@/components/ui/input";
import { apiErrorMessage } from "@/lib/api";
import { useSignIn } from "@/lib/hooks";
import { useAuthStore } from "@/lib/store";
import { AUTH_CONTROL } from "@/lib/auth-flow";
import { emailField } from "@/lib/auth-schemas";
import { toast } from "sonner";

const signInSchema = z.object({
  email: emailField(),
  // Deliberately the pre-policy minimum and not `PASSWORD_POLICY`: signing in
  // must not impose the signup rule, or anyone who registered under the older
  // 6-character rule would be locked out of their own account.
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const TRUST_MARKS = [
  { icon: ShieldCheck, label: "SSL Secured" },
  { icon: Users, label: "50K+ Users" },
  { icon: Star, label: "4.9 Rating" },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { mutate: signIn, isPending } = useSignIn();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: SignInFormData) => {
    setError("");
    signIn(data, {
      onSuccess: (response) => {
        /*
         * The hook's `mutationFn` already unwraps the axios envelope
         * (`const { data } = await api.post(...)`), and the API puts `token`,
         * `user` and `message` at the top level of that body. Reading
         * `response.data.token` looked one level too deep, was always undefined,
         * and made every successful sign-in report "Login failed".
         */
        if (response.token) {
          login(response.token, response.user ?? { id: "", name: "", email: data.email, role: "user" });
          toast.success("Welcome back!");
          navigate("/");
        } else {
          setError(response.message || "Login failed. Please try again.");
        }
      },
      onError: (err) => setError(apiErrorMessage(err, "An error occurred. Please try again.")),
    });
  };

  return (
    <AuthLayout aside={<AuthAside variant="illustration" />}>
      <AuthCard title="Welcome Back!" subtitle="Sign in to continue your fresh shopping experience">
        <div className="flex flex-col gap-8">
          <SocialAuthButtons action="Continue with" />
          <AuthDivider label="OR CONTINUE WITH EMAIL" />

          {error && <FormAlert>{error}</FormAlert>}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
            <AuthField id="email" label="Email Address" icon={Mail} error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                disabled={isPending}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={AUTH_CONTROL.input}
                {...register("email")}
              />
            </AuthField>

            <AuthPasswordField
              id="password"
              label="Password"
              icon={Lock}
              error={errors.password?.message}
              action={
                <Link
                  to="/forgetpassword"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              }
              inputProps={{
                placeholder: "Enter your password",
                disabled: isPending,
                ...register("password"),
              }}
            />

            <AuthSubmit pending={isPending} pendingLabel="Signing in...">
              Sign In
            </AuthSubmit>
          </form>

          <AuthCardFooter>
            New to FreshCart?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </AuthCardFooter>

          {/* 24:6851 */}
          <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
            {TRUST_MARKS.map((mark) => (
              <span key={mark.label} className="flex items-center gap-1.5">
                <mark.icon className="size-4 shrink-0" aria-hidden="true" />
                {mark.label}
              </span>
            ))}
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
