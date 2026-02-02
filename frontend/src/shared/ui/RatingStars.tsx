"use client";

import { Star, StarHalf } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  reviewsCount?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export default function RatingStars({
  rating,
  reviewsCount,
  size = "md",
  showCount = true,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
        />
      );
    }

    // Half star
    if (hasHalfStar && fullStars < 5) {
      stars.push(
        <StarHalf
          key="half"
          className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
        />
      );
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className={`${sizeClasses[size]} text-gray-300`}
        />
      );
    }

    return stars;
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">{renderStars()}</div>
      <span className={`font-semibold text-gray-900 ${textSizeClasses[size]}`}>
        {rating.toFixed(1)}
      </span>
      {showCount && reviewsCount !== undefined && (
        <span className={`text-gray-500 ${textSizeClasses[size]}`}>
          ({reviewsCount} {reviewsCount === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  );
}
