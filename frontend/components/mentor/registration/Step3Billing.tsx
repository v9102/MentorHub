import React from "react";
import { MentorFormData } from "../../../types/mentor";

interface Step3Props {
    formData: MentorFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const Step3Billing: React.FC<Step3Props> = ({ formData, handleChange, nextStep, prevStep }) => {
    const isValid =
        formData.bankName &&
        formData.accountNumber &&
        formData.ifscCode &&
        formData.accountHolderName;

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (isValid) nextStep();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">
                Billing Information
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                We need this information to process your payouts for mentorship sessions.
            </p>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Account Holder Name
                    </label>
                    <input
                        type="text"
                        name="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-gray-900 transition-all outline-none"
                        placeholder="As per bank records"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Bank Name
                    </label>
                    <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-gray-900 transition-all outline-none"
                        placeholder="Bank of America"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Account Number
                        </label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-gray-900 transition-all outline-none"
                            placeholder="1234567890"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            IFSC / Routing Code
                        </label>
                        <input
                            type="text"
                            name="ifscCode"
                            value={formData.ifscCode}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-gray-900 transition-all outline-none"
                            placeholder="ABCD0123456"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-8">
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

export default Step3Billing;
