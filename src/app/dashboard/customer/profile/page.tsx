import type { Metadata } from "next";
import { ProfileForm } from "@/components/profile/profile-form";

export const metadata: Metadata = { title: "Profile Settings" };

export default function CustomerProfilePage() {
  return <ProfileForm />;
}
