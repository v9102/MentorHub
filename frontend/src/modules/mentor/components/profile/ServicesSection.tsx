import React from "react";
import { Button } from "@/shared/ui/button";
import { Video, FileText, Phone, MessageSquare, ArrowRight } from "lucide-react";
import { MentorProfile } from "@/app/(public)/mentors/mock";
import Link from "next/link";

interface ServicesSectionProps {
    mentor: MentorProfile;
}

const getIcon = (iconName?: string) => {
    switch (iconName) {
        case "video": return Video;
        case "document": return FileText;
        case "phone": return Phone;
        default: return Video;
    }
};

export const ServicesSection = ({ mentor }: ServicesSectionProps) => {
    const offerings = mentor.offerings || [
        { id: "default-1", title: "1:1 Mentorship Session", price: mentor.pricing, icon: "video" }
    ];

    return (
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <h2 className="text-xl font-bold mb-6">Available Services</h2>

            <div className="space-y-4">
                {offerings.map((offering) => {
                    const Icon = getIcon(offering.icon);
                    return (
                        <div key={offering.id} className="group border rounded-xl p-4 hover:border-black transition-colors relative">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{offering.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {offering.price === mentor.pricing ? "Standard 1:1 consultation" : "Specialized service"}
                                        </p>

                                        {offering.discount && (
                                            <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                                                {offering.discount}% OFF
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-lg font-bold">₹{offering.price}</p>
                                    {offering.discount && (
                                        <p className="text-sm text-gray-400 line-through">
                                            ₹{Math.round(offering.price * (1 + offering.discount / 100))}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t flex justify-end">
                                <Link href={`/book/${mentor.id}?service=${offering.id}`} className="w-full md:w-auto">
                                    <Button className="w-full md:w-auto gap-2">
                                        Book Now <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
