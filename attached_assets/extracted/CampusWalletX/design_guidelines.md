# Smart Campus Wallet - Glassmorphism Design Guidelines

## Design Approach

**System Foundation:** Material Design principles with premium fintech aesthetics (Revolut, N26), interpreted through liquid glass/glassmorphism treatment

**Rationale:** Financial utility requires trust and clarity, achieved through sophisticated glassmorphism creating a premium, modern interface. Frosted glass effects differentiate the app while maintaining information hierarchy through layered transparency.

## Typography System

**Primary Font:** Inter (Google Fonts CDN)
- Headings: 700 weight, text-2xl to text-4xl, high contrast for glass readability
- Body: 500-600 weight, text-base to text-lg (heavier weights for glass legibility)
- Financial Data: 700 weight, tabular-nums for alignment
- Labels: 600 weight, text-sm (stronger than typical for transparency)

**Glass-Optimized Contrast:**
- All text requires stronger weight on translucent backgrounds
- Balance numbers: text-4xl, font-bold with subtle text-shadow for depth
- Transaction items: text-base, font-semibold
- Metadata: text-sm, font-medium (never font-normal on glass)

## Visual Treatment Core

### Glassmorphism Implementation

**Glass Effect Recipe:**
- backdrop-blur-xl for primary glass panels
- backdrop-blur-lg for secondary elements
- backdrop-blur-md for tertiary overlays
- Background: bg-white/10 to bg-white/20 for light mode
- Borders: border border-white/30 for glass edges
- Shadows: shadow-2xl with colored tints (shadow-red-500/10)

**Gradient System (Rutgers Scarlet Red Accents):**
- Hero gradients: from-red-500/20 via-purple-500/10 to-blue-500/10
- Card accents: from-red-600/30 to-transparent
- Balance cards: Subtle radial gradients behind glass
- Background: Multi-layer gradient mesh with scarlet red dominant

**Floating Aesthetic:**
- All cards elevated with transform hover:scale-105 transition
- Organic rounded-3xl to rounded-[2rem] corners
- Layered depth through stacked glass planes
- Soft shadows: shadow-xl shadow-red-500/20

## Layout System

**Spacing:** Tailwind units of 4, 6, 8, 12, 16, 20
- Glass card padding: p-6 to p-8 (generous for premium feel)
- Section spacing: space-y-8 to space-y-12
- Floating card gaps: gap-6 to gap-8
- Page margins: px-6 md:px-8 (wider for breathing room)

**Container Strategy:**
- Mobile: Full-width glass panels with px-6
- Desktop: max-w-7xl with floating card clusters
- Widgets: Organic max-w-sm to max-w-lg shapes

## Core Layout Structure

### Dashboard Landing
**Background:** Animated gradient mesh (scarlet red to purple to blue) with flowing organic shapes

**Hero Section (No Image):** Compact glass panel cluster featuring:
- Three floating balance cards in asymmetric grid (staggered vertical positioning)
- Each card: rounded-3xl, backdrop-blur-xl, bg-white/10, border-white/30, p-6
- Large balance numbers with subtle glow effect
- "Add Funds" button with backdrop-blur-md, bg-red-600/80, hover:bg-red-700

**Multi-Section Layout:**
1. **Balance Overview:** 3 glass cards in organic arrangement (not strict grid)
2. **Quick Actions:** Horizontal pill-shaped glass buttons with icons, scrollable
3. **Recent Transactions:** Glass list container with individual frosted items
4. **Spending Insights:** Glass panel with chart on gradient background
5. **Rewards Progress:** Circular glass tracker with animated fill
6. **Events Feed:** Masonry grid of glass cards with gradient overlays

### Transaction History
- Floating glass container with nested frosted list items
- Each transaction: Glass pill shape, icon in gradient circle, flex layout
- Category chips: Rounded-full, backdrop-blur-md, colored borders
- Sticky search bar: Full-width glass panel, backdrop-blur-xl
- Floating filter pills in horizontal scroll

### Other Key Screens
- **Budgets:** Grid of glass category cards with gradient progress fills
- **Rewards:** Circular glass achievement badges in organic cluster layout
- **AI Insights:** Chat bubbles with glass treatment, gradient message backgrounds
- **Payment:** Service cards with glass overlay on gradient backgrounds

## Component Library

### Navigation
- Bottom tab bar: Full-width frosted glass, backdrop-blur-xl, floating 16px from bottom
- Top bar: Translucent glass strip with logo, balance chip (glass pill), avatar
- Icons: Outlined style with gradient fills on active state

### Glass Cards
- Primary cards: rounded-3xl, backdrop-blur-xl, bg-white/15, border-white/30, shadow-2xl
- Nested cards: backdrop-blur-lg, bg-white/10, border-white/20
- Hover state: transform scale-105, shadow-red-500/30 glow
- Balance cards: Gradient background layer behind glass

### Data Display
- Progress bars: Glass tube with gradient fill, rounded-full
- Charts: Chart.js with translucent fills, gradient strokes
- Stat tiles: Glass rounded-2xl panels, gradient number backgrounds
- Lists: Alternating frosted items with subtle divider lines

### Forms & Inputs
- Text inputs: Glass outlined, rounded-xl, backdrop-blur-md, bg-white/10
- All inputs: h-12, border-white/30, focus:border-red-400/60
- Buttons: Primary (gradient bg with glass overlay), Secondary (glass outline)
- All interactive: backdrop-blur-md minimum

### Overlays
- Modals: Centered glass panel, rounded-3xl, backdrop-blur-2xl on dimmed background
- Bottom sheets: Slide-up glass with handle, rounded-t-3xl
- Toasts: Top-right glass pills with gradient accents
- Loading: Animated gradient skeleton with glass overlay

## Images

**Required Images:**
1. **Campus Event Cards:** aspect-ratio-video thumbnails with gradient-to-transparent overlay (from-black/60 to-transparent), rounded-2xl
2. **Empty States:** Minimal line illustrations on glass cards with gradient accents
3. **Achievement Badges:** Icon graphics with gradient fills inside glass circles
4. **AI Avatar:** Small rounded-full with gradient border ring

**Image Treatment:**
- All images: Gradient overlay for glass integration
- Rounded corners: rounded-xl to rounded-2xl
- Border overlay: border-2 border-white/20

## Accessibility

- Glass text contrast: Always font-semibold or font-bold minimum
- Focus rings: ring-2 ring-red-400/60 ring-offset-2
- Interactive elements: min-h-12 for thumb-friendly glass buttons
- Alternative indicators: Icons + gradient color coding (not transparency-dependent)
- High contrast mode: Increase bg opacity to bg-white/40

## Animations

**Smooth Transitions:**
- Glass hover: transition-all duration-300 ease-out
- Scale effects: hover:scale-105 on cards
- Gradient shifts: Subtle color rotation on backgrounds
- Number updates: CountUp with fade transition
- Chart loads: Fade-in with gradient wipe (400ms)

**Performance:** Minimize concurrent blur animations, static backdrop-blur for most elements

This glassmorphism system creates a premium, distinctive financial experience with visual sophistication while maintaining utility and trust through careful transparency management and strong typographic hierarchy.