import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import { ensureMongo } from "@/lib/mongodb";

const handlers = toNextJsHandler(auth);

async function withDb(req: Request, handler: (req: Request) => Promise<Response>): Promise<Response> {
  try {
    await ensureMongo();
  } catch {
    return Response.json({ message: "Service is temporarily unavailable. Please try again." }, { status: 503 });
  }
  return handler(req);
}

export const GET = (req: Request) => withDb(req, handlers.GET);
export const POST = (req: Request) => withDb(req, handlers.POST);
