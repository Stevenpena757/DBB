# Dallas Beauty Book

## Overview

Dallas Beauty Book is a Pinterest-inspired visual discovery platform designed exclusively for DFW's Health, Beauty, and Aesthetics businesses. The application provides a clean, visual-first interface where users can discover businesses, read articles and how-to guides, shop from vendors, and save their favorite content. The platform follows Pinterest's proven design principles with a masonry grid layout, subtle interactions, and a focus on visual content.

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

**Data Models:**
- Businesses: Core entity with category, location, contact info, social media links
- Articles: Long-form content with excerpts, categories, and view tracking
- How-Tos: Step-by-step guides with structured step arrays
- Vendors: Product suppliers with ratings and product type listings
- Vendor Products: Individual products linked to vendors
- Saves: User bookmarks for businesses and content (session-based)
- Posts: Social media-style updates from businesses
- Claim Requests: Business ownership verification workflow

### Storage Architecture

**Database Schema:**
- Serial IDs for all primary keys
- Text fields for flexible content storage
- JSONB fields for structured data (steps in how-tos, hours of operation)
- Boolean flags for featured status and verification
- Timestamp fields for creation tracking and sorting
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