"use client";

import { SelectHTMLAttributes } from "react";
import clsx from "clsx";

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={clsx(
        "w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white",
        className
      )}
      {...props}
    />
  );
}
