import { MongoClient, type Db } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");

const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

// One client per server instance. Atlas shared tiers can take several seconds to
// complete the handshake with the primary, so the timeouts are deliberately generous.
const client =
  globalForMongo._mongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 20_000,
    connectTimeoutMS: 20_000,
  });

if (!globalForMongo._mongoClient) {
  globalForMongo._mongoClient = client;
  attachDatabasePool(client);
}

/**
 * Ensures the client is connected. connect() is a no-op when already connected,
 * and it reopens the client if a failed auto-connect closed the topology, which
 * would otherwise break every later request on this instance.
 */
export async function ensureMongo(): Promise<void> {
  try {
    await client.connect();
  } catch {
    await client.connect();
  }
}

export const db: Db = client.db(process.env.MONGODB_DB || "pizzahub");
export { client as mongoClient };
