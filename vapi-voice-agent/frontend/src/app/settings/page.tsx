"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function SettingsPage() {
    const [startHour, setStartHour] = useState(12);
    const [endHour, setEndHour] = useState(17);
    const [slotDuration, setSlotDuration] = useState(15);
    const [workingDays, setWorkingDays] = useState<number[]>([0,1,2,3,4,5]);
    const [holidays, setHolidays] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const dayOptions = [
        { value: 0, label: "Monday" },
        { value: 1, label: "Tuesday" },
        { value: 2, label: "Wednesday" },
        { value: 3, label: "Thursday" },
        { value: 4, label: "Friday" },
        { value: 5, label: "Saturday" },
        { value: 6, label: "Sunday" },
    ];

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://spleenish-ivan-unfrothing.ngrok-free.dev/settings/", {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true" 
                }
            });
            const data = await response.json();
            setStartHour(data.start_hour ?? 12);
            setEndHour(data.end_hour ?? 17);
            setSlotDuration(data.slot_duration_minutes ?? 15);
            if (data.working_days) {
                setWorkingDays(data.working_days.split(",").map((d: string) => parseInt(d.trim())));
            } else {
                setWorkingDays([]);
            }
            setHolidays(data.holidays || "");
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage("");
        try {
            const response = await fetch("https://spleenish-ivan-unfrothing.ngrok-free.dev/settings/", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true" 
                },
                body: JSON.stringify({
                    start_hour: startHour,
                    end_hour: endHour,
                    slot_duration_minutes: slotDuration,
                    working_days: workingDays.join(","),
                    holidays: holidays
                })
            });
            if (response.ok) {
                setMessage("Settings saved successfully!");
            } else {
                setMessage("Failed to save settings.");
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            setMessage("An error occurred while saving.");
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(""), 3000);
        }
    };


    const toggleDay = (dayValue: number) => {
        setWorkingDays(prev => 
            prev.includes(dayValue) 
                ? prev.filter(d => d !== dayValue)
                : [...prev, dayValue]
        );
    };

    return (
        <div className="flex bg-[#F8FAFC] min-h-screen">
            <Sidebar />
            <main className="flex-1">
                <Header />
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-slate-800">Clinic Settings</h1>
                        <button 
                            onClick={fetchSettings}
                            className="text-sm bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 font-medium"
                        >
                            Refresh
                        </button>
                    </div>
                    {loading ? (
                        <p>Loading settings...</p>
                    ) : (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
                            <h2 className="text-xl font-bold mb-6 text-slate-800">Schedule Configuration</h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-md font-semibold text-slate-700 mb-3">Working Hours</h3>
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <label className="block text-sm text-slate-500 mb-1">Start Hour (0-23)</label>
                                            <select 
                                                value={startHour} 
                                                onChange={(e) => setStartHour(parseInt(e.target.value))}
                                                className="border rounded px-3 py-2 w-full max-w-[120px] text-black text-center font-mono bg-white"
                                            >
                                                {Array.from({ length: 24 }).map((_, i) => (
                                                    <option key={i} value={i}>
                                                        {i.toString().padStart(2, "0")}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-slate-500 mb-1">End Hour (0-23)</label>
                                            <select 
                                                value={endHour} 
                                                onChange={(e) => setEndHour(parseInt(e.target.value))}
                                                className="border rounded px-3 py-2 w-full max-w-[120px] text-black text-center font-mono bg-white"
                                            >
                                                {Array.from({ length: 24 }).map((_, i) => (
                                                    <option key={i} value={i}>
                                                        {i.toString().padStart(2, "0")}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-slate-500 mb-1">Slot Duration (Mins)</label>
                                            <select 
                                                value={slotDuration} 
                                                onChange={(e) => setSlotDuration(parseInt(e.target.value))}
                                                className="border rounded px-3 py-2 w-full bg-white text-black"
                                            >
                                                <option value={15}>15 mins</option>
                                                <option value={30}>30 mins</option>
                                                <option value={45}>45 mins</option>
                                                <option value={60}>60 mins</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-md font-semibold text-slate-700 mb-3">Working Days</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {dayOptions.map(day => (
                                            <label key={day.value} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded border border-slate-200 cursor-pointer hover:bg-slate-100">
                                                <input 
                                                    type="checkbox" 
                                                    checked={workingDays.includes(day.value)}
                                                    onChange={() => toggleDay(day.value)}
                                                    className="w-4 h-4 text-[#8B2635] rounded border-slate-300 focus:ring-[#8B2635]"
                                                />
                                                <span className="text-sm font-medium text-slate-700">{day.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-md font-semibold text-slate-700 mb-3">Holidays & Closed Dates</h3>
                                    <label className="block text-sm text-slate-500 mb-1">Enter specific dates to block booking (YYYY-MM-DD, comma separated)</label>
                                    <textarea
                                        value={holidays}
                                        onChange={(e) => setHolidays(e.target.value)}
                                        placeholder="e.g. 2026-12-25, 2027-01-01"
                                        className="w-full border rounded px-3 py-2 h-24 text-sm text-black"
                                    ></textarea>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <button 
                                        onClick={handleSave} 
                                        disabled={saving}
                                        className="bg-[#8B2635] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#6B1925] transition-colors disabled:opacity-50"
                                    >
                                        {saving ? "Saving..." : "Save Settings"}
                                    </button>
                                    {message && (
                                        <span className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
                                            {message}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
