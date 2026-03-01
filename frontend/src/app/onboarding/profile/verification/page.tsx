"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CloudUpload, ShieldCheck, CheckCircle, Info, AlertCircle } from "lucide-react";
import { useMentorOnboarding } from "@/shared/lib/context/MentorOnboardingContext";

const ID_TYPES = [
    { value: "", label: "Select ID Type", pattern: null, length: null, hint: "" },
    { value: "aadhaar", label: "Aadhaar Card", pattern: /^\d{12}$/, length: 12, hint: "12-digit number (e.g., 123456789012)" },
    { value: "pan", label: "PAN Card", pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, length: 10, hint: "Format: ABCDE1234F (5 letters, 4 digits, 1 letter)" },
    { value: "passport", label: "Passport", pattern: /^[A-Z]{1}[0-9]{7}$/, length: 8, hint: "Format: A1234567 (1 letter, 7 digits)" },
    { value: "driving_license", label: "Driving License", pattern: /^[A-Z]{2}[0-9]{2}[0-9]{11}$/, length: 15, hint: "Format: MH02 + 11 digits (e.g., MH0220190012345)" },
    { value: "voter_id", label: "Voter ID (EPIC)", pattern: /^[A-Z]{3}[0-9]{7}$/, length: 10, hint: "Format: ABC1234567 (3 letters, 7 digits)" },
    { value: "college_id", label: "College ID Card", pattern: /^[A-Za-z0-9]{6,20}$/, length: null, hint: "6-20 alphanumeric characters" },
    { value: "itr", label: "ITR Acknowledgment", pattern: /^\d{15}$/, length: 15, hint: "15-digit acknowledgment number" },
    { value: "salary_slip", label: "Salary Slip", pattern: /^[A-Za-z0-9]{4,20}$/, length: null, hint: "Employee ID (4-20 alphanumeric characters)" },
    { value: "tdr", label: "TDR (Tax Deduction Receipt)", pattern: /^[A-Za-z0-9]{10,20}$/, length: null, hint: "10-20 alphanumeric characters" },
    { value: "employment_letter", label: "Employment Verification Letter", pattern: /^[A-Za-z0-9]{4,20}$/, length: null, hint: "Reference/Employee ID (4-20 alphanumeric)" },
    { value: "professional_cert", label: "Professional Certification", pattern: /^[A-Za-z0-9]{6,25}$/, length: null, hint: "Certificate number (6-25 alphanumeric)" },
];

export default function VerificationPage() {
    const router = useRouter();
    const { data: onboardingData, updateData } = useMentorOnboarding();
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [idType, setIdType] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [idError, setIdError] = useState<string | null>(null);
    const [touched, setTouched] = useState(false);

    // Load saved data from context
    useEffect(() => {
        if (onboardingData.verification) {
            const saved = onboardingData.verification as any;
            if (saved.idType) setIdType(saved.idType);
            if (saved.idNumber) setIdNumber(saved.idNumber);
            // Note: File cannot be restored from localStorage, user needs to re-upload
        }
    }, [onboardingData.verification]);

    const selectedIdType = useMemo(() => ID_TYPES.find(t => t.value === idType), [idType]);

    const validateIdNumber = (value: string, type: string): string | null => {
        const idConfig = ID_TYPES.find(t => t.value === type);
        if (!idConfig || !idConfig.pattern) return null;
        
        // Remove spaces for validation
        const cleanValue = value.replace(/\s/g, "").toUpperCase();
        
        if (!cleanValue) {
            return "ID number is required";
        }
        
        if (idConfig.length && cleanValue.length !== idConfig.length) {
            return `Must be exactly ${idConfig.length} characters`;
        }
        
        if (!idConfig.pattern.test(cleanValue)) {
            return `Invalid format. ${idConfig.hint}`;
        }
        
        return null;
    };

    const handleIdNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.toUpperCase();
        
        // For Aadhaar, format with spaces every 4 digits
        if (idType === "aadhaar") {
            value = value.replace(/\D/g, "").slice(0, 12);
            value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
        }
        // For PAN, only allow alphanumeric and limit to 10
        else if (idType === "pan") {
            value = value.replace(/[^A-Z0-9]/g, "").slice(0, 10);
        }
        // For Passport
        else if (idType === "passport") {
            value = value.replace(/[^A-Z0-9]/g, "").slice(0, 8);
        }
        // For Driving License
        else if (idType === "driving_license") {
            value = value.replace(/[^A-Z0-9]/g, "").slice(0, 15);
        }
        // For Voter ID
        else if (idType === "voter_id") {
            value = value.replace(/[^A-Z0-9]/g, "").slice(0, 10);
        }
        // For ITR
        else if (idType === "itr") {
            value = value.replace(/\D/g, "").slice(0, 15);
        }
        
        setIdNumber(value);
        
        if (touched) {
            const error = validateIdNumber(value, idType);
            setIdError(error);
        }
    };

    const handleIdBlur = () => {
        setTouched(true);
        const error = validateIdNumber(idNumber, idType);
        setIdError(error);
    };

    const handleIdTypeChange = (newType: string) => {
        setIdType(newType);
        setIdNumber("");
        setIdError(null);
        setTouched(false);
    };

    const isFormValid = useMemo(() => {
        if (!idType || !idNumber || !file) return false;
        const error = validateIdNumber(idNumber, idType);
        return error === null;
    }, [idType, idNumber, file]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) setFile(selected);
    };

    const handleContinue = () => {
        updateData({
            verification: {
                idType,
                idNumber,
                documentFileName: file?.name || null,
            },
        });
        router.push("/onboarding/profile/review");
    };

    return (
        <div className="py-8 space-y-6">
            {/* ── Progress ── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="max-w-2xl space-y-2"
            >
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                        Step 3 of 4: Identity &amp; Trust
                    </span>
                    <span className="text-sm font-bold text-primary">75% Complete</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                </div>
            </motion.div>

            {/* ── Title ── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.35, ease: "easeOut" }}
                className="max-w-2xl space-y-2"
            >
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                    Verify your credentials
                </h1>
                <p className="text-lg leading-relaxed text-slate-600 max-w-xl">
                    Our community thrives on trust. Please provide professional documentation to confirm your
                    expertise and unlock your mentor profile.
                </p>
            </motion.div>

            {/* ── Main Content Grid ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
                className="max-w-2xl grid grid-cols-1 gap-6 md:grid-cols-3"
            >
                {/* Left: Upload + Accepted Docs */}
                <div className="space-y-5 md:col-span-2">
                    {/* Government ID Details */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
                        <h4 className="flex items-center gap-2 font-bold text-slate-900">
                            <Info className="h-5 w-5 text-primary" />
                            Government ID Details
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* ID Type Dropdown */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Document Type <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={idType}
                                    onChange={(e) => handleIdTypeChange(e.target.value)}
                                    className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all duration-200 ease-in-out hover:bg-white focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                                >
                                    {ID_TYPES.map((type) => (
                                        <option key={type.value} value={type.value} disabled={type.value === ""}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* ID Number Input */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                    ID/Reference Number <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={idNumber}
                                    onChange={handleIdNumberChange}
                                    onBlur={handleIdBlur}
                                    disabled={!idType}
                                    placeholder={selectedIdType?.hint || "Select document type first"}
                                    className={`h-12 w-full rounded-lg border bg-slate-50 px-4 text-slate-900 transition-all duration-200 ease-in-out hover:bg-white focus:bg-white focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 ${
                                        idError && touched
                                            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                                            : "border-slate-200 focus:border-primary focus:ring-primary/10"
                                    }`}
                                />
                                {selectedIdType?.hint && !idError && (
                                    <p className="text-xs text-slate-500">{selectedIdType.hint}</p>
                                )}
                                {idError && touched && (
                                    <p className="flex items-center gap-1 text-xs font-medium text-rose-500">
                                        <AlertCircle className="h-3 w-3" />
                                        {idError}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Upload Zone */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            Upload Document <span className="text-rose-500">*</span>
                        </label>
                        <label
                            onDragOver={(e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={(e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); setDragging(false); const dropped = e.dataTransfer.files[0]; if (dropped) setFile(dropped); }}
                            className={`group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 bg-white transition-all ${dragging ? "border-primary bg-primary/5" : "border-slate-300 hover:border-primary"
                                }`}
                        >
                        <input type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110">
                            <CloudUpload className="h-8 w-8 text-primary" />
                        </div>
                        {file ? (
                            <>
                                <p className="text-base font-bold text-slate-900">{file.name}</p>
                                <p className="mt-1 text-sm text-primary font-medium">File ready — click to change</p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-lg font-bold text-slate-900">Click or drag and drop to upload</h3>
                                <p className="mt-2 text-center text-sm text-slate-500">
                                    Upload government ID, professional certifications, or employment proof.
                                </p>
                            </>
                        )}
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {["PDF", "JPG", "PNG", "Max 10MB"].map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        </label>
                    </div>

                    {/* Accepted Documents */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6">
                        <h4 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                            <Info className="h-5 w-5 text-primary" />
                            Accepted Documents
                        </h4>
                        <ul className="space-y-3">
                            {[
                                "Aadhaar Card, PAN Card, Passport, Driving License, Voter ID",
                                "College ID Card or University enrollment proof",
                                "ITR Acknowledgment or Tax Deduction Receipt (TDR)",
                                "Salary Slip or Employment Verification Letter",
                                "Professional certifications from recognized institutions",
                            ].map((doc) => (
                                <li key={doc} className="flex items-start gap-3 text-sm text-slate-600">
                                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                    <span>{doc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right: Verified Status Card */}
                <div className="md:col-span-1">
                    <div className="sticky top-24 flex flex-col items-center rounded-xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent p-8 text-center overflow-hidden">
                        {/* Verified Badge */}
                        <div className="relative mb-6">
                            <div className="absolute inset-0 animate-pulse rounded-full bg-primary opacity-20 blur-2xl" />
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
                                <ShieldCheck className="h-12 w-12 text-white" />
                            </div>
                        </div>
                        <h4 className="mb-2 text-xl font-bold text-slate-900">Verified Status</h4>
                        <p className="mb-6 text-sm leading-relaxed text-slate-600">
                            Once verified, this badge will appear on your profile. Verified mentors see a{" "}
                            <span className="font-bold text-primary">45% higher</span> conversion rate from mentees.
                        </p>
                        {/* Profile Preview Card */}
                        <div className="w-full rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
                            <div className="relative">
                                {/* Profile Image */}
                                <div className="relative w-16 h-16 mx-auto mb-3">
                                    <img
                                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                                        alt="Mentor Preview"
                                        className="w-full h-full rounded-full object-cover border-2 border-white shadow-md"
                                    />
                                    {/* Verified Badge */}
                                    <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-md">
                                        <CheckCircle className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                                {/* Mock Profile Info */}
                                <h5 className="text-sm font-bold text-slate-900">Rajesh Sharma</h5>
                                <p className="text-xs text-slate-500 mb-2">Senior Physics Faculty</p>
                                <div className="flex items-center justify-center gap-1 text-xs text-primary font-medium">
                                    <ShieldCheck className="h-3 w-3" />
                                    <span>Verified Mentor</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── Footer Navigation ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="max-w-2xl flex items-center justify-between border-t border-slate-200 pt-8"
            >
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-slate-600 transition-all hover:bg-slate-100"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>
                <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!isFormValid}
                    className="flex items-center gap-2 rounded-xl bg-primary px-10 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Continue to Final Step
                    <ArrowRight className="h-4 w-4" />
                </button>
            </motion.div>

            {/* ── Footer Note ── */}
            <p className="max-w-2xl text-center text-sm text-slate-500">
                Your documents are processed securely and encrypted. We never share your private ID documents with anyone.
            </p>
        </div>
    );
}
