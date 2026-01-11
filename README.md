# MentorHub

> Connect with top scorers and mentors who have cracked IIT JEE, NEET, CAT, UPSC and more. Get personalized guidance to achieve your goals.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development Status](#development-status)
- [Roadmap](#roadmap)
- [Scripts](#scripts)

---

## Overview

**MentorHub** is a mentorship platform designed to connect students preparing for competitive exams (IIT JEE, NEET, CAT, UPSC, GATE, etc.) with experienced mentors who have successfully cleared these exams.

---

## Features

### Implemented
- **Landing Page** - Modern, responsive hero section with exam categories
- **Mentor Discovery** - Browse, search, and filter mentors
- **Authentication** - Secure sign-in/sign-up via Clerk
- **Onboarding Flow** - Multi-step mentor registration
- **Responsive Design** - Mobile-first approach with Tailwind CSS

### In Progress
- Booking system for mentor sessions
- Student dashboard
- Mentor dashboard

### Planned
- Payment integration
- Real-time chat/video calls
- Reviews & ratings system
- Analytics dashboard

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript 5** | Type safety |
| **Tailwind CSS 4** | Styling |
| **Clerk** | Authentication |
| **Firebase** | Database (Firestore) |
| **Lucide React** | Icons |
| **React Hook Form** | Form handling |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Express 5** | Web framework |
| **TypeScript** | Type safety |
| **CORS** | Cross-origin requests |

---

## Project Structure

```
MentorHub/
├── frontend/                 # Next.js application
│   ├── app/                  # App Router pages
│   │   ├── api/              # API routes
│   │   ├── book/             # Booking pages
│   │   ├── mentors/          # Mentor listing & profiles
│   │   ├── onboarding/       # Mentor onboarding flow
│   │   ├── sign-in/          # Authentication
│   │   ├── sign-up/
│   │   └── student/          # Student dashboard
│   ├── components/           # React components
│   │   ├── landing/          # Landing page components
│   │   ├── onboarding/       # Onboarding components
│   │   ├── shared/           # Shared components (Navbar)
│   │   └── ui/               # Reusable UI components
│   ├── lib/                  # Utilities
│   │   ├── context/          # React contexts
│   │   ├── types/            # TypeScript types
│   │   └── firebase.ts       # Firebase config
│   └── public/               # Static assets
│
├── backend/                  # Express.js API (In Development)
│   └── src/
│       ├── api/
│       │   └── auth/         # Auth endpoints
│       └── lib/
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn** or **pnpm**
- **Clerk Account** - [Sign up here](https://clerk.com/)
- **Firebase Project** - [Create one here](https://console.firebase.google.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MentorHub
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables** (see [Environment Variables](#environment-variables))

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## Development Status

### Current Status: Pre-MVP / Prototype

| Component | Status | Notes |
|-----------|--------|-------|
| **Frontend UI** | Working | Landing, mentor listing, auth, onboarding |
| **Authentication** | Working | Clerk integration complete |
| **Database** | Partial | Firebase configured, using mock data |
| **Backend API** | Not Started | Express structure exists, no implementation |
| **Booking System** | Not Started | Pages exist, no functionality |
| **Payments** | Not Started | Not implemented |

### What's Needed for MVP

1. **Backend API** - Implement Express endpoints
2. **Database Integration** - Replace mock data with Firestore
3. **Booking Flow** - Complete session booking functionality
4. **Error Handling** - Add error boundaries and loading states
5. **Testing** - Add unit and integration tests

---

## Roadmap

### Phase 1: MVP (Current Focus)
- [ ] Implement backend API endpoints
- [ ] Connect frontend to real database
- [ ] Complete booking flow
- [ ] Add error handling & loading states
- [ ] Basic testing setup

### Phase 2: Core Features
- [ ] Payment integration (Razorpay/Stripe)
- [ ] Video call integration (Zoom/Google Meet)
- [ ] Real-time chat
- [ ] Email notifications

### Phase 3: Growth Features
- [ ] Reviews & ratings
- [ ] Analytics dashboard
- [ ] Mentor verification system
- [ ] Mobile app

---

## Scripts

### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend

```bash
npm run dev      # Start development server
npm run build    # Compile TypeScript
npm run start    # Start production server
```

---

**Proprietary and Confidential**
