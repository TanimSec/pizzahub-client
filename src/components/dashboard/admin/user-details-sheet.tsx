"use client";

import { formatDate } from "@/lib/format";
import { useAdminUser } from "@/lib/queries/admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { initials } from "@/components/layout/user-menu";

interface Props {
  userId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsSheet({ userId, onOpenChange }: Props) {
  const { data, isLoading } = useAdminUser(userId);
  const user = data?.user;

  return (
    <Sheet open={!!userId} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl">User details</SheetTitle>
          <SheetDescription>Account information and activity</SheetDescription>
        </SheetHeader>
        <div className="space-y-6 overflow-y-auto px-4 pb-6">
          {isLoading || !user ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <>
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback className="text-lg font-semibold">{initials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold">{user.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Role</dt>
                  <dd className="font-semibold capitalize">{user.role}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Account</dt>
                  <dd>
                    <StatusBadge status={user.isBlocked ? "rejected" : "approved"} />
                    <span className="ml-2 text-xs text-muted-foreground">{user.isBlocked ? "Blocked" : "Active"}</span>
                  </dd>
                </div>
                {user.role === "vendor" && (
                  <>
                    <div>
                      <dt className="text-muted-foreground">Restaurant</dt>
                      <dd className="font-semibold">{user.businessName ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Plan</dt>
                      <dd className="font-semibold capitalize">{user.subscriptionPlan}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Menu items</dt>
                      <dd className="font-semibold">{data.itemCount}</dd>
                    </div>
                  </>
                )}
                <div>
                  <dt className="text-muted-foreground">Related orders</dt>
                  <dd className="font-semibold">{data.orderCount}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Joined</dt>
                  <dd className="font-semibold">{user.createdAt ? formatDate(user.createdAt) : "—"}</dd>
                </div>
              </dl>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
