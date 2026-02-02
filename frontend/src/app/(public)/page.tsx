import { BookOpen, Stethoscope, Brain, Calculator, Scale, Cog, FlaskConical, DollarSign, Globe, GraduationCap } from "lucide-react";
import Link from "next/link";
import BecomeMentorButton from '@/modules/landing/BecomeMentorButton';

export default function Home() {
  return (
    <div
      className="min-h-screen bg-gray-50 overflow-x-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero  Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-blue-800">Ace Your </span>
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Dream Exam</span>
          </h1>

          <p className="text-gray-600 mb-8 max-w-2xl mx-auto px-4">
            Connect with top scorers and mentors who have cracked IIT JEE, NEET, CAT, UPSC and more. Get personalized guidance to achieve your goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <Link
              href="/mentors"
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-3xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
            >
              Find Your Mentor
            </Link>

            <BecomeMentorButton />
          </div>
        </div>

        {/* Popular Exams Section */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-900">
            <span className="text-blue-800">Popular </span>
            <span className="text-orange-600">Exams</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            <Link
              href="/exam/iit-jee"
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Calculator className="w-6 h-6 text-blue-800" />
              </div>
              <h3 className="text-gray-900 font-semibold text-sm">
                IIT JEE
              </h3>
            </Link>

            <Link
              href="/exam/neet"
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Stethoscope className="w-6 h-6 text-green-800" />
              </div>
              <h3 className="text-gray-900 font-semibold text-sm">
                NEET
              </h3>
            </Link>

            <Link
              href="/exam/cat-mba"
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <GraduationCap className="w-6 h-6 text-purple-800" />
              </div>
              <h3 className="text-gray-900 font-semibold text-sm">
                CAT / MBA
              </h3>
            </Link>

            <Link
              href="/exam/upsc"
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6 text-orange-800" />
              </div>
              <h3 className="text-gray-900 font-semibold text-sm">
                UPSC
              </h3>
            </Link>

            <Link
              href="/exam/gate"
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                <Cog className="w-6 h-6 text-indigo-800" />
              </div>
              <h3 className="text-gray-900 font-semibold text-sm">
                GATE
              </h3>
            </Link>

            <Link
              href="/exam/ca"
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
                <DollarSign className="w-6 h-6 text-yellow-800" />
              </div>
              <h3 className="text-gray-900 font-semibold text-sm">
                CA
              </h3>
            </Link>

            <Link
              href="/exam/clat"
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                <Scale className="w-6 h-6 text-red-800" />
              </div>
              <h3 className="text-gray-900 font-semibold text-sm">
                CLAT
              </h3>
            </Link>

            <Link
              href="/exam/nda"
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                <Globe className="w-6 h-6 text-teal-800" />
              </div>
              <h3 className="text-gray-900 font-semibold text-sm">
                NDA
              </h3>
            </Link>

            <Link
              href="/exam/cuet"
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-3">
                <Brain className="w-6 h-6 text-pink-800" />
              </div>
              <h3 className="text-gray-900 font-semibold text-sm">
                CUET
              </h3>
            </Link>

            <Link
              href="/exam/bitsat"
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-3">
                <FlaskConical className="w-6 h-6 text-cyan-800" />
              </div>
              <h3 className="text-gray-900 font-semibold text-sm">
                BITSAT
              </h3>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
