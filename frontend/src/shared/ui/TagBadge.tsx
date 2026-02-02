"use client";

interface TagBadgeProps {
  text: string;
  variant?: "primary" | "secondary" | "accent";
}

export default function TagBadge({ text, variant = "primary" }: TagBadgeProps) {
  const variantStyles = {
    primary: "bg-blue-50 text-blue-700 border-blue-200",
    secondary: "bg-orange-50 text-orange-700 border-orange-200",
    accent: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${variantStyles[variant]} transition-colors duration-200`}
    >
      {text}
    </span>
  );
}
