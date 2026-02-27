"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
    const pathname = usePathname();

    // Hide the navbar on mentor dashboard, onboarding, and admin routes
    // But show it on /mentors (public mentor listing page)
    if (
        (pathname?.startsWith("/mentor/") || pathname === "/mentor") ||
        pathname?.startsWith("/onboarding") ||
        pathname?.startsWith("/admin")
    ) {
        return null;
    }

    return <Navbar />;
}
