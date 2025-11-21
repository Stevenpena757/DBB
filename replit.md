# Dallas Beauty Book

## Overview

Dallas Beauty Book is a Pinterest-inspired B2B SaaS platform for Beauty, Aesthetics, and Wellness businesses in the DFW area. It aims to provide visibility, facilitate content sharing, and connect businesses with clients and suppliers through a visual-first approach. The platform's core value is free visibility through content, with paid subscription tiers for enhanced features and additional revenue from sponsored content and supplier listings. It targets DFW beauty businesses and entrepreneurs, offering a supplier directory and leveraging a masonry grid layout for content discovery.

## User Preferences

- Preferred communication style: Simple, everyday language
- Terminology: Use "connection" instead of "hub"; always order as "Beauty, Aesthetics, and Wellness" (not "Health, Beauty, and Aesthetics" or "Beauty, Wellness, and Aesthetics")

## System Architecture

### Frontend Architecture

The frontend uses React with TypeScript, Vite, and Wouter for routing. TanStack Query manages server state and caching. UI is built with shadcn/ui (Radix UI) and styled with Tailwind CSS, featuring a Pinterest-inspired clean aesthetic, masonry grid, mobile-first design, and custom theming for light/dark modes. State management is handled by React Query, React Hook Form with Zod, and Context API.

### Backend Architecture

The backend is built with Express.js and Node.js, using TypeScript. It provides a RESTful API with JSON communication, centralized error handling, and request logging. PostgreSQL is the primary database, managed with Drizzle ORM and hosted on Neon. Authentication uses Replit Auth (OpenID Connect) with session-based management and PostgreSQL storage. Protected API routes and admin-specific middleware provide role-based access control. An Admin Panel supports management of users, businesses, claim requests, moderation queues, and platform analytics, including secure document viewing for claim verification.

### Storage Architecture

The database schema uses serial IDs, text fields, JSONB for structured data, boolean flags, and enums for various categories. Timestamps track creation and expiration. Data access is managed through a storage interface abstraction layer supporting CRUD operations, filtered queries, and analytics. Foreign key constraints utilize CASCADE or SET NULL for data integrity.

### AI and Automation

The system integrates OpenAI via Replit AI Integrations (using gpt-5) for content moderation, business listing validation, and managing an admin moderation queue for AI-flagged content.

### Key Features

- **Personalized Discovery Flow ("Create Your Dallas Beauty Book"):** A 5-step form-based flow capturing user preferences for tailored business recommendations. Features a responsive two-column layout with sticky image on desktop, mobile-first design with hidden image on mobile. Uses type-safe chip toggle functions for enhance areas and vibes with proper React Hook Form state management.
- **Dynamic Content & Layouts:** Homepage reorganization with dynamic business listings and community content, utilizing AI-generated category images. Homepage features a 2-column grid for feature cards: "Ask the Community" and "Create Your Beauty Book".
- **Admin Delete Functionality:** Comprehensive delete capabilities in the admin console for users and businesses with CASCADE deletion and confirmation dialogs.

### Recent Changes (November 2025)

**Personal Profile System (Completed):**
- **Database Schema:** Added 3 new tables for user engagement:
  - `user_business_follows`: Track business follows with unique constraint on (userId, businessId)
  - `user_goals`: Beauty/wellness goals with categories, completion tracking, and target dates
  - `user_promotions`: Personalized offers with business association, validity tracking, and usage status
- **User Profile Page:** Comprehensive profile at /profile with 4 tabs:
  - Overview: Beauty Book responses, recent community activity
  - Goals: Create, track, and complete beauty goals with 7 categories (skin, hair, body, wellness, beauty, fitness, other)
  - Following: Grid of followed businesses with direct navigation
  - Promotions: View and claim personalized offers
- **Follow System:** FollowButton component integrated into business pages:
  - Unauthenticated users see "Sign in to Follow" with redirect to login
  - Authenticated users can follow/unfollow with real-time UI updates
  - Denormalized queries to avoid N+1 performance issues
- **API Routes:** 17 new endpoints for follows, goals, promotions, and profile data
  - All routes protected with Replit Auth middleware
  - Comprehensive Zod validation on all mutations
  - Optimized queries with JOINs for performance
- **Login Encouragement:** All protected features show login prompts instead of hiding from unauthenticated users

**Beauty Book → Profile Integration (Completed):**
- **Wizard Flow:** "Create Your Dallas Beauty Book" at /my-beauty-book automatically links to user account
  - Authenticated users: Beauty Book auto-linked to userId during creation
  - Unauthenticated users: Beauty Book saved to localStorage, claimed after login
  - Success screen shows "Save to Profile" CTA for unauthenticated users
- **Auto-Claim System:** When user logs in, profile automatically claims pending Beauty Book
  - localStorage tracking of pendingBeautyBookId
  - PATCH /api/beauty-book/:uuid/claim endpoint with ownership verification
  - Returns 403 if trying to claim another user's Beauty Book
  - Idempotent - safe to call multiple times
- **Profile Display:** Beauty Book preferences shown in Profile Overview tab
  - Displays location, enhancement areas, vibe preferences, and routine frequency
  - Created date shown with card
- **Security:** Claim endpoint verifies Beauty Book is unclaimed (userId=null) or already belongs to requesting user

**Beauty Book Enhancement:**
- Added quiz-notebook-brush.jpg image to Create Your Beauty Book page
- Implemented responsive two-column grid layout (form left, image right)
- Image sticky positioning on desktop, hidden on mobile
- Type-safe chip toggle functions (toggleEnhanceArea, toggleVibe) with proper form state management

**Quiz Feature Removal:**
- Completely removed Beauty Match Quiz feature from platform
- Deleted Quiz.tsx page component (377 lines)
- Removed /quiz route from App.tsx (returns 404)
- Removed Quiz card from homepage
- Removed orphaned Quiz API endpoints (POST/GET /api/quiz) from server/routes.ts
- Updated homepage layout from 3-column to 2-column grid for feature cards

**TLDR V2 Optimization (November 2025):**
- **Homepage Simplification:** Shortened all copy, one-line "How It Works" steps, limited content grids to 4 items with "View all" links
- **Welcome Modal:** Concise messaging with two clear paths (exploring services vs running a business)
- **Content Rewards Messaging:** Added incentives for user and business content submission throughout platform
- **Data Insights:** Condensed to single future-focused paragraph about anonymized insights

**TLDR V3 Guided Flows (November 2025):**
- **Two-Persona Homepage:** Clear separation for users (locals) and businesses (pros)
  - Hero: "Where DFW Beauty Meets Community" with streamlined copy
  - "I'm here to..." CTA strip: Quick path selection (Discover services / Promote business)
  - "Start Here" split section: Side-by-side cards for locals vs professionals with distinct 3-step journeys
  - Section reordering: Hero → CTA strip → How It Works → Start Here split → Beauty Book → Browse → Community
- **Welcome Modal Enhancement:** Stacked button layout with clearer CTAs:
  - "I'm looking for beauty services" → /my-beauty-book
  - "I run or manage a beauty business" → /for-professionals
  - "Just browse for now" → close modal
- **How It Works:** Ultra-concise one-liners:
  - "Answer a few questions to create your Beauty Book."
  - "We match you with DFW beauty pros and categories."
  - "Explore, save, and join the community."
- **Monetization Clarity:** Explicit messaging about claiming listings, content submission rewards, and future data/insights value

**Business Dashboard (November 2025):**
- **New Feature:** Comprehensive dashboard at /business-dashboard for claimed businesses
  - Shows follower count, average rating, and positive review metrics
  - Three tabs: Followers, Reviews, Send Promotions
  - Followers tab displays users following the business with join dates
  - Reviews tab shows all reviews with 4-5 star reviews highlighted
  - Send Promotions tab enables targeted offers to followers and positive reviewers
- **Database Schema:** Added business_reviews table with rating (1-5), title, review text, helpful count
- **API Enhancements:**
  - Fixed critical route ordering: GET /api/businesses/claimed now before /:id route
  - Added POST /api/follows with authorization (users follow as themselves, admins can follow as any user)
  - Review creation automatically updates business average rating and count via SQL aggregation
  - All dashboard endpoints verify business ownership before returning sensitive data
- **Performance Optimization:** Review rating calculation uses SQL aggregation instead of fetching all reviews (O(1) vs O(n))
- **Storage Methods:** getClaimedBusinessesByUser, getBusinessFollowers, getReviewsByBusiness, getPositiveReviewsByBusiness, createBusinessReview

**Mobile Navigation Update (November 2025):**
- **Removed "Shop" tab** from mobile bottom navigation bar (feature not implemented)
- **Mobile navigation now has 4 tabs:**
  - Home: Navigate to homepage
  - Explore: Browse businesses and content
  - Community: Access the forum
  - Saved: View saved items
- Updated grid layout from 5 columns to 4 columns for even spacing
- Located in Footer.tsx component, visible only on mobile devices (hidden on desktop)

## Email Verification Note

**Deferred Email Verification:** Email verification codes are not currently implemented. The Beauty Book wizard validates that emails are from major providers (Gmail, Yahoo, Outlook, iCloud, ProtonMail, etc.) to ensure data quality. Future implementation could add verification codes via Resend or SendGrid integration. User dismissed Resend integration during initial setup.

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