"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, UserCog } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "@/lib/auth-client";
import { clearToken } from "@/lib/token";
import { profilePath } from "@/lib/nav";
import type { Role } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface NavUser {
  name: string;
  email?: string;
  image?: string | null;
  role: Role;
}

export const initials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "U";

export function UserMenu({ user }: { user: NavUser }) {
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    clearToken();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open profile menu"
        className="flex items-center gap-2 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar size="lg">
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback className="bg-secondary font-semibold text-secondary-foreground">{initials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="truncate text-sm font-semibold text-foreground">{user.name}</span>
            <span className="truncate text-xs font-normal capitalize text-muted-foreground">{user.role}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/dashboard" />}>
          <LayoutDashboard /> Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={profilePath(user.role)} />}>
          <UserCog /> Profile Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
