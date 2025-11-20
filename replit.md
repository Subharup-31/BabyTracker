# BabyTrack - Premium Pediatric Baby Tracker SaaS

## Overview
BabyTrack is a comprehensive, premium SaaS web application designed for modern parents to track their baby's health journey. Built with React, TypeScript, and Express, it features a beautiful pastel baby-care theme following modern SaaS design patterns inspired by Linear, Notion, and Framer.

## Recent Changes (November 20, 2025)
- **Complete MVP Implementation**: Built entire application from scratch
- **Frontend**: Premium landing page, authentication, dashboard, baby profile, vaccine tracker, growth tracker, and AI chatbot
- **Backend**: Full REST API with session-based authentication, CRUD operations, and Gemini AI integration
- **Design System**: Implemented pastel baby-care color theme with Inter and Poppins fonts
- **Authentication**: Session-based auth with protected routes and auth provider, added /api/auth/me endpoint
- **Data Persistence**: Switched from in-memory to PostgreSQL database with Drizzle ORM
- **PDF Generation**: Client-side PDF reports for growth tracking
- **AI Integration**: Gemini-powered pediatric chatbot for parental guidance

## User Preferences
- Modern, clean SaaS aesthetic with pastel colors
- Mobile-first design with bottom navigation
- Professional yet warm and approachable tone
- Focus on ease of use for busy parents

## Project Architecture

### Technology Stack
- **Frontend**: React 18, TypeScript, Wouter (routing), TanStack Query (data fetching)
- **Backend**: Express.js, TypeScript, express-session with memorystore
- **UI Framework**: Tailwind CSS, shadcn/ui components
- **AI**: Google Gemini API for pediatric assistant
- **PDF Generation**: jsPDF and jsPDF-AutoTable
- **Charts**: Recharts for growth visualizations

### Data Model (shared/schema.ts)
- **users**: Authentication (username, password)
- **babyProfiles**: Baby information (name, birthDate, gender, photoUrl)
- **vaccines**: Vaccination tracking (name, dueDate, status)
- **growthRecords**: Height/weight measurements (date, height, weight)
- **chatMessages**: AI chat history (role, content, timestamp)

### Application Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── AuthProvider.tsx # Authentication context and protected routes
│   │   ├── ThemeProvider.tsx # Dark/light mode
│   │   ├── AppLayout.tsx    # Authenticated app layout
│   │   └── BottomNav.tsx    # Mobile navigation
│   ├── pages/
│   │   ├── landing.tsx      # Public landing page
│   │   ├── login.tsx        # Login page
│   │   ├── signup.tsx       # Signup page
│   │   ├── dashboard.tsx    # Main dashboard with overview
│   │   ├── profile.tsx      # Baby profile management
│   │   ├── vaccines.tsx     # Vaccine tracker
│   │   ├── growth.tsx       # Growth tracker with charts
│   │   └── chat.tsx         # AI chatbot
│   ├── lib/
│   │   └── queryClient.ts   # TanStack Query config with credentials
│   └── index.css            # Design tokens and theme

server/
├── routes.ts                # API endpoints with session auth
├── storage.ts               # In-memory data storage interface
└── gemini.ts                # Gemini AI integration
```

### Key Features

1. **Landing Page**
   - Hero section with gradient background and generated images
   - Feature cards (Vaccines, Growth, PDF Reports, AI Chatbot)
   - How It Works section with 4-step process
   - Testimonials with generated avatars
   - CTA section and footer

2. **Authentication**
   - Session-based with memorystore
   - Protected routes with AuthProvider
   - Auto-redirect to login if unauthenticated
   - Credentials included in all API requests

3. **Dashboard**
   - Baby profile overview
   - Next vaccine due
   - Pending/completed vaccine counts
   - Latest growth measurements
   - Mini growth chart preview
   - Quick action buttons

4. **Vaccine Tracker**
   - CRUD operations for vaccines
   - Color-coded status badges:
     - Green: Completed
     - Blue: Due Today
     - Red: Overdue
     - Pink: Pending
   - Sorted by due date with completed items last
   - Mark as complete functionality

5. **Growth Tracker**
   - Record height (cm) and weight (grams)
   - Dual-axis line chart (height & weight)
   - Sortable data table
   - PDF export with baby profile and all records
   - Generated with jsPDF on client-side

6. **AI Chatbot**
   - Bubble-style chat interface
   - Powered by Gemini 2.0 Flash
   - Pediatric-focused system prompt
   - Chat history persisted per user
   - Real-time responses

### Environment Variables
- `GEMINI_API_KEY`: Google AI API key for chatbot
- `SESSION_SECRET`: Session encryption key (optional, has default)

### Design Tokens
- Primary: Soft blue (#4AB8E6)
- Secondary: Lavender purple
- Accent: Soft pink
- Background: Light cream (98% lightness)
- Card: Pure white with subtle shadows
- Fonts: Inter (body), Poppins (headings)

### API Endpoints

**Auth**
- POST `/api/auth/signup` - Create account
- POST `/api/auth/login` - Sign in
- GET `/api/auth/me` - Check auth status
- POST `/api/auth/logout` - Sign out

**Baby Profile**
- GET `/api/baby-profile` - Get profile
- POST `/api/baby-profile` - Create profile
- PUT `/api/baby-profile` - Update profile

**Vaccines**
- GET `/api/vaccines` - List all vaccines
- POST `/api/vaccines` - Add vaccine
- PATCH `/api/vaccines/:id` - Update vaccine
- DELETE `/api/vaccines/:id` - Delete vaccine

**Growth Records**
- GET `/api/growth-records` - List all records
- POST `/api/growth-records` - Add record
- DELETE `/api/growth-records/:id` - Delete record

**Chat**
- GET `/api/chat/messages` - Get chat history
- POST `/api/chat/send` - Send message to AI

## Development Notes
- All protected routes wrapped in `<ProtectedRoute>`
- TanStack Query configured with `credentials: 'include'` for session cookies
- Dark mode support with theme toggle in headers
- Mobile-first with responsive breakpoints (md, lg)
- Bottom navigation for app pages
- Hover and active states using custom elevation utilities
- All data isolated by `userId` in session
