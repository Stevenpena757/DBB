# Design Guidelines: GENESIS - NeoVibrant Luxe Directory

## Design Philosophy

GENESIS embodies a "NeoVibrant Luxe" aesthetic—modern, AI-powered, and tech-forward with bold colors, sophisticated gradients, and strategic glow effects. The design balances vibrant energy with professional credibility for DFW's health, beauty, and aesthetics community.

**Core Principles**:
- **Tech-Forward Luxury**: Premium aesthetic with cutting-edge visual language
- **Universal Appeal**: Professional and aspirational without gender coding
- **Data-Driven Discovery**: Clear hierarchy for business listings and community insights
- **Adaptive Experience**: Seamless dark/light mode transitions

## Design Approach

**System Foundation**: Material Design principles adapted with aggressive customization for the NeoVibrant aesthetic. Emphasis on elevation, dynamic color, and responsive depth.

**Key Differentiators**: Bold gradients, strategic glow effects on interactive elements, and a vibrant color system that commands attention while maintaining professionalism.

## Color System

### Light Mode
- **Background**: Pure white (#FFFFFF)
- **Surface**: Off-white (#F8FAFC)
- **Text Primary**: Deep charcoal (#1A1A1A)
- **Text Secondary**: Medium gray (#64748B)
- **Border**: Light gray (#E2E8F0)

### Dark Mode
- **Background**: Rich black (#0A0A0A)
- **Surface**: Dark slate (#1A1F2E)
- **Text Primary**: Pure white (#FFFFFF)
- **Text Secondary**: Light gray (#94A3B8)
- **Border**: Dark gray (#2D3748)

### Brand Colors (Mode-Agnostic)
- **Primary**: Electric Azure (#0077FF) - CTAs, links, primary actions
- **Secondary**: Vivid Lime (#A3FF12) - Success states, upvotes, highlights
- **Accent**: Cyber Gold (#FFD100) - Premium features, verified badges, marketplace

### Gradient Treatments
- **Hero Gradient**: Azure to Lime (135deg, #0077FF → #A3FF12)
- **Card Hover**: Subtle Azure glow (box-shadow: 0 0 20px rgba(0, 119, 255, 0.3))
- **Premium Elements**: Gold shimmer gradient (90deg, #FFD100 → #FFA500)
- **Background Patterns**: Mesh gradients combining all three brand colors at 5-10% opacity

## Typography

### Font Stack
- **Headings**: Montserrat ExtraBold (800 weight) - powerful, modern
- **Logo/Accent**: Space Grotesk (500-700 weight) - tech-forward personality
- **Body/UI**: Inter (400-600 weight) - optimal readability

### Hierarchy
- **H1**: 48px/56px (mobile: 32px/40px) - Montserrat ExtraBold
- **H2**: 36px/44px (mobile: 24px/32px) - Montserrat ExtraBold
- **H3**: 24px/32px (mobile: 20px/28px) - Space Grotesk Bold
- **Body**: 16px/24px - Inter Regular
- **Small**: 14px/20px - Inter Regular
- **Caption**: 12px/16px - Inter Medium

## Layout System

### Spacing Primitives
Use Tailwind units: **4, 6, 8, 12, 16** for consistent vertical rhythm.
- Section padding: py-16 (desktop), py-12 (mobile)
- Card padding: p-6
- Component gaps: gap-6 (standard), gap-8 (sections)

### Grid Patterns
- **Business Listings**: 3-column grid (lg), 2-column (md), 1-column (mobile)
- **Featured Vendors**: 4-column grid with variable card heights
- **Social Feed**: Single column, max-width 720px centered
- **Marketplace**: 3-4 column product grid with consistent aspect ratios

### Container Strategy
- Full-width hero: w-full with gradient backgrounds
- Content sections: max-w-7xl mx-auto
- Reading content: max-w-3xl
- Forms: max-w-md

## Core Components

### Hero Section
- Full-width with mesh gradient background (Azure/Lime/Gold blend)
- Large hero image: Modern tech aesthetic, diverse beauty professionals, vibrant lighting
- Overlaid search bar with blur backdrop (backdrop-blur-lg bg-white/10)
- Text: Large Montserrat ExtraBold headline + Space Grotesk subheading
- CTA buttons with blurred backgrounds, no hover effects on blur

### Navigation
- Sticky header with blur backdrop (backdrop-blur-md)
- Logo: Space Grotesk with gradient text treatment
- Dark/light mode toggle (prominent placement)
- Search icon with glow effect on focus
- Mobile: Bottom navigation bar with 5 key sections

### Business Listing Cards
- Rounded-xl (12px) with subtle shadow
- Featured image (16:9 aspect ratio)
- Business name: Space Grotesk Bold
- Category tags with gradient backgrounds
- Upvote counter with Vivid Lime accent
- Hover: Lift effect with Azure glow shadow

### Social Feed Cards
- Clean white/dark cards with rounded-lg
- Profile image + username + timestamp
- Post content with image gallery support
- Interaction bar: Like (Lime), Comment, Share
- Verified badges in Cyber Gold

### Marketplace Product Cards
- Square product images (1:1)
- Price in Cyber Gold
- Vendor badge with glow effect
- Add to cart: Primary Azure button
- Grid layout with consistent heights

### Forms & Inputs
- Rounded-lg inputs with focus glow (Azure)
- Floating labels (Space Grotesk)
- Error states in red, success in Vivid Lime
- Submit buttons with gradient backgrounds

### Badges & Tags
- Rounded-full pills
- Gradient backgrounds for categories
- Solid colors for status indicators
- Small Inter Medium text

## Interactive Elements

### Buttons
- **Primary**: Azure background, white text, subtle glow
- **Secondary**: Outline style with Azure border
- **Accent**: Cyber Gold for premium actions
- Rounded-lg (8px), padding: px-6 py-3
- Hover: Brightness increase + glow intensity

### Glow Effects
Apply strategically to:
- Focused inputs (box-shadow: 0 0 0 3px rgba(0, 119, 255, 0.2))
- Active cards (Azure glow)
- Premium features (Gold glow)
- Upvote buttons on hover (Lime glow)

### Transitions
- Duration: 200ms for micro-interactions
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Properties: transform, box-shadow, background-color

## Images

### Hero Image
Large, high-quality lifestyle image showing:
- Modern aesthetic clinic or beauty space
- Diverse professionals in tech-forward setting
- Vibrant, well-lit environment
- Placement: Full-width hero section, 60vh height

### Listing Images
- Professional business photos (interiors, services, team)
- 16:9 aspect ratio for consistency
- High-quality, well-lit, modern aesthetic

### Profile/Avatar Images
- Circular crops (rounded-full)
- Consistent sizing across components
- Fallback gradients for missing images

### Background Elements
- Abstract gradient meshes for section backgrounds
- Subtle geometric patterns at 3% opacity
- No stock photos in backgrounds

## Accessibility

- WCAG AA contrast ratios in both modes
- Keyboard navigation with visible focus states (Azure glow)
- Semantic HTML structure
- ARIA labels for icon-only buttons
- Screen reader text for complex interactions
- Motion reduction media query support

## Mobile Optimization

- Touch targets: minimum 44px height
- Bottom navigation: 5 icons (Home, Explore, Post, Marketplace, Profile)
- Simplified header on mobile (logo + search + menu)
- Single-column layouts with full-width cards
- Swipeable carousels for featured content
- Sticky search bar below header

## Dark Mode Implementation

- Automatic system preference detection
- Manual toggle in header
- Smooth transitions between modes (300ms)
- Adjusted glow intensities (more subtle in dark mode)
- Inverted text but consistent brand colors
- Elevated surfaces with lighter grays

## Performance

- Lazy loading for all images
- Code splitting for marketplace/social features
- Progressive Web App capabilities
- Optimized gradient rendering
- Minimal animation overhead
- CDN delivery for fonts