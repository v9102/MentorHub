import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, Instagram, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#F8FAFC]">
      <div className="max-w-[1280px] mx-auto px-6 pt-10 pb-10 md:px-16 md:pt-[60px] md:pb-10">

        {/* ── Main grid: 1-col mobile → 3-col desktop ── */}
        <div className="grid grid-cols-1 gap-0 md:grid-cols-[2fr_1fr_1fr] md:gap-12">

          {/* Brand block */}
          <div className="pb-6 md:pb-0">
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/mentomanialogo.png"
                alt="MentoMania"
                width={564}
                height={124}
                className="w-auto object-contain"
                style={{ height: '124px' }}
                priority
              />
            </Link>
            <p
              className="leading-relaxed max-w-[280px]"
              style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.6' }}
            >
              Connecting government exam aspirants with rank-holder mentors for personalized guidance.
            </p>
          </div>

          {/* ── Platform ── */}
          {/* border-t on mobile = section divider; stripped on desktop */}
          <div
            className="pt-6 pb-6 border-t md:pt-0 md:pb-0 md:border-t-0"
            style={{ borderColor: 'rgba(0,0,0,0.06)' }}
          >
            <h4
              className="font-bold uppercase mb-4"
              style={{ fontSize: '12px', letterSpacing: '0.1em', color: '#2E5FFF' }}
            >
              Platform
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/mentors"
                  className="text-[14px] text-[#64748B] hover:text-[#0A1628] transition-colors"
                >
                  Find Mentors
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-[14px] text-[#64748B] hover:text-[#0A1628] transition-colors"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up/mentor"
                  className="text-[14px] text-[#64748B] hover:text-[#0A1628] transition-colors"
                >
                  Become a Mentor
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Contact Us ── */}
          <div>
            <h4
              className="font-bold uppercase mb-4"
              style={{ fontSize: '12px', letterSpacing: '0.1em', color: '#2E5FFF' }}
            >
              Contact Us
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="tel:+917258889250"
                  className="flex items-center gap-2 text-[14px] text-[#64748B] hover:text-[#0A1628] transition-colors"
                >
                  <Phone size={16} style={{ color: '#2E5FFF', flexShrink: 0 }} />
                  +91 72588 89250
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@mentomania.in"
                  className="flex items-center gap-2 text-[14px] text-[#64748B] hover:text-[#0A1628] transition-colors"
                >
                  <Mail size={16} style={{ color: '#2E5FFF', flexShrink: 0 }} />
                  hello@mentomania.in
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/mentomania"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[14px] text-[#64748B] hover:text-[#0A1628] transition-colors"
                >
                  <Instagram size={16} style={{ color: '#E1306C', flexShrink: 0 }} />
                  @mentomania
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-[14px] text-[#64748B]">
                  <MapPin size={16} style={{ color: '#2E5FFF', flexShrink: 0 }} />
                  India
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div
          className="mt-10 pt-6"
          style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
        >
          <p className="text-center" style={{ fontSize: '12px', color: '#94A3B8' }}>
            © 2026 MentoMania. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );}