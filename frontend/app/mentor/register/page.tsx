"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "../../../components/mentor/registration/ProgressBar";
import Step1Personal from "../../../components/mentor/registration/Step1Personal";
import Step2Professional from "../../../components/mentor/registration/Step2Professional";
import Step3Billing from "../../../components/mentor/registration/Step3Billing";
import Step4Review from "../../../components/mentor/registration/Step4Review";
import { MentorFormData, initialMentorFormData } from "../../../types/mentor";

export default function MentorRegistrationPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const totalSteps = 4;
    const [formData, setFormData] = useState<MentorFormData>(initialMentorFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle Input Change
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Navigation Handlers
    const nextStep = () => {
        if (step < totalSteps) setStep((prev) => prev + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep((prev) => prev - 1);
    };

    // Form Submission
    const submitFormData = async () => {
        setIsSubmitting(true);
        try {
            console.log("Submitting Mentor Data:", formData);

            // Sending data to backend
            // Note: Backend URL handling should ideally be in env vars or proxy
            // Assuming relative path /api/mentors if proxy is set, or localhost:5000

            const response = await fetch("http://localhost:5000/api/mentors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to submit application");
            }

            const result = await response.json();
            console.log("Server Response:", result);

            alert("Application Submitted Successfully! Redirecting...");
            router.push("/"); // Redirect to home or dashboard
        } catch (error) {
            console.error("Submission Error:", error);
            alert("Submission failed. Please try again. (Make sure backend is running)");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8"
            style={{
                backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
                backgroundSize: "24px 24px",
            }}
        >
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            <span className="text-blue-700">Become a </span>
                            <span className="text-orange-500">Mentor</span>
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Share your expertise and guide the next generation.
                        </p>
                    </div>

                    <ProgressBar currentStep={step} totalSteps={totalSteps} />

                    <div className="mt-8">
                        {step === 1 && (
                            <Step1Personal
                                formData={formData}
                                handleChange={handleChange}
                                nextStep={nextStep}
                            />
                        )}
                        {step === 2 && (
                            <Step2Professional
                                formData={formData}
                                handleChange={handleChange}
                                nextStep={nextStep}
                                prevStep={prevStep}
                            />
                        )}
                        {step === 3 && (
                            <Step3Billing
                                formData={formData}
                                handleChange={handleChange}
                                nextStep={nextStep}
                                prevStep={prevStep}
                            />
                        )}
                        {step === 4 && (
                            <Step4Review
                                formData={formData}
                                prevStep={prevStep}
                                submitFormData={submitFormData}
                                setFormData={setFormData}
                            />
                        )}
                    </div>

                    {isSubmitting && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg flex items-center space-x-4">
                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-lg font-medium">Submitting...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
