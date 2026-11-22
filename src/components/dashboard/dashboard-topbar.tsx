"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu, type NavUser } from "@/components/layout/user-menu";
import { roleLabel } from "@/lib/dashboard-nav";

export function DashboardTopbar({ user }: { user: NavUser }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur sm:px-6">
      <SidebarTrigger aria-label="Toggle sidebar" className="size-10" />
      <Separator orientation="vertical" className="h-6" />
      <p className="hidden text-sm font-medium text-muted-foreground sm:block">{roleLabel[user.role]} workspace</p>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
