"use client";

import { useState } from "react";
import { Ban, Eye, Search, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { errorMessage } from "@/lib/api-error";
import { formatDate } from "@/lib/format";
import { useAdminUsers, useBlockUser } from "@/lib/queries/admin";
import type { AppUser } from "@/lib/types";
import { useDebounce } from "@/hooks/use-debounce";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Pager } from "@/components/shared/pager";
import { StatusBadge } from "@/components/shared/status-badge";
import { initials } from "@/components/layout/user-menu";
import { FilterSelect } from "@/components/menu/filter-select";
import { DashboardHeading } from "../dashboard-heading";
import { UserDetailsSheet } from "./user-details-sheet";

const ROLE_OPTIONS = [
  { value: "all", label: "All roles" },
  { value: "vendor", label: "Vendors" },
  { value: "customer", label: "Customers" },
  { value: "admin", label: "Admins" },
];

export function AdminUsersView() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const q = useDebounce(search);
  const { data, isLoading, isError, error, refetch, isFetching } = useAdminUsers({ q: q || undefined, role: role === "all" ? undefined : role, page });
  const block = useBlockUser();
  const [viewing, setViewing] = useState<string | null>(null);
  const [target, setTarget] = useState<AppUser | null>(null);

  async function confirmBlock() {
    if (!target) return;
    try {
      const res = await block.mutateAsync({ id: target.id, isBlocked: !target.isBlocked });
      toast.success(res.message);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setTarget(null);
    }
  }

  return (
    <div className="space-y-6">
      <DashboardHeading title="Manage users" description="Search accounts, review details and block or unblock access." />

      <div className="grid gap-4 rounded-2xl border bg-card p-4 sm:grid-cols-[1fr_14rem]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email"
            aria-label="Search users"
            className="h-11 pl-10"
          />
        </div>
        <FilterSelect
          id="role"
          label=""
          value={role}
          options={ROLE_OPTIONS}
          onChange={(v) => {
            setRole(v);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState title="Could not load users" description={errorMessage(error)} action={<Button onClick={() => refetch()}>Try again</Button>} />
      ) : !data || data.users.length === 0 ? (
        <EmptyState title="No users found" description="Try a different name, email or role filter." />
      ) : (
        <>
          <div className={`overflow-x-auto rounded-2xl border bg-card ${isFetching ? "opacity-70" : ""}`}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={u.image ?? undefined} alt="" />
                          <AvatarFallback>{initials(u.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{u.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{u.role}</TableCell>
                    <TableCell className="capitalize text-muted-foreground">{u.role === "vendor" ? u.subscriptionPlan : "—"}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{u.createdAt ? formatDate(u.createdAt) : "—"}</TableCell>
                    <TableCell>
                      <StatusBadge status={u.isBlocked ? "rejected" : "approved"} className="" />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setViewing(u.id)}>
                          <Eye /> Details
                        </Button>
                        {u.role !== "admin" && (
                          <Button variant={u.isBlocked ? "secondary" : "ghost"} size="sm" className={u.isBlocked ? undefined : "text-destructive"} onClick={() => setTarget(u)}>
                            {u.isBlocked ? <ShieldCheck /> : <Ban />} {u.isBlocked ? "Unblock" : "Block"}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pager page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}

      <UserDetailsSheet userId={viewing} onOpenChange={(o) => !o && setViewing(null)} />
      <ConfirmDialog
        open={!!target}
        onOpenChange={(o) => !o && setTarget(null)}
        title={target?.isBlocked ? "Unblock this user?" : "Block this user?"}
        description={
          target?.isBlocked
            ? `${target?.name} will regain access to protected features.`
            : `${target?.name} will be signed out and cannot use protected features until unblocked.`
        }
        confirmLabel={target?.isBlocked ? "Unblock user" : "Block user"}
        destructive={!target?.isBlocked}
        loading={block.isPending}
        onConfirm={confirmBlock}
      />
    </div>
  );
}
