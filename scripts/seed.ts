import { ObjectId } from "mongodb";
import { auth } from "../src/lib/auth";
import { db, mongoClient } from "../src/lib/mongodb";
import { customers, DEMO_PASSWORD, items, vendors } from "./seed-data";

const users = db.collection("users");

async function ensureUser(input: { name: string; email: string; password: string; role: "customer" | "vendor"; businessName?: string }) {
  const existing = await users.findOne({ email: input.email });
  if (!existing) {
    await auth.api.signUpEmail({
      body: { name: input.name, email: input.email, password: input.password, role: input.role, businessName: input.businessName } as never,
    });
  }
  const user = await users.findOne({ email: input.email });
  if (!user) throw new Error(`Could not create ${input.email}`);
  if (!(user._id instanceof ObjectId)) {
    throw new Error("users._id is not an ObjectId. The API server expects ObjectId ids; adjust Better Auth id generation.");
  }
  return user;
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
  const user = await ensureUser({ name: "PizzaHub Admin", email, password, role: "customer" });
  await users.updateOne({ _id: user._id }, { $set: { role: "admin", isBlocked: false, emailVerified: true } });
  console.log(`Admin ready: ${email}`);
}

async function seedDemo() {
  const vendorIds = new Map<string, ObjectId>();
  for (const v of vendors) {
    const user = await ensureUser({ name: v.name, email: v.email, password: DEMO_PASSWORD, role: "vendor", businessName: v.businessName });
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    await users.updateOne(
      { _id: user._id },
      { $set: v.premium ? { subscriptionPlan: "premium", subscriptionExpiresAt: expires } : { subscriptionPlan: "free", subscriptionExpiresAt: null } },
    );
    vendorIds.set(v.email, user._id);
  }
  for (const c of customers) await ensureUser({ name: c.name, email: c.email, password: DEMO_PASSWORD, role: "customer" });

  const menuItems = db.collection("menuItems");
  await menuItems.deleteMany({ vendorId: { $in: [...vendorIds.values()] } });
  const now = Date.now();
  await menuItems.insertMany(
    items.map((item, i) => ({
      vendorId: vendorIds.get(item.vendor) as ObjectId,
      itemName: item.itemName,
      category: item.category,
      description: item.description,
      price: item.price,
      location: item.location,
      images: item.images,
      status: "approved",
      createdAt: new Date(now - i * 60 * 60 * 1000),
      updatedAt: new Date(now),
    })),
  );
  console.log(`Seeded ${vendors.length} vendors, ${customers.length} customer and ${items.length} approved menu items`);
}

async function main() {
  await seedAdmin();
  if (process.argv.includes("--admin-only")) return;
  await seedDemo();
}

main()
  .then(() => console.log("Seed complete"))
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoClient.close());
