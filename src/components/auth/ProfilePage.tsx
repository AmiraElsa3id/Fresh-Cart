"use client";

import { apiErrorMessage } from "@/lib/api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, User, Lock, Package } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useUpdateProfile, useChangePassword } from "@/lib/hooks";
import { useUserOrders } from "@/lib/hooks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^01[0-9]{9}$/, "Please enter a valid Egyptian phone number"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    password: z.string().min(6, "New password must be at least 6 characters"),
    rePassword: z.string(),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export function ProfilePage() {
  const { user, isLoggedIn, logout, setUser } = useAuthStore();
  const { mutate: updateProfile, isPending: profilePending } = useUpdateProfile();
  const { mutate: changePassword, isPending: passwordPending } = useChangePassword();
  const { data: orders, isLoading: ordersLoading } = useUserOrders(user?.id || "");
  const [activeTab, setActiveTab] = useState("profile");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  if (!isLoggedIn) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting to login...</div>;
  }

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
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
  });

  const onSubmitProfile = (data: ProfileFormData) => {
    setProfileError("");
    setProfileSuccess("");
    updateProfile(data, {
      onSuccess: (response) => {
        if (response.data?.user) {
          setUser(response.data.user);
          setProfileSuccess("Profile updated successfully!");
          toast.success("Profile updated!");
        } else {
          setProfileError(response.data?.message || "Failed to update profile.");
        }
      },
      onError: () => {
        setProfileError("An error occurred. Please try again.");
      },
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
      onError: (err) => {
        setPasswordError(apiErrorMessage(err, "Failed to change password."));
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink">My Account</h1>
        <p className="text-slate-500">Manage your profile, orders, and settings</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-ink">{user?.name}</h3>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                </div>
                <Button variant="outline" className="w-full" onClick={logout}>
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="orders">
                <Package className="w-4 h-4 mr-2" />
                My Orders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {profileError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription>{profileError}</AlertDescription>
                    </Alert>
                  )}
                  {profileSuccess && (
                    <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                      <CheckCircle className="w-4 h-4" />
                      <AlertDescription>{profileSuccess}</AlertDescription>
                    </Alert>
                  )}
                  <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" {...registerProfile("name")} disabled={profilePending} />
                        {profileErrors.name && <p className="text-sm text-red-500">{profileErrors.name.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...registerProfile("email")} disabled={profilePending} />
                        {profileErrors.email && <p className="text-sm text-red-500">{profileErrors.email.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" {...registerProfile("phone")} placeholder="01XXXXXXXXX" disabled={profilePending} />
                      {profileErrors.phone && <p className="text-sm text-red-500">{profileErrors.phone.message}</p>}
                    </div>
                    <Button type="submit" disabled={profilePending} className="w-full sm:w-auto">
                      {profilePending ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  {passwordError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription>{passwordError}</AlertDescription>
                    </Alert>
                  )}
                  {passwordSuccess && (
                    <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                      <CheckCircle className="w-4 h-4" />
                      <AlertDescription>{passwordSuccess}</AlertDescription>
                    </Alert>
                  )}
                  <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" {...registerPassword("currentPassword")} disabled={passwordPending} />
                      {passwordErrors.currentPassword && <p className="text-sm text-red-500">{passwordErrors.currentPassword.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <Input id="password" type="password" {...registerPassword("password")} disabled={passwordPending} />
                      {passwordErrors.password && <p className="text-sm text-red-500">{passwordErrors.password.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rePassword">Confirm New Password</Label>
                      <Input id="rePassword" type="password" {...registerPassword("rePassword")} disabled={passwordPending} />
                      {passwordErrors.rePassword && <p className="text-sm text-red-500">{passwordErrors.rePassword.message}</p>}
                    </div>
                    <Button type="submit" disabled={passwordPending} className="w-full sm:w-auto">
                      {passwordPending ? "Changing..." : "Change Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-surface-2 rounded-lg animate-pulse">
                          <div className="w-16 h-16 rounded-lg bg-gray-200" />
                          <div className="flex-1 space-y-3">
                            <div className="h-4 w-3/4 bg-gray-200 rounded" />
                            <div className="h-3 w-1/2 bg-gray-200 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : orders && orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-xl hover:bg-surface-2 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Package className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-ink">Order #{order._id?.slice(-8).toUpperCase()}</p>
                              <p className="text-sm text-slate-500">
                                {order.items?.length || 0} items • {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium",
                              order.status === "delivered" && "bg-green-100 text-green-700",
                              order.status === "shipped" && "bg-blue-100 text-blue-700",
                              order.status === "processing" && "bg-yellow-100 text-yellow-700",
                              order.status === "cancelled" && "bg-red-100 text-red-700",
                              order.status === "pending" && "bg-gray-100 text-gray-700"
                            )}>
                              {order.status}
                            </span>
                            <span className="font-bold text-primary">{order.totalPrice?.toFixed(2)} EGP</span>
                            <Link
                              to={`/orders/${order._id}`}
                              className="text-primary hover:underline text-sm font-medium"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                      <h3 className="text-xl font-semibold text-ink mb-2">No orders yet</h3>
                      <p className="text-slate-500 mb-6">Your order history will appear here.</p>
                      <a href="/products">
                        <Button>Start Shopping</Button>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}