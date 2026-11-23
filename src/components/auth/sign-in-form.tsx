"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { clearToken } from "@/lib/token";
import { signInSchema, type SignInValues } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { Spinner } from "@/components/shared/spinner";
import { PasswordInput } from "./password-input";
import { GoogleButton } from "./google-button";
import { AuthCard, OrDivider } from "./auth-card";

export function SignInForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  async function onSubmit(values: SignInValues) {
    setFormError(null);
    const { error } = await signIn.email({ email: values.email, password: values.password });
    if (error) {
      const message = error.message ?? "Invalid email or password";
      setFormError(message);
      toast.error(message);
      return;
    }
    clearToken();
    toast.success("Welcome back!");
    // No router.refresh() here: it re-runs the auth layout, which would redirect to the dashboard
    // and override the return URL. Navigating to a dynamic route already fetches fresh data.
    router.replace(callbackUrl);
  }

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to order your favorite pizza or manage your restaurant."
      footer={
        <>
          New to PizzaHub?{" "}
          <Link href="/sign-up" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <GoogleButton callbackURL={callbackUrl} />
      <OrDivider />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField id="email" label="Email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" className="h-11" aria-invalid={!!errors.email} {...register("email")} />
        </FormField>
        <FormField id="password" label="Password" error={errors.password?.message}>
          <PasswordInput id="password" autoComplete="current-password" placeholder="Your password" aria-invalid={!!errors.password} {...register("password")} />
        </FormField>
        {formError && (
          <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
            {formError}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Spinner />} Sign In
        </Button>
      </form>
    </AuthCard>
  );
}
