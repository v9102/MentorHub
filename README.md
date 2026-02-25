# MentoMania

> Connect with top scorers and mentors who have cracked IIT JEE, NEET, CAT, UPSC and more. Get personalized guidance to achieve your goals.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development Status](#development-status)
- [Implemented Features](#implemented-features)
- [Pending Features](#pending-features)
- [Known Issues](#known-issues)
- [Roadmap](#roadmap)
- [Scripts](#scripts)

---

## Overview

**MentoMania** is a comprehensive mentorship platform designed to connect students preparing for competitive exams (IIT JEE, NEET, CAT, UPSC, GATE, etc.) with experienced mentors who have successfully cleared these exams. The platform provides a complete ecosystem for booking sessions, tracking progress, and facilitating mentor-student interactions.

---

## Features

### ✅ Fully Implemented
- **Landing Page** - Modern, responsive hero section with exam categories, testimonials, FAQ, and CTAs
- **Mentor Discovery** - Advanced browse, search, and filter system with pagination
- **Authentication** - Complete Clerk integration with sign-in/sign-up
- **Mentor Onboarding** - 4-step registration flow (Personal, Professional, Billing, Review)
- **Mentor Dashboard** - Comprehensive dashboard with analytics, earnings tracking, and profile management
- **Student Dashboard** - Learning trends visualization and quick action cards
- **Backend API** - Express.js server with MongoDB integration
- **User Management** - Complete CRUD operations for users and mentors
- **Webhook Integration** - Clerk webhook handling for user synchronization
- **Profile Management** - Update and view mentor profiles
- **Responsive Design** - Mobile-first approach with Tailwind CSS 4
- **UI Components** - Rich component library with charts, cards, filters, and animations

### 🔨 Partially Implemented
- **Booking System** - UI pages exist but functionality incomplete
- **Session Management** - API routes created but not fully connected
- **Payment Integration** - Razorpay dependency added but not implemented
- **Analytics** - Charts and visualizations using mock data

### 📋 Planned
- **Payment Processing** - Complete Razorpay integration
- **Real-time Video Calls** - Video/audio session functionality
- **Live Chat** - Real-time messaging between students and mentors
- **Reviews & Ratings** - Student feedback system
- **Notifications** - Email and in-app notifications
- **Advanced Analytics** - Real-time data tracking and insights
- **Mobile App** - Native iOS/Android applications

---

## Tech Stack

### Frontend
| Technology | Purpose | Status |
|-----------|---------|--------|
| **Next.js 16** | React framework with App Router | ✅ Implemented |
| **React 19** | UI library | ✅ Implemented |
| **TypeScript 5** | Type safety | ✅ Implemented |
| **Tailwind CSS 4** | Styling framework | ✅ Implemented |
| **Clerk** | Authentication & user management | ✅ Implemented |
| **Firebase** | Database (Firestore) | ⚠️ Configured, not actively used |
| **Framer Motion** | Animations & transitions | ✅ Implemented |
| **Lucide React** | Icon library | ✅ Implemented |
| **React Hook Form** | Form handling | ✅ Implemented |
| **Recharts** | Data visualization | ✅ Implemented |
| **Axios** | HTTP client | ✅ Implemented |

### Backend
| Technology | Purpose | Status |
|-----------|---------|--------|
| **Express 5** | Web framework | ✅ Implemented |
| **MongoDB** | Primary database | ✅ Implemented |
| **Mongoose** | ODM for MongoDB | ✅ Implemented |
| **Clerk SDK** | Server-side auth | ✅ Implemented |
| **Firebase Admin** | Server-side Firebase (optional) | 📦 Installed |
| **Razorpay** | Payment gateway | 📦 Installed, not implemented |
| **Svix** | Webhook verification | ✅ Implemented |
| **JWT** | Token generation | ✅ Implemented |
| **bcryptjs** | Password hashing | ✅ Implemented |
| **Zod** | Schema validation | 📦 Installed |

### DevOps
| Technology | Purpose | Status |
|-----------|---------|--------|
| **Docker** | Containerization | ✅ Dockerfiles present |
| **Google Cloud** | Deployment (Cloud Build) | ⚠️ Config exists |

---

## Project Structure

```
MentoMania/
├── frontend/                           # Next.js Application
│   ├── src/
│   │   ├── app/                        
│   │   │   ├── (auth)/                 # ✅ Authentication pages
│   │   │   │   ├── sign-in/            # ✅ Sign-in page
│   │   │   │   └── sign-up/            # ✅ Sign-up page
│   │   │   ├── (protected)/            # 🔒 Protected routes (auth required)
│   │   │   │   ├── dashboard/          
│   │   │   │   │   ├── student/        # ✅ Student dashboard with analytics
│   │   │   │   │   └── mentor/         # ✅ Mentor dashboard (earnings, analytics, profile)
│   │   │   │   ├── book/               # ⚠️ Booking pages (UI only)
│   │   │   │   │   └── [mentorId]/     # ⚠️ Mentor booking & confirmation
│   │   │   │   ├── session/            # 📋 Session pages (planned)
│   │   │   │   └── call/               # 📋 Video call pages (planned)
│   │   │   ├── (public)/               # 🌐 Public pages
│   │   │   │   ├── page.tsx            # ✅ Landing page
│   │   │   │   ├── mentors/            # ✅ Mentor discovery & profiles
│   │   │   │   ├── about/              # ✅ About page
│   │   │   │   ├── pricing/            # ✅ Pricing page
│   │   │   │   ├── how-it-works/       # ✅ How it works
│   │   │   │   ├── faq/                # ✅ FAQ page
│   │   │   │   ├── contact/            # ✅ Contact page
│   │   │   │   ├── blogs/              # ✅ Blog section
│   │   │   │   ├── careers/            # ✅ Careers page
│   │   │   │   ├── community/          # ✅ Community page
│   │   │   │   ├── partners/           # ✅ Partners page
│   │   │   │   ├── exam/               # ✅ Exam categories
│   │   │   │   ├── privacy/            # ✅ Privacy policy
│   │   │   │   ├── terms/              # ✅ Terms of service
│   │   │   │   └── cookie/             # ✅ Cookie policy
│   │   │   ├── api/                    # API Routes
│   │   │   │   ├── webhooks/           # ✅ Clerk webhook handler
│   │   │   │   ├── mentor/             # ✅ Mentor API proxy
│   │   │   │   └── sessions/           # ⚠️ Session API routes (created, not functional)
│   │   │   ├── onboarding/             
│   │   │   │   ├── mentor/             # ✅ 4-step mentor registration
│   │   │   │   ├── mentor-setup/       # ✅ Mentor profile setup
│   │   │   │   └── profile/            # ✅ Profile onboarding
│   │   │   └── test/                   # ✅ Test page
│   │   ├── modules/                    # Feature modules
│   │   │   ├── landing/                # ✅ Landing page components
│   │   │   │   ├── components/         # ✅ Hero, Features, Testimonials, FAQ, CTA
│   │   │   │   └── data.ts             # ✅ Landing page data
│   │   │   ├── mentor/                 # ✅ Mentor-specific components
│   │   │   │   ├── components/         # ✅ Mentor cards, filters
│   │   │   │   └── registration/       # ✅ Multi-step registration forms
│   │   │   └── onboarding/             # ✅ Onboarding components
│   │   │       ├── OnboardingLayout.tsx
│   │   │       ├── OnboardingSidebar.tsx
│   │   │       ├── ProgressBar.tsx
│   │   │       └── StickyFooter.tsx
│   │   └── shared/                     # Shared utilities & components
│   │       ├── hooks/                  # ✅ Custom React hooks
│   │       ├── lib/                    
│   │       │   ├── api/                # ✅ API client functions
│   │       │   ├── context/            # ✅ React contexts (MentorOnboarding)
│   │       │   ├── models/             # ✅ Data models
│   │       │   ├── types/              # ✅ TypeScript types
│   │       │   ├── db.ts               # ⚠️ Firebase config (not actively used)
│   │       │   ├── firebase.ts         # ⚠️ Firebase setup
│   │       │   └── utils.ts            # ✅ Utility functions
│   │       ├── types/                  # ✅ Shared TypeScript types
│   │       │   ├── booking.ts
│   │       │   └── mentor.ts
│   │       └── ui/                     # ✅ Reusable UI components (40+ components)
│   │           ├── Navbar.tsx
│   │           ├── Footer.tsx
│   │           ├── FiltersPanel.tsx
│   │           ├── SimpleMentorCard.tsx
│   │           ├── Pagination.tsx
│   │           ├── PremiumAreaChart.tsx
│   │           ├── PremiumBarChart.tsx
│   │           ├── PremiumDonutChart.tsx
│   │           ├── PremiumLineChart.tsx
│   │           ├── ProfileBanner.tsx
│   │           └── ... (many more)
│   ├── public/                         # Static assets
│   │   └── mentors/                    # Mentor profile photos
│   ├── Dockerfile                      # ✅ Frontend Docker config
│   ├── next.config.ts                  # ✅ Next.js configuration
│   ├── tailwind.config.ts              # ✅ Tailwind CSS config
│   └── package.json
│
├── backend/                            # Express.js API Server
│   ├── src/
│   │   ├── app.js                      # ✅ Express app configuration
│   │   ├── config/                     
│   │   │   ├── db.js                   # ✅ MongoDB connection
│   │   │   └── clerk.js                # ✅ Clerk configuration
│   │   ├── controllers/                # ✅ Request handlers
│   │   │   ├── mentor.controller.js    # ✅ Mentor CRUD operations
│   │   │   ├── mentorAuth.controller.js # ✅ Mentor registration
│   │   │   └── webhook.controller.js   # ✅ Clerk webhook handler
│   │   ├── middleware/                 
│   │   │   ├── auth.js                 # ✅ JWT authentication
│   │   │   └── requireMentor.js        # ✅ Role-based access control
│   │   ├── models/                     
│   │   │   └── user.js                 # ✅ User & Mentor schema (Mongoose)
│   │   ├── routes/                     # ✅ API route definitions
│   │   │   ├── mentor.routes.js        # ✅ GET /mentors, GET /mentor/:id, PUT /mentor/profile
│   │   │   ├── mentorAuth.routes.js    # ✅ POST /become-mentor
│   │   │   └── webhook.routes.js       # ✅ POST /webhook/clerk
│   │   └── utils/
│   │       └── generateToken.js        # ✅ JWT token generation
│   ├── server.js                       # ✅ Server entry point
│   ├── Dockerfile                      # ✅ Backend Docker config
│   ├── cloudbuild.yaml                 # ⚠️ Google Cloud Build config
│   ├── TROUBLESHOOTING.md              # 📝 Troubleshooting guide
│   └── package.json
│
├── package.json                        # Root package.json
└── README.md                           # This file
```

**Legend:**
- ✅ Fully implemented and working
- ⚠️ Partially implemented or needs work
- 📋 Planned/not started
- 🔒 Protected (authentication required)
- 🌐 Public access

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm**, **yarn**, or **pnpm**
- **MongoDB** - Local installation or MongoDB Atlas account
- **Clerk Account** - [Sign up here](https://clerk.com/)
- **Firebase Project** - [Create one here](https://console.firebase.google.com/) (Optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MentoMania
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

5. **Set up environment variables** (see [Environment Variables](#environment-variables))

6. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

7. **Run the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

8. **Run the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

9. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

### Frontend (`frontend/.env.local`)

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Clerk Webhook Secret (for synchronization)
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# Firebase Configuration (Optional - not actively used)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# API Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### Backend (`backend/.env`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/mentomania
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mentomania?retryWrites=true&w=majority

# Clerk Configuration
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Firebase Admin SDK (Optional)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com

# Razorpay (When implementing payments)
# RAZORPAY_KEY_ID=rzp_test_xxxxx
# RAZORPAY_KEY_SECRET=xxxxx
```

---

## Development Status

### Current Status: **MVP Phase - 60% Complete**

| Component | Status | Completeness | Notes |
|-----------|--------|--------------|-------|
| **Frontend UI** | ✅ Working | 90% | All major pages designed and implemented |
| **Authentication** | ✅ Working | 100% | Clerk integration complete with webhook sync |
| **Backend API** | ✅ Working | 70% | Core endpoints functional, needs expansion |
| **Database** | ✅ Working | 80% | MongoDB with Mongoose, schema complete |
| **Mentor System** | ✅ Working | 85% | Registration, profiles, discovery working |
| **Student System** | ⚠️ Partial | 50% | Dashboard exists, needs session integration |
| **Booking System** | ⚠️ Partial | 30% | UI created, backend logic missing |
| **Payments** | 📋 Not Started | 0% | Dependencies installed, implementation needed |
| **Sessions/Calls** | 📋 Not Started | 10% | Routes created, no functionality |
| **Analytics** | ⚠️ Partial | 60% | Charts working with mock data |
| **Notifications** | 📋 Not Started | 0% | Not implemented |

---

## Implemented Features

### 🎨 Frontend (Next.js 16 + React 19)

#### ✅ Landing & Marketing Pages
- **Landing Page** - Complete with hero, features, testimonials, FAQ, CTAs
- **About Page** - Company information and mission
- **How It Works** - Step-by-step guide
- **Pricing Page** - Pricing tiers and plans
- **FAQ Section** - Common questions and answers
- **Contact Page** - Contact form and information
- **Static Pages** - Privacy, Terms, Cookies, Careers, Community, Partners, Blogs

#### ✅ Authentication
- Clerk-based authentication with social logins
- Sign-in and sign-up pages with OAuth
- Protected routes middleware
- Role-based access control (Student/Mentor)
- User session management

#### ✅ Mentor Features
- **Mentor Discovery** - Browse all mentors with advanced filtering
  - Filter by exam (UPSC, JEE, NEET, CAT, etc.)
  - Filter by subject (Math, Physics, Chemistry, etc.)
  - Filter by language (Hindi, English, etc.)
  - Filter by price range
  - Filter by experience level
  - Search by name/keywords
  - Pagination with 20 mentors per page
  
- **Mentor Profiles** - Detailed mentor profile pages
  - Education and qualifications
  - Subjects and expertise
  - Pricing and availability
  - Reviews and ratings display (mock data)
  - Session booking button
  
- **Mentor Onboarding** - 4-step registration process
  - Step 1: Personal information (gender, organization, role)
  - Step 2: Professional details (education, college, branch)
  - Step 3: Billing setup (pricing, session duration, free trial)
  - Step 4: Review and submit
  - Progress tracking with visual indicators
  - Form validation and error handling
  
- **Mentor Dashboard** - Comprehensive analytics dashboard
  - Earnings overview with charts
  - Session statistics and trends
  - Payment method breakdown
  - Recent transactions list
  - Device usage analytics
  - Profile management
  - QR code for profile sharing
  - Social media sharing integration
  - Upcoming sessions calendar
  - Profile visibility toggle
  - Session link management

#### ✅ Student Features
- **Student Dashboard** - Learning progress tracking
  - Weekly learning hours visualization
  - Quick action cards (Find Mentors, Book Session, View Sessions)
  - Statistics overview
  - Upcoming sessions (when implemented)
  
- **Booking Pages** - Session booking interface (UI only)
  - Mentor selection
  - Date and time slot selection
  - Booking confirmation page
  - Payment integration placeholder

#### ✅ UI Components Library (40+ components)
- Navigation components (Navbar, Footer, Sidebar)
- Data visualization (Area, Bar, Donut, Line charts)
- Form inputs and controls
- Filter panels and accordions
- Mentor cards (Simple, Featured)
- Profile components (Banner, Avatar Stack)
- Rating stars display
- Pagination component
- Modal dialogs
- Tooltips
- Badges and chips
- Loading states
- Coming soon placeholders
- Mobile-responsive layouts

### 🔧 Backend (Express.js + MongoDB)

#### ✅ API Endpoints

**Mentor Routes** (`/api/mentor/`)
- `GET /mentors` - Fetch all mentors with pagination
  - Query params: `page` (default: 1)
  - Returns: mentor list, total count, pagination info
- `GET /mentor/:id` - Get single mentor profile by ID
- `PUT /mentor/profile` - Update mentor profile (protected)
  - Updates: basicInfo, professionalInfo, expertise, availability, pricing

**Mentor Auth Routes** (`/api/mentorAuth/`)
- `POST /become-mentor` - Register as mentor (Clerk protected)
  - Creates mentor profile
  - Updates Clerk user metadata
  - Syncs role to MongoDB

**Webhook Routes** (`/api/webhook/`)
- `POST /clerk` - Handle Clerk user events
  - User creation/update synchronization
  - Role updates from Clerk to MongoDB
  - Webhook signature verification

#### ✅ Database (MongoDB)

**User Schema** (Mongoose Model)
```javascript
{
  clerkId: String (unique, required),
  email: String (required),
  firstName: String,
  lastName: String,
  username: String,
  imageUrl: String,
  role: Enum ["student", "mentor", "admin"] (default: "student"),
  name: String,
  mentorProfile: {
    basicInfo: {
      gender, currentOrganisation, industry,
      currentRole, workExperience, profilePhoto
    },
    professionalInfo: {
      highestQualification, college, branch, passingYear
    },
    expertise: {
      subjects: [String], specializations: String
    },
    availability: {
      days: [String], timeSlots: [String]
    },
    pricing: {
      pricePerSession, sessionDuration, isFreeTrialEnabled
    }
  },
  timestamps: true
}
```

#### ✅ Middleware
- **Authentication** - JWT token verification
- **Role Authorization** - Mentor-only route protection
- **Error Handling** - Centralized error responses
- **CORS** - Cross-origin request handling
- **Body Parsing** - JSON and raw body parsing
- **Webhook Verification** - Svix signature validation

#### ✅ Infrastructure
- MongoDB connection with error handling
- Environment variable configuration
- Server initialization with graceful shutdown
- Docker support (Dockerfiles for both frontend and backend)
- Google Cloud Build configuration (cloudbuild.yaml)

---

## Pending Features

### 🔨 High Priority (MVP Blockers)

#### Payment Integration
- [ ] Complete Razorpay SDK integration
- [ ] Create payment orders endpoint
- [ ] Handle payment verification webhooks
- [ ] Store transaction records in database
- [ ] Implement refund logic
- [ ] Add payment method management
- [ ] Create invoices/receipts
- [ ] Handle failed payment scenarios

#### Session Booking System
- [ ] Connect booking UI to backend
- [ ] Create session booking endpoint
- [ ] Implement slot availability checking
- [ ] Store booking records in database
- [ ] Send confirmation emails
- [ ] Add booking cancellation logic
- [ ] Implement rescheduling functionality
- [ ] Calendar integration

#### Session Management
- [ ] Create sessions collection/schema
- [ ] Implement session listing for students
- [ ] Implement session listing for mentors
- [ ] Add session status tracking (scheduled, completed, cancelled)
- [ ] Session history and records
- [ ] Generate session join links
- [ ] Session reminder system

### 🔨 Medium Priority

#### Video Call Integration
- [ ] Choose video platform (Zoom/Google Meet/Agora/100ms)
- [ ] Integrate SDK
- [ ] Create meeting room generation
- [ ] Add join session functionality
- [ ] Implement in-call controls
- [ ] Record sessions (optional)
- [ ] Screen sharing support
- [ ] Chat during calls

#### Reviews & Ratings
- [ ] Create review schema
- [ ] Add review submission endpoint
- [ ] Display reviews on mentor profiles
- [ ] Calculate average ratings
- [ ] Review moderation system
- [ ] Reply to reviews (mentor feature)
- [ ] Helpful/report review buttons
- [ ] Review verification (verified purchase)

#### Notifications
- [ ] Email notification service setup
- [ ] In-app notification system
- [ ] Notification preferences
- [ ] Send booking confirmations
- [ ] Send session reminders
- [ ] Send payment receipts
- [ ] Send promotional emails
- [ ] Push notifications (future)

#### Real-time Features
- [ ] Live chat between students and mentors
- [ ] Real-time availability updates
- [ ] Online/offline status indicators
- [ ] Typing indicators
- [ ] Read receipts
- [ ] File sharing in chat

### 🔨 Low Priority (Post-MVP)

#### Analytics & Insights
- [ ] Replace mock data with real analytics
- [ ] Track user engagement metrics
- [ ] Session completion rates
- [ ] Revenue analytics for mentors
- [ ] Student learning progress tracking
- [ ] A/B testing framework
- [ ] Custom reports generation

#### Advanced Features
- [ ] Mentor verification system
- [ ] Background checks
- [ ] Certificate uploads
- [ ] Group sessions/webinars
- [ ] Course creation tools
- [ ] Resource library
- [ ] Discussion forums
- [ ] Mentor matching algorithm
- [ ] AI-powered mentor recommendations

#### Platform Enhancements
- [ ] Multi-language support (i18n)
- [ ] Mobile app (React Native)
- [ ] Progressive Web App (PWA)
- [ ] Offline mode support
- [ ] Advanced search with Elasticsearch
- [ ] Content moderation AI
- [ ] Automated testing suite
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)

#### Admin Features
- [ ] Admin dashboard
- [ ] User management panel
- [ ] Content moderation tools
- [ ] Platform analytics
- [ ] Revenue tracking
- [ ] Support ticket system
- [ ] Bulk operations
- [ ] Data export tools

---

## Known Issues

### Critical
- [ ] Booking system UI not connected to backend
- [ ] Session management endpoints not functional
- [ ] Payment gateway not integrated
- [ ] Mock data being used instead of real analytics

### Medium
- [ ] Firebase configured but not actively used (consider removing)
- [ ] Some API error handling needs improvement
- [ ] Missing unit and integration tests
- [ ] No rate limiting on API endpoints
- [ ] Webhook retry logic not implemented

### Minor
- [ ] Some TypeScript types need refinement
- [ ] Console warnings in development mode
- [ ] Loading states could be improved
- [ ] Mobile responsiveness needs testing on more devices
- [ ] Accessibility improvements needed

---

## Roadmap

### Phase 1: MVP Completion (Current - Q2 2026)
**Goal:** Launch functional platform with core features

- [x] Landing page and marketing pages
- [x] User authentication (Clerk)
- [x] Mentor discovery and profiles
- [x] Mentor onboarding flow
- [x] Basic dashboards (mentor & student)
- [x] Backend API foundation
- [x] MongoDB database setup
- [ ] **Payment integration (Razorpay)** ⬅️ Next Priority
- [ ] Complete booking system
- [ ] Session management
- [ ] Email notifications
- [ ] Error handling & loading states
- [ ] Basic testing suite
- [ ] Production deployment

**Target Launch:** End of Q2 2026

---

### Phase 2: Core Enhancements (Q3 2026)
**Goal:** Improve user experience and add essential features

- [ ] Video call integration (Zoom/100ms)
- [ ] Real-time chat between students and mentors
- [ ] Reviews and ratings system
- [ ] Advanced search and filters
- [ ] Notification center
- [ ] Mentor verification badges
- [ ] Session recordings
- [ ] Mobile app development starts
- [ ] Analytics with real data
- [ ] Performance optimization

**Target Completion:** September 2026

---

### Phase 3: Growth Features (Q4 2026)
**Goal:** Scale platform and add competitive advantages

- [ ] Group sessions/webinars
- [ ] Course creation platform
- [ ] Resource library
- [ ] Discussion forums
- [ ] AI-powered mentor recommendations
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app launch (iOS/Android)
- [ ] Referral program
- [ ] Partnership integrations

**Target Completion:** December 2026

---

### Phase 4: Enterprise & Advanced (2027)
**Goal:** Enterprise features and market expansion

- [ ] Corporate mentorship programs
- [ ] Institutional partnerships
- [ ] White-label solutions
- [ ] Advanced AI features
- [ ] Custom integrations API
- [ ] Mentor certification programs
- [ ] Advanced content moderation
- [ ] International expansion
- [ ] Enterprise-grade security
- [ ] Compliance certifications

---

## Scripts

### Frontend (`frontend/`)

```bash
npm run dev      # Start Next.js development server on http://localhost:3000
npm run build    # Build optimized production bundle
npm run start    # Start production server (requires build first)
npm run lint     # Run ESLint to check code quality
```

### Backend (`backend/`)

```bash
npm run dev      # Start development server with auto-reload (--watch mode)
npm run build    # Compile TypeScript to JavaScript (if using TypeScript)
npm run start    # Start production server
```

### Root

```bash
npm install      # Install all dependencies (root + frontend + backend)
```

---

## API Documentation

### Base URL
- **Development:** `http://localhost:5000`
- **Production:** TBD

### Endpoints

#### Mentor Routes

**GET /api/mentor/mentors**
- **Description:** Fetch paginated list of mentors
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit`: 20 mentors per page
- **Response:**
```json
{
  "success": true,
  "page": 1,
  "limit": 20,
  "totalMentors": 45,
  "totalPages": 3,
  "mentors": [...]
}
```

**GET /api/mentor/mentor/:id**
- **Description:** Get single mentor profile
- **Parameters:** `id` - Clerk ID or MongoDB ID
- **Response:**
```json
{
  "success": true,
  "mentor": {...}
}
```

**PUT /api/mentor/profile**
- **Description:** Update mentor profile
- **Authentication:** Required (JWT)
- **Body:**
```json
{
  "basicInfo": {...},
  "professionalInfo": {...},
  "expertise": {...},
  "availability": {...},
  "pricing": {...}
}
```

#### Mentor Auth Routes

**POST /api/mentorAuth/become-mentor**
- **Description:** Register as a mentor
- **Authentication:** Required (Clerk)
- **Body:** Complete mentor profile data
- **Response:**
```json
{
  "message": "You are now a mentor",
  "user": {...}
}
```

#### Webhook Routes

**POST /api/webhook/clerk**
- **Description:** Handle Clerk user events
- **Authentication:** Webhook signature verification
- **Events Handled:** `user.created`, `user.updated`

---

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  clerkId: String (unique),
  email: String,
  firstName: String,
  lastName: String,
  username: String,
  imageUrl: String,
  role: "student" | "mentor" | "admin",
  name: String,
  mentorProfile: {
    basicInfo: {
      gender: String,
      currentOrganisation: String,
      industry: String,
      currentRole: String,
      workExperience: Number,
      profilePhoto: String
    },
    professionalInfo: {
      highestQualification: String,
      college: String,
      branch: String,
      passingYear: Number
    },
    expertise: {
      subjects: [String],
      specializations: String
    },
    availability: {
      days: [String],
      timeSlots: [String]
    },
    pricing: {
      pricePerSession: Number,
      sessionDuration: Number,
      isFreeTrialEnabled: Boolean
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Future Collections (Planned)

**Sessions Collection**
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: User),
  mentorId: ObjectId (ref: User),
  scheduledAt: Date,
  duration: Number,
  status: "scheduled" | "completed" | "cancelled",
  paymentId: String,
  meetingLink: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Payments Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  sessionId: ObjectId (ref: Session),
  amount: Number,
  currency: String,
  status: "pending" | "success" | "failed",
  paymentMethod: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Deployment

### Docker Deployment

Both frontend and backend have Dockerfiles:

**Build Frontend:**
```bash
cd frontend
docker build -t mentomania-frontend .
docker run -p 3000:3000 mentomania-frontend
```

**Build Backend:**
```bash
cd backend
docker build -t mentomania-backend .
docker run -p 5000:5000 mentomania-backend
```

### Google Cloud Platform

Backend includes `cloudbuild.yaml` for GCP deployment:

```bash
gcloud builds submit --config cloudbuild.yaml
```

---

## Contributing

This is a proprietary project. For team members:

1. **Fork the repository** (if allowed)
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update README for new features

---

## License

**Proprietary and Confidential**

This project is private and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

## Team & Contact

**Project:** MentoMania  
**Status:** In Active Development  
**Last Updated:** February 25, 2026  

For questions or support, contact the development team.

---

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Clerk](https://clerk.com/) - Authentication
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Recharts](https://recharts.org/) - Data visualization

---

**Built with ❤️ for students and mentors**
