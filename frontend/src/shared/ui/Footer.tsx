'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Phone, Send } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-gray-100 pt-20 pb-8 font-sans">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* 4-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    
                    {/* Column 1: Brand Block */}
                    <div className="lg:col-span-4 flex flex-col items-start pr-4">
                        <Link href="/" className="inline-flex items-center space-x-2 mb-4">
                            <Image
                                src="/logo.png"
                                alt="MentoMania Logo"
                                width={32}
                                height={32}
                                className="w-8 h-8 object-contain"
                            />
                            <span className="font-bold text-xl text-gray-900 tracking-tight">
                                Mento<span className="text-blue-600">Mania</span>
                            </span>
                        </Link>
                        
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            Connecting government exam aspirants with rank-holder mentors for personalized guidance.
                        </p>

                        <a 
                            href="tel:+917258889250" 
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6 font-medium"
                        >
                            <Phone className="w-4 h-4" />
                            <span>+91 72588 89250</span>
                        </a>

                        <div className="flex gap-3 relative">
                            <div className="group relative w-min">
                                <a
                                    href="https://www.instagram.com/mentomania?utm_source=qr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-blue-200 hover:text-blue-600 hover:shadow-sm transition-all duration-200"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="w-4 h-4" />
                                </a>

                                {/* QR Code Hover Card */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-56 md:w-64 p-4 bg-white border border-gray-100 rounded-2xl shadow-soft opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out z-50">
                                    <div className="w-full aspect-square border border-gray-100 rounded-xl overflow-hidden mb-3">
                                        <Image
                                            src="/instagram.jpg"
                                            alt="Instagram QR Code"
                                            width={256}
                                            height={256}
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                    <p className="text-xs font-medium text-center text-gray-500">Scan to Follow</p>

                                    {/* Small Triangle */}
                                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45 shadow-[1px_1px_2px_rgb(0_0_0/0.03)]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Platform */}
                    <div className="lg:col-span-2 lg:col-start-6">
                        <h4 className="text-gray-900 font-semibold text-base mb-5">Platform</h4>
                        <ul className="space-y-3">
                            <li><Link href="/mentors" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Find Mentors</Link></li>
                            <li><Link href="/how-it-works" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">How it Works</Link></li>
                            <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Pricing</Link></li>
                            <li><Link href="/sign-up/mentor" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Become a Mentor</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Company */}
                    <div className="lg:col-span-2">
                        <h4 className="text-gray-900 font-semibold text-base mb-5">Company</h4>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">About</Link></li>
                            <li><Link href="/blogs" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Blog</Link></li>
                            <li><Link href="/faq" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">FAQ</Link></li>
                            <li><Link href="/contact" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Stay Updated */}
                    <div className="lg:col-span-3">
                        <h4 className="text-gray-900 font-semibold text-base mb-2">Stay Updated</h4>
                        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                            Discover the latest strategies and platform updates.
                        </p>
                        <form className="flex w-full" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Subscribe to our newsletter!"
                                className="w-full px-4 py-2 bg-gray-200/50 border border-transparent rounded-l-lg text-sm focus:outline-none focus:bg-white focus:border-gray-200 focus:ring-0 transition-all placeholder:text-gray-500 text-gray-900"
                                required
                            />
                            <button 
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-r-lg transition-colors flex items-center justify-center shrink-0"
                                aria-label="Subscribe"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-gray-200/70 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>&copy; {new Date().getFullYear()} MentoMania.</span>
                        <span className="hidden sm:inline">All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-sm text-gray-500">All systems operational</span>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}
