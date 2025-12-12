import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();  // <-- IMPORTANT: await

  const path = req.nextUrl.pathname;

  // Public routes
  const isPublic =
    path === "/" ||
    path.startsWith("/sign-in") ||
    path.startsWith("/sign-up");

  if (isPublic) return;

  // Protect all other routes
  if (!userId) {
    return Response.redirect(new URL("/sign-in", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|webp|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
