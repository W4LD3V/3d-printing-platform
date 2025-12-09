# 3D Printing Platform

A modern web app for managing 3D printing orders. Built with Next.js 15 App Router, GraphQL (Apollo Server/Client), Prisma (SQLite), Tailwind CSS, and NextAuth. Includes admin console for plastics/colors and E2E scaffolding with WebdriverIO + Cucumber.

## Features
- User registration/login with credential auth
- Create orders by submitting 3D model URLs
- Select plastics and colors (admin managed)
- Order history and status updates
- Admin console for materials/colors and all orders
- Responsive, Tailwind-based UI

## Getting Started
1. Install deps:
```bash
npm install
```
2. Copy env and set secrets:
```bash
cp .env.example .env
# set NEXTAUTH_SECRET (use `openssl rand -base64 32`)
```
3. Prisma migrate + seed:
```bash
npx prisma migrate dev --name init
npm run prisma:seed
```
4. Run dev server:
```bash
npm run dev
```

### Default accounts
- Admin: admin@example.com / admin123
- User: user@example.com / user123

## GraphQL
- Endpoint: `/api/graphql`
- Auth: session cookies via NextAuth (Credentials provider).
- Key types: `Order`, `Plastic`, `Color`, `User`
- Example mutation:
```graphql
mutation Create($input: OrderInput!) {
  createOrder(input: $input) { id status modelUrl }
}
```

## Testing
- E2E scaffold: `npm run test:e2e`
  - Uses WebdriverIO + Cucumber + Chromedriver.
  - Set `BASE_URL` to your running dev server (default http://localhost:3000).

## Notes
- State management combines Apollo Client for reads/mutations and SWR for lightweight order history revalidation.
- Prisma schema lives at `prisma/schema.prisma`; seed script at `prisma/seed.ts`.
- Tailwind configuration in `tailwind.config.ts`; global styles in `app/globals.css`.
