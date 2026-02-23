import React from "react";
import { MentorProfile } from "@/app/(public)/mentors/mock";
import { ProfileBanner } from "@/shared/ui/ProfileBanner";

interface ProfileHeaderProps {
    mentor: MentorProfile;
}

export const ProfileHeader = ({ mentor }: ProfileHeaderProps) => {
    return (
        <div className="mb-8 max-w-7xl mx-auto px-4 md:px-6 mt-6">
            <ProfileBanner
                initials={mentor.name.substring(0, 2).toUpperCase()}
                name={mentor.name}
                role={mentor.service ? `${mentor.service} Officer` : mentor.exam ? `${mentor.exam} Mentor` : "Expert Mentor"}
                location={mentor.posting || "India"}
                reviewsCount={mentor.reviewsCount}
                rank={mentor.rank}
                tagLine={mentor.tagLine}
                profilePhoto={mentor.profilePhoto}
                isEditable={false}
                onShare={() => console.log('Share clicked')}
                onSave={() => console.log('Save clicked')}
            />
        </div>
    );
};
