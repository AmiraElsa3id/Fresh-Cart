"use client";

import { apiErrorMessage } from "@/lib/api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  Package,
  Save,
  Settings,
  User,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useChangePassword, useUpdateProfile, useUserOrders } from "@/lib/hooks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  PASSWORD_HINT,
  emailField,
  passwordField,
  phoneField,
  refinePasswordMatch,
} from "@/lib/auth-schemas";

/**
 * Profile — Figma `51:4193` ("Profile page - settings | Desktop").
 *
 * A green gradient banner over `#F9FAFB`, then a 288px sidebar beside the main
 * column. Two of the design's three panels map onto what this backend supports:
 * Profile Information (with the "Save Changes" button) and Change Password (with
 * the design's `#E17100` button). The third panel in the design, saved addresses,
 * has no API behind it on this public backend, so the sidebar offers Settings and
 * My Orders instead of pointing at a route that does not exist.
 */

const CARD_SHADOW = "shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]";
const HAIRLINE = "border-[#F3F4F6]";

/** `#16A34A` → `#22C55E` → `#4ADE80`, top to bottom. */
const BANNER_GRADIENT = "bg-gradient-to-br from-[#16A34A] via-[#22C55E] to-[#4ADE80]";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: emailField(),
  phone: phoneField(),
});

const passwordSchema = refinePasswordMatch(
  {
    currentPassword: z.string().min(1, "Current password is required"),
    // Same policy as signup and reset, so nobody can downgrade their password by
    // changing it here.
    password: passwordField("New password"),
    rePassword: z.string().trim().min(1, "Please confirm your new password"),
  },
  "password",
  "rePassword",
);

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

/** The design's label: `#364153`, 14px medium, sitting 8px above its control. */
function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-[#364153]">
        {label}
      </Label>
      {children}
      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

/** Password row with the design's absolutely-positioned reveal button. */
function PasswordField({
  id,
  label,
  hint,
  error,
  visible,
  onToggle,
  inputProps,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  visible: boolean;
  onToggle: () => void;
  inputProps: Record<string, unknown>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-[#364153]">
        {label}
      </Label>
      <div className="relative">
        <Input id={id} type={visible ? "text" : "password"} className="pr-12" {...inputProps} />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
          className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#6A7282] transition-colors hover:bg-[#F3F4F6] hover:text-[#364153]"
        >
          {visible ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
        </button>
      </div>
      {hint && !error && <p className="text-xs text-[#6A7282]">{hint}</p>}
      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export function ProfilePage() {
  const { user, isLoggedIn, logout, setUser } = useAuthStore();
  const { mutate: updateProfile, isPending: profilePending } = useUpdateProfile();
  const { mutate: changePassword, isPending: passwordPending } = useChangePassword();
  const { data: orders, isLoading: ordersLoading } = useUserOrders(user?.id || "");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  /*
   * Before the `!isLoggedIn` early return below. Hooks after a return mean the
   * logged-out and logged-in renders use different hook orders, which React
   * rejects with error #310 the moment the token appears.
   */
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onTouched",
  });

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <p className="text-base font-medium text-[#6A7282]">Redirecting to login…</p>
      </div>
    );
  }

  const onSubmitProfile = (data: ProfileFormData) => {
    setProfileError("");
    setProfileSuccess("");
    updateProfile(data, {
      onSuccess: (response) => {
        // Top-level body, not `response.data` - see LoginPage for why.
        if (response.user) {
          setUser({ ...user, ...response.user });
          setProfileSuccess("Profile updated successfully!");
          toast.success("Profile updated!");
        } else {
          setProfileError(response.message || "Failed to update profile.");
        }
      },
      onError: (err) => setProfileError(apiErrorMessage(err, "Failed to update profile.")),
    });
  };

  const onSubmitPassword = (data: PasswordFormData) => {
    setPasswordError("");
    setPasswordSuccess("");
    changePassword(data, {
      onSuccess: () => {
        setPasswordSuccess("Password changed successfully!");
        toast.success("Password changed!");
        resetPasswordForm();
      },
      onError: (err) => setPasswordError(apiErrorMessage(err, "Failed to change password.")),
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-[#F9FAFB] pb-8">
      {/* 51:4226 - green gradient banner carrying the page identity. */}
      <div className={`w-full ${BANNER_GRADIENT}`}>
        <div className="container mx-auto flex flex-col gap-6 px-4 py-12">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
            <Link to="/" className="font-medium text-white/70 transition-colors hover:text-white">
              Home
            </Link>
            <span aria-hidden="true" className="font-medium text-white/40">
              /
            </span>
            <span aria-current="page" className="font-medium text-white">
              My Account
            </span>
          </nav>

          <div className="flex items-center gap-5">
            {/* 51:4236 - frosted 64px badge. */}
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.1),0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_0px_0px_1px_rgba(255,255,255,0.3)] backdrop-blur-sm">
              <User aria-hidden="true" className="size-7 text-white" />
            </span>
            <div>
              <h1 className="text-2xl font-bold leading-8 text-white">My Account</h1>
              <p className="mt-1 text-sm font-medium text-white/80">
                Manage your profile, orders and account settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full max-w-[1504px] flex-col gap-8 px-4 lg:flex-row">
        {/* 51:4246 - 288px sidebar. */}
        <aside className="w-full lg:w-[288px] lg:shrink-0">
          <nav
            aria-label="Account sections"
            className={`rounded-2xl border ${HAIRLINE} bg-white ${CARD_SHADOW}`}
          >
            <div className={`border-b ${HAIRLINE} px-4 py-4`}>
              <h2 className="text-base font-bold leading-6 text-[#101828]">{user?.name || "My Account"}</h2>
              <p className="mt-0.5 text-sm text-[#6A7282]">{user?.email}</p>
            </div>

            <ul className="p-2">
              <SidebarItem icon={Settings} label="Settings" to="/profile" current />
              <SidebarItem icon={Package} label="My Orders" to="/orders" count={orders?.length} />
            </ul>

            <div className={`border-t ${HAIRLINE} p-2`}>
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-[#FEF2F2]"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F3F4F6]">
                  <LogOut aria-hidden="true" className="size-4 text-[#4A5565]" />
                </span>
                <span className="flex-1 font-medium text-[#4A5565]">Sign Out</span>
              </button>
            </div>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          {/* 51:4265 */}
          <div className="mb-6">
            <h2 className="text-xl font-bold leading-7 text-[#101828]">Account Settings</h2>
            <p className="mt-1 text-sm font-medium leading-5 text-[#6A7282]">
              Update your profile information and change your password
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* 51:4270 - profile information. */}
            <section className={`rounded-2xl border ${HAIRLINE} bg-white ${CARD_SHADOW}`}>
              <div className={`flex flex-col gap-6 border-b ${HAIRLINE} p-8`}>
                <div className="flex items-center gap-4">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#DCFCE7]">
                    <User aria-hidden="true" className="size-6 text-[#16A34A]" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold leading-6 text-[#101828]">Profile Information</h3>
                    <p className="mt-0.5 text-sm text-[#6A7282]">Update your personal details</p>
                  </div>
                </div>

                {profileError && (
                  <Alert variant="destructive" role="alert">
                    <AlertCircle aria-hidden="true" className="size-4" />
                    <AlertDescription>{profileError}</AlertDescription>
                  </Alert>
                )}
                {profileSuccess && (
                  <Alert role="status" className="border-[#DCFCE7] bg-[#F0FDF4] text-[#016630]">
                    <CheckCircle aria-hidden="true" className="size-4" />
                    <AlertDescription>{profileSuccess}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmitProfile(onSubmitProfile)} noValidate className="flex flex-col gap-5">
                  <Field id="name" label="Full Name" error={profileErrors.name?.message}>
                    <Input id="name" autoComplete="name" disabled={profilePending} {...registerProfile("name")} />
                  </Field>

                  <Field id="email" label="Email Address" error={profileErrors.email?.message}>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      disabled={profilePending}
                      {...registerProfile("email")}
                    />
                  </Field>

                  <Field id="phone" label="Phone Number" error={profileErrors.phone?.message}>
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="01xxxxxxxxx"
                      disabled={profilePending}
                      {...registerProfile("phone")}
                    />
                  </Field>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={profilePending}
                      className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#16A34A] px-6 text-base font-semibold text-white shadow-[0px_4px_6px_-4px_rgba(22,163,74,0.25),0px_10px_15px_-3px_rgba(22,163,74,0.25)] transition-colors hover:bg-[#15803D] disabled:opacity-60"
                    >
                      <Save aria-hidden="true" className="size-4" />
                      {profilePending ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>

              {/* 51:4304 - read-only account facts on a tinted strip. */}
              <div className="flex flex-col gap-3 bg-[#F9FAFB] p-8">
                <h3 className="text-base font-bold leading-6 text-[#101828]">Account Information</h3>
                <dl className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm text-[#6A7282]">User ID</dt>
                    <dd className="truncate font-mono text-xs text-[#364153]">{user?.id || "—"}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm text-[#6A7282]">Role</dt>
                    <dd className="rounded-lg bg-[#DCFCE7] px-3 py-1 text-sm font-medium text-[#15803D]">
                      {user?.role || "user"}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* 51:4318 - change password. */}
            <section className={`rounded-2xl border ${HAIRLINE} bg-white ${CARD_SHADOW}`}>
              <div className="flex flex-col gap-6 p-8">
                <div className="flex items-center gap-4">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#FEF3C6]">
                    <KeyRound aria-hidden="true" className="size-6 text-[#E17100]" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold leading-6 text-[#101828]">Change Password</h3>
                    <p className="mt-0.5 text-sm text-[#6A7282]">Update your account password</p>
                  </div>
                </div>

                {passwordError && (
                  <Alert variant="destructive" role="alert">
                    <AlertCircle aria-hidden="true" className="size-4" />
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}
                {passwordSuccess && (
                  <Alert role="status" className="border-[#DCFCE7] bg-[#F0FDF4] text-[#016630]">
                    <CheckCircle aria-hidden="true" className="size-4" />
                    <AlertDescription>{passwordSuccess}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmitPassword(onSubmitPassword)} noValidate className="flex flex-col gap-5">
                  <PasswordField
                    id="currentPassword"
                    label="Current Password"
                    error={passwordErrors.currentPassword?.message}
                    visible={showPasswords}
                    onToggle={() => setShowPasswords((v) => !v)}
                    inputProps={{
                      autoComplete: "current-password",
                      placeholder: "Enter your current password",
                      disabled: passwordPending,
                      ...registerPassword("currentPassword"),
                    }}
                  />

                  <PasswordField
                    id="password"
                    label="New Password"
                    hint={PASSWORD_HINT}
                    error={passwordErrors.password?.message}
                    visible={showPasswords}
                    onToggle={() => setShowPasswords((v) => !v)}
                    inputProps={{
                      autoComplete: "new-password",
                      placeholder: "Enter your new password",
                      disabled: passwordPending,
                      ...registerPassword("password"),
                    }}
                  />

                  <PasswordField
                    id="rePassword"
                    label="Confirm New Password"
                    error={passwordErrors.rePassword?.message}
                    visible={showPasswords}
                    onToggle={() => setShowPasswords((v) => !v)}
                    inputProps={{
                      autoComplete: "new-password",
                      placeholder: "Confirm your new password",
                      disabled: passwordPending,
                      ...registerPassword("rePassword"),
                    }}
                  />

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={passwordPending}
                      className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#E17100] px-6 text-base font-semibold text-white shadow-[0px_4px_6px_-4px_rgba(225,113,0,0.25),0px_10px_15px_-3px_rgba(225,113,0,0.25)] transition-colors hover:bg-[#C25E00] disabled:opacity-60"
                    >
                      <KeyRound aria-hidden="true" className="size-4" />
                      {passwordPending ? "Changing…" : "Change Password"}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            {/* Order history lives on /orders; this is a compact pointer, not a
                duplicate list, so the two can never disagree. */}
            <section className={`rounded-2xl border ${HAIRLINE} bg-white ${CARD_SHADOW}`}>
              <div className="flex items-center gap-4 p-8">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#DCFCE7]">
                  <Package aria-hidden="true" className="size-6 text-[#16A34A]" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold leading-6 text-[#101828]">Order History</h3>
                  <p className="mt-0.5 text-sm text-[#6A7282]">
                    {ordersLoading
                      ? "Loading your orders…"
                      : orders && orders.length > 0
                        ? `${orders.length} ${orders.length === 1 ? "order" : "orders"} placed`
                        : "You have not placed any orders yet."}
                  </p>
                </div>
                <Link
                  to="/orders"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-[#16A34A] transition-colors hover:bg-[#F0FDF4]"
                >
                  View orders
                  <ChevronRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

/** 51:4251 / 51:4257 - selected rows are `#F0FDF4` with a green icon tile. */
function SidebarItem({
  icon: Icon,
  label,
  to,
  current,
  count,
}: {
  icon: typeof Settings;
  label: string;
  to: string;
  current?: boolean;
  count?: number;
}) {
  return (
    <li>
      <Link
        to={to}
        aria-current={current ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-xl px-4 py-3 transition-colors",
          current ? "bg-[#F0FDF4]" : "hover:bg-[#F3F4F6]",
        )}
      >
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            current ? "bg-[#22C55E]" : "bg-[#F3F4F6]",
          )}
        >
          <Icon aria-hidden="true" className={cn("size-4", current ? "text-white" : "text-[#4A5565]")} />
        </span>
        <span className={cn("flex-1 font-medium", current ? "text-[#15803D]" : "text-[#4A5565]")}>{label}</span>
        {count !== undefined && count > 0 && (
          <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-xs font-medium text-[#4A5565]">{count}</span>
        )}
        <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-[#6A7282]" />
      </Link>
    </li>
  );
}
