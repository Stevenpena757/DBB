# Dallas Beauty Book

## Overview

Dallas Beauty Book is a Pinterest-inspired B2B SaaS platform designed for Health, Beauty, and Aesthetics businesses and entrepreneurs in the DFW area. It serves as a visual-first platform for businesses to gain visibility, share expertise, and grow their brand by discovering clients through content creation and connecting with suppliers. The platform utilizes a masonry grid layout and focuses on visual content, similar to Pinterest's successful design principles.

The platform's primary customers are DFW beauty businesses and entrepreneurs. It includes a supplier directory to help businesses find equipment, products, and supplies. Its core value proposition is free visibility through content sharing, complemented by paid tiers for enhanced features.

Monetization is achieved through a three-tier subscription model (Free, Pro, Premium) that offers enhanced features while maintaining free content creation. Additional revenue streams include sponsored content placements and commissions from supplier listings.

## SEO Infrastructure

The platform includes comprehensive SEO optimization:
- **50 Landing Pages**: Dynamic SEO landing pages for DFW cities and beauty categories (defined in `shared/seo.ts`)
- **JSON-LD Schemas**: LocalBusiness schema for business profiles, ItemList schema for landing pages, BreadcrumbList for navigation
- **Sitemaps**: XML sitemap index at `/sitemap.xml` with 4 sub-sitemaps:
  - `/sitemap-categories.xml` - All category landing pages
  - `/sitemap-cities.xml` - All city landing pages
  - `/sitemap-businesses.xml` - All business profiles
  - `/sitemap-community.xml` - Homepage, explore, forum + recent posts
- **robots.txt**: Served at `/robots.txt` with proper crawl directives
- **Canonical URLs**: All pages include canonical link tags to prevent duplicate content
- **Meta Tags**: Dynamic title, description, and Open Graph tags for social sharing

## Brand Identity - Vibrant Miami Glow

Dallas Beauty Book features a bold, energetic, and modern brand aesthetic inspired by Miami's vibrant energy.

### Color Palette (WCAG Accessible)
- **Primary (Accessible Peach)**: #CC4A28 - Bold, energetic, warm (5.5:1 contrast with white)
- **Secondary (Accessible Sunset)**: #D91D66 - Vibrant, eye-catching, feminine (4.8:1 contrast with white)
- **Accent (Accessible Mint)**: #1ABDA6 - Fresh, modern, exciting (darker for better contrast)
- **Navy (Ocean Navy)**: #102646 - Professional, trustworthy, grounding
- **Background (Peach Mist)**: #FFF1ED - Soft, warm, inviting
- **Light variants**: #FF7E5F (peach), #FD3A84 (sunset), #2EDFD0 (mint) - Used for backgrounds and decorative elements

### Typography System
- **Headings**: Montserrat (600-800 weight) - Bold, modern, geometric, confident
- **Body Text**: Hind Madurai (400-600 weight) - Clean, readable, international appeal
- **UI Elements**: Poppins (500-600 weight) - Friendly, modern, versatile

### CSS Variables
- `--font-heading`: 'Montserrat', sans-serif
- `--font-body`: 'Hind Madurai', sans-serif
- `--font-ui`: 'Poppins', sans-serif

### Brand Characteristics
- Vibrant gradients (sunset gradient from pink to peach)
- Pill-shaped buttons with shadows and hover effects
- Card hover lifts with smooth transitions
- Mint aqua accents for calls-to-action
- Focus outlines using Mint Aqua for accessibility

### Components Updated
- Homepage: Vibrant gradient hero with sunset overlay, bold white headings
- Explore: Pill-shaped filter chips, vibrant cards
- Forum: Gradient heading, bold CTA button
- Header: Gradient logo, vibrant primary buttons
- Footer: Clean white background, UI font

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (November 2025)

### Comprehensive UX Overhaul
A major update to improve first-time visitor clarity and engagement:

**Navigation Updates:**
- Updated header navigation: "Explore Businesses", "Ask the Community"
- Changed "Claim Your Listing" to "For Professionals" dropdown menu (Claim Listing, Add Listing)
- All internal navigation uses wouter Link components/setLocation (SPA navigation preserved)

**Homepage Enhancements:**
- **Hero Section:** New messaging "One platform for DFW beauty, health & aesthetics" with two user-path CTAs (I'm looking for beauty services / I'm a beauty professional)
- **Quick Tour Link:** Added "New here? Start with a quick tour →" link to /start-here
- **How DallasBeautyBook Works:** 3-step explanation section (Discover, Share, Support Local Pros)
- **Popular in DFW Right Now:** 8 trending treatment chips (Botox, Lip Filler, Lash Extensions, etc.)
- **Why Contribute:** 3 value propositions (Help Others, Earn Recognition, Support Local Pros)
- **From the Community:** Preview of 3 recent forum posts with engagement metrics

**New Features:**
- `/start-here` onboarding route: Comprehensive guide explaining platform purpose, target audience, and how to use each feature
- First-time welcome modal: Shows on first visit, uses localStorage tracking (key: "dbb-welcome-modal-shown"), provides two action buttons (Explore Businesses / Ask the Community)

**Technical Improvements:**
- Full SPA navigation implementation using wouter throughout Header, Hero, Home, and WelcomeModal
- No window.location.href or plain <a href> for internal routes
- Improved code quality and maintainability

### Accessibility Improvements (WCAG AA Compliant)

**Hero Carousel Accessibility:**
- Fixed text contrast: Solid white text with drop shadows on gradient backgrounds (replaced semi-transparent text)
- Full keyboard navigation: Inactive cards excluded from tab order (tabIndex={-1}, aria-hidden="true")
- Visible focus states: 4px accent ring (focus:ring-4 focus:ring-accent) on all focusable elements
- Auto-rotation pause on focus/hover: Prevents focus traps by pausing when user interacts with carousel
- Auto-rotation resume: Resumes smoothly when focus/hover leaves carousel
- Prefers-reduced-motion support: Auto-rotation disabled when user prefers reduced motion
- WCAG 2.2.2 compliance: Carousel meets "Pause, Stop, Hide" requirement

**ARIA Attributes:**
- Carousel: role="region", aria-roledescription="carousel", aria-label="Featured DallasBeautyBook businesses"
- Cards: aria-label with business names, aria-pressed states (true for active, false for inactive)
- Carousel dots: aria-label with position info, aria-pressed states
- Search inputs: Descriptive aria-labels for screen readers

**Navigation Improvements:**
- Footer mobile navigation: Uses wouter Link components for SPA preservation
- All internal links: Converted from <a href> to Link components throughout site
- Focus management: Proper blur detection using currentTarget.contains(relatedTarget)

**Technical Implementation:**
- State-based pause control using isHovered and isFocused states
- useEffect hook for prefers-reduced-motion with mediaQuery listener and cleanup
- Comprehensive focus/blur handlers that detect when focus leaves carousel entirely
- Verified through e2e testing with Playwright

## System Architecture

### Frontend Architecture

The frontend uses React with TypeScript, Vite for building, and Wouter for routing. TanStack Query manages server state and caching. The UI is built with shadcn/ui (based on Radix UI), styled with Tailwind CSS, and uses Class Variance Authority for component variants. It features a Pinterest-inspired clean aesthetic with a masonry grid, mobile-first responsive design, and a custom theming system for light/dark modes. State management is handled by React Query for API data, React Hook Form with Zod for forms, and Context API for themes.

### Backend Architecture

The backend is built with Express.js and Node.js, using TypeScript for type safety. It provides a RESTful API with JSON communication, centralized error handling, and request logging. PostgreSQL is the primary database, managed with Drizzle ORM for type-safe queries and Neon for scalable hosting, utilizing WebSocket-based connection pooling.

Authentication is integrated with Replit Auth (OpenID Connect), using session-based authentication with `express-session` and PostgreSQL storage. It includes user profile management, protected API routes, and admin-specific middleware for role-based access control. The system gracefully handles unauthorized responses.

An Admin Panel provides role-based access control with a dedicated admin router. It supports user, business, claim request, and moderation queue management, along with platform analytics. Secure proof document viewing for claim verification is included, with file uploads handled by Multer, stored in a private object storage, and protected by admin middleware.

**Data Models:** Key data models include Users, Businesses, Articles, How-Tos, Vendors, Vendor Products, Saves, Posts, Claim Requests, Sessions, Subscriptions, Abuse Reports, User Bans, Admin Activity Logs, Security Events, and an AI Moderation Queue.

### Storage Architecture

The database schema uses serial IDs for primary keys, text fields for content, JSONB for structured data, boolean flags for status, and enums for subscription tiers, categories, and DFW locations. Timestamps track creation and expiration. Data access is managed through a storage interface abstraction layer supporting CRUD operations, filtered queries, and analytics.

### AI and Automation

The system integrates OpenAI via Replit AI Integrations (using gpt-5) for:
- **Content Moderation:** Automatically scans articles, how-tos, and posts for policy violations with confidence scoring.
- **Business Validation:** Validates pending business listings for completeness, legitimacy, and relevance to the DFW beauty/aesthetics market.
- **Admin Moderation Queue:** Manages AI-flagged content awaiting manual review.

## External Dependencies

**Database Services:**
- Neon Serverless PostgreSQL
- `connect-pg-simple`

**UI Component Libraries:**
- Radix UI
- Lucide React
- React Icons
- Vaul (Drawer)
- cmdk (Command palette)
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
- Replit-specific plugins

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
- Stripe (for subscriptions, webhooks, customer portal)

**AI and Automation:**
- OpenAI Integration (via Replit AI Integrations)
- p-limit, p-retry