"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useVerifyResetCode } from "@/lib/hooks";
import { toast } from "sonner";

const verifyResetCodeSchema = z.object({
  resetCode: z.string().length(6, "Reset code must be 6 digits"),
});

type VerifyResetCodeFormData = z.infer<typeof verifyResetCodeSchema>;

export function VerifyResetCodePage() {
  const navigate = useNavigate();
  const { mutate: verifyResetCode, isPending } = useVerifyResetCode();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyResetCodeFormData>({
    resolver: zodResolver(verifyResetCodeSchema),
  });

  const onSubmit = (data: VerifyResetCodeFormData) => {
    setError("");
    verifyResetCode(data.resetCode, {
      onSuccess: () => {
        toast.success("Code verified successfully!");
        navigate("/resetpassword");
      },
      onError: (err) => {
        setError(err.response?.data?.message || "Invalid or expired code. Please try again.");
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-ink">Verify Reset Code</CardTitle>
          <CardDescription className="text-slate-500">
            Enter the 6-digit code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resetCode">Reset Code</Label>
              <Input
                id="resetCode"
                type="text"
                placeholder="123456"
                maxLength={6}
                {...register("resetCode")}
                disabled={isPending}
                className="text-center text-2xl tracking-widest font-mono"
                aria-invalid={errors.resetCode ? "true" : "false"}
                aria-describedby={errors.resetCode ? "resetcode-error" : undefined}
              />
              {errors.resetCode && (
                <p id="resetcode-error" className="text-sm text-red-500 text-center" role="alert">
                  {errors.resetCode.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isPending}>
              {isPending ? "Verifying..." : "Verify Code"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-slate-500 text-center">
            Didn't receive the code?{" "}
            <Link to="/forgetpassword" className="text-primary hover:underline font-medium">
              Resend Code
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}