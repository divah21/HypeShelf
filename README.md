# HypeShelf

**Collect and share the stuff you're hyped about.**

HypeShelf is a shared recommendations hub where friends log in and share their favorite movies in one clean, public shelf.

## Features

- **Public Shelf** — Browse the latest recommendations without signing in
- **Add Recommendations** — Signed-in users can add a title, genre, link, and short blurb
- **Genre Filtering** — Filter recommendations by horror, action, comedy, drama, sci-fi, and more
- **Staff Picks** — Admins can highlight standout recommendations with a Staff Pick badge
- **Role-Based Access** — Two roles (admin and user) with enforced permissions on both client and server
- **User Dashboard** — Sidebar navigation with all recommendations, personal shelf, and profile management
- **Admin Dashboard** — Overview stats, user management, all listings moderation, and analytics

## Tech Stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Framework      | [Next.js](https://nextjs.org/) (App Router)     |
| Authentication | [Clerk](https://clerk.com/)                     |
| Database       | [Convex](https://convex.dev/)                   |
| Styling        | [Tailwind CSS](https://tailwindcss.com/) v4     |
| UI Components  | [shadcn/ui](https://ui.shadcn.com/)             |
| Language       | TypeScript                                      |

## Project Structure

```
app/                    → Next.js App Router pages
  page.tsx              → Public home page
  dashboard/            → User dashboard (sidebar layout)
    page.tsx            → All recommendations
    my-recommendations/ → User's own recommendations
    profile/            → Profile management
  admin/                → Admin dashboard (sidebar layout, role-gated)
    page.tsx            → Overview & stats
    users/              → User management
    recommendations/    → All listings moderation
    analytics/          → Usage analytics
components/             → Shared React components
  dashboard-sidebar.tsx → User sidebar navigation
  admin-sidebar.tsx     → Admin sidebar navigation
  recommendation-card.tsx
  add-recommendation-form.tsx
  genre-filter.tsx
  genre-badge.tsx
  ui/                   → shadcn/ui primitives
convex/                 → Convex backend
  schema.ts             → Database schema
  recommendations.ts    → Recommendation queries & mutations
  users.ts              → User queries & mutations
  auth.config.ts        → Clerk ↔ Convex auth config
middleware.ts           → Clerk route protection
```

## Roles & Permissions

| Action                        | User | Admin |
| ----------------------------- | ---- | ----- |
| View public recommendations   | ✓    | ✓     |
| Add a recommendation          | ✓    | ✓     |
| Delete own recommendation     | ✓    | ✓     |
| Delete any recommendation     | ✗    | ✓     |
| Toggle Staff Pick             | ✗    | ✓     |
| Manage users & roles          | ✗    | ✓     |
| Access admin dashboard        | ✗    | ✓     |

All permissions are enforced server-side in Convex mutations, not just in the UI.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A [Clerk](https://clerk.com/) account
- A [Convex](https://convex.dev/) account

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/divah21/HypeShelf.git
   cd HypeShelf
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root:

   ```env
   NEXT_PUBLIC_CONVEX_URL=<your-convex-deployment-url>
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
   CLERK_SECRET_KEY=<your-clerk-secret-key>
   CLERK_JWT_ISSUER_DOMAIN=<your-clerk-jwt-issuer-domain>
   ```

4. **Push the Convex schema**

   ```bash
   npx convex dev
   ```

5. **Start the dev server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Security

- Route protection via Clerk middleware for `/dashboard` and `/admin` routes
- Server-side role checks in every Convex mutation
- Admin dashboard has a client-side role guard with a server-enforced fallback
- Users can only delete their own recommendations; admins can delete any

## License

This project is for educational and demonstration purposes.
