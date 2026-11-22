import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { ObjectId } from "mongodb";
import { db } from "./mongodb";

const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
const SELF_ASSIGNABLE_ROLES = ["vendor", "customer"];

function readCookie(header: string | null | undefined, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db),
  trustedOrigins: [baseURL],
  user: {
    modelName: "users",
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      businessName: { type: "string", required: false, input: true },
      isBlocked: { type: "boolean", required: false, defaultValue: false, input: false },
      subscriptionPlan: { type: "string", required: false, defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
    },
  },
  emailAndPassword: { enabled: true, minPasswordLength: 6, autoSignIn: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          const requested =
            (user as { role?: string }).role ??
            readCookie(ctx?.request?.headers.get("cookie") ?? ctx?.headers?.get("cookie"), "ph_signup_role") ??
            "customer";
          if (!SELF_ASSIGNABLE_ROLES.includes(requested)) {
            throw new APIError("BAD_REQUEST", { message: "Invalid account role" });
          }
          return { data: { ...user, role: requested, isBlocked: false, subscriptionPlan: "free" } };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const id = (session as { userId: string }).userId;
          const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
          const user = await db.collection("users").findOne(filter, { projection: { isBlocked: true } });
          if (user?.isBlocked) {
            throw new APIError("FORBIDDEN", { message: "Your account has been blocked. Contact support." });
          }
        },
      },
    },
  },
  plugins: [
    jwt({
      jwt: {
        issuer: baseURL,
        audience: baseURL,
        expirationTime: "15m",
        definePayload: ({ user }) => ({
          email: user.email,
          role: (user as { role?: string }).role,
        }),
      },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
