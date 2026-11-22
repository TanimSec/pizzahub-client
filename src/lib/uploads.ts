import { api } from "./api";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const { url } = await api<{ url: string }>("/api/uploads/image", { method: "POST", formData });
  return url;
}
