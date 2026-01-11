"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { MentorProfile } from "../../../mentors/mock";

type Props = {
  mentor: MentorProfile;
  sessionDate: string;
  sessionTime: string;
  price: number;
};

export default function ConfirmClient({
  mentor,
  sessionDate,
  sessionTime,
  price,
}: Props) {
  const { user, isLoaded } = useUser();

  /* ---------------- Basic State ---------------- */
  const [finalPrice, setFinalPrice] = useState(price);
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");

  /* ---------------- Phone OTP State ---------------- */
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] =
    useState<ConfirmationResult | null>(null);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);

  /* ---------------- reCAPTCHA Ref (NO any) ---------------- */
  const recaptchaVerifierRef =
    useRef<RecaptchaVerifier | null>(null);

  /* ---------------- Init reCAPTCHA ---------------- */
  useEffect(() => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        firebaseAuth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }

    return () => {
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
    };
  }, []);

  /* ---------------- Loading Guard ---------------- */
  if (!isLoaded || !user) {
    return (
      <div className="p-6 text-sm text-gray-600">
        Loading user information…
      </div>
    );
  }

  /* ---------------- User Data (Read-only) ---------------- */
  const name =
    user.fullName ??
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  const email =
    user.primaryEmailAddress?.emailAddress ?? "";

  /* ---------------- OTP Logic ---------------- */
  const sendOtp = async () => {
    if (!recaptchaVerifierRef.current) return;

    if (!phone.startsWith("+")) {
      alert("Phone number must be in +91XXXXXXXXXX format");
      return;
    }

    setLoadingOtp(true);
    try {
      const result = await signInWithPhoneNumber(
        firebaseAuth,
        phone,
        recaptchaVerifierRef.current
      );
      setConfirmation(result);
      alert("OTP sent");
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP");
    }
    setLoadingOtp(false);
  };

  const verifyOtp = async () => {
    if (!confirmation) return;

    setLoadingOtp(true);
    try {
      await confirmation.confirm(otp);
      setPhoneVerified(true);
      alert("Phone verified");
    } catch {
      alert("Invalid OTP");
    }
    setLoadingOtp(false);
  };

  /* ---------------- Coupon Logic (NEW10 only) ---------------- */
  const applyCoupon = () => {
    if (coupon.trim().toLowerCase() === "new10") {
      setFinalPrice(Math.floor(price * 0.9)); // 10% off
      setCouponError("");
    } else {
      setFinalPrice(price);
      setCouponError("Invalid coupon code");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Fill Information
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Booking session for {sessionDate}, {sessionTime}
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border rounded-lg p-5 space-y-4">
        {/* Name */}
        <div>
          <label className="text-xs text-gray-600">Name</label>
          <input
            value={name}
            readOnly
            className="w-full border rounded-md px-3 py-2 text-sm bg-gray-100"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-xs text-gray-600">Email</label>
          <input
            value={email}
            readOnly
            className="w-full border rounded-md px-3 py-2 text-sm bg-gray-100"
          />
        </div>

        {/* Phone + OTP */}
        <div>
          <label className="text-xs text-gray-600">
            Phone number
          </label>

          <div id="recaptcha-container" />

          <div className="flex gap-2">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={phoneVerified}
              className="flex-1 border rounded-md px-3 py-2 text-sm"
              placeholder="+91XXXXXXXXXX"
            />

            {!confirmation ? (
              <button
                onClick={sendOtp}
                disabled={loadingOtp}
                className="px-4 rounded-md bg-gray-100 text-sm"
              >
                Verify
              </button>
            ) : (
              <button
                disabled
                className="px-4 rounded-md bg-green-100 text-green-700 text-sm"
              >
                OTP Sent
              </button>
            )}
          </div>

          {confirmation && !phoneVerified && (
            <div className="flex gap-2 mt-2">
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 border rounded-md px-3 py-2 text-sm"
                placeholder="Enter OTP"
              />
              <button
                onClick={verifyOtp}
                disabled={loadingOtp}
                className="px-4 rounded-md bg-black text-white text-sm"
              >
                Confirm
              </button>
            </div>
          )}

          {phoneVerified && (
            <p className="text-xs text-green-600 mt-1">
              Phone verified ✔
            </p>
          )}
        </div>
      </div>

      {/* Coupon */}
      <div className="bg-white border rounded-lg p-5 space-y-3">
        <p className="text-sm font-medium">Apply Coupon</p>

        <div className="flex gap-2">
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="flex-1 border rounded-md px-3 py-2 text-sm"
            placeholder="Coupon code"
          />
          <button
            onClick={applyCoupon}
            className="px-4 rounded-md bg-black text-white text-sm"
          >
            Apply
          </button>
        </div>

        {couponError ? (
          <p className="text-xs text-red-600">{couponError}</p>
        ) : (
          <p className="text-xs text-green-600">
            Use <strong>NEW10</strong> to get 10% off
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between">
        <button className="text-sm text-gray-600">← Back</button>

        <button
          disabled={!phoneVerified}
          className={`px-6 py-2 rounded-md text-sm ${
            phoneVerified
              ? "bg-black text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Pay ₹{finalPrice}
        </button>
      </div>
    </div>
  );
}
