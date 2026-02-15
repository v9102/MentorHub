"use client";

export function StickyFooter() {
  return (
    <div className="w-full bg-white border-t border-gray-100 p-4 sticky bottom-0 z-10 flex justify-center items-center">
      <p className="text-sm text-gray-500">
        Need Help? <a href="mailto:support@mentomania.com" className="text-[#0066ff] hover:underline font-medium">Contact support@mentomania.com</a>
      </p>
    </div>
  );
}
