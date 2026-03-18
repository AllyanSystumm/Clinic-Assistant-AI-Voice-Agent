"use client";

import { useEffect, useState, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { TopSummaryCards } from "@/components/TopSummaryCards";
import { MainChartArea } from "@/components/MainChartArea";

type Appointment = {
    id: number;
    patient_name: string;
    reason: string | null;
    start_time: string;
    canceled: boolean;
    created_at: string;
};

export default function Dashboard() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchAppointments = useCallback(async () => {
        console.log('Dashboard: Fetching appointments for today');
        setLoading(true);
        try {
            const today = new Date().toLocaleDateString('en-CA');
            console.log(`Dashboard: Today's date = ${today}`);
            const response = await fetch("https://spleenish-ivan-unfrothing.ngrok-free.dev/list_appointments/?cb=1", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
                body: JSON.stringify({}),
            });
            const data = await response.json();
            console.log(`Dashboard: Received ${data.length} appointments:`, data);
            setAppointments(Array.isArray(data) ? data : []);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch on mount
    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const totalCanceled = appointments.filter(a => a.canceled).length;

    return (
        <div className="flex min-h-screen bg-[#f0f2f5] font-sans">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                <Header />

                <main className="flex-1 overflow-auto p-6">

                    <TopSummaryCards
                        totalAppointments={appointments.length}
                        totalCanceled={totalCanceled}
                    />

                    <MainChartArea appointments={appointments} />

                </main>
            </div>
        </div>
    );
}
