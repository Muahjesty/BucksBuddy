# Smart Campus Wallet

## Overview

Smart Campus Wallet is a financial management application designed for college students to manage their campus finances. The application provides a unified interface for tracking meal plans, dining dollars, campus card balances, transactions, budgets, rewards, and campus events. Students can monitor their spending, set budget limits, earn rewards for smart financial habits, and interact with an AI-powered financial assistant for personalized insights.

**New Features** (November 15, 2025):
- **Tap & Pay**: QR code-based contactless payment system allowing students to pay at merchant terminals using meal plan, dining dollars, or campus card balance
- **Web Scraping**: Automated scraping of campus dining menus and merchant data to keep pricing and availability information up-to-date

## User Preferences

Preferred communication style: Simple, everyday language.

## Current Status

**PostgreSQL Database Integrated** ✅:  
The application is fully integrated with PostgreSQL for permanent data storage. All user data (users, balances, transactions, budgets, rewards, events) is persisted in the database using Drizzle ORM. Database schema includes 6 tables with automatic UUID generation and foreign key relationships. User registration automatically creates associated balance and rewards records.

**Authentication Fixed** ✅:  
Successfully resolved React context propagation bug by moving `AuthContext` and `useAuth` hook to a separate file (`client/src/contexts/AuthContext.tsx`). This fixed both the Vite HMR incompatibility warning and the context propagation issue. Dashboard now correctly displays authenticated username ("Welcome back, MarvinN!") instead of "Guest".

**Database Statistics** (as of November 15, 2025):
- 15+ registered users
- All transactions and budgets persisted
- Session storage in PostgreSQL (connect-pg-simple)
- Tap & Pay sessions with QR token-based authentication
- Web-scraped merchant menu and pricing data

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, built using Vite for fast development and optimized production builds.

**Routing**: Wouter for lightweight client-side routing. The application uses a single-page architecture with routes for Dashboard, Transactions, Budgets, Rewards, and AI Insights pages.

**State Management**: TanStack Query (React Query) for server state management, caching, and data synchronization. Client-side state is managed through React hooks with minimal global state requirements.

**UI Component Library**: Shadcn UI (Radix UI primitives) with customized Tailwind CSS styling. The design system follows Material Design principles with inspiration from fintech apps (Venmo, Cash App, Revolut) for trust signals and information density.

**Design System**:
- Typography: Inter font family via Google Fonts CDN
- Color scheme: Neutral base with customizable HSL-based theme variables supporting light/dark modes
- Spacing: Tailwind's spacing scale (units of 2, 4, 6, 8, 12, 16)
- Mobile-first responsive design with bottom navigation for mobile devices
- Component patterns emphasize card-based layouts with rounded corners, subtle shadows, and hover elevation effects

**Data Visualization**: Recharts library for rendering spending charts (bar charts, pie charts) with category breakdowns and weekly spending patterns.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript support.

**API Design**: RESTful API architecture with endpoints organized by domain:
- `/api/balance` - User balance operations (meal plan, dining dollars, campus card)
- `/api/transactions` - Transaction history and filtering
- `/api/budgets` - Budget creation, updates, and tracking
- `/api/rewards` - Rewards points and achievement system
- `/api/events` - Campus events and ticket purchasing

**Development Mode**: Vite dev server integration with HMR (Hot Module Replacement) for development. Production builds are served as static assets.

**Session Management**: Express sessions with PostgreSQL-backed session store (connect-pg-simple).

**Request Handling**: JSON body parsing with raw body preservation for webhook verification. Comprehensive request/response logging for API endpoints.

### Data Storage

**Database**: PostgreSQL accessed via Neon serverless driver for WebSocket-based connections.

**ORM**: Drizzle ORM for type-safe database queries and schema management.

**Schema Design**:
- `users` - User authentication (username, hashed passwords)
- `balances` - Per-user financial balances (meal plan count, dining dollars, campus card balance)
- `transactions` - Transaction records (amount, category, merchant, date, type)
- `budgets` - User-defined spending limits by category with spent tracking
- `rewards` - Rewards points, level progression, and achievements
- `campusEvents` - Campus events with pricing and category information
- `tap_sessions` - QR code payment sessions with 60-second TTL and token-based auth
- `merchant_terminals` - Physical merchant terminals accepting Tap & Pay
- `merchant_sources` - Web scraping source URLs for merchant data
- `scraped_items` - Normalized menu items, pricing, and availability from scraping

**Migration Strategy**: Drizzle Kit for schema migrations with output to `/migrations` directory.

**Data Access Layer**: Repository pattern implemented via `DatabaseStorage` class providing typed interfaces for all CRUD operations.

### Authentication & Authorization

**Implementation**: Full session-based authentication system with user registration and login.

**Security**:
- Passwords hashed using bcrypt (10 salt rounds)
- Session management via express-session with PostgreSQL store (connect-pg-simple)
- HTTP-only session cookies with secure flag in production
- 30-day session expiration
- Protected API routes requiring authentication via middleware

**Authentication Flow**:
1. Registration: Users create accounts with username/password → automatically logged in with session
2. Login: Credentials verified against hashed passwords → session created on success
3. Session Persistence: User state maintained via AuthContext (React) checking `/api/auth/user` endpoint
4. Protected Routes: Client-side route protection redirects unauthenticated users to `/login`
5. Logout: Session destroyed server-side, client state cleared

**API Endpoints**:
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate and create session
- `POST /api/auth/logout` - Destroy session
- `GET /api/auth/user` - Get current authenticated user

**User Data Initialization**: New users automatically receive:
- Starting balance (14 meal swipes, $300 dining dollars, $150 campus card)
- Empty transaction history
- Bronze rewards level (0 points)

**Protected Resources**: All financial endpoints (`/api/balance`, `/api/transactions`, `/api/budgets`, `/api/rewards`, `/api/events/pay`, etc.) require authentication and scope data to the logged-in user's session.

### External Dependencies

**Database Service**: Neon PostgreSQL (serverless PostgreSQL with WebSocket support)
- Connection pooling via `@neondatabase/serverless` Pool
- Environment variable: `DATABASE_URL`

**Google Fonts CDN**: Inter font family and additional typefaces (Architects Daughter, DM Sans, Fira Code, Geist Mono)

**Image Assets**: Static image assets stored in `/attached_assets/generated_images/` for event thumbnails and AI assistant avatar.

**Development Tools**:
- Replit-specific plugins for runtime error overlay, cartographer, and dev banner
- ESBuild for backend bundling in production
- PostCSS with Tailwind CSS and Autoprefixer

**UI Dependencies**: Comprehensive Radix UI primitive collection for accessible, unstyled components (accordions, dialogs, dropdowns, tooltips, etc.)

**Validation**: Zod for schema validation integrated with Drizzle ORM (`drizzle-zod`) for type-safe API input validation.

**Date Handling**: date-fns library for date formatting and manipulation throughout the application.

**QR Code Generation**: qrcode library for generating payment QR codes in Tap & Pay feature.

**Web Scraping**: Axios for HTTP requests and Cheerio for HTML parsing to extract merchant menu/pricing data from campus dining portals.

### Tap & Pay System

**Architecture**: Token-based QR payment system with merchant terminal integration.

**Payment Flow**:
1. Student creates tap session via TapPayDialog (selects payment source: meal plan, dining dollars, or campus card)
2. Frontend generates QR code containing signed token with 60-second expiration
3. Merchant terminal scans QR code and submits payment request to `/api/tap/authorize`
4. Server validates token, checks balance, processes payment, and creates transaction record
5. Student receives real-time confirmation and rewards points

**Security Features**:
- Short-lived tokens (60-second TTL) minimize fraud window
- Amount caps prevent overcharging
- Signed tokens using HMAC (production-ready)
- Merchant API key validation for terminal access
- Session state tracking (pending → captured/expired)

**API Endpoints**:
- `POST /api/tap/create` - Create new tap session with QR token
- `POST /api/tap/authorize` - Merchant terminal payment authorization and capture
- `GET /api/tap/session/:token` - Check session status

### Web Scraping System

**Purpose**: Automatically update merchant menu items, pricing, and availability from campus dining portals.

**Implementation**:
- Scraper module: `server/scrapers/dining-scraper.ts`
- HTTP client: Axios for fetching HTML content
- Parser: Cheerio for DOM traversal and data extraction
- Storage: `merchant_sources` stores raw HTML, `scraped_items` stores normalized data

**Data Normalization**:
- Merchant name, item name, description
- Pricing (converted to decimal)
- Category classification
- Availability flags
- Timestamp tracking

**API Endpoints**:
- `POST /api/scraper/run` - Manually trigger scraper (authenticated users)
- `GET /api/menu/items` - Fetch scraped menu items with optional filters (merchant, category)

**Future Enhancements**:
- Scheduled scraping via cron jobs or background workers
- Support for additional merchant portals beyond dining
- Price change notifications
- Menu item popularity tracking