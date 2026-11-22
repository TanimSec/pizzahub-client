import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getOptionalSession } from "@/lib/session";
import type { Role } from "@/lib/types";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const session = await getOptionalSession();
  const u = session?.user as { name: string; email: string; image?: string | null; role?: string } | undefined;
  const initialUser = u
    ? { name: u.name, email: u.email, image: u.image ?? null, role: (u.role ?? "customer") as Role }
    : null;

  return (
    <>
      <Navbar initialUser={initialUser} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
