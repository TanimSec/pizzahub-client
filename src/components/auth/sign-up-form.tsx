"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";
import { clearToken } from "@/lib/token";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/uploads";
import { signUpSchema, type SignUpValues } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { AvatarPicker } from "@/components/shared/avatar-picker";
import { Spinner } from "@/components/shared/spinner";
import { PasswordInput } from "./password-input";
import { RolePicker } from "./role-picker";
import { GoogleButton } from "./google-button";
import { AuthCard, OrDivider } from "./auth-card";

export function SignUpForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [photo, setPhoto] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { role: "customer", name: "", email: "", password: "", businessName: "" },
  });
  const role = watch("role");

  async function onSubmit(values: SignUpValues) {
    setFormError(null);
    const { error } = await signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
      ...(values.role === "vendor" && { businessName: values.businessName }),
    });
    if (error) {
      const message = error.message ?? "Could not create your account";
      setFormError(message);
      toast.error(message);
      return;
    }
    clearToken();
    if (photo) {
      try {
        const url = await uploadImage(photo);
        await api("/api/users/me", { method: "PATCH", body: { image: url } });
      } catch {
        toast.warning("Account created, but the profile photo could not be uploaded. You can add it in Profile Settings.");
      }
    }
    toast.success("Account created. Welcome to PizzaHub!");
    router.replace(callbackUrl);
    router.refresh();
  }

  return (
    <AuthCard
      title="Create your account"
      description="Join PizzaHub to order pizza or sell from your restaurant."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <Controller
        control={control}
        name="role"
        render={({ field }) => (
          <>
            <RolePicker value={field.value} onChange={field.onChange} />
            <GoogleButton callbackURL={callbackUrl} role={field.value} />
          </>
        )}
      />
      <OrDivider />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <AvatarPicker file={photo} onChange={setPhoto} fallback="+" />
        <FormField id="name" label="Full name" error={errors.name?.message}>
          <Input id="name" autoComplete="name" placeholder="Jane Doe" className="h-11" aria-invalid={!!errors.name} {...register("name")} />
        </FormField>
        {role === "vendor" && (
          <FormField id="businessName" label="Restaurant name" error={errors.businessName?.message}>
            <Input id="businessName" placeholder="Slice & Co." className="h-11" aria-invalid={!!errors.businessName} {...register("businessName")} />
          </FormField>
        )}
        <FormField id="email" label="Email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" className="h-11" aria-invalid={!!errors.email} {...register("email")} />
        </FormField>
        <FormField id="password" label="Password" error={errors.password?.message} hint="At least 6 characters with one uppercase and one lowercase letter.">
          <PasswordInput id="password" autoComplete="new-password" placeholder="Create a password" aria-invalid={!!errors.password} {...register("password")} />
        </FormField>
        {formError && (
          <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
            {formError}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Spinner />} Create Account
        </Button>
      </form>
    </AuthCard>
  );
}
