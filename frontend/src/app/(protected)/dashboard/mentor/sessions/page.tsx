// Re-exports SessionsPage from the canonical /dashboard/sessions location
// This keeps the old /dashboard/mentor/sessions URL working for any bookmarks
import { redirect } from "next/navigation";
export default function OldSessionsRoute() { redirect("/dashboard/sessions"); }
