"use client";

import { useState } from "react";
import { Briefcase, Globe, MapPin, Users, Building, Save, Check } from "lucide-react";
import FadeIn from "@/components/dashboard-ui/FadeIn";

interface CompanyForm {
    name: string; role: string; website: string; location: string;
    employees: string; industry: string; description: string;
}

export default function CompanyPage() {
    const [form, setForm] = useState<CompanyForm>({
        name: "", role: "", website: "", location: "",
        employees: "1–10", industry: "Technology", description: "",
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const set = (k: keyof CompanyForm, v: string) => setForm((p) => ({ ...p, [k]: v }));

    const save = async () => {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 900));
        setSaving(false); setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="animate-fadeIn">
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 -mx-4 md:-mx-6 px-4 md:px-6 mb-6">
                <div className="py-5 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Building className="w-6 h-6 text-blue-600" /> Company Profile
                        </h1>
                        <p className="text-slate-500 mt-0.5 text-sm">Your company information shown on your mentor profile</p>
                    </div>
                    <button onClick={save} disabled={saving || saved}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white transition-all min-w-[130px] justify-center
              ${saved ? "bg-green-500" : "bg-slate-900 hover:bg-blue-600"}
              ${saving ? "opacity-70 cursor-not-allowed" : ""}`}>
                        {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : saved ? <><Check className="w-4 h-4" /> Saved!</>
                                : <><Save className="w-4 h-4" /> Save</>}
                    </button>
                </div>
            </header>

            <div className="max-w-3xl mx-auto space-y-5">
                <FadeIn delay={0.1}>
                    <div className="bg-white rounded-[24px] border border-slate-200 shadow-soft p-6 space-y-5">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Building className="w-4 h-4" /> Basic Details
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-5">
                            {[
                                { label: "Company Name", key: "name", placeholder: "e.g. Acme Corp", icon: Building },
                                { label: "Your Role", key: "role", placeholder: "e.g. Senior Engineer", icon: Briefcase },
                                { label: "Website", key: "website", placeholder: "https://example.com", icon: Globe },
                                { label: "Location", key: "location", placeholder: "e.g. Bangalore, India", icon: MapPin },
                            ].map(({ label, key, placeholder, icon: Icon }) => (
                                <div key={key} className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                        <Icon className="w-3.5 h-3.5 text-slate-400" /> {label}
                                    </label>
                                    <input value={form[key as keyof CompanyForm]}
                                        onChange={(e) => set(key as keyof CompanyForm, e.target.value)}
                                        placeholder={placeholder}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                <FadeIn delay={0.15}>
                    <div className="bg-white rounded-[24px] border border-slate-200 shadow-soft p-6 space-y-5">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Users className="w-4 h-4" /> More About the Company
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700">Employees</label>
                                <select value={form.employees} onChange={(e) => set("employees", e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                    {["1–10", "11–50", "51–200", "201–500", "500+"].map((o) => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700">Industry</label>
                                <select value={form.industry} onChange={(e) => set("industry", e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                    {["Technology", "Finance", "Healthcare", "Education", "E-commerce", "Other"].map((o) => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">Company Description</label>
                            <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                                rows={4} placeholder="What does your company do?"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none" />
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
