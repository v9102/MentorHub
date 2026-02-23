"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DonutItem {
    name: string;
    value: number;
}

interface PremiumDonutChartProps {
    data: DonutItem[];
    colors?: string[];
    height?: number;
    innerRadius?: number;
    outerRadius?: number;
}

const DEFAULT_COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-border-subtle shadow-floating rounded-xl px-4 py-3 text-sm">
                <p className="font-medium text-slate-800">
                    {payload[0].name}: <span style={{ color: payload[0].payload.fill }}>{payload[0].value}%</span>
                </p>
            </div>
        );
    }
    return null;
};

const CustomLegend = ({ payload }: any) => (
    <div className="flex flex-wrap justify-center gap-4 mt-3">
        {payload.map((entry: any, i: number) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
                {entry.value}
            </div>
        ))}
    </div>
);

export function PremiumDonutChart({ data, colors = DEFAULT_COLORS, height = 280, innerRadius = 60, outerRadius = 90 }: PremiumDonutChartProps) {
    return (
        <div style={{ height, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="45%"
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        paddingAngle={3}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1200}
                        stroke="none"
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegend />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
