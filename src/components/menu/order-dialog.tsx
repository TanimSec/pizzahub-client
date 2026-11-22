"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { errorMessage } from "@/lib/api-error";
import { useCreateOrder } from "@/lib/queries/orders";
import { orderSchema, todayString, type OrderValues } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "@/components/shared/form-field";
import { Spinner } from "@/components/shared/spinner";

export function OrderDialog({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const createOrder = useCreateOrder();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: { deliveryDate: "", deliveryAddress: "", message: "" },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setPlaced(false);
      setFormError(null);
      reset();
    }
  }

  async function onSubmit(values: OrderValues) {
    setFormError(null);
    try {
      await createOrder.mutateAsync({ itemId: item._id, ...values, message: values.message ?? "" });
      setPlaced(true);
      toast.success("Order placed! The restaurant will review it shortly.");
    } catch (err) {
      const message = errorMessage(err);
      setFormError(message);
      toast.error(message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="lg" className="w-full sm:w-auto" />}>
        <ShoppingBag /> Order Now
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {placed ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="size-14 text-success" />
            <DialogTitle className="text-2xl">Order placed!</DialogTitle>
            <DialogDescription>
              Your order for {item.itemName} is pending. You will see the status change in My Orders once the restaurant responds.
            </DialogDescription>
            <DialogFooter className="mt-2 w-full sm:justify-center">
              <ButtonLink href="/dashboard/customer/orders">View My Orders</ButtonLink>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Keep browsing
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-2xl">Place your order</DialogTitle>
              <DialogDescription>
                {item.itemName} · {formatPrice(item.price)}
              </DialogDescription>
            </DialogHeader>
            <FormField id="deliveryDate" label="Delivery date" error={errors.deliveryDate?.message}>
              <Input id="deliveryDate" type="date" min={todayString()} className="h-11" aria-invalid={!!errors.deliveryDate} {...register("deliveryDate")} />
            </FormField>
            <FormField id="deliveryAddress" label="Delivery address" error={errors.deliveryAddress?.message}>
              <Textarea id="deliveryAddress" rows={2} placeholder="Street, apartment, city" aria-invalid={!!errors.deliveryAddress} {...register("deliveryAddress")} />
            </FormField>
            <FormField id="message" label="Additional message / special instructions" optional error={errors.message?.message}>
              <Textarea id="message" rows={3} placeholder="Extra cheese, no onions, ring the bell twice..." {...register("message")} />
            </FormField>
            {formError && (
              <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                {formError}
              </p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createOrder.isPending}>
                {createOrder.isPending && <Spinner />} Place Order
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
