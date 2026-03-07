"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
    const pathname = usePathname();

    if (
        (pathname?.startsWith("/mentor/") || pathname === "/mentor") ||
        pathname?.startsWith("/onboarding") ||
        pathname?.startsWith("/admin") ||
        pathname?.startsWith("/meeting")
    ) {
        return null;
    }

    return <Navbar />;
}
