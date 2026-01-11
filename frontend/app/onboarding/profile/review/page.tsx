"use client";

import { useRouter } from "next/navigation";
import { OnboardingActionButton } from "@/components/onboarding/OnboardingActionButton";
import { useMentorOnboarding } from "@/lib/context/MentorOnboardingContext";

export default function ReviewPage() {
  const { data } = useMentorOnboarding();
  const router = useRouter();

  const onSubmit = async () => {
    try {
      const res = await fetch("/api/mentor/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to submit profile");
      }

      router.push("/mentor/dashboard");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Review your profile
        </h1>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          {/* Basic Info */}
          <Section title="Basic Information">
            <Item
              label="Name"
              value={
                data.basicInfo
                  ? `${data.basicInfo.firstName} ${data.basicInfo.lastName}`
                  : "-"
              }
            />

            <Item
              label="Gender"
              value={
                data.basicInfo?.gender ? capitalize(data.basicInfo.gender) : "-"
              }
            />
          </Section>

          {/* Professional Info */}
          <Section title="Professional Background">
            <Item
              label="College"
              value={data.professionalInfo?.college ?? "-"}
            />
            <Item label="Branch" value={data.professionalInfo?.branch ?? "-"} />
            <Item
              label="Passing Year"
              value={
                data.professionalInfo?.passingYear
                  ? data.professionalInfo.passingYear.toString()
                  : "-"
              }
            />
          </Section>

          {/* Expertise */}
          <Section title="Expertise">
            <Item
              label="Subjects"
              value={
                data.expertise?.subjects?.length
                  ? data.expertise.subjects.join(", ")
                  : "-"
              }
            />
            <Item
              label="Specializations"
              value={data.expertise?.specializations ?? "-"}
            />
          </Section>

          {/* Availability */}
          <Section title="Availability">
            <Item
              label="Days"
              value={
                data.availability?.days?.length
                  ? data.availability.days.join(", ")
                  : "-"
              }
            />
            <Item
              label="Time Slots"
              value={
                data.availability?.timeSlots?.length
                  ? data.availability.timeSlots.join(", ")
                  : "-"
              }
            />
          </Section>

          {/* Pricing */}
          <Section title="Pricing">
            <Item
              label="Price per session"
              value={
                data.pricing?.pricePerSession
                  ? `₹${data.pricing.pricePerSession} / session`
                  : "-"
              }
            />
          </Section>

          {/* Submit */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <OnboardingActionButton
              isValid={true}
              isSubmitting={false}
              label="Submit Profile"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 uppercase">{title}</h2>
      <div className="mt-2 space-y-1">{children}</div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
