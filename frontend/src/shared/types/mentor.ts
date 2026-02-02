export interface MentorFormData {
    // Step 1: Personal Info
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    linkedin: string;

    // Step 2: Professional Info
    jobTitle: string;
    company: string;
    educationLevel: string;
    institute: string;
    expertise: string[]; // e.g., ["JavaScript", "Python"]
    skills: string; // Comma separated for input, or tag input

    // Step 3: Billing Info
    bankName: string;
    accountNumber: string;
    ifscCode: string; // or generic routing code
    accountHolderName: string;

    // Step 4: Metadata
    agreedToTerms: boolean;
}

export const initialMentorFormData: MentorFormData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    linkedin: "",
    jobTitle: "",
    company: "",
    educationLevel: "",
    institute: "",
    expertise: [],
    skills: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    agreedToTerms: false,
};
