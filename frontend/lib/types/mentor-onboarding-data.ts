export type MentorBasicInfo = {
  firstName: string;
  lastName: string;
  profilePhoto: string;
  gender: string;
  currentOrganisation: string;
  industry: string;
  currentRole: string;
  workExperience: number;
};

export type MentorProfessionalInfo = {
  highestQualification: string;
  college: string;
  branch: string;
  passingYear: number;
};

export type MentorExpertiseInfo = {
  subjects: string[];
  specializations: string;
};

export type MentorAvailabilityInfo = {
  days: string[];
  timeSlots: string[];
};

export type MentorPricingInfo = {
  pricePerSession: number;
  sessionDuration: number;
  isFreeTrialEnabled: boolean;
};

export type MentorOnboardingData = {
  basicInfo?: MentorBasicInfo;
  professionalInfo?: MentorProfessionalInfo;
  expertise?: MentorExpertiseInfo;
  availability?: MentorAvailabilityInfo;
  pricing?: MentorPricingInfo;
};
