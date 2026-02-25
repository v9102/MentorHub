import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

export default function SSOCallback() {
    // Handle the redirect flow by rendering the
    // prebuilt component.
    return <AuthenticateWithRedirectCallback />
}
