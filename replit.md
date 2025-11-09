# Dallas Beauty Book

## Overview

Dallas Beauty Book is a Pinterest-inspired B2B SaaS platform built FOR DFW's Health, Beauty, and Aesthetics businesses and entrepreneurs. This is their platform to gain visibility, share expertise, and grow their business. The application provides a clean, visual-first interface where businesses can discover clients through content creation, connect with suppliers, and build their brand. The platform follows Pinterest's proven design principles with a masonry grid layout, subtle interactions, and a focus on visual content.

**Platform Positioning:**
- Primary Customers: Beauty businesses and entrepreneurs in the DFW area
- Supplier Directory: A feature that SERVES businesses by helping them find and connect with suppliers (equipment, products, supplies)
- Core Value Proposition: FREE visibility through content sharing, with paid tiers for enhanced features

**Monetization Strategy:**
The platform implements a three-tier subscription model (Free, Pro $29/mo, Premium $99/mo) that preserves the core promise of FREE visibility through content creation. Revenue streams include:
- Subscription tiers with enhanced features for businesses
- Sponsored content placements for premium visibility in the feed
- Supplier listings connecting businesses with vendors (20% commission free tier, 15% pro, 10% premium)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching

**UI Component System:**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for component variant management
- Custom theming system supporting light/dark modes

**Design System:**
- Pinterest-inspired clean aesthetic with pure white backgrounds
- Masonry grid layout for visual content discovery
- System font stack for optimal performance
- Subtle hover and active states with elevation effects
- Mobile-first responsive design with fixed bottom navigation on mobile

**State Management:**
- React Query for all API data fetching and caching with infinite stale time
- React Hook Form with Zod validation for form state
- Context API for theme management
- Local component state for UI interactions

### Backend Architecture

**Server Framework:**
- Express.js running on Node.js
- TypeScript for type safety across the stack
- HTTP server for serving both API routes and static assets

**API Design:**
- RESTful API endpoints organized by resource type
- JSON request/response format
- Query parameter-based filtering for businesses (category, location)
- Centralized error handling and request logging middleware

**Database Layer:**
- PostgreSQL as the primary database
- Drizzle ORM for type-safe database queries and schema management
- Neon serverless PostgreSQL for scalable database hosting
- WebSocket-based connection pooling

**Authentication System:**
- Replit Auth integration with OpenID Connect (OIDC)
- Session-based authentication using express-session with PostgreSQL storage
- Conditional cookie security (secure: false in development, secure: true in production)
- User profile management with automatic creation/update on login
- Protected API routes using isAuthenticated middleware
- Frontend auth state management via useAuth hook with TanStack Query
- Graceful handling of unauthorized responses (401s treated as logged-out state)

**Data Models:**
- Users: Platform users authenticated via Replit Auth with profile info (username, email, profileImage)
- Businesses: Core entity with category, location, contact info, social media links, subscription tier (free/pro/premium), sponsored status, and upvote tracking
- Articles: Long-form content with excerpts, categories, and view tracking
- How-Tos: Step-by-step guides with structured step arrays
- Vendors: Product suppliers with ratings, product type listings, subscription tier, and commission rates
- Vendor Products: Individual products linked to vendors
- Saves: User bookmarks for businesses and content (linked to user accounts)
- Posts: Social media-style updates from businesses
- Claim Requests: Business ownership verification workflow
- Sessions: PostgreSQL session storage for authentication (managed by express-session)

### Storage Architecture

**Database Schema:**
- Serial IDs for all primary keys
- Text fields for flexible content storage
- JSONB fields for structured data (steps in how-tos, hours of operation)
- Boolean flags for featured status, verification, and sponsored status
- Subscription tier enum (free, pro, premium) for businesses and vendors
- Integer fields for upvote counts and commission rates
- Timestamp fields for creation tracking, sorting, and sponsored content expiration
- Predefined enums for categories and DFW locations

**Data Access Pattern:**
- Storage interface abstraction layer for database operations
- CRUD operations for all resource types
- Filtered queries supporting category and location filters
- Special queries for featured content and related items
- View count incrementing for article analytics

### External Dependencies

**Database Services:**
- Neon Serverless PostgreSQL: Cloud-hosted PostgreSQL database with WebSocket support
- connect-pg-simple: PostgreSQL session store for Express sessions

**UI Component Libraries:**
- Radix UI: Unstyled, accessible component primitives (20+ component packages)
- Lucide React: Icon library for consistent iconography
- React Icons: Additional icon sets (specifically TikTok icon)
- Vaul: Drawer component for mobile interactions
- cmdk: Command palette component
- Embla Carousel: Carousel/slider functionality
- React Day Picker: Date selection component
- Recharts: Charting library for data visualization

**Form Management:**
- React Hook Form: Form state management with performance optimization
- @hookform/resolvers: Integration between React Hook Form and validation libraries
- Zod: Schema validation for forms and API data
- drizzle-zod: Bridge between Drizzle ORM schemas and Zod validation

**Development Tools:**
- tsx: TypeScript execution for development server
- esbuild: Fast bundler for production builds
- drizzle-kit: Database migration and schema management CLI
- Replit-specific plugins: Runtime error overlay, cartographer, dev banner

**Styling:**
- Tailwind CSS: Utility-first CSS framework
- tailwind-merge: Utility for merging Tailwind classes
- clsx: Conditional class name composition
- class-variance-authority: Type-safe variant management

**Utilities:**
- date-fns: Date manipulation and formatting
- nanoid: Unique ID generation
- ws: WebSocket implementation for database connections