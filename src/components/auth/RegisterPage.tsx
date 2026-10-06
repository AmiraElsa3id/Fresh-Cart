"use client";

/** Sign up - Figma `24:4988` (Sign up Page - Desktop). */

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Mail, Phone, User } from "lucide-react";
import {
  AuthAside,
  AuthCard,
  AuthCardFooter,
  AuthDivider,
  AuthLayout,
  AuthSubmit,
  SocialAuthButtons,
} from "@/components/auth/AuthLayout";
import { AuthField, AuthPasswordField, FormAlert, PasswordStrength } from "@/components/auth/AuthFields";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiErrorMessage } from "@/lib/api";
import { useSignUp } from "@/lib/hooks";
import { useAuthStore } from "@/lib/store";
import { AUTH_CONTROL } from "@/lib/auth-flow";
import {
  PASSWORD_HINT,
  emailField,
  passwordField,
  phoneField,
  refinePasswordMatch,
} from "@/lib/auth-schemas";
import { toast } from "sonner";

/**
 * The design's hint at 24:5154 reads "Must be at least 8 characters with numbers
 * and symbols", which is what `PASSWORD_POLICY` now enforces. Phone stays
 * Egyptian because that is what the API validates - the design's
 * `+1 234 567 8900` placeholder would be rejected.
 */
const registerSchema = refinePasswordMatch(
  {
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: emailField(),
    password: passwordField(),
    rePassword: z.string().trim().min(1, "Please confirm your password"),
    phone: phoneField(),
    // Not `z.literal(true, { message })`: Zod 3's ZodLiteral._parse emits its own
    // `invalid_literal` issue and never reads the custom message, so the user
    // would see "Invalid literal value, expected true". `refine` does read it.
    terms: z
      .boolean({ invalid_type_error: "Please accept the terms to continue" })
      .refine((accepted) => accepted, { message: "You must accept the terms to continue" }),
  },
  "password",
  "rePassword",
);

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { mutate: signUp, isPending } = useSignUp();
  const [error, setError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", password: "", rePassword: "", phone: "", terms: false as never },
  });

  const password = watch("password");

  const onSubmit = (data: RegisterFormData) => {
    setError("");
    signUp(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        rePassword: data.rePassword,
        phone: data.phone,
      },
      {
        onSuccess: (response) => {
          /*
           * The hook's `mutationFn` already unwraps the axios envelope
           * (`const { data } = await api.post(...)`), and the API puts `token`,
           * `user` and `message` at the top level of that body. Reading
           * `response.data.token` looked one level too deep, was always undefined,
           * and made a successful sign-up report "Registration failed" even
           * though the account had been created.
           */
          if (response.token) {
            login(
              response.token,
              response.user ?? { id: "", name: data.name, email: data.email, role: "user" }
            );
            toast.success("Account created successfully!");
            navigate("/");
          } else {
            setError(response.message || "Registration failed. Please try again.");
          }
        },
        onError: (err) =>
          setError(apiErrorMessage(err, "An error occurred. Please try again.")),
      }
    );
  };

  return (
    <AuthLayout aside={<AuthAside variant="features" />}>
      <AuthCard
        title="Create Your Account"
        subtitle="Start your fresh journey with us today"
        showBrand={false}
        titleAs="h2"
      >
        <div className="flex flex-col gap-8">
          <SocialAuthButtons action="Sign up with" className="rounded-lg" />
          <AuthDivider label="or" />

          {error && <FormAlert>{error}</FormAlert>}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7" noValidate>
            <AuthField id="name" label="Name*" icon={User} error={errors.name?.message}>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                disabled={isPending}
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={AUTH_CONTROL.input}
                {...register("name")}
              />
            </AuthField>

            <AuthField id="email" label="Email*" icon={Mail} error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
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
              label="Password*"
              icon={Lock}
              error={errors.password?.message}
              placeholder="Create a strong password"
              inputProps={{
                autoComplete: "new-password",
                disabled: isPending,
                ...register("password"),
              }}
              footer={
                <PasswordStrength value={password ?? ""} hint={PASSWORD_HINT} />
              }
            />

            <AuthPasswordField
              id="rePassword"
              label="Confirm Password*"
              icon={Lock}
              error={errors.rePassword?.message}
              placeholder="Confirm your password"
              inputProps={{
                autoComplete: "new-password",
                disabled: isPending,
                ...register("rePassword"),
              }}
            />

            <AuthField id="phone" label="Phone Number*" icon={Phone} error={errors.phone?.message}>
              <Input
                id="phone"
                type="tel"
                placeholder="01XXXXXXXXX"
                autoComplete="tel"
                inputMode="tel"
                disabled={isPending}
                aria-invalid={errors.phone ? "true" : "false"}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                className={AUTH_CONTROL.input}
                {...register("phone")}
              />
            </AuthField>

            {/* 24:5167 - terms checkbox */}
            <div>
              <div className="flex items-start gap-2">
                <Controller
                  control={control}
                  name="terms"
                  render={({ field }) => (
                    <Checkbox
                      id="terms"
                      checked={field.value === true}
                      onCheckedChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      disabled={isPending}
                      aria-invalid={errors.terms ? "true" : "false"}
                      aria-describedby={errors.terms ? "terms-error" : undefined}
                      className="mt-0.5"
                    />
                  )}
                />
                <Label htmlFor="terms" className="text-sm leading-5 font-normal text-[#4A5565]">
                  I agree to the{" "}
                  <Link to="/terms" className="font-semibold text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="font-semibold text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  <span aria-hidden="true">*</span>
                </Label>
              </div>
              {errors.terms && (
                <p id="terms-error" role="alert" className="mt-1.5 text-sm text-red-500">
                  {errors.terms.message}
                </p>
              )}
            </div>

            <AuthSubmit
              pending={isPending}
              pendingLabel="Creating account..."
              className="rounded-lg"
            >
              Create My Account
            </AuthSubmit>
          </form>

          <AuthCardFooter>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </AuthCardFooter>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
