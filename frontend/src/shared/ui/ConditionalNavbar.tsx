"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
    const pathname = usePathname();

    // Hide the navbar on dashboard, onboarding, and admin routes
    if (
        pathname?.startsWith("/dashboard") ||
        pathname?.startsWith("/onboarding") ||
        pathname?.startsWith("/admin")
    ) {
        return null;
    }

    return <Navbar />;
}
