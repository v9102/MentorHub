"use client";

import { useMentorOnboarding } from "@/lib/context/MentorOnboardingContext";

export default function MentorDashboardPage() {
  const { data } = useMentorOnboarding();

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Welcome, {data.basicInfo?.firstName ?? "Mentor"} 
      </h1>

      <div className="bg-white border rounded-xl p-4 space-y-2">
        <p>
          <strong>College:</strong>{" "}
          {data.professionalInfo?.college ?? "-"}
        </p>

        <p>
          <strong>Expertise:</strong>{" "}
          {data.expertise?.subjects?.join(", ") ?? "-"}
        </p>

        <p>
          <strong>Price:</strong>{" "}
          {data.pricing?.pricePerSession
            ? `₹${data.pricing.pricePerSession}`
            : "-"}
        </p>
      </div>
    </div>
  );
}
