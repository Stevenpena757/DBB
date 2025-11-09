# Design Guidelines: GENESIS - Copper Radiance Directory

## Design Philosophy

GENESIS embodies a "Copper Radiance" aesthetic—warm, sophisticated, and luxurious with copper and champagne tones. The design conveys professional expertise and welcoming elegance for DFW's health, beauty, and aesthetics community.

**Core Principles**:
- **Warm Luxury**: Premium aesthetic with sophisticated copper gradients
- **Professional Elegance**: Refined and aspirational without being cold
- **Expert Discovery**: Clear hierarchy for business listings and community insights
- **Adaptive Warmth**: Seamless dark/light mode with consistent copper tones

## Design Approach

**System Foundation**: Material Design principles with sophisticated customization for warm, luxurious aesthetics. Emphasis on soft elevation, copper gradients, and warm shadows.

**Key Differentiators**: Copper-to-gold gradients, warm glowing shadows on interactive elements, champagne accents that convey expertise and trust.

## Color System

### Light Mode
- **Background**: Warm white (#FDFBF9)
- **Surface**: Champagne mist (#F9F5F2)
- **Text Primary**: Rich espresso (#2C1810)
- **Text Secondary**: Warm gray (#6B5B52)
- **Border**: Soft taupe (#E8DDD6)

### Dark Mode
- **Background**: Deep cocoa (#1A0F0A)
- **Surface**: Dark copper (#2B1D16)
- **Text Primary**: Warm white (#FFF8F3)
- **Text Secondary**: Light copper (#C9B5A8)
- **Border**: Bronze gray (#4A3B32)

### Brand Colors (Mode-Agnostic)
- **Primary**: Copper Rose (#D67A59) - CTAs, links, primary actions
- **Secondary**: Peach Nude (#E3A28D) - Success states, upvotes, highlights
- **Accent**: Highlight Gold (#F2C97D) - Premium features, verified badges, marketplace

### Gradient Treatments
- **Hero Gradient**: Copper to Gold (135deg, #D67A59 → #F2C97D)
- **Card Hover**: Warm copper glow (box-shadow: 0 4px 20px rgba(214, 122, 89, 0.25))
- **Premium Elements**: Gold shimmer (90deg, #F2C97D → #E8B86D)
- **Background Patterns**: Soft copper mesh at 6% opacity with champagne highlights

## Typography

### Font Stack
- **Headings**: Montserrat ExtraBold (800) - powerful, sophisticated
- **Logo/Accent**: Space Grotesk (500-700) - modern elegance
- **Body/UI**: Inter (400-600) - optimal readability

### Hierarchy
- **H1**: 48px/56px (mobile: 32px/40px) - Montserrat ExtraBold
- **H2**: 36px/44px (mobile: 24px/32px) - Montserrat ExtraBold
- **H3**: 24px/32px (mobile: 20px/28px) - Space Grotesk Bold
- **Body**: 16px/24px - Inter Regular
- **Small**: 14px/20px - Inter Regular

## Layout System

**Spacing Primitives**: Tailwind units **4, 6, 8, 12, 16**
- Section padding: py-16 (desktop), py-12 (mobile)
- Card padding: p-6
- Component gaps: gap-6 (standard), gap-8 (sections)

**Grid Patterns**:
- Business Listings: 3-col (lg), 2-col (md), 1-col (mobile)
- Featured Vendors: 4-col with varied heights
- Social Feed: Single column, max-w-3xl centered
- Marketplace: 3-4 col product grid

**Containers**:
- Hero: w-full with copper gradient overlays
- Content: max-w-7xl mx-auto
- Forms: max-w-md

## Core Components

### Hero Section
- Full-width with large lifestyle image (60vh height)
- Copper-to-gold gradient overlay (opacity 40%)
- Search bar with blur backdrop (backdrop-blur-lg bg-white/20 in light, bg-black/20 in dark)
- Large Montserrat headline + Space Grotesk subheading in white
- CTA buttons with blurred backgrounds, no hover blur effects

### Navigation
- Sticky header with blur backdrop (backdrop-blur-md)
- Logo: Space Grotesk with copper gradient text
- Dark/light toggle with copper accent
- Search with warm glow on focus
- Mobile: Bottom nav with 5 icons (Home, Explore, Post, Marketplace, Profile)

### Business Listing Cards
- Rounded-xl with warm copper shadow
- Featured image (16:9)
- Business name: Space Grotesk Bold
- Category tags with peach gradient backgrounds
- Upvote counter with Peach Nude accent
- Hover: Lift with copper glow shadow

### Social Feed Cards
- Warm white/dark cards, rounded-lg
- Profile image + username + timestamp
- Post content with image galleries
- Interactions: Like (Peach), Comment, Share
- Verified badges in Highlight Gold

### Marketplace Product Cards
- Square images (1:1)
- Price in Highlight Gold
- Vendor badge with warm glow
- Add to cart: Copper Rose button
- Consistent grid heights

### Forms & Inputs
- Rounded-lg with warm copper focus glow
- Floating labels (Space Grotesk)
- Error states in warm red, success in Peach Nude
- Submit buttons with copper-gold gradient

### Badges & Tags
- Rounded-full pills with copper/gold gradients
- Small Inter Medium text
- Category badges use secondary color

## Interactive Elements

**Buttons**:
- Primary: Copper Rose bg, white text, warm shadow
- Secondary: Peach Nude outline
- Accent: Highlight Gold for premium
- Rounded-lg, px-6 py-3
- Hover: Warm glow intensification

**Glow Effects**:
- Focused inputs: 0 0 0 3px rgba(214, 122, 89, 0.2)
- Active cards: Warm copper glow
- Premium features: Gold glow
- Strategic application for warmth

**Transitions**: 200ms, cubic-bezier(0.4, 0, 0.2, 1)

## Images

### Hero Image
Large lifestyle image showing:
- Modern aesthetic clinic/spa with warm lighting
- Diverse professionals in elegant setting
- Soft, inviting ambiance with natural light
- Placement: Full-width hero, 60vh, with copper gradient overlay

### Listing Images
- Professional business photography
- 16:9 aspect ratio
- Warm, well-lit environments

### Profile Images
- Circular crops (rounded-full)
- Consistent sizing
- Copper gradient fallbacks

### Background Elements
- Soft copper gradient meshes
- Champagne geometric patterns at 4% opacity

## Accessibility & Mobile

- WCAG AA contrast in both modes
- Copper glow for focus states
- Touch targets: 44px minimum
- Bottom nav on mobile
- Simplified mobile header
- Motion reduction support

## Dark Mode

- System preference detection
- Manual toggle with smooth 300ms transition
- Warmer copper tones in dark mode
- Consistent brand colors across modes
- Elevated surfaces with bronze-gray tones