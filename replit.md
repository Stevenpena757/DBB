# Dallas Beauty Book

## Overview

Dallas Beauty Book is a Pinterest-inspired B2B SaaS platform for Health, Beauty, and Aesthetics businesses in the DFW area. It aims to provide visibility, facilitate content sharing, and connect businesses with clients and suppliers through a visual-first approach. The platform's core value is free visibility through content, with paid subscription tiers for enhanced features and additional revenue from sponsored content and supplier listings. It targets DFW beauty businesses and entrepreneurs, offering a supplier directory and leveraging a masonry grid layout for content discovery.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend uses React with TypeScript, Vite, and Wouter for routing. TanStack Query manages server state and caching. UI is built with shadcn/ui (Radix UI) and styled with Tailwind CSS, featuring a Pinterest-inspired clean aesthetic, masonry grid, mobile-first design, and custom theming for light/dark modes. State management is handled by React Query, React Hook Form with Zod, and Context API.

### Backend Architecture

The backend is built with Express.js and Node.js, using TypeScript. It provides a RESTful API with JSON communication, centralized error handling, and request logging. PostgreSQL is the primary database, managed with Drizzle ORM and hosted on Neon. Authentication uses Replit Auth (OpenID Connect) with session-based management and PostgreSQL storage. Protected API routes and admin-specific middleware provide role-based access control. An Admin Panel supports management of users, businesses, claim requests, moderation queues, and platform analytics, including secure document viewing for claim verification.

### Storage Architecture

The database schema uses serial IDs, text fields, JSONB for structured data, boolean flags, and enums for various categories. Timestamps track creation and expiration. Data access is managed through a storage interface abstraction layer supporting CRUD operations, filtered queries, and analytics.

### AI and Automation

The system integrates OpenAI via Replit AI Integrations (using gpt-5) for content moderation, business listing validation, and managing an admin moderation queue for AI-flagged content.

## External Dependencies

**Database Services:**
- Neon Serverless PostgreSQL
- `connect-pg-simple`

**UI Component Libraries:**
- Radix UI
- Lucide React
- React Icons
- Vaul
- cmdk
- Embla Carousel
- React Day Picker
- Recharts

**Form Management:**
- React Hook Form
- `@hookform/resolvers`
- Zod
- `drizzle-zod`

**Development Tools:**
- tsx
- esbuild
- drizzle-kit

**Styling:**
- Tailwind CSS
- `tailwind-merge`
- clsx
- `class-variance-authority`

**Utilities:**
- date-fns
- nanoid
- ws

**Payment Processing:**
- Stripe

**AI and Automation:**
- OpenAI Integration (via Replit AI Integrations)
- p-limit, p-retry

## Recent Features (November 2025)

### AI-Generated Category Images (November 19, 2025)

Replaced text-only and icon-based category displays with AI-generated product photography that matches the Soft Editorial aesthetic.

**Implementation:**
- Generated 8 custom AI images for beauty categories using OpenAI image generation
- Categories with images: Hair Salon, Nail Salon, Med Spa, Medical Aesthetics, Skincare, Makeup Artist, Lash & Brow, Massage & Wellness
- Image style: Product-focused photography with warm cream backgrounds, forest green accents, professional editorial aesthetic (no people/faces)
- Images stored in: `attached_assets/generated_images/`

**Homepage Updates:**
- Renamed section: "Trending Categories" → "Popular Categories"
- Replaced simple tag-based display with elegant image cards
- Grid layout: 2 columns on mobile, 4 on desktop
- Each card features: Square AI-generated image, hover scale effect (105%), category name in serif font
- Cards link to `/explore` with category filter applied

**Explore Page Updates:**
- Added small circular thumbnail images (6x6 pixels) to category filter buttons
- Thumbnails appear to the left of category text
- Maintains existing selection states (forest green for selected, sand for unselected)
- "All" button correctly displays without image

**Technical Details:**
- Images imported using `@assets` alias for optimal Vite bundling
- No runtime image loading - all assets bundled at build time
- Responsive design with smooth hover transitions (300ms)
- Dark mode compatible
- Maintains SPA navigation using wouter Link components