import React, { useState } from "react";
import { MentorFormData } from "../../../types/mentor";

interface Step4Props {
    formData: MentorFormData;
    prevStep: () => void;
    submitFormData: () => void;
    setFormData: React.Dispatch<React.SetStateAction<MentorFormData>>;
}

const Step4Review: React.FC<Step4Props> = ({
    formData,
    prevStep,
    submitFormData,
    setFormData,
}) => {
    const [captchaSolved, setCaptchaSolved] = useState(false);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, agreedToTerms: e.target.checked }));
    };

    const handleCaptcha = () => {
        // Mock captcha verification
        setCaptchaSolved(true);
    };

    const isReadyToSubmit = formData.agreedToTerms && captchaSolved;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">
                Review & Submit
            </h2>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4 text-sm">
                <div>
                    <h3 className="font-semibold text-gray-900">Personal Information</h3>
                    <p className="text-gray-600">
                        {formData.firstName} {formData.lastName} <br />
                        {formData.email} | {formData.phone}
                    </p>
                </div>
                <div className="border-t border-gray-200 pt-3">
                    <h3 className="font-semibold text-gray-900">Professional Information</h3>
                    <p className="text-gray-600">
                        {formData.jobTitle} at {formData.company} <br />
                        {formData.educationLevel} from {formData.institute}
                    </p>
                </div>
                <div className="border-t border-gray-200 pt-3">
                    <h3 className="font-semibold text-gray-900">Billing Information</h3>
                    <p className="text-gray-600">
                        {formData.bankName} - {formData.accountNumber}
                    </p>
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={formData.agreedToTerms}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                        I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Mentor Policy</a>.
                    </label>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                        {captchaSolved ? "✅ Captcha Verified" : "Please verify you are human"}
                    </span>
                    {!captchaSolved && (
                        <button
                            onClick={handleCaptcha}
                            className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
                        >
                            Verify (Mock)
                        </button>
                    )}
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <button
                    className="px-8 py-3 border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 font-semibold transition-all"
                >
                    Previous
                </button>
                <button
                    onClick={submitFormData}
                    disabled={!isReadyToSubmit}
                    className="px-8 py-3 bg-orange-400 text-white rounded-full hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all font-semibold"
                >
                    Submit Application
                </button>
            </div>
        </div>
    );
};

export default Step4Review;
