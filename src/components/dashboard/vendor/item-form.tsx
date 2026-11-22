"use client";

import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES } from "@/lib/constants";
import { ApiError } from "@/lib/api-error";
import { itemSchema, type ItemValues } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/shared/form-field";
import { ImageUploader } from "@/components/shared/image-uploader";
import { Spinner } from "@/components/shared/spinner";
import { FilterSelect } from "@/components/menu/filter-select";

interface Props {
  defaultValues?: Partial<ItemValues>;
  submitLabel: string;
  onSubmit: (values: ItemValues) => Promise<void>;
  onCancelHref: string;
}

export function ItemForm({ defaultValues, submitLabel, onSubmit, onCancelHref }: Props) {
  const [formError, setFormError] = useState<{ message: string; upgrade: boolean } | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ItemValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: { itemName: "", category: "", description: "", price: undefined, location: "", images: [], ...defaultValues },
  });

  async function submit(values: ItemValues) {
    setFormError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setFormError({ message, upgrade: err instanceof ApiError && err.status === 403 });
    }
  }

  const categoryOptions = [{ value: "", label: "Select a category" }, ...CATEGORIES.map((c) => ({ value: c, label: c }))];

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-6 rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="itemName" label="Item name" error={errors.itemName?.message}>
          <Input id="itemName" placeholder="Margherita Supreme" className="h-11" aria-invalid={!!errors.itemName} {...register("itemName")} />
        </FormField>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <FormField id="category" label="Category" error={errors.category?.message}>
              <FilterSelect id="category" label="" value={field.value} options={categoryOptions} onChange={field.onChange} />
            </FormField>
          )}
        />
        <FormField id="price" label="Price (USD)" error={errors.price?.message}>
          <Input id="price" type="number" step="0.01" min="0" inputMode="decimal" placeholder="12.99" className="h-11" aria-invalid={!!errors.price} {...register("price", { valueAsNumber: true })} />
        </FormField>
        <FormField id="location" label="Location (area / city)" error={errors.location?.message}>
          <Input id="location" placeholder="Brooklyn, NY" className="h-11" aria-invalid={!!errors.location} {...register("location")} />
        </FormField>
      </div>
      <FormField id="description" label="Description" error={errors.description?.message}>
        <Textarea id="description" rows={5} placeholder="Describe the toppings, size and what makes it special" aria-invalid={!!errors.description} {...register("description")} />
      </FormField>
      <Controller
        control={control}
        name="images"
        render={({ field }) => (
          <FormField id="images" label="Item images" error={undefined}>
            <ImageUploader value={field.value} onChange={field.onChange} error={errors.images?.message} />
          </FormField>
        )}
      />
      {formError && (
        <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {formError.message}{" "}
          {formError.upgrade && (
            <Link href="/dashboard/vendor/subscription" className="font-semibold underline">
              Upgrade to Premium
            </Link>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" render={<Link href={onCancelHref} />} nativeButton={false}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner />} {submitLabel}
        </Button>
      </div>
    </form>
  );
}
