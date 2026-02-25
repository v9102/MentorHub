# PLAN-mentorhub-guidelines

## Phase -1: Context Check
**Goal**: Establish rigorous guidelines for future development on the MentorHub2 project to ensure security, optimized API usage, high-quality UI/UX, and strict adherence to the project's core principles.
**Context**:
- **Frontend Stack**: Next.js 16, React 19, Tailwind CSS v4, Framer Motion, Radix UI, Clerk for Auth.
- **Backend Stack**: Node.js/Express, Mongoose, Firebase Admin, Razorpay, Clerk SDK.
- **Core Principle**: The fundamental workings and architecture of the `mentorhub2` directory MUST remain unchanged.

## Phase 0: Socratic Gate
Before locking in the final guideline document, we need clarification on the following to tailor the rules perfectly:
1. **Security Guidelines**: Are there specific compliance standards (e.g., OWASP Top 10, GDPR) you want explicitly enforced beyond standard secure coding practices (like JWT validation, input sanitization, and rate limiting)?
2. **API Optimization**: Aside from implementing React Query/SWR for caching and debouncing inputs on the frontend, are there any strict backend rate limits or particular high-traffic endpoints we should prioritize optimizing?
3. **UI/UX Aesthetics**: Should we strictly follow an existing Figma design/design system, or are we authorized to build and enhance the UI using modern patterns (glassmorphism, micro-animations via Framer Motion) as long as we maintain the current theme?

## Task Breakdown
1. **Define Security Protocol**:
   - Establish rules for Clerk authentication state management.
   - Define data validation rules using Zod (already in backend dependencies).
   - Set policies against exposing `.env` variables (e.g., Firebase, Razorpay, DB URIs).

2. **Define API Minimization Strategy**:
   - Mandate frontend caching strategies to reduce redundant network requests.
   - Establish rules for batching requests or using pagination/infinite scroll for heavy data loads.

3. **Define UI/UX Developer Standards**:
   - Standardize Tailwind v4 utility usage and Radix UI components for accessibility.
   - Mandate loading states, error boundaries, and skeleton loaders for all asynchronous UI elements.
   - Incorporate Framer Motion for smooth transitions without blocking the main thread.

4. **Enforce Core Principle Protection**:
   - Create a strict operational boundary: no existing architectural patterns or core database schemas in `mentorhub2` can be structurally altered. Only extensions or additive changes are permitted unless explicitly approved.

## Agent Assignments
- **Antigravity Agent**: Act as the gatekeeper and implementer adhering strictly to these generated guidelines in all future files and modifications.

## Verification Checklist
- [ ] User responds to Socratic Gate questions.
- [ ] Finalize `PROJECT_GUIDELINES.md` or `.cursorrules` file containing the explicit rules.
- [ ] Review any new PRs or changes against the finalized guidelines.
