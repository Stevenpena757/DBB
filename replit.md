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

The database schema uses serial IDs, text fields, JSONB for structured data, boolean flags, and enums for various categories. Timestamps track creation and expiration. Data access is managed through a storage interface abstraction layer supporting CRUD operations, filtered queries, and analytics. Foreign key constraints utilize CASCADE or SET NULL for data integrity.

### AI and Automation

The system integrates OpenAI via Replit AI Integrations (using gpt-5) for content moderation, business listing validation, and managing an admin moderation queue for AI-flagged content.

### Key Features

- **Personalized Discovery Flow ("Create Your Dallas Beauty Book"):** A 5-step form-based flow capturing user preferences for tailored business recommendations. Features a responsive two-column layout with sticky image on desktop, mobile-first design with hidden image on mobile. Uses type-safe chip toggle functions for enhance areas and vibes with proper React Hook Form state management.
- **Dynamic Content & Layouts:** Homepage reorganization with dynamic business listings and community content, utilizing AI-generated category images. Homepage features a 2-column grid for feature cards: "Ask the Community" and "Create Your Beauty Book".
- **Admin Delete Functionality:** Comprehensive delete capabilities in the admin console for users and businesses with CASCADE deletion and confirmation dialogs.

### Recent Changes (November 2025)

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