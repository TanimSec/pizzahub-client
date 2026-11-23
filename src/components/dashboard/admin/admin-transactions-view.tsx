"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { errorMessage } from "@/lib/api-error";
import { formatDate, formatPrice } from "@/lib/format";
import { useAdminTransactions } from "@/lib/queries/admin";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { Pager } from "@/components/shared/pager";
import { StatusBadge } from "@/components/shared/status-badge";
import { FilterSelect } from "@/components/menu/filter-select";
import { DashboardHeading } from "../dashboard-heading";
import { RecordCard, RecordList } from "../record-card";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "canceled", label: "Canceled" },
];

export function AdminTransactionsView() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching } = useAdminTransactions({ status: status === "all" ? undefined : status, page });

  return (
    <div className="space-y-6">
      <DashboardHeading
        title="Transactions"
        description="Subscription payments recorded from verified Stripe events."
        action={
          <p className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
            <Lock className="size-3.5" /> Read-only records
          </p>
        }
      />
      <div className="max-w-xs">
        <FilterSelect id="tx-status" label="Status" value={status} options={STATUS_OPTIONS} onChange={(v) => { setStatus(v); setPage(1); }} />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState title="Could not load transactions" description={errorMessage(error)} action={<Button onClick={() => refetch()}>Try again</Button>} />
      ) : !data || data.transactions.length === 0 ? (
        <EmptyState title="No transactions yet" description="Payments appear here after vendors subscribe to Premium." />
      ) : (
        <>
          <div className={`hidden overflow-x-auto rounded-2xl border bg-card xl:block ${isFetching ? "opacity-70" : ""}`}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.transactions.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell>
                      <p className="font-medium">{t.vendor?.businessName || t.vendor?.name || "Unknown vendor"}</p>
                      <p className="text-xs text-muted-foreground">{t.vendor?.email}</p>
                    </TableCell>
                    <TableCell className="capitalize">{t.plan}</TableCell>
                    <TableCell className="font-semibold">{formatPrice(t.amount, t.currency.toUpperCase())}</TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(t.createdAt, "MMM d, yyyy h:mm a")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <RecordList className={isFetching ? "opacity-70" : ""}>
            {data.transactions.map((t) => (
              <RecordCard
                key={t._id}
                title={t.vendor?.businessName || t.vendor?.name || "Unknown vendor"}
                subtitle={t.vendor?.email}
                badge={<StatusBadge status={t.status} />}
                fields={[
                  { label: "Plan", value: <span className="capitalize">{t.plan}</span> },
                  { label: "Amount", value: formatPrice(t.amount, t.currency.toUpperCase()) },
                  { label: "Date", value: formatDate(t.createdAt, "MMM d, yyyy h:mm a"), wide: true },
                ]}
              />
            ))}
          </RecordList>
          <Pager page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
