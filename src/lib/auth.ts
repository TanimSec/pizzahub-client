import { betterAuth } from "better-auth";
import { addOAuthServerContext, APIError, createAuthMiddleware, getOAuthState } from "better-auth/api";
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
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Google sign-in: remember which account type the visitor chose on the sign-up page.
      // The value is validated against an allow-list (never "admin") and stored in the OAuth state,
      // so it survives the redirect to Google without depending on browser cookies.
      if (ctx.path === "/sign-in/social") {
        const chosen = (ctx.body?.additionalData as { signupRole?: string } | undefined)?.signupRole;
        if (chosen && SELF_ASSIGNABLE_ROLES.includes(chosen)) await addOAuthServerContext({ signupRole: chosen });
        return;
      }
      if (ctx.path !== "/sign-up/email") return;
      const password = String(ctx.body?.password ?? "");
      if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message: "Password needs at least 6 characters, one uppercase and one lowercase letter",
        });
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          const oauthState = await getOAuthState().catch(() => null);
          const roleFromOAuth = (oauthState?.serverContext as { signupRole?: string } | undefined)?.signupRole;
          const fromEmailForm = ctx?.path === "/sign-up/email" ? (user as { role?: string }).role : undefined;
          const requested =
            fromEmailForm ??
            roleFromOAuth ??
            readCookie(ctx?.request?.headers.get("cookie") ?? ctx?.headers?.get("cookie"), "ph_signup_role") ??
            "customer";
          console.info(
            "[auth] new account role:",
            requested,
            "| source:",
            fromEmailForm ? "form" : roleFromOAuth ? "oauth-state" : "default-or-cookie",
          );
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
