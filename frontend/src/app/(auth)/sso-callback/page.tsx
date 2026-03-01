"use client";

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function SSOCallback() {
    useEffect(() => {
        // Clear any auth-related session storage to prevent loops
        sessionStorage.removeItem('clerk-redirect');
    }, []);

    return <AuthenticateWithRedirectCallback />;
}
