import React from "react";
import { MentorFormData } from "../../../types/mentor";

interface Step2Props {
    formData: MentorFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const Step2Professional: React.FC<Step2Props> = ({ formData, handleChange, nextStep, prevStep }) => {
    const isValid =
        formData.jobTitle &&
        formData.company &&
        formData.educationLevel &&
        formData.institute &&
        formData.skills;

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (isValid) nextStep();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">
                Professional Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Current Job Title
                    </label>
                    <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-gray-900 transition-all outline-none"
                        placeholder="Senior Software Engineer"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Company / Organization
                    </label>
                    <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-gray-900 transition-all outline-none"
                        placeholder="Tech Corp Inc."
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Highest Education Level
                    </label>
                    <select
                        name="educationLevel"
                        value={formData.educationLevel}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-gray-900 transition-all outline-none"
                    >
                        <option value="">Select Level</option>
                        <option value="Bachelors">Bachelor's Degree</option>
                        <option value="Masters">Master's Degree</option>
                        <option value="PhD">PhD / Doctorate</option>
                        <option value="Diploma">Diploma / Certification</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Institute / University
                    </label>
                    <input
                        type="text"
                        name="institute"
                        value={formData.institute}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-gray-900 transition-all outline-none"
                        placeholder="University of Technology"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Skills & Expertise (Comma separated)
                </label>
                <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-gray-900 transition-all outline-none"
                    placeholder="React, Node.js, System Design, Python"
                />
                <p className="text-xs text-gray-500 mt-1">
                    List your key skills that you can mentor others in.
                </p>
            </div>

            <div className="flex justify-between">
                <button
                    onClick={prevStep}
                    className="px-8 py-3 border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 font-semibold transition-all"
                >
                    Previous
                </button>
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

export default Step2Professional;
