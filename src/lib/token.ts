import { authClient } from "./auth-client";

let cached: { token: string; exp: number } | null = null;
let inflight: Promise<string | null> | null = null;

function decodeExp(token: string): number {
  try {
    const part = token.split(".")[1].split("-").join("+").split("_").join("/");
    return JSON.parse(atob(part)).exp * 1000;
  } catch {
    return Date.now() + 60_000;
  }
}

export function clearToken(): void {
  cached = null;
  inflight = null;
}

export async function getToken(force = false): Promise<string | null> {
  if (!force && cached && cached.exp - Date.now() > 60_000) return cached.token;
  if (inflight) return inflight;
  inflight = authClient
    .token()
    .then(({ data }) => {
      if (!data?.token) {
        cached = null;
        return null;
      }
      cached = { token: data.token, exp: decodeExp(data.token) };
      return data.token;
    })
    .catch(() => null)
    .finally(() => {
      inflight = null;
    });
  return inflight;
}
