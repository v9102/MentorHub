"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface DataPoint {
    date: string;
    value: number;
}

interface PremiumAreaChartProps {
    data: DataPoint[];
    color?: string;
    height?: number;
    valuePrefix?: string;
}

const CustomTooltip = ({ active, payload, label, valuePrefix = "" }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-border-subtle shadow-floating rounded-xl px-4 py-3 text-sm">
                <p className="text-xs text-slate-500 mb-1 font-medium">{label}</p>
                <p className="font-semibold text-slate-900">
                    {valuePrefix}{payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

export function PremiumAreaChart({
    data,
    color = "#2563eb",
    height = 300,
    valuePrefix = "",
}: PremiumAreaChartProps) {
    const gradientId = `colorGradient-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div style={{ height, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        tickFormatter={(value) => `${valuePrefix}${value}`}
                    />
                    <Tooltip content={<CustomTooltip valuePrefix={valuePrefix} />} cursor={{ stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "4 4" }} />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill={`url(#${gradientId})`}
                        animationDuration={1500}
                        activeDot={{ r: 6, fill: color, strokeWidth: 0 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
