import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/sso-callback(.*)',
  '/mentors(.*)',
  '/mentor/(.*)',
  '/how-it-works(.*)',
  '/become-mentor(.*)',
  '/about(.*)',
  '/book(.*)',
  '/api/webhooks(.*)',
  '/api/mentors(.*)',
  '/privacy(.*)',
  '/terms(.*)',
  '/contact(.*)',
  '/about(.*)',
  '/faq(.*)',
  '/careers(.*)',
  '/blogs(.*)',
  '/community(.*)',
  '/partners(.*)',
  '/pricing(.*)',
  '/cookie(.*)',
  '/exam(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|webp|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
