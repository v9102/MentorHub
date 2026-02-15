'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Twitter, Linkedin, Instagram, Send } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative bg-slate-950 text-slate-300 overflow-hidden border-t border-slate-800">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="footer-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-700" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#footer-grid-pattern)" />
                </svg>
            </div>
            {/* Gradient Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-900/20 blur-[100px] pointer-events-none rounded-full" />

            <div className="container mx-auto px-4 relative z-10 pt-16 pb-8">
                {/* Visual Block for Newsletter/Call to Action */}
                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl -mr-32 -mt-32 rounded-full pointer-events-none"></div>

                    <div className="max-w-xl relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-2">Stay ahead of the curve</h3>
                        <p className="text-slate-400">Join our newsletter for the latest mentor tips, study hacks, and platform updates.</p>
                    </div>
                    <div className="flex w-full md:w-auto gap-2 relative z-10">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 placeholder:text-slate-600"
                        />
                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20">
                            Subscribe <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="bg-blue-600/10 p-1 rounded-lg border border-blue-600/20">
                                <Image
                                    src="/logo.png"
                                    alt="MentoMania Logo"
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                            <span className="font-bold text-xl text-white tracking-tight pt-1">
                                ento<span className="text-blue-500">Mania</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400">
                            Empowering students with personalized mentorship. Connect, learn, and succeed with the best guides in the industry.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all">
                                <Instagram className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="/mentors" className="hover:text-blue-400 transition-colors">Find Mentors</Link></li>
                            <li><Link href="/sign-up/mentor" className="hover:text-blue-400 transition-colors">Become a Mentor</Link></li>
                            <li><Link href="/how-it-works" className="hover:text-blue-400 transition-colors">How it Works</Link></li>
                            <li><Link href="/pricing" className="hover:text-blue-400 transition-colors">Pricing Plans</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="/blogs" className="hover:text-blue-400 transition-colors">Blog & Guides</Link></li>
                            <li><Link href="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
                            <li><Link href="/support" className="hover:text-blue-400 transition-colors">Help Center</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/cookie" className="hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} MentoMania. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy</span>
                        <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms</span>
                        <span className="hover:text-slate-300 cursor-pointer transition-colors">Sitemap</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
