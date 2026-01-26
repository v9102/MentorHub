import React from "react";
import { MentorFormData } from "../../../types/mentor";

interface Step1Props {
    formData: MentorFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    nextStep: () => void;
}

const Step1Personal: React.FC<Step1Props> = ({ formData, handleChange, nextStep }) => {
    const isValid =
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.phone &&
        formData.linkedin;

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (isValid) nextStep();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">
                Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        First Name
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-gray-900 transition-all outline-none"
                        placeholder="John"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-gray-900 transition-all outline-none"
                        placeholder="Doe"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-gray-900 transition-all outline-none"
                    placeholder="john@example.com"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-gray-900 transition-all outline-none"
                        placeholder="+1 234 567 890"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        LinkedIn URL
                    </label>
                    <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-gray-900 transition-all outline-none"
                        placeholder="https://linkedin.com/in/johndoe"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Bio (Short description)
                </label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50 text-gray-900 transition-all outline-none"
                    placeholder="Tell us a bit about yourself..."
                />
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleNext}
                    disabled={!isValid}
                    className="px-8 py-3 bg-orange-400 text-white rounded-full hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all font-semibold"
                >
                    Next Step
                </button>
            </div>
        </div>
    );
};

export default Step1Personal;
