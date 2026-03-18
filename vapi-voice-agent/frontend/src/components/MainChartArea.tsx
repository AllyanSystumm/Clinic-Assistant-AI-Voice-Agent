"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Calendar as CalendarIcon } from "lucide-react";

const monthlyData = [
    { name: '1', uv: 45 },
    { name: '2', uv: 32 },
    { name: '3', uv: 35 },
    { name: '4', uv: 48 },
    { name: '5', uv: 60 },
    { name: '6', uv: 75 },
    { name: '7', uv: 88 },
    { name: '8', uv: 92 },
    { name: '9', uv: 85 },
    { name: '10', uv: 68 },
    { name: '11', uv: 55 },
    { name: '12', uv: 40 },
];

const rankingData = [
    { rank: 3, title: "Vaccination", count: "21,128" },
    { rank: 4, title: "Consultation", count: "18,943" },
    { rank: 5, title: "Follow-up", count: "14,321" },
    { rank: 6, title: "Pediatric Care", count: "9,845" },
    { rank: 7, title: "Emergency", count: "5,432" },
];

type Appointment = {
    id: number;
    patient_name: string;
    reason: string | null;
    start_time: string;
    canceled: boolean;
    created_at: string;
};

export function MainChartArea({ appointments = [], holidays = [] }: { appointments?: Appointment[], holidays?: string[] }) {
    const [activeTab, setActiveTab] = useState("Sales"); // Keeping name matches original 'Sales', but we'll show 'Appointments' conceptually
    const [timeRange, setTimeRange] = useState("Next 10 Days");

    // Dynamically calculate the 10 day window data
    const generateChartData = () => {
        const data = [];
        const today = new Date();
        // Reset to midnight for local comparison
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 10; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            const month = currentDate.toLocaleString('default', { month: 'short' });
            const day = currentDate.getDate();
            const label = `${month} ${day}`;
            
            // Format to YYYY-MM-DD to match incoming times where possible, or just parse
            const currentDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

            // Count appointments for this day (excluding canceled)
            const count = appointments.filter(a => {
                if (a.canceled) return false;
                const aDate = new Date(a.start_time);
                return (
                    aDate.getFullYear() === currentDate.getFullYear() &&
                    aDate.getMonth() === currentDate.getMonth() &&
                    aDate.getDate() === currentDate.getDate()
                );
            }).length;

            const isHoliday = holidays.includes(currentDateStr);
            data.push({ name: label, uv: count, isHoliday });
        }
        return data;
    };

    const chartData = generateChartData();
    
    // Calculate the overall dates for the display
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 9);
    
    const startDateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
    const endDateStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

    return (
        <div className="bg-white rounded-md shadow-sm border border-gray-100 mb-6">

            {/* Header Tabs (Matches exactly) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-6 text-base mt-2 md:mt-0">
                    <button
                        onClick={() => setActiveTab("Sales")}
                        className={`pb-4 border-b-2 font-medium ${activeTab === "Sales" ? "border-[#8B2635] text-[#8B2635]" : "border-transparent text-gray-800 hover:text-[#8B2635]"} -mb-[17px]`}
                    >
                        Appointments
                    </button>
                    <button
                        onClick={() => setActiveTab("Visits")}
                        className={`pb-4 border-b-2 font-medium ${activeTab === "Visits" ? "border-[#8B2635] text-[#8B2635]" : "border-transparent text-gray-800 hover:text-[#8B2635]"} -mb-[17px]`}
                    >
                        Visits
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 text-sm text-gray-600 mt-4 md:mt-0">
                    <div className="flex space-x-4 mr-6">
                        {["Next 10 Days"].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`${timeRange === range ? "text-[#8B2635]" : "hover:text-[#8B2635]"}`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center border border-gray-300 rounded px-2 md:px-3 py-1.5 bg-white cursor-pointer hover:border-[#8B2635] w-fit">
                        <span className="mr-2 md:mr-3 text-xs md:text-sm">{startDateStr} ~ {endDateStr}</span>
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Main Content Area: Chart (Left) + List (Right) */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Side: Bar Chart */}
                <div className="lg:col-span-2">
                    <h4 className="text-base font-medium text-gray-800 mb-6">10-Day Appointment Trends</h4>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8c8c8c', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8c8c8c', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f5f5f5' }} itemStyle={{ color: '#000' }} />
                                <Bar dataKey="uv" name="Appointments" radius={[2, 2, 0, 0]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.isHoliday ? "#FFD700" : "#8B2635"} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Side: Ranking List */}
                <div>
                    <h4 className="text-base font-medium text-gray-800 mb-6">Appointment Ranking</h4>
                    <ul className="space-y-4">
                        {rankingData.map((item) => (
                            <li key={item.rank} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs mr-4 ${item.rank <= 3 ? "bg-[#6B1925] text-white" : "bg-[#f5f5f5] text-[#6B1925]"}`}>
                                        {item.rank}
                                    </span>
                                    <span className="text-sm text-gray-600">{item.title}</span>
                                </div>
                                <span className="text-sm font-medium text-gray-800">{item.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
}
