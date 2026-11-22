# PizzaHub

PizzaHub is a pizza ordering and delivery platform. Customers discover local pizzerias, browse menus and place orders. Vendors publish menu items and manage incoming orders. Admins moderate users, menu items and subscription payments.

- **Live site:** https://pizzahub-client-alpha-hazel.vercel.app
- **Live API:** https://pizzahub-server-orpin.vercel.app
- **Client repository:** https://github.com/TanimSec/pizzahub-client
- **Server repository:** https://github.com/TanimSec/pizzahub-server

## Features

- Email/password and Google sign-in (Better Auth), role chosen at sign-up (Vendor or Customer). Admin accounts are never created through public registration.
- Role-based dashboards for Customer, Vendor and Admin with sidebar navigation, statistic cards and charts. Wrong-role URLs are redirected on the server.
- Public Browse Menu with search, category and location filters, price range, price sorting and pagination.
- Item details with image gallery, order dialog (delivery date, address, instructions), duplicate and self-order protection.
- Vendor: add, edit, delete and hide items (image upload through the API, hosted on Cloudinary or ImgBB), accept or reject orders, Free vs Premium subscription through Stripe Checkout.
- Customer: order tracking with status timeline, cancel pending orders, favorites.
- Admin: search users, block and unblock, review and moderate menu items, read-only transactions.
- Light and dark mode, Motion animations that respect reduced-motion, custom 404 and error pages, loading and empty states, toast notifications.

## Tech stack

next, react, typescript, tailwindcss, shadcn/ui (base-ui), better-auth, mongodb, @tanstack/react-query, react-hook-form, zod, @hookform/resolvers, motion, next-themes, recharts, lucide-react, date-fns, sonner, tsx

## Installation

```bash
git clone https://github.com/TanimSec/pizzahub-client.git
cd pizzahub-client
npm install
cp .env.example .env.local   # fill in the values
```

## Run locally

Start the API server first (see the server repository), then:

```bash
npm run dev        # http://localhost:3000
npm run build      # production build
```

Create the admin account and demo data (uses `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env.local`):

```bash
npm run seed
node --env-file=.env.local --import tsx scripts/seed.ts --admin-only   # admin only
```

Demo accounts created by the full seed use the password `Pizza123`: `giuseppe@pizzahub.demo` (Premium vendor), `sofia@pizzahub.demo`, `marco@pizzahub.demo`, `customer@pizzahub.demo`. Seed item photos point at Unsplash; replace them with your own images through the vendor dashboard.

## Environment variables

| Name | Purpose |
|---|---|
| BETTER_AUTH_SECRET | Secret used to sign sessions |
| BETTER_AUTH_URL | Public URL of this app (also the JWT issuer and audience) |
| NEXT_PUBLIC_APP_URL | Public URL of this app for the auth client |
| MONGODB_URI, MONGODB_DB | MongoDB connection shared with the API |
| GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET | Google OAuth credentials |
| NEXT_PUBLIC_API_URL | Base URL of the Express API |
| NEXT_PUBLIC_PREMIUM_PRICE_LABEL | Display label for the Premium price |
| ADMIN_EMAIL, ADMIN_PASSWORD | Used only by the seed script |

Only `.env.example` is committed. Secrets belong in `.env.local` or the hosting dashboard.

## Challenge implementation notes

### Advanced search and sorting

The Browse Menu keeps all filters in the URL so results are shareable and survive reloads. The page calls `GET /api/menu` with:

| Query | Meaning |
|---|---|
| q | Name, description, location or category text (debounced 350 ms) |
| category | One of the six categories |
| location | Area or city |
| minPrice, maxPrice | Inclusive price range |
| sort | `price_asc`, `price_desc` or `newest` |
| page, limit | Pagination (12 per page) |

The API runs one aggregation (`$match`, vendor `$lookup`, `$facet` for items and total) and only returns approved items.

### JWT verification flow

1. Better Auth runs inside this Next.js app and sets the session cookie on the same origin, so reloads keep users signed in.
2. The Better Auth JWT plugin signs short-lived (15 min) tokens and publishes a JWKS at `/api/auth/jwks`.
3. The client fetches a token with `authClient.token()`, caches it in memory until one minute before expiry and sends it as `Authorization: Bearer`. A 401 triggers one token refresh and retry.
4. The Express API verifies signature, issuer, audience and expiry against the JWKS, loads the user fresh from MongoDB, rejects blocked users with 403, then applies role middleware. Invalid or expired tokens receive 401.

### Route protection

- `proxy.ts` redirects visitors without a session cookie from private paths to `/sign-in?callbackUrl=...` (optimistic check).
- Server layouts call `auth.api.getSession` and `requireRole`, so a Customer opening `/dashboard/admin` is redirected to their own dashboard. This runs on every request, including reloads.
- The API repeats role verification on every protected endpoint.

### Payment flow

The Upgrade button asks the API for a Stripe Checkout Session. Premium is activated only by the verified Stripe webhook. The success page merely polls the webhook-recorded status. Customer orders do not use Stripe.

## Testing payments

Use Stripe test mode with card `4242 4242 4242 4242`, any future expiry and any CVC.
