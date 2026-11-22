import { ApiError } from "./api-error";
import { getToken } from "./token";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

interface Options {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  formData?: FormData;
  params?: Record<string, string | number | boolean | undefined | null>;
  auth?: boolean;
  signal?: AbortSignal;
}

function buildUrl(path: string, params?: Options["params"]): string {
  const url = new URL(path.startsWith("http") ? path : `${API_URL}${path}`);
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }
  return url.toString();
}

async function send(path: string, opts: Options, token: string | null): Promise<Response> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  try {
    return await fetch(buildUrl(path, opts.params), {
      method: opts.method ?? "GET",
      headers,
      body: opts.formData ?? (opts.body !== undefined ? JSON.stringify(opts.body) : undefined),
      signal: opts.signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new ApiError(0, "Cannot reach the server. Check your connection and try again.");
  }
}

export async function api<T = unknown>(path: string, opts: Options = {}): Promise<T> {
  const needsAuth = opts.auth !== false;
  let token = needsAuth ? await getToken() : null;
  let res = await send(path, opts, token);
  if (res.status === 401 && needsAuth) {
    token = await getToken(true);
    res = await send(path, opts, token);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, (data as { message?: string }).message ?? "Request failed", (data as { details?: unknown }).details);
  }
  return data as T;
}
