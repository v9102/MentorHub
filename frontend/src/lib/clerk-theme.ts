export const clerkThemeValues = {
    elements: {
        // Positioning and Card
        rootBox: "w-full flex justify-center",
        cardBox: "shadow-none",
        card: "shadow-none border-0 w-full sm:w-[400px] bg-transparent !p-0 m-0",

        // Header
        headerTitle: "!text-3xl !font-extrabold text-[#0f172a] tracking-tight mb-1",
        headerSubtitle: "text-slate-500 text-base mb-6",

        // Tabs / Nav
        tabButton: "text-slate-500 hover:text-slate-900 border-b-2 hover:border-slate-300 font-medium pb-2 transition-all",
        tabButton__active: "text-[#1DA1F2] border-b-2 border-[#1DA1F2] font-semibold pb-2",

        // Social Buttons
        socialButtonsBlockButton:
            "border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold transition-colors !rounded-full h-12 flex justify-center",
        socialButtonsBlockButtonText: "font-semibold text-slate-700",
        // Hide LinkedIn Button completely as requested
        socialButtonsBlockButton__linkedin: "hidden",

        // Divider
        dividerRow: "my-6",
        dividerLine: "bg-slate-200",
        dividerText: "text-slate-400 font-medium text-xs uppercase tracking-wider",

        // Form Fields
        formFieldLabel: "text-slate-700 font-semibold text-sm mb-2",
        formFieldInput:
            "w-full h-12 px-4 !rounded-full border border-slate-200 bg-white text-slate-900 focus:border-[#1DA1F2] focus:ring-2 focus:ring-[#1DA1F2]/20 transition-all placeholder:text-slate-400 text-base",

        // Primary Form Button
        formButtonPrimary:
            "w-full h-12 bg-[#1DA1F2] hover:bg-[#1a90d9] text-white font-semibold !rounded-full shadow-sm hover:shadow transition-all focus:ring-2 focus:ring-[#1DA1F2]/20 text-base mt-2",

        // Footers and Alerts
        footerActionText: "text-slate-500",
        footerActionLink: "text-[#1DA1F2] hover:text-[#1a90d9] font-semibold transition-colors",
        identityPreviewText: "text-slate-700 font-medium",
        identityPreviewEditButton: "text-[#1DA1F2] hover:text-[#1a90d9]",
        formFieldSuccessText: "text-green-500",
        formFieldErrorText: "text-red-500 text-xs mt-1",
        alertText: "text-amber-800",
        alert: "bg-amber-50 border border-amber-200 rounded-xl p-3",
    },
    layout: {
        socialButtonsPlacement: "bottom",
        logoPlacement: "none",
        showOptionalFields: false,
    },
    variables: {
        colorPrimary: "#1DA1F2",
        colorText: "#0f172a",
        colorTextSecondary: "#64748b",
        colorBackground: "#ffffff",
        colorDanger: "#ef4444",
        colorSuccess: "#22c55e",
        colorInputBackground: "#ffffff",
        colorInputText: "#0f172a",
        fontFamily: "Inter, sans-serif",
        borderRadius: "0.75rem",
    }
} as const;
