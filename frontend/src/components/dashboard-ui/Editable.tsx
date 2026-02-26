"use client";

import React from "react";

interface EditableTextProps {
    value: string;
    onChange: (value: string) => void;
    editable: boolean;
    className?: string;
    placeholder?: string;
}

export function EditableText({
    value,
    onChange,
    editable,
    className = "",
    placeholder,
}: EditableTextProps) {
    if (editable) {
        return (
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full bg-transparent border-none focus:ring-0 p-0 ${className}`}
            />
        );
    }
    return <span className={className}>{value}</span>;
}

interface EditableTextareaProps {
    value: string;
    onChange: (value: string) => void;
    editable: boolean;
    rows?: number;
    className?: string;
    placeholder?: string;
}

export function EditableTextarea({
    value,
    onChange,
    editable,
    rows = 3,
    className = "",
    placeholder,
}: EditableTextareaProps) {
    if (editable) {
        return (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                placeholder={placeholder}
                className={`w-full bg-slate-50 border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-[oklch(0.546_0.245_262.24)] focus:border-transparent ${className}`}
            />
        );
    }
    return <p className={`whitespace-pre-wrap ${className}`}>{value}</p>;
}
