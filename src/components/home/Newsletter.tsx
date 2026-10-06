"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { emailField } from "@/lib/auth-schemas";

const newsletterSchema = z.object({
  email: emailField(),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

interface NewsletterProps {
  className?: string;
  variant?: "default" | "footer" | "standalone";
}

export function Newsletter({ className, variant = "default" }: NewsletterProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("success");
      setMessage("Thanks for subscribing! Check your inbox for confirmation.");
      reset();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  const baseStyles = "rounded-2xl p-6 md:p-10 bg-[#DCFCE7] border-y border-green-200";
  const footerStyles = "rounded-none border-none bg-transparent p-0";
  const standaloneStyles = "rounded-2xl p-6 md:p-8 bg-white shadow-lg border border-gray-100";

  return (
    <section
      className={`${variant === "footer" ? footerStyles : variant === "standalone" ? standaloneStyles : baseStyles} ${className}`}
      aria-labelledby="newsletter-heading"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 id="newsletter-heading" className="text-2xl md:text-3xl font-bold text-ink mb-3">
          {variant === "footer" ? "Get the FreshCart App" : "Join Our Newsletter"}
        </h2>
        <p className="text-slate-500 mb-6">
          {variant === "footer"
            ? "We'll send you a link to download the app."
            : "Get fresh deals and weekly offers straight to your inbox."}
        </p>

        {status === "success" && (
          <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert className="mb-4 bg-red-50 border-red-200 text-red-800" variant="destructive">
            <AlertCircle className="w-5 h-5" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            {...register("email")}
            type="email"
            placeholder="Enter your email"
            // A placeholder is not an accessible name - it disappears as soon as
            // the field has content and is skipped by some screen readers. This
            // form has no visible <label> (the design has none), so the name is
            // set on the control itself.
            aria-label={
              variant === "footer"
                ? "Email address to receive the app download link"
                : "Email address to subscribe to the newsletter"
            }
            className="flex-1"
            disabled={isSubmitting || status === "success"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span id="email-error" className="sr-only">
              {errors.email.message}
            </span>
          )}
          <Button
            type="submit"
            className="whitespace-nowrap bg-primary hover:bg-primary-dark"
            disabled={isSubmitting || status === "success"}
            size="lg"
          >
            {isSubmitting ? "Subscribing..." : variant === "footer" ? "Share App" : "Subscribe"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-slate-500">
          By subscribing, you agree to our Privacy Policy and consent to receive updates.
        </p>
      </div>
    </section>
  );
}