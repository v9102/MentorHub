type OnboardingActionButtonProps = {
  label?: string;
  isValid: boolean;
  isSubmitting: boolean;
};

export function OnboardingActionButton({
  label = "Next",
  isValid,
  isSubmitting,
}: OnboardingActionButtonProps) {
  const disabled = !isValid || isSubmitting;

  return (
    <div className="pt-4 flex justify-end">
      <button
        type="submit"
        disabled={disabled}
        className={`px-6 py-2 rounded-md text-white transition
          ${
            disabled
              ? "bg-orange-300 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
      >
        {label}
      </button>
    </div>
  );
}
