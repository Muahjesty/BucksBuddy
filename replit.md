# Smart Campus Wallet

## Overview

Smart Campus Wallet is a comprehensive financial management platform designed for college students at Rutgers University-Newark. The application helps students track campus-related spending, manage multiple payment methods (meal plans, dining dollars, campus cards), set budgets, earn rewards, and gain AI-powered insights into their financial habits. Built for the HackFest 2025 hackathon, the application provides a modern, fintech-inspired interface with Rutgers branding and a clean black/white/red design theme that makes financial management approachable and engaging for students.

## Recent Changes (November 16, 2025)

**Clean Black/White/Red Theme Implementation:**
- Removed all glassmorphism/liquid glass effects and converted to clean solid color design
- Updated all CSS variables to use exact Rutgers scarlet red (#CC0033 / HSL: 345° 100% 40%)
- Removed all glass utility classes (`.glass`, `.glass-card`, `.glass-strong`, `.glass-subtle`)
- Updated all dialog components to use clean solid backgrounds
- Updated sidebar and balance cards to use clean solid backgrounds
- Verified theme works properly in both light and dark modes with proper color contrast
- Primary color now consistently uses Rutgers scarlet throughout the application

**Previous Changes (November 15, 2025):**
- Integrated Replit Auth (OpenID Connect) supporting email/password, Google, GitHub, X, and Apple logins
- Added PostgreSQL-backed session management for persistent authentication
- Implemented automatic token refresh flow with proper session persistence
- Created Landing page for logged-out users showcasing app features
- All API routes now protected with authentication middleware
- Migrated users table from username/password to OIDC-based fields
- Added sessions table for persistent session storage

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- **React with TypeScript** - Component-based UI architecture using functional components and hooks
- **Vite** - Fast build tool and development server with hot module replacement
- **Wouter** - Lightweight client-side routing (alternative to React Router)
- **TanStack Query** - Server state management for data fetching, caching, and synchronization

**UI Component System:**
- **shadcn/ui** - Accessible, customizable component library built on Radix UI primitives
- **Tailwind CSS** - Utility-first styling with custom design tokens for Rutgers branding
- **Class Variance Authority (CVA)** - Type-safe component variant management
- **Recharts** - Composable charting library for data visualizations (spending breakdowns, budget progress)

**Design System:**
- **Clean Black/White/Red Theme** - Solid colors with clean, modern appearance
- Rutgers scarlet red (#CC0033 / HSL: 345° 100% 40%) as primary brand color throughout
- Custom theme system supporting light/dark modes with proper contrast
- Typography using Inter font family for readability of financial data
- Monospace fonts (Roboto Mono) for monetary values to ensure alignment
- **Light Mode Colors:**
  - Background: Pure white (HSL: 0° 0% 100%)
  - Cards: White with subtle borders
  - Primary: Rutgers scarlet (HSL: 345° 100% 40%)
  - Sidebar: Light gray (HSL: 0° 0% 98%)
- **Dark Mode Colors:**
  - Background: Dark gray (HSL: 0° 0% 3.9%)
  - Cards: Dark with subtle borders
  - Primary: Brighter Rutgers scarlet (HSL: 345° 100% 50%)
  - Sidebar: Dark (HSL: 0° 0% 10%)

### Backend Architecture

**Server Framework:**
- **Express.js** - RESTful API server with middleware-based architecture
- **Node.js ESM** - Modern ECMAScript modules for clean imports and better tree-shaking

**Authentication & Session Management:**
- **Replit Auth (OpenID Connect)** - Secure authentication with multiple login providers (email/password, Google, GitHub, X, Apple)
- **passport.js** - Express authentication middleware for OIDC integration
- **openid-client** - Official OpenID Connect client library for token management
- **connect-pg-simple** - PostgreSQL-backed session store for persistent user sessions
- **Token Refresh Flow** - Automatic token refresh with proper session persistence using req.login()
- Express session middleware for authentication state with 7-day TTL

**API Design:**
- RESTful endpoints prefixed with `/api`
- All endpoints (except auth routes) protected with `isAuthenticated` middleware
- JSON request/response format
- Request logging middleware for debugging and monitoring
- Error handling with structured error responses
- User context available via `req.user.claims.sub` in protected routes

### Data Storage

**Database:**
- **PostgreSQL** (via Neon Database serverless) - Relational database for structured data
- **Drizzle ORM** - Type-safe SQL query builder and migration tool
- **Drizzle-Zod** - Runtime schema validation from database schema

**Schema Design:**
The application uses five primary tables:

1. **users** - Student profiles with OIDC authentication (id, email, firstName, lastName, profileImageUrl, timestamps)
2. **sessions** - PostgreSQL-backed session storage for persistent authentication (sid, sess, expire)
3. **transactions** - Financial transaction records with merchant, category, amount, payment method, location, and timestamp
4. **budgets** - User-defined spending limits by category and time period (weekly/monthly) with current spending tracking
5. **campusEvents** - Campus events with title, description, category, location, date, time, price, and registration URL

**Data Access Pattern:**
- Storage interface abstraction (`IStorage`) allows swapping between in-memory and database implementations
- Currently implements `MemStorage` for development with mock data
- Production would use database-backed storage implementing the same interface

### External Dependencies

**Third-Party UI Libraries:**
- **@radix-ui/** - Headless accessible UI primitives (accordion, dialog, dropdown, tabs, tooltip, etc.)
- **lucide-react** - Icon library with consistent design
- **react-hook-form** - Form state management and validation
- **date-fns** - Date manipulation and formatting
- **embla-carousel-react** - Touch-friendly carousel component

**Development Tools:**
- **@replit/** plugins - Development experience enhancements for Replit environment (error overlay, cartographer, dev banner)
- **tsx** - TypeScript execution for development server
- **esbuild** - Fast JavaScript bundler for production builds

**Data Visualization:**
- **recharts** - React wrapper for D3-based charts (pie charts for spending breakdown)

**Database & ORM:**
- **@neondatabase/serverless** - Serverless PostgreSQL driver optimized for edge environments
- **drizzle-orm** - Type-safe database queries with automatic TypeScript inference
- **drizzle-kit** - CLI for schema migrations and database management

**Optional AI Integration:**
The architecture supports AI-powered features (spending summaries, recommendations, Q&A) though specific AI service integration is not yet implemented. The `AIInsights` component is designed to display AI-generated insights with categorization (savings, spending, recommendations).

### Key Architectural Decisions

**Monorepo Structure:**
- **client/** - Frontend React application
- **server/** - Express backend
- **shared/** - Shared TypeScript types and database schema (ensures type safety across frontend/backend boundary)

**Type Safety:**
- Full TypeScript coverage with strict mode enabled
- Path aliases (@/, @shared/) for cleaner imports
- Zod schemas derived from database schema for runtime validation
- Component prop types using TypeScript generics

**Responsive Design:**
- Mobile-first approach with breakpoint-based layouts
- Custom hook (`useIsMobile`) for device detection
- Adaptive sidebar that collapses on mobile devices

**State Management Philosophy:**
- Server state via TanStack Query (transactions, budgets, rewards)
- Local UI state via React hooks (theme preference, dialog open/close)
- Form state via react-hook-form
- No global state management library needed due to component-based architecture

**Security Considerations:**
- Password hashing expected for production (currently basic storage)
- CSRF protection via session middleware
- SQL injection prevention via parameterized queries (Drizzle ORM)
- Input validation via Zod schemas

**Development vs. Production:**
- Environment-aware configuration (NODE_ENV)
- Development uses in-memory storage, production would use PostgreSQL
- Vite dev server with HMR in development
- Optimized production build with code splitting and minification