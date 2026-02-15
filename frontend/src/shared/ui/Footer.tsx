'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Linkedin, Instagram, ArrowRight, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 font-sans">
            {/* Newsletter Section */}
            <div className="border-b border-gray-100 bg-gray-50/50">
                <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="max-w-md text-center md:text-left">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Join 10,000+ Aspirants</h3>
                        <p className="text-gray-500 text-sm">Get exclusive study hacks and mentor insights weekly.</p>
                    </div>
                    <div className="flex w-full md:w-auto gap-3">
                        <div className="relative w-full md:w-72">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 text-gray-900"
                            />
                        </div>
                        <button className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shrink-0 shadow-sm hover:shadow-md">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-16 pb-12">
                <div className="grid grid-cols-2 md:grid-cols-12 gap-y-12 gap-x-8 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-4 space-y-6 pr-0 md:pr-12">
                        <Link href="/" className="inline-flex items-center space-x-2">
                            <div className="bg-blue-50 p-1.5 rounded-xl">
                                <Image
                                    src="/logo.png"
                                    alt="MentoMania Logo"
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 object-contain"
                                />
                            </div>
                            <span className="font-bold text-xl text-gray-900 tracking-tight">
                                Mento<span className="text-blue-600">Mania</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-500">
                            The #1 platform connecting government exam aspirants with rank-holder mentors. Crack UPSC, SSC, and Banking exams with personalized guidance.
                        </p>
                        <div className="flex gap-3">
                            {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-white hover:border-blue-200 hover:text-blue-600 hover:shadow-sm transition-all duration-300"
                                >
                                    <Icon className="w-4 h-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-gray-900 font-semibold text-sm mb-5">Platform</h4>
                        <ul className="space-y-3.5 text-sm text-gray-500">
                            <li><Link href="/mentors" className="hover:text-blue-600 transition-colors">Find Mentors</Link></li>
                            <li><Link href="/how-it-works" className="hover:text-blue-600 transition-colors">How it Works</Link></li>
                            <li><Link href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link></li>
                            <li><Link href="/sign-up/mentor" className="hover:text-blue-600 transition-colors">Become a Mentor</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-gray-900 font-semibold text-sm mb-5">Resources</h4>
                        <ul className="space-y-3.5 text-sm text-gray-500">
                            <li><Link href="/blogs" className="hover:text-blue-600 transition-colors">Success Stories</Link></li>
                            <li><Link href="/blogs" className="hover:text-blue-600 transition-colors">Blog</Link></li>
                            <li><Link href="/community" className="hover:text-blue-600 transition-colors">Community</Link></li>
                            <li><Link href="/faq" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-gray-900 font-semibold text-sm mb-5">Company</h4>
                        <ul className="space-y-3.5 text-sm text-gray-500">
                            <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-blue-600 transition-colors">Careers</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
                            <li><Link href="/partners" className="hover:text-blue-600 transition-colors">Partners</Link></li>
                        </ul>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-gray-900 font-semibold text-sm mb-5">Legal</h4>
                        <ul className="space-y-3.5 text-sm text-gray-500">
                            <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link></li>
                            <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms</Link></li>
                            <li><Link href="/cookie" className="hover:text-blue-600 transition-colors">Cookies</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
                    <p>&copy; {new Date().getFullYear()} MentoMania Inc. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 ring-4 ring-green-50"></span>
                        <span className="text-gray-500 font-medium">All systems operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
