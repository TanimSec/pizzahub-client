import "server-only";
import { API_URL } from "./api";
import { ApiError } from "./api-error";

export async function publicGet<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate } });
  if (!res.ok) throw new ApiError(res.status, "Failed to load data");
  return (await res.json()) as T;
}
