import React from "react";
import { Badge } from "../../../../shared/ui/badge";
import { MentorProfile } from "@/app/(public)/mentors/mock";

interface AboutSectionProps {
    mentor: MentorProfile;
}

export const AboutSection = ({ mentor }: AboutSectionProps) => {
    return (
        <div className="space-y-6">
            <section className="bg-white rounded-2xl p-6 border shadow-sm">
                <h2 className="text-xl font-bold mb-4">About Me</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {mentor.bio}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Service</p>
                        <p className="font-bold text-gray-900">{mentor.service || "N/A"}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider">Education</p>
                        <p className="font-bold text-gray-900 truncate" title={mentor.college}>{mentor.college || "N/A"}</p>
                    </div>
                    {mentor.optionalSubject && (
                        <div className="p-3 bg-pink-50 rounded-lg">
                            <p className="text-xs text-pink-600 font-semibold uppercase tracking-wider">Optional</p>
                            <p className="font-bold text-gray-900">{mentor.optionalSubject}</p>
                        </div>
                    )}
                    <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="text-xs text-orange-600 font-semibold uppercase tracking-wider">Experience</p>
                        <p className="font-bold text-gray-900">{mentor.yearsOfExperience} Years</p>
                    </div>
                </div>
            </section>

            <section className="bg-white rounded-2xl p-6 border shadow-sm">
                <h2 className="text-xl font-bold mb-4">Expertise & Skills</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Subjects</h3>
                        <div className="flex flex-wrap gap-2">
                            {mentor.subjects.map((subject) => (
                                <Badge key={subject} variant="secondary" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700">
                                    {subject}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Specializations</h3>
                        <div className="flex flex-wrap gap-2">
                            {mentor.specializations.map((spec) => (
                                <Badge key={spec} variant="outline" className="px-3 py-1 border-blue-200 text-blue-700 bg-blue-50/50">
                                    {spec}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
