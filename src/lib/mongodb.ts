import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");

const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

const client =
  globalForMongo._mongoClient ??
  new MongoClient(uri, { maxPoolSize: 10, serverSelectionTimeoutMS: 8000 });

if (process.env.NODE_ENV !== "production") globalForMongo._mongoClient = client;

export const db: Db = client.db(process.env.MONGODB_DB || "pizzahub");
export { client as mongoClient };
