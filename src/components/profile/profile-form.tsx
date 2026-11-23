"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { errorMessage } from "@/lib/api-error";
import { uploadImage } from "@/lib/uploads";
import { formatDate } from "@/lib/format";
import { useMe, useUpdateProfile } from "@/lib/queries/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AvatarPicker } from "@/components/shared/avatar-picker";
import { FormField } from "@/components/shared/form-field";
import { Spinner } from "@/components/shared/spinner";
import { StatusBadge } from "@/components/shared/status-badge";
import { initials } from "@/components/layout/user-menu";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  businessName: z.string().trim().max(80).optional(),
});
type Values = z.infer<typeof schema>;

export function ProfileForm() {
  const router = useRouter();
  const { data: me, isLoading } = useMe();
  const update = useUpdateProfile();
  const [photo, setPhoto] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: "", businessName: "" } });

  useEffect(() => {
    if (me) reset({ name: me.name, businessName: me.businessName ?? "" });
  }, [me, reset]);

  async function onSubmit(values: Values) {
    if (!me) return;
    setFormError(null);
    if (me.role === "vendor" && (!values.businessName || values.businessName.length < 2)) {
      setFormError("Restaurant name is required for vendors");
      return;
    }
    try {
      const image = photo ? await uploadImage(photo) : undefined;
      await update.mutateAsync({
        name: values.name,
        ...(image && { image }),
        ...(me.role === "vendor" && { businessName: values.businessName }),
      });
      setPhoto(null);
      await authClient.getSession({ query: { disableCookieCache: true } });
      router.refresh();
      toast.success("Profile updated");
    } catch (err) {
      const message = errorMessage(err);
      setFormError(message);
      toast.error(message);
    }
  }

  if (isLoading || !me) return <Skeleton className="mx-auto h-96 max-w-2xl" />;

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Profile settings</CardTitle>
        <CardDescription>Update how you appear on PizzaHub. Your role and plan can only be changed through the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          <AvatarPicker file={photo} onChange={setPhoto} currentUrl={me.image} fallback={initials(me.name)} />
          <FormField id="name" label="Full name" error={errors.name?.message}>
            <Input id="name" className="h-11" aria-invalid={!!errors.name} {...register("name")} />
          </FormField>
          {me.role === "vendor" && (
            <FormField id="businessName" label="Restaurant name" error={errors.businessName?.message}>
              <Input id="businessName" className="h-11" {...register("businessName")} />
            </FormField>
          )}
          <FormField id="email" label="Email" hint="Your email is managed by your sign-in method and cannot be changed here.">
            <Input id="email" value={me.email} readOnly disabled className="h-11" />
          </FormField>
          <dl className="grid gap-4 rounded-xl bg-muted/60 p-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Role</dt>
              <dd className="font-semibold capitalize">{me.role}</dd>
            </div>
            {me.role === "vendor" && (
              <div>
                <dt className="text-muted-foreground">Plan</dt>
                <dd className="font-semibold capitalize">{me.subscriptionPlan}</dd>
              </div>
            )}
            {me.createdAt && (
              <div>
                <dt className="text-muted-foreground">Member since</dt>
                <dd className="font-semibold">{formatDate(me.createdAt)}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted-foreground">Account</dt>
              <dd>
                <StatusBadge status={me.isBlocked ? "rejected" : "approved"} label={me.isBlocked ? "Blocked" : "Active"} />
              </dd>
            </div>
          </dl>
          {formError && (
            <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
              {formError}
            </p>
          )}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || (!isDirty && !photo)}>
              {isSubmitting && <Spinner />} Save changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
