"use client";

import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded-md text-sm font-medium transition",
        variant === "primary" &&
          "bg-blue-600 text-white hover:bg-blue-700",
        variant === "ghost" &&
          "text-gray-700 hover:bg-gray-100",
        variant === "outline" &&
          "border border-gray-300 text-gray-700 hover:bg-gray-50",
        className
      )}
      {...props}
    />
  );
}
