import React from "react";
import { Star } from "lucide-react";
import { MentorProfile } from "@/app/(public)/mentors/mock";

interface ReviewsSectionProps {
    mentor: MentorProfile;
}

export const ReviewsSection = ({ mentor }: ReviewsSectionProps) => {
    return (
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Student Reviews</h2>
                <div className="text-sm text-gray-500">
                    <span className="font-bold text-gray-900">{mentor.rating}</span>/5 rating ({mentor.reviewsCount} reviews)
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {mentor.testimonials?.map((review, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
                            ))}
                        </div>
                        <p className="text-gray-700 font-medium mb-3">"{review.text}"</p>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                                {review.studentName.charAt(0)}
                            </div>
                            <span className="text-xs font-bold text-gray-500">{review.studentName}</span>
                        </div>
                    </div>
                ))}
                {(!mentor.testimonials || mentor.testimonials.length === 0) && (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                        No reviews yet. Be the first to review!
                    </div>
                )}
            </div>
        </div>
    );
};
