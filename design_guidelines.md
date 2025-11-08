# Design Guidelines: DFW Health, Beauty & Aesthetics Directory + Social Platform

## Design Approach: Reference-Based Hybrid

**Primary References:**
- **Airbnb**: Card-based business discovery, visual-first directory layout, location-centric browsing
- **Instagram**: Social feed patterns, content creation flows, engagement interactions
- **Yelp**: Business profiles, category filtering, claim business workflows

**Key Design Principles:**
- Visual sophistication befitting beauty/aesthetics industry
- Texas-sized confidence with generous spacing and bold typography
- Community-first interactions with seamless business-to-user connections
- Mobile-optimized for on-the-go Dallas metro discovery

## Typography System

**Font Families:**
- Primary: Inter (CDN) - clean, modern sans-serif for UI elements, body text
- Display: Syne or Outfit (CDN) - bold, contemporary for headlines, business names

**Hierarchy:**
- Hero Headlines: 3xl to 6xl, bold weight
- Section Headers: 2xl to 4xl, semibold
- Business Names: xl to 2xl, semibold
- Body Text: base to lg, normal weight
- Captions/Meta: sm to base, medium weight

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Micro spacing: 2, 4 (within components)
- Standard gaps: 6, 8 (between elements)
- Section padding: 12, 16, 20 (mobile to desktop)
- Major sections: 24 (desktop hero/feature areas)

**Container Strategy:**
- Full-width sections with max-w-7xl inner containers
- Business cards/grids: max-w-6xl
- Content reading areas: max-w-4xl
- Forms: max-w-2xl

## Component Library

### Navigation
**Main Header:**
- Sticky transparent-to-solid on scroll
- Logo left, search bar center (desktop), auth/profile right
- Category pills below header (Health | Beauty | Aesthetics)
- Mobile: Hamburger menu with slide-out drawer

### Homepage Components

**Hero Section (80vh):**
- Full-bleed background image: High-quality Dallas skyline or upscale beauty/wellness imagery
- Centered content overlay with blurred-background search card
- Search bar with location autocomplete (DFW neighborhoods)
- Category quick-filters as chips
- Trust indicator: "500+ DFW Businesses Listed"

**Featured Categories Grid:**
- 3-column on desktop (Health | Beauty | Aesthetics)
- Large icon + title + business count + CTA
- Hover lift effect (subtle)

**Discover Section:**
- Masonry grid (Pinterest-style) of business cards
- Each card: business image, logo badge, name, category tag, rating stars, location badge
- "Load More" infinite scroll

**How It Works:**
- 3-step horizontal timeline (desktop) / vertical stack (mobile)
- Icons + headlines + descriptions
- For businesses: Claim → Create → Connect
- For users: Discover → Engage → Support Local

**Community Highlights:**
- Recent posts from claimed businesses
- 2-column on desktop: larger featured post left, 2 stacked smaller posts right
- Each post: business avatar, name, timestamp, content preview, engagement metrics

**Call-to-Action Sections:**
- "Claim Your Business" - centered with benefits list (3 columns on desktop)
- "Join the Community" - for users, with email signup

### Directory Pages

**Search/Filter Sidebar (Desktop):**
- Sticky positioned
- Category checkboxes
- Location radius slider
- Service type multi-select
- Price range (if applicable)
- "Apply Filters" + "Clear All" buttons

**Results Grid:**
- Cards layout: 2-3 columns based on viewport
- Card structure: Image top (16:9), logo overlay (bottom-left corner), business name, category tag, 1-line description, rating + reviews, location + distance, "View Profile" button

**Mobile:** Filters in expandable bottom sheet, single-column cards

### Business Profile Pages

**Hero Banner:**
- Full-width cover image (business ambiance shot)
- Overlay gradient for text readability
- Business name + category + verification badge
- Primary CTA: "Book Appointment" or custom action
- Secondary actions: Save, Share, Message

**Info Tabs:**
- Horizontal tabs: Overview | Services | Gallery | Reviews | Posts
- Sticky below hero on scroll

**Overview Tab:**
- 2-column layout (desktop): Main content left (about, hours, contact) + sidebar right (location map, quick stats, social links)

**Services Section:**
- List or grid of services with descriptions and pricing
- "Request Quote" per service

**Gallery:**
- Masonry grid of business photos
- Lightbox modal on click

**Reviews:**
- Star rating summary at top
- Individual reviews with avatar, name, date, rating, text
- Reply threads from business owners (indented)

**Posts (Social Feed):**
- Business can create: text posts, image posts, promotions, events
- Card layout similar to Instagram posts
- Engagement: Like, Comment, Share

### Social Feed (Community Page)

**Feed Layout:**
- Single column, centered (max-w-2xl)
- Post composition card at top (for business accounts)
- Posts display: Avatar + business name + timestamp + content (text/image) + engagement bar (like count, comment count) + comment input
- "Load More" pagination

**Post Types:**
- Standard update
- Before/After showcase (2-image slider)
- Promotion/special offer (highlighted card treatment)
- Event announcement (date badge)

### Claim Your Business Flow

**Multi-Step Form (3 steps):**
1. Business Search/Verify (search existing or add new)
2. Business Details (name, category, address, contact, hours, description)
3. Upload Media (logo, cover photo, gallery images)

**Progress Indicator:**
- Horizontal stepper at top
- "Save & Continue" + "Back" navigation

**Confirmation:**
- Success state with next steps
- Prompt to complete profile and create first post

### User Account/Dashboard

**Business Dashboard:**
- Sidebar navigation: Profile, Posts, Analytics, Messages, Settings
- Analytics cards: Profile views, post engagement, review summary
- Recent activity feed
- Quick actions: Create Post, Respond to Review, Update Hours

**User Account:**
- Saved businesses grid
- Activity feed (likes, comments)
- Settings and preferences

## Images Strategy

**Hero Section:** Yes - large, high-impact image
- Upscale Dallas landmark OR premium beauty/wellness environment
- Professional photography quality
- Overlay with blurred-background search component

**Business Cards:** Featured image for each business (16:9 ratio)

**Profile Pages:** Cover image + logo + gallery images

**Posts:** Support for single or multiple images per post

**Category Features:** Icon-based (use Heroicons via CDN)

## Accessibility

- Consistent focus states across all interactive elements
- Form labels and aria-labels throughout
- Alt text for all images
- Keyboard navigation for modals and menus
- WCAG AA contrast ratios for text

## Texas/DFW Aesthetic Touches

- Confident, spacious layouts reflecting Texas scale
- Modern sophistication for health/beauty market
- Local imagery: Dallas skyline, recognizable landmarks
- Copy tone: Warm, welcoming, community-focused ("y'all", "neighbor")
- Trust signals: "Dallas Local", "DFW Verified Business" badges