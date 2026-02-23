"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface BarItem {
    name: string;
    value: number;
}

interface PremiumBarChartProps {
    data: BarItem[];
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

export function PremiumBarChart({ data, color = "#2563eb", height = 260, valuePrefix = "" }: PremiumBarChartProps) {
    return (
        <div style={{ height, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barCategoryGap="30%">
                    <XAxis
                        dataKey="name"
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
                    <Tooltip content={(props) => <CustomTooltip {...props} valuePrefix={valuePrefix} />} cursor={{ fill: "#f1f5f9" }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1200}>
                        {data.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={color}
                                fillOpacity={0.7 + (index / data.length) * 0.3}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
