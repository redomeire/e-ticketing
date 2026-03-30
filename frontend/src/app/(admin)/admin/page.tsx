"use client"

import { useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis
} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Ticket01Icon as Ticket,
    Dollar02Icon as DollarSign,
    UserGroupIcon as Users,
    Calendar03Icon as Calendar,
    TrendingUp,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetAnalytics } from "@/modules/analytics/hooks/useAnalyticsRepository";
import { QueryStateHandler } from "@/components/query/QueryStateHandler";

const trendData: Record<string, { label: string; revenue: number }[]> = {
    week: [
        { label: "Senin", revenue: 4500000 }, { label: "Selasa", revenue: 5200000 },
        { label: "Rabu", revenue: 3800000 }, { label: "Kamis", revenue: 6100000 },
        { label: "Jumat", revenue: 9400000 }, { label: "Sabtu", revenue: 12000000 },
        { label: "Minggu", revenue: 8500000 },
    ],
    month: [
        { label: "Minggu 1", revenue: 25000000 }, { label: "Minggu 2", revenue: 32000000 },
        { label: "Minggu 3", revenue: 28000000 }, { label: "Minggu 4", revenue: 45000000 },
    ],
    year: [
        { label: "Januari", revenue: 120000000 }, { label: "Februari", revenue: 150000000 },
        { label: "Maret", revenue: 110000000 }, { label: "April", revenue: 180000000 },
    ]
};

const chartConfig = {
    revenue: {
        label: "Pendapatan",
        color: "oklch(0.55 0.22 263)",
    },
} satisfies ChartConfig;

export default function AdminDashboard() {
    const [timeRange, setTimeRange] = useState("week");
    const { data: analytics, isPending, isError } = useGetAnalytics({}, {
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });

    return (
        <div className="space-y-8 bg-slate-50/30 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Ringkasan</h1>
                    <p className="text-base text-slate-500 mt-2 font-medium">
                        Pantau performa platform event secara real-time.
                    </p>
                </div>
            </div>

            <QueryStateHandler
                data={analytics}
                isPending={isPending}
                isError={isError}
            >
                {
                    analytics &&
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Penjualan Tiket"
                            value={analytics.data.total_seats_booked.toLocaleString()}
                            icon={Ticket}
                            iconColor="text-blue-600"
                            subText="Tiket terjual terakumulasi"
                        />
                        <StatCard
                            title="Total Pendapatan"
                            value="Rp 1.24M"
                            icon={DollarSign}
                            iconColor="text-emerald-600"
                            trend="+8.2%"
                        />
                        <StatCard
                            title="User Terdaftar"
                            value={analytics.data.total_users.toLocaleString()}
                            icon={Users}
                            iconColor="text-purple-600"
                            subText="Total akun aktif"
                        />
                        <StatCard
                            title="Event Terselenggara"
                            value={analytics.data.total_events.toLocaleString()}
                            icon={Calendar}
                            iconColor="text-orange-500"
                            subText="Event yang telah berlangsung"
                        />
                    </div>
                }
            </QueryStateHandler>


            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6 px-6">
                    <div>
                        <CardTitle className="text-base font-semibold text-slate-900">
                            Grafik Pendapatan
                        </CardTitle>
                        <CardDescription className="text-sm">
                            Arus kas masuk berdasarkan periode waktu terpilih
                        </CardDescription>
                    </div>
                    <div className="w-1/4">
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-full h-10 bg-slate-50 border-slate-200 rounded-lg text-sm font-medium">
                                <SelectValue placeholder="Pilih Periode" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                <SelectItem value="week" className="text-sm">Minggu Ini</SelectItem>
                                <SelectItem value="month" className="text-sm">Bulan Ini</SelectItem>
                                <SelectItem value="year" className="text-sm">Tahun Ini</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="pt-10 px-6">
                    <ChartContainer config={chartConfig} className="h-87.5 w-full">
                        <BarChart accessibilityLayer data={trendData[timeRange]}>
                            <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="4 4" />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                tickMargin={12}
                                axisLine={false}
                                className="text-xs font-medium text-slate-400"
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                className="text-xs font-medium text-slate-400"
                                tickFormatter={(value) => `Rp${value >= 1000000 ? value / 1000000 + 'jt' : value}`}
                            />
                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            <Bar
                                dataKey="revenue"
                                fill="var(--color-revenue)"
                                radius={[6, 6, 0, 0]}
                                barSize={timeRange === 'year' ? 24 : 48}
                            />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}

function StatCard({ title, value, icon, iconColor, trend, subText }:
    {
        title: string;
        value: string;
        icon: IconSvgElement;
        iconColor: string;
        trend?: string;
        subText?: string;
    }
) {
    return (
        <Card className="border-none shadow-sm bg-white transition-all hover:shadow-md group">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-semibold">
                    {title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl ${iconColor} bg-opacity-10 bg-current transition-colors group-hover:bg-opacity-20`}>
                    <HugeiconsIcon icon={icon} className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                    {value}
                </div>
                {trend ? (
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center text-emerald-600 font-semibold text-xs bg-emerald-50 px-2 py-1 rounded-md">
                            <HugeiconsIcon icon={TrendingUp} className="h-3 w-3 mr-1" />
                            {trend}
                        </div>
                        <span className="text-xs text-slate-400 font-normal">vs periode lalu</span>
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 font-normal mt-2">
                        {subText}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}