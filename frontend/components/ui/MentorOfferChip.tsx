"use client";

import { Video, FileText, MessageCircle, BookOpen } from "lucide-react";

interface MentorOfferChipProps {
  offering: {
    id: string;
    title: string;
    price: number;
    discount?: number;
    icon?: string;
  };
  onClick?: () => void;
}

export default function MentorOfferChip({
  offering,
  onClick,
}: MentorOfferChipProps) {
  const getIcon = () => {
    switch (offering.icon) {
      case "video":
        return <Video className="w-3.5 h-3.5" />;
      case "document":
        return <FileText className="w-3.5 h-3.5" />;
      case "message":
        return <MessageCircle className="w-3.5 h-3.5" />;
      case "book":
        return <BookOpen className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const discountedPrice = offering.discount
    ? offering.price - (offering.price * offering.discount) / 100
    : offering.price;

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-full border-2 border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 hover:scale-105 group"
    >
      {offering.icon && (
        <span className="text-gray-600 group-hover:text-blue-600 transition-colors">
          {getIcon()}
        </span>
      )}
      <span className="text-sm font-medium text-gray-900 group-hover:text-blue-900">
        {offering.title}
      </span>
      <div className="flex items-center gap-1.5">
        {offering.discount && (
          <span className="text-xs text-gray-400 line-through">
            ₹{offering.price}
          </span>
        )}
        <span className="text-sm font-bold text-gray-900 group-hover:text-blue-900">
          ₹{discountedPrice}
        </span>
      </div>
      {offering.discount && (
        <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
          {offering.discount}% OFF
        </span>
      )}
    </button>
  );
}
