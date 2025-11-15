# Smart Campus Wallet - Design Guidelines

## Design Approach

**Selected Approach:** Modern Fintech-Inspired Design System

Drawing inspiration from consumer fintech leaders (Venmo, Cash App, Mint) while following Material Design principles for data-rich financial applications. The design prioritizes clarity, trust, and quick comprehension of financial information—essential for student users managing campus finances.

**Key Design Principles:**
- **Financial Clarity:** All monetary values, balances, and budgets must be immediately scannable
- **Data Hierarchy:** Most important information (current balances, recent transactions) front and center
- **Trust & Stability:** Clean, professional aesthetic that conveys security and reliability
- **Student-Friendly:** Approachable, modern interface without being overly playful

---

## Typography System

**Font Stack:**
- Primary: Inter (via Google Fonts) - excellent readability for financial data
- Monospace: 'Roboto Mono' for monetary values and transaction IDs

**Type Scale:**
- **Hero Numbers** (balances): text-4xl to text-6xl, font-semibold
- **Section Headers**: text-2xl, font-bold
- **Card Titles**: text-lg, font-semibold
- **Body Text**: text-base, font-normal
- **Labels/Captions**: text-sm, font-medium
- **Monetary Values**: Use tabular numbers (font-variant-numeric: tabular-nums) for alignment

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **4, 6, 8, 12, 16** for consistent rhythm
- Component padding: p-6 or p-8
- Section spacing: mb-8 or mb-12
- Card gaps: gap-6
- Inner element spacing: space-y-4

**Container Strategy:**
- Dashboard layout: max-w-7xl mx-auto
- Content sections: px-4 sm:px-6 lg:px-8
- Cards: Full-width on mobile, multi-column grid on desktop

**Grid Patterns:**
- Balance cards: grid-cols-1 md:grid-cols-3 (Meal Plan, Dining Dollars, Campus Card)
- Transaction list: Single column with full-width cards
- Budget categories: grid-cols-1 md:grid-cols-2
- Charts: Full-width or 2-column for comparisons

---

## Component Library

### Navigation
**Top App Bar:**
- Fixed position with logo left, user profile/notifications right
- Height: h-16
- Contains: App name, navigation icons, user avatar
- Include notification bell icon for budget alerts

### Dashboard Cards
**Balance Overview Cards** (3-card grid):
- Large balance number at top (text-4xl, font-bold)
- Card type label above (text-sm, uppercase tracking)
- Progress indicator or recent activity below
- Rounded corners (rounded-xl), subtle shadow (shadow-md)

**Spending Breakdown Card:**
- Donut or pie chart visualization for category spending
- Legend with category names, amounts, and percentages
- Total spending prominently displayed

**Recent Transactions Card:**
- List format with merchant icon/avatar left
- Transaction details: merchant name, category tag, date
- Amount right-aligned in monospace font
- Separator lines between items (border-b)

### Budget Components
**Budget Progress Bars:**
- Category name and limit displayed above
- Horizontal progress bar showing spent/remaining
- Color-coded status (under budget, approaching limit, over budget)
- Spent amount and total displayed as "spent/total"

**Budget Creation Form:**
- Clean input fields with labels above
- Category selector (dropdown)
- Amount input with currency symbol
- Time period selector (weekly/monthly)

### Transaction List
**Transaction Cards:**
- Merchant icon or category badge (w-10 h-10, rounded-full)
- Merchant name (font-semibold)
- Category tag (small badge, rounded-full)
- Location and payment method (text-sm)
- Date and time (text-sm)
- Amount (font-bold, right-aligned)

### Rewards Section
**Points Display:**
- Large points balance (text-5xl, font-bold)
- Streak counter with flame/star icon
- Recent achievements list
- Progress to next reward tier

### AI Insights Panel
**Insight Cards:**
- Icon representing insight type
- Headline summary (font-semibold)
- Detailed recommendation text
- CTA button ("View Details" or "Apply Suggestion")

### Forms & Inputs
- Input fields: h-12, rounded-lg, border with focus states
- Labels: text-sm, font-medium, mb-2
- Buttons: h-12, rounded-lg, font-semibold
- Primary action: Prominent, full or auto width
- Secondary action: Outline style

---

## Images

**Hero Section Image:**
Include a large hero image showing diverse students on campus (studying, using phones, at campus café). Image should:
- Span full viewport width on desktop
- Height: 60vh on desktop, 40vh on mobile
- Overlay: Semi-transparent gradient for text readability
- Position hero content (app name, tagline, CTA) over image with blurred background buttons

**Additional Images:**
- Feature section: Students using mobile payment at campus dining
- Rewards section: Campus events, student activities
- About/How It Works: Screenshot mockups of the dashboard interface
- All images should have rounded corners (rounded-xl) when displayed as cards

---

## Page Structure

### Main Dashboard Layout
1. **App Bar** (fixed top)
2. **Balance Overview Section** (3-card grid immediately below header)
3. **Quick Actions Row** (Add Transaction, View Budget, Pay, Scan buttons)
4. **Spending Insights** (Chart + AI summary if enabled, side-by-side on desktop)
5. **Recent Transactions** (Scrollable list, "View All" link)
6. **Budget Status** (Progress bars for active budgets)
7. **Rewards Summary** (Points, streaks, achievements)

### Budget Management Page
- Page header with "Create Budget" CTA
- Active budgets grid (2 columns on desktop)
- Historical budget performance
- Savings suggestions from AI

### Transaction History Page
- Filter bar (date range, category, payment method)
- Search input
- Full transaction list with infinite scroll or pagination
- Export functionality button

### Rewards Page
- Large points balance card
- Achievement showcase grid
- Redemption options
- Activity feed

---

## Accessibility & Interaction

- All interactive elements minimum h-12 for touch targets
- Form inputs have visible focus states (ring-2)
- Monetary values use consistent formatting ($X.XX)
- Icons paired with text labels
- Cards have hover elevation (hover:shadow-lg transition)
- Loading states for AI insights
- Empty states with illustrations and helpful CTAs

---

## Responsive Behavior

**Mobile (base to md):**
- Single column layout
- Stacked balance cards
- Collapsible filters
- Bottom navigation for main actions

**Desktop (lg+):**
- Multi-column grids
- Side-by-side comparisons
- Persistent sidebar navigation option
- Larger charts and visualizations