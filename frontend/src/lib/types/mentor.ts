export type MentorBasicInfo = {
  firstName: string;
  lastName: string;
  profilePhoto: string;

  gender: "male" | "female" | "non-binary" | "prefer-not-to-say";
  currentOrganisation: string;
  industry: string;
  currentRole: string;
  workExperience: number;
};
