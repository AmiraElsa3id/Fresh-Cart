"use client";

/**
 * Shared chrome for all five auth screens.
 *
 * The five Figma frames (login 24:6713, sign up 24:4988, forgot 54:20254,
 * verify 54:22665, reset 54:23995) are the same two-column layout with a
 * different left panel and a different card body, so the shell lives here once.
 *
 * The Figma frames each carry their own top bar, header, pre-footer trust row
 * and footer. Those are already provided by the app's route `Layout`, so this
 * component is the auth body only - see `src/components/layout/Layout.tsx`.
 */

import type { ReactNode } from "react";
import { Fragment } from "react";
import {
  Headphones,
  Lock,
  Mail,
  ShieldCheck,
  Star,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { AUTH_BRAND, AUTH_CONTROL, AUTH_LAYOUT, RESET_STEPS } from "@/lib/auth-flow";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ shell */

export function AuthLayout({ aside, children }: { aside: ReactNode; children: ReactNode }) {
  return (
    <div className="w-full px-4 py-10 sm:px-6 lg:py-16">
      <div className={AUTH_LAYOUT.grid}>
        {aside}
        <div className="mx-auto w-full max-w-[616px]">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ aside */

interface AuthAsideProps {
  variant: "illustration" | "features" | "steps";
  /** Which step of the reset flow is active. Only used by `variant="steps"`. */
  activeStep?: number;
}

export function AuthAside({ variant, activeStep = 1 }: AuthAsideProps) {
  if (variant === "illustration") return <LoginAside />;
  if (variant === "features") return <SignUpAside />;
  return <ResetAside activeStep={activeStep} />;
}

/** Pill row: a 15x12 glyph plus 14px muted text. Shared by every aside variant. */
function Pills({ items }: { items: { icon: LucideIcon; label: string }[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <item.icon className="h-[15px] w-4 shrink-0" aria-hidden="true" />
          <span className="text-sm text-slate-500">{item.label}</span>
        </span>
      ))}
    </div>
  );
}

function LoginAside() {
  return (
    <div className={AUTH_LAYOUT.aside}>
      <div className={AUTH_LAYOUT.panel}>
        <img
          src="/images/auth-illustration.jpg"
          alt=""
          width={1024}
          height={638}
          className={cn(
            AUTH_LAYOUT.panelHeight,
            "w-full rounded-2xl object-cover shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)]"
          )}
        />
        <div className="mt-4 space-y-4">
          <h2 className="text-3xl font-bold leading-9 text-ink">
            <span className="text-primary-dark">FreshCart</span> - Your One-Stop Shop for Fresh
            Products
          </h2>
          <p className="text-lg leading-7 font-medium text-[#4A5565]">
            Join thousands of happy customers who trust FreshCart for their daily grocery needs
          </p>
          <Pills
            items={[
              { icon: Truck, label: "Free Delivery" },
              { icon: ShieldCheck, label: "Secure Payment" },
              { icon: Headphones, label: "24/7 Support" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function SignUpAside() {
  const highlights = [
    {
      icon: Star,
      title: "Premium Quality",
      body: "Premium quality products sourced from trusted suppliers.",
    },
    { icon: Truck, title: "Fast Delivery", body: "Same-day delivery available in most areas" },
    {
      icon: ShieldCheck,
      title: "Secure Shopping",
      body: "Your data and payments are completely secure",
    },
  ];

  return (
    <div className={cn(AUTH_LAYOUT.aside, "lg:text-left")}>
      <h1 className="text-4xl font-bold text-ink">
        Welcome to <span className="text-primary-dark">FreshCart</span>
      </h1>
      <p className="mt-4 text-xl font-medium text-[#4A5565]">
        Join thousands of happy customers who enjoy fresh groceries delivered right to their
        doorstep.
      </p>

      <ul className="mt-6 space-y-6">
        {highlights.map((item) => (
          <li key={item.title} className="flex gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#DCFCE7]">
              <item.icon className="size-6 text-primary" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-ink">{item.title}</h2>
              <p className="text-[#4A5565]">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* 24:5075 div.review */}
      <figure className="mt-8 rounded-lg bg-white p-5 shadow-sm ring-1 ring-black/5">
        <div className="flex items-center gap-3">
          <img
            src="/images/testimonial-avatar.jpg"
            alt=""
            width={48}
            height={48}
            className="size-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-ink">Sarah Johnson</h3>
            <div className="flex gap-0.5" aria-label="Rated 5 out of 5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
              ))}
            </div>
          </div>
        </div>
        <blockquote className="mt-4 text-[#4A5565] italic">
          &ldquo;FreshCart has transformed my shopping experience. The quality of the products is
          outstanding, and the delivery is always on time. Highly recommend!&rdquo;
        </blockquote>
      </figure>
    </div>
  );
}

function ResetAside({ activeStep }: { activeStep: number }) {
  const stepIcons = [Mail, ShieldCheck, Lock] as const;
  const StepIcon = stepIcons[Math.min(activeStep, stepIcons.length) - 1] ?? Mail;

  return (
    <div className={AUTH_LAYOUT.aside}>
      {/* 54:20288 - fixed 384px gradient panel with blurred decorative blobs */}
      <div
        className={cn(
          AUTH_LAYOUT.panelHeight,
          "relative flex w-full flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl",
          "bg-[linear-gradient(159deg,rgba(240,253,244,1)_0%,rgba(240,253,244,1)_50%,rgba(243,244,246,1)_100%)]"
        )}
      >
        <span
          aria-hidden="true"
          className="absolute top-8 left-8 size-24 rounded-full bg-[#A4F4CF] opacity-40 blur-2xl"
        />
        <span
          aria-hidden="true"
          className="absolute -top-6 -right-8 size-32 rounded-full bg-[#00BC7D] opacity-20 blur-3xl"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-1/3 size-16 rounded-full bg-[#A4F4CF] opacity-50 blur-xl"
        />

        <div className="relative flex size-28 items-center justify-center rounded-3xl bg-white/20 shadow-[0_8px_24px_-8px_rgba(0,188,125,0.35)]">
          <div className="flex size-20 items-center justify-center rounded-2xl bg-white">
            <StepIcon className="size-9 text-primary" aria-hidden="true" />
          </div>
        </div>

        {/* 54:20297 - three dots mirroring the card stepper */}
        <div className="relative flex gap-2" role="presentation">
          {RESET_STEPS.map((step, i) => (
            <span
              key={step.id}
              className={cn(
                "size-3 rounded-full transition-colors",
                i + 1 <= activeStep ? "bg-primary" : "bg-white"
              )}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <h2 className="text-3xl font-bold leading-9 text-ink">
          <span className="text-primary-dark">FreshCart</span> Password Recovery
        </h2>
        <p className="text-lg leading-7 font-medium text-[#4A5565]">
          Don&apos;t worry, it happens to the best of us. We&apos;ll help you get back into your
          account in no time.
        </p>
        <Pills
          items={[
            { icon: Mail, label: RESET_STEPS[0].label },
            { icon: ShieldCheck, label: RESET_STEPS[1].label },
            { icon: Lock, label: RESET_STEPS[2].label },
          ]}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- card */

interface AuthCardProps {
  title: string;
  subtitle: ReactNode;
  /** The two-tone "FreshCart" wordmark shown above the title (24:6786). */
  showBrand?: boolean;
  /**
   * Heading level for the card title, so the page keeps exactly one `h1`.
   * The designs are not consistent here: login and the reset chain use `h1` in
   * the card with an `h2` aside, while sign-up uses `h1` in the aside with an
   * `h2` card (24:5034 vs 24:5098).
   */
  titleAs?: "h1" | "h2";
  /** Reset-flow stepper, rendered between the header and the body. */
  stepper?: ReactNode;
  children: ReactNode;
}

export function AuthCard({
  title,
  subtitle,
  showBrand = true,
  titleAs: Title = "h1",
  stepper,
  children,
}: AuthCardProps) {
  return (
    <div className={AUTH_LAYOUT.card}>
      <div className="text-center">
        {showBrand && (
          <p className="text-3xl leading-9 font-bold">
            <span className="text-primary">{AUTH_BRAND.fresh}</span>
            <span className="text-ink">{AUTH_BRAND.cart}</span>
          </p>
        )}
        <Title className="text-2xl leading-8 font-bold text-ink">{title}</Title>
        <p className="mt-1 text-base leading-6 font-medium text-[#4A5565]">{subtitle}</p>
      </div>

      {stepper}
      {children}
    </div>
  );
}

/** 24:6844 / 24:5178 - the "New to FreshCart?" strip pinned to the card base. */
export function AuthCardFooter({ children }: { children: ReactNode }) {
  return (
    <div className="border-t border-surface-2 pt-6 text-center text-base font-medium text-[#4A5565]">
      {children}
    </div>
  );
}

/** 24:6805 - hairline with a centred label. */
export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="relative flex items-center">
      <span className="w-full border-t border-border" />
      <span className="mx-4 shrink-0 bg-white px-4 text-sm whitespace-nowrap text-slate-500">
        {label}
      </span>
      <span className="w-full border-t border-border" />
    </div>
  );
}

/* --------------------------------------------------------------- stepper */

const STEP_ICONS = [Mail, ShieldCheck, Lock] as const;

/**
 * 54:20340 - three 40px circles each trailed by a 64px bar. The active circle
 * carries a 4px mint ring (`boxShadow: 0 0 0 4px rgba(220,252,231,1)`).
 */
export function AuthStepper({ activeStep }: { activeStep: number }) {
  return (
    <ol className="flex items-center" aria-label={`Step ${activeStep} of ${RESET_STEPS.length}`}>
      {RESET_STEPS.map((step, i) => {
        const position = i + 1;
        const done = position < activeStep;
        const active = position === activeStep;
        const Icon = STEP_ICONS[i];

        return (
          <Fragment key={step.id}>
            <li className="flex flex-col items-center gap-1.5">
              <span
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex size-10 items-center justify-center rounded-full",
                  done || active ? "bg-primary text-white" : "bg-white text-slate-400",
                  active && "shadow-[0_0_0_4px_rgba(220,252,231,1)]",
                  !done && !active && "ring-2 ring-[#E5E7EB] ring-inset"
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                <span className="sr-only">
                  {step.label}
                  {done ? " (done)" : active ? " (current)" : ""}
                </span>
              </span>
              <span
                className={cn(
                  "text-[11px] leading-tight",
                  active || done ? "font-semibold text-ink" : "text-slate-500"
                )}
              >
                {step.label}
              </span>
            </li>
            <span
              aria-hidden="true"
              className={cn(
                "mb-4 ml-1 h-1 w-16 rounded-full",
                done ? "bg-primary" : "bg-[#E5E7EB]"
              )}
            />
          </Fragment>
        );
      })}
    </ol>
  );
}

/* --------------------------------------------------------- social buttons */

const SOCIAL = [
  { id: "google", label: "Google" },
  { id: "facebook", label: "Facebook" },
] as const;

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-[22px]" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.26-2.09 3.55-5.17 3.55-8.87Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.88-3.01c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.28a12 12 0 0 0 0 10.74l3.99-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.63l3.99 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-[22px]" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"
      />
    </svg>
  );
}

/**
 * 24:6795 / 24:5104 - the design puts Google and Facebook sign-in on both login
 * and sign-up, but the API exposes no OAuth endpoints (only `/auth/signin` with
 * an email and password). They render disabled so the layout stays faithful
 * without offering a button that cannot work; flip `enabled` once a provider
 * is wired up.
 */
export function SocialAuthButtons({
  action = "Continue with",
  enabled = false,
  className,
}: {
  action?: string;
  enabled?: boolean;
  className?: string;
}) {
  return (
    <div className="space-y-3">
      {SOCIAL.map((provider) => {
        const Mark = provider.id === "google" ? GoogleMark : FacebookMark;
        return (
          <button
            key={provider.id}
            type="button"
            disabled={!enabled}
            title={enabled ? undefined : `${provider.label} sign-in is not available yet`}
            className={cn(
              "flex w-full items-center justify-center gap-3 rounded-xl border-2 border-input bg-white px-4 py-3",
              "text-base font-medium text-ink transition-colors",
              enabled
                ? "cursor-pointer hover:border-primary/40 hover:bg-surface"
                : "cursor-not-allowed opacity-60",
              className
            )}
          >
            <Mark />
            {action} {provider.label}
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------------- submit */

export function AuthSubmit({
  pending,
  pendingLabel,
  className,
  children,
}: {
  pending: boolean;
  pendingLabel: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        AUTH_CONTROL.submit,
        "inline-flex items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
