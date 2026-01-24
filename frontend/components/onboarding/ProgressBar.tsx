"use client";

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = Math.min(((currentStep + 1) / totalSteps) * 100, 100);

  return (
    <div className="w-full bg-gray-100 h-[6px] rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-[#0066ff] to-[#ff9900] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
