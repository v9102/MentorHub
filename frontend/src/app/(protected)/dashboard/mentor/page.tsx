import { redirect } from "next/navigation";

/** Corrected: /dashboard/mentor is the old route — redirect to the new flat structure */
export default function MentorLegacyRedirect() {
  redirect("/dashboard");
}
