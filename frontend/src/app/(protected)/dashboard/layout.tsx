import { currentUser } from "@clerk/nextjs/server";
import DashboardSidebar from "@/components/dashboard-ui/DashboardSidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();
    const name = user
        ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "User"
        : "User";
    const title = user?.publicMetadata?.role === "mentor" ? "Mentor" : "User";
    const profileImageUrl = user?.imageUrl ?? null;

    return (
        /* Outermost wrapper — matches final_website Layout.jsx root div structure:
           h-screen prevents the page from expanding beyond viewport;
           overflow-hidden clips both sidebar and content to the screen boundary. */
        <div className="flex min-h-screen w-full bg-slate-50 font-sans text-slate-900 md:h-screen md:overflow-hidden">
            {/* Fixed sidebar — renders its own internal mobile header */}
            <DashboardSidebar
                name={name}
                title={title}
                profileImageUrl={profileImageUrl}
            />

            {/* Main content column — fills remaining width, scrolls independently.
                Mobile: pt-16 accounts for fixed mobile header; full-width padding.
                Desktop: standard padding with independent scroll. */}
            <main className="flex-1 overflow-y-auto pt-16 px-4 pb-6 md:pt-0 md:px-6 md:pb-8 lg:px-8">
                {children}
            </main>
        </div>
    );
}
