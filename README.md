# Dallas Beauty Book 🌟

**Where DFW Beauty Meets Community**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Built on Replit](https://img.shields.io/badge/Built%20on-Replit-667881?logo=replit)](https://replit.com)

> A Pinterest-inspired B2B SaaS platform connecting Beauty, Aesthetics, and Wellness businesses with clients across the Dallas-Fort Worth area.

---

## 📖 What is Dallas Beauty Book?

Dallas Beauty Book is a visual-first discovery platform that helps DFW locals find their perfect beauty professionals while giving businesses free visibility through content sharing. Think Pinterest meets Yelp, but exclusively for the Dallas beauty community.

**Core Value Proposition:**
- **For Consumers:** Discover local beauty pros through personalized Beauty Books, get recommendations, and connect with the DFW beauty community
- **For Businesses:** Free visibility through content sharing, with premium subscription tiers for enhanced features and analytics
- **For the Community:** A central hub for beauty conversations, reviews, and shared experiences

---

## ✨ Key Features

### For Consumers (Locals)
- 🎨 **Personalized Beauty Books** - Answer a few questions to get tailored business recommendations
- 🔍 **Visual Discovery** - Pinterest-inspired masonry grid for browsing beauty content
- 💬 **Community Forum** - Ask questions, share experiences, get advice
- 🎯 **Goals Tracking** - Set and track beauty/wellness goals
- 💝 **Exclusive Promotions** - Receive personalized offers from businesses you follow
- ⭐ **Reviews & Ratings** - Help others discover great beauty professionals

### For Business Professionals
- 📊 **Business Dashboard** - Track followers, reviews, and engagement metrics
- 🎁 **Targeted Promotions** - Send offers to followers and positive reviewers
- 📈 **Analytics** - Understand your audience and business performance
- 🏆 **Content Rewards** - Submit content to unlock featured placement and benefits
- 🔐 **Verified Claims** - Secure business ownership verification process

### Platform Features
- 🤖 **AI Content Moderation** - OpenAI-powered content review and validation
- 👑 **Admin Panel** - Comprehensive management for users, businesses, and content
- 🎨 **Soft Editorial Design** - Elegant, service-focused aesthetic with serif typography
- 📱 **Mobile-First** - Optimized for on-the-go beauty discovery
- 🔐 **Secure Authentication** - Replit Auth (OpenID Connect) with session management

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Routing:** Wouter (lightweight SPA routing)
- **State Management:** TanStack Query (React Query v5)
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS with custom Soft Editorial theme
- **Forms:** React Hook Form + Zod validation
- **Build Tool:** Vite

### Backend
- **Runtime:** Node.js + Express.js
- **Language:** TypeScript
- **API Style:** RESTful JSON
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Drizzle ORM
- **Authentication:** Replit Auth (OpenID Connect)
- **Session Store:** PostgreSQL with connect-pg-simple

### Integrations
- **AI:** OpenAI (GPT-5 via Replit AI Integration)
- **Payments:** Stripe (3-tier subscription model)
- **Object Storage:** Replit Object Storage
- **Deployment:** Replit (automatic deployments)

### Development Tools
- **Database Migrations:** Drizzle Kit
- **Type Safety:** TypeScript + Zod + drizzle-zod
- **Package Manager:** npm
- **Version Control:** Git

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   Routing   │  │ State Mgmt   │  │  UI Components │  │
│  │  (Wouter)   │  │ (TanStack Q) │  │  (shadcn/ui)   │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                    REST API (JSON)
                           │
┌─────────────────────────────────────────────────────────┐
│                    Backend (Express)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │     Auth     │  │     API      │  │  Middleware  │  │
│  │ (Replit)     │  │   Routes     │  │  (Session)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                    Drizzle ORM
                           │
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL Database (Neon)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Users   │  │Businesses│  │  Beauty  │  │ Reviews │ │
│  │          │  │          │  │  Books   │  │         │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Data Model Highlights
- **Users** - Authentication, profiles, goals, follows, promotions
- **Businesses** - Listings, claims, categories, subscription tiers
- **Beauty Books** - Consumer preferences, enhancement areas, vibe preferences
- **Reviews** - Ratings, feedback, helpfulness tracking
- **Forum** - Community posts, replies, moderation
- **Admin** - Claim requests, moderation queues, analytics

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+ (or use Replit's built-in database)
- Replit account (for authentication and deployment)

### Quick Start on Replit

1. **Fork this Repl** or import from GitHub
2. **Environment is auto-configured** - Database, auth, and secrets are ready
3. **Run the application:**
   ```bash
   npm run dev
   ```
4. **Open the webview** - Your app runs at `https://your-repl.repl.co`

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/dallas-beauty-book.git
   cd dallas-beauty-book
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file with:
   ```bash
   # Database (Neon PostgreSQL)
   DATABASE_URL="postgresql://user:password@host/database"
   PGHOST="your-db-host"
   PGPORT="5432"
   PGUSER="your-user"
   PGPASSWORD="your-password"
   PGDATABASE="your-database"

   # Session Secret
   SESSION_SECRET="your-secure-random-string"

   # Replit Auth (OpenID Connect)
   # Configure in Replit settings or use your own OIDC provider

   # Stripe (for subscriptions)
   STRIPE_SECRET_KEY="sk_test_..."
   VITE_STRIPE_PUBLIC_KEY="pk_test_..."

   # OpenAI (for content moderation)
   # Configured via Replit AI Integration

   # Object Storage
   # Configured via Replit Object Storage
   ```

4. **Run database migrations:**
   ```bash
   npm run db:push
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```
   - Frontend: Runs on port 5000
   - Backend: Same port (Vite proxies API requests)

---

## 📂 Project Structure

```
dallas-beauty-book/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/              # shadcn/ui primitives
│   │   │   ├── DbbCard.tsx      # Custom branded components
│   │   │   ├── Footer.tsx
│   │   │   └── Header.tsx
│   │   ├── pages/               # Route pages
│   │   │   ├── Home.tsx         # Landing page
│   │   │   ├── MyBeautyBook.tsx # Beauty Book creation wizard
│   │   │   ├── BusinessOnboarding.tsx
│   │   │   ├── Profile.tsx      # User profile & dashboard
│   │   │   ├── BusinessDashboard.tsx
│   │   │   ├── Forum.tsx        # Community forum
│   │   │   └── AdminConsole.tsx
│   │   ├── lib/                 # Utilities
│   │   │   ├── queryClient.ts   # TanStack Query setup
│   │   │   └── utils.ts
│   │   ├── hooks/               # Custom React hooks
│   │   ├── App.tsx              # Root component & routing
│   │   ├── index.css            # Global styles & theme
│   │   └── main.tsx             # Entry point
├── server/                      # Backend Express application
│   ├── routes.ts                # API endpoints
│   ├── storage.ts               # Database interface & implementation
│   ├── index.ts                 # Express server setup
│   └── vite.ts                  # Vite integration
├── shared/                      # Shared TypeScript types
│   └── schema.ts                # Drizzle schema + Zod validators
├── attached_assets/             # Static assets
│   └── images/                  # Images for UI
├── db/                          # Database migrations
├── package.json                 # Dependencies & scripts
├── vite.config.ts               # Vite configuration
├── tailwind.config.ts           # Tailwind + theme config
├── tsconfig.json                # TypeScript configuration
├── drizzle.config.ts            # Drizzle ORM config
└── replit.md                    # Internal project documentation
```

---

## 🎨 Design System

**Soft Editorial Aesthetic** - Wellness-focused, service-oriented design inspired by editorial magazines and Pinterest.

### Color Palette
- **Forest Green** (#396052) - Primary brand color
- **Warm Cream** (hsl(32, 50%, 96%)) - Background
- **Sand** (hsl(32, 35%, 88%)) - Borders & subtle accents
- **Rose** (hsl(343, 24%, 86%)) - Secondary accent
- **Charcoal** (hsl(25, 7%, 28%)) - Primary text

### Typography
- **Headings:** Playfair Display (serif)
- **Subheadings:** Cormorant Garamond (serif)
- **Body:** Lato (sans-serif)

### Key UI Principles
- Mobile-first responsive design
- Visual hierarchy through whitespace and typography
- Masonry grid layouts for content discovery
- Pill-shaped buttons with rounded edges
- Subtle shadows and soft borders
- Gradient animations for CTAs

---

## 💼 Business Model

### Subscription Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0/mo | Basic listing, community access, content submission |
| **Pro** | $29/mo | Analytics dashboard, promoted placement, featured badge |
| **Premium** | $99/mo | Priority support, advanced analytics, unlimited promotions |

### Revenue Streams
1. **Subscription revenue** - Pro and Premium business tiers
2. **Sponsored content** - Featured placement in Beauty Books and feeds
3. **Supplier directory** - Paid listings for beauty product suppliers
4. **Data insights** - Anonymized aggregate data for industry trends (future)

---

## 🔐 Authentication & Authorization

### Replit Auth (OpenID Connect)
- Sign in with Replit for seamless authentication
- Google login supported via Replit Auth
- Session-based authentication with PostgreSQL storage
- Secure session management with `express-session`

### User Roles
- **Regular Users** - Full access to consumer features
- **Business Owners** - Access to business dashboard after claim verification
- **Admins** - Full platform management via Admin Console

### Protected Routes
- `/profile` - User dashboard (requires auth)
- `/business-dashboard` - Business metrics (requires business ownership)
- `/admin` - Platform management (requires admin role)

---

## 📊 Key User Flows

### Consumer Journey
1. **Land on homepage** → See "I'm here to..." options
2. **Click "Create Your Beauty Book"** → Complete 5-step personalization wizard
3. **Sign in (optional)** → Save Beauty Book to profile
4. **Browse recommendations** → Discover businesses matching preferences
5. **Follow & engage** → Save favorites, join community, track goals
6. **Receive promotions** → Get personalized offers from followed businesses

### Business Journey
1. **Land on "For Professionals"** → Learn about platform benefits
2. **Click "Claim Your Listing"** → Submit business information
3. **Document verification** → Upload proof of ownership
4. **Admin approval** → Business claim verified
5. **Sign in & access dashboard** → View metrics, send promotions
6. **Upgrade to Pro/Premium** → Unlock advanced features
7. **Submit content** → Gain visibility through articles and guides

### Admin Workflow
1. **Access Admin Console** → View pending claims and moderation queue
2. **Review claim requests** → Verify documents, approve/reject
3. **Moderate content** → Review AI-flagged posts and businesses
4. **Manage users & businesses** → Edit, delete, or suspend accounts
5. **View analytics** → Track platform growth and engagement

---

## 🧪 Development Workflows

### Adding a New Feature

1. **Update the database schema** in `shared/schema.ts`:
   ```typescript
   export const myNewTable = pgTable("my_new_table", {
     id: serial("id").primaryKey(),
     // ... columns
   });
   
   export const insertMyNewSchema = createInsertSchema(myNewTable);
   ```

2. **Run database migration:**
   ```bash
   npm run db:push
   ```

3. **Add storage methods** in `server/storage.ts`:
   ```typescript
   interface IStorage {
     createMyNew(data: InsertMyNew): Promise<SelectMyNew>;
     // ...
   }
   ```

4. **Create API routes** in `server/routes.ts`:
   ```typescript
   app.post("/api/my-new", async (req, res) => {
     const data = insertMyNewSchema.parse(req.body);
     const result = await storage.createMyNew(data);
     res.json(result);
   });
   ```

5. **Build frontend page** in `client/src/pages/`:
   ```typescript
   const { data } = useQuery({
     queryKey: ["/api/my-new"],
   });
   ```

6. **Register route** in `client/src/App.tsx`:
   ```typescript
   <Route path="/my-new" component={MyNewPage} />
   ```

### Testing Changes

```bash
# Check TypeScript types
npm run build

# Test the application manually
npm run dev

# Database changes
npm run db:push        # Apply schema changes
npm run db:studio      # Open Drizzle Studio
```

---

## 🚀 Deployment

### Replit Deployment (Recommended)

1. **Push to Replit** - Changes auto-deploy on save
2. **Configure secrets** - Set environment variables in Replit Secrets
3. **Enable Always On** - Keep your app running 24/7 (paid feature)
4. **Custom Domain** - Link your own domain in Replit settings

### Manual Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set environment variables** on your hosting platform

3. **Run database migrations:**
   ```bash
   npm run db:push
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

### Health Check Endpoint
- `GET /api/health` - Returns 200 OK when server is healthy

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Reporting Bugs
- Use GitHub Issues to report bugs
- Include steps to reproduce
- Share screenshots if applicable

### Suggesting Features
- Open a GitHub Issue with the `enhancement` label
- Describe the feature and its use case
- Explain how it benefits users

### Code Contributions
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with descriptive messages (`git commit -m 'Add amazing feature'`)
6. Push to your fork (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style
- Follow existing TypeScript conventions
- Use Prettier for formatting
- Add `data-testid` attributes to interactive elements
- Write clear, descriptive variable names
- Comment complex logic

---

## 📧 Support & Contact

- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/dallas-beauty-book/issues)
- **Email:** support@dallasbeautybook.com
- **Community:** Join our forum at `/forum` on the platform

---

## 🗺️ Roadmap

### Completed ✅
- [x] Q4 2024: Core platform with business directory
- [x] Q4 2024: Beauty Book personalization wizard
- [x] Q4 2024: Community forum
- [x] Q1 2025: User profiles with goals & follows
- [x] Q1 2025: Business dashboard with analytics
- [x] Q1 2025: Promotions system for targeted offers
- [x] Q1 2025: AI content moderation

### In Progress 🚧
- [ ] Mobile app (React Native)
- [ ] Email notifications system
- [ ] Advanced search filters
- [ ] Business analytics expansion

### Future 🔮
- [ ] Supplier directory integration
- [ ] Booking/appointment system
- [ ] Loyalty rewards program
- [ ] Data insights & trends dashboard
- [ ] API for third-party integrations

---

## 📜 License

This project is proprietary software. All rights reserved.

For licensing inquiries, contact: legal@dallasbeautybook.com

---

## 🙏 Acknowledgments

**Built with:**
- [Replit](https://replit.com) - Development environment and deployment
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe database toolkit
- [TanStack Query](https://tanstack.com/query) - Powerful data synchronization
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Stripe](https://stripe.com/) - Payment processing
- [OpenAI](https://openai.com/) - AI-powered content moderation

**Inspired by:**
- [Pinterest](https://www.pinterest.com/) - Visual discovery
- [Yelp](https://www.yelp.com/) - Local business reviews
- [Product Hunt](https://www.producthunt.com/) - Community-driven discovery

**Special thanks to the open-source community and all contributors!**

---

**⭐ If you find this project useful or interesting, please star the repository!**

---

*Last updated: November 2025*
