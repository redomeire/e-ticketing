import { Gear } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { get } from "@vercel/edge-config";

const maintenance = await get('maintenance') as {
    enabled: boolean;
    durationMinutes: number;
};

export default async function Page() {
    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-stone-800 select-none">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-blue-200 animate-ping opacity-75"></div>
                        <div className="relative bg-blue-900 text-white p-5 rounded-full shadow-lg">
                            <HugeiconsIcon icon={Gear} size={50} />
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
                        System Maintenance
                    </h1>
                    <p className="text-lg text-stone-600">
                        We are currently performing scheduled maintenance. We apologize for any inconvenience and appreciate your patience.
                    </p>
                </div>

                <div className="text-stone-600 bg-white p-5 rounded-xl shadow-sm border border-stone-200/80 text-left leading-relaxed">
                    <p className="font-semibold text-stone-800 mb-2 text-lg">What’s Happening?</p>
                    <p className="mb-3">We are performing essential updates to our system to ensure better performance, enhanced security, and new features for our users. During this time, the E-Ticketing platform will be temporarily unavailable.</p>
                    <p className="font-semibold text-stone-800 mb-2 text-lg">Estimated Time of Completion</p>
                    <p>We expect the maintenance to be completed within the next {maintenance.durationMinutes || 30} minutes. We will keep you updated on our channels.</p>
                </div>

                <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Online
                    </span>
                    <span className="hidden sm:inline text-stone-300">|</span>
                    <p className="text-stone-500 font-medium">Time estimation: <span className="font-bold text-stone-700">{maintenance.durationMinutes || 30} minutes</span></p>
                </div>
            </div>
        </div>
    );
}