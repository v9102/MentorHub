"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface DataPoint {
    date: string;
    value: number;
}

interface PremiumLineChartProps {
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

export function PremiumLineChart({ data, color = "#2563eb", height = 260, valuePrefix = "" }: PremiumLineChartProps) {
    return (
        <div style={{ height, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        tickFormatter={(v) => `${valuePrefix}${v}`}
                    />
                    <Tooltip content={(props) => <CustomTooltip {...props} valuePrefix={valuePrefix} />} cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }} />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#fff", stroke: color, strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: color, strokeWidth: 0 }}
                        animationDuration={1500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
