import React from "react";

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

    return (
        <div className="w-full mb-8">
            <div className="flex justify-between mb-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                        key={index}
                        className={`text-sm font-medium ${index + 1 <= currentStep ? "text-orange-600" : "text-gray-400"
                            }`}
                    >
                        Step {index + 1}
                    </div>
                ))}
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
