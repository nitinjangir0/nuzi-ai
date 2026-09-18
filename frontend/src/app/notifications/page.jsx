"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BsSoundwave } from "react-icons/bs";
import {
    FiBell,
    FiZap,
    FiTrendingUp,
} from "react-icons/fi";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function NotificationsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [briefTime, setBriefTime] = useState("6:30 AM");

    useEffect(() => {
        const savedTime = sessionStorage.getItem("nuzi_brief_time");

        if (!savedTime) return;

        try {
            const parsedTime = JSON.parse(savedTime);

            if (parsedTime?.time && parsedTime?.period) {
                setBriefTime(
                    `${parsedTime.time} ${parsedTime.period}`
                );
            }
        } catch {
            setBriefTime("6:30 AM");
        }
    }, []);

    async function handleAllowNotifications() {
        try {
            setLoading(true);

            if ("Notification" in window) {
                await Notification.requestPermission();
            }

            const email = sessionStorage.getItem("nuzi_user_email");

            if (!email) {
                router.push("/ready");
                return;
            }

            const response = await fetch(
                `${API_URL}/preferences/notifications`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email,
                        notifications: true,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                        "Unable to save notification preference"
                );
            }

            sessionStorage.setItem(
                "nuzi_notifications",
                JSON.stringify(true)
            );

            router.push("/ready");
        } catch (error) {
            console.error(
                "Notification save error:",
                error
            );

            sessionStorage.setItem(
                "nuzi_notifications",
                JSON.stringify(true)
            );

            router.push("/ready");
        } finally {
            setLoading(false);
        }
    }

    async function handleNotNow() {
        try {
            setLoading(true);

            const email = sessionStorage.getItem("nuzi_user_email");

            if (!email) {
                router.push("/ready");
                return;
            }

            const response = await fetch(
                `${API_URL}/preferences/notifications`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email,
                        notifications: false,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                        "Unable to save notification preference"
                );
            }

            sessionStorage.setItem(
                "nuzi_notifications",
                JSON.stringify(false)
            );

            router.push("/ready");
        } catch (error) {
            console.error(
                "Notification save error:",
                error
            );

            sessionStorage.setItem(
                "nuzi_notifications",
                JSON.stringify(false)
            );

            router.push("/ready");
        } finally {
            setLoading(false);
        }
    }

    function handleSkip() {
        router.push("/ready");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#09090f] px-0 py-0 sm:px-4 sm:py-6">
            <div className="relative flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden rounded-none bg-[#101016] px-3 py-7 text-white shadow-2xl sm:min-h-[720px] sm:rounded-[32px] sm:px-5 sm:py-8">

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <BsSoundwave
                            size={11}
                            className="mr-1 text-white"
                        />

                        <span className="text-[7px] font-semibold text-white">
                            Nuzio
                        </span>

                        <span className="text-[7px] font-semibold text-[#8b5cf6]">
                            AI
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleSkip}
                        className="text-[7px] font-medium tracking-[0.14em] text-gray-500 transition hover:text-white"
                    >
                        SKIP →
                    </button>
                </div>

                <div className="mt-7">
                    <div className="flex gap-[3px]">
                        <div className="h-[3px] flex-1 rounded-full bg-[#8b5cf6]" />
                        <div className="h-[3px] flex-1 rounded-full bg-[#8b5cf6]" />
                        <div className="h-[3px] flex-1 rounded-full bg-[#8b5cf6]" />
                        <div className="h-[3px] flex-1 rounded-full bg-[#8b5cf6]" />
                        <div className="h-[3px] flex-1 rounded-full bg-[#8b5cf6]" />
                        <div className="h-[3px] flex-1 rounded-full bg-[#292931]" />
                    </div>

                    <div className="mt-4">
                        <span className="text-[7px] font-medium uppercase tracking-[0.18em] text-[#8b5cf6]">
                            STEP 5 OF 6
                        </span>
                    </div>
                </div>

                <div className="mt-3">
                    <h1 className="text-[24px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[26px]">
                        Stay in
                        <br />
                        <span className="font-serif italic font-normal text-[#a78bfa]">
                            the loop.
                        </span>
                    </h1>

                    <p className="mt-3 max-w-[330px] text-[9px] leading-4 text-gray-500 sm:text-[10px]">
                        Turn on notifications so you never miss your brief.
                    </p>
                </div>

                <div className="mt-4 rounded-2xl border border-[#292931] bg-[#18181d] p-3">
                    <div className="flex items-start gap-2.5">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#7044f5]">
                            <BsSoundwave
                                size={11}
                                className="text-white"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[8px] font-semibold text-white">
                                    Nuzio
                                </span>

                                <span className="text-[5px] text-gray-500">
                                    NOW
                                </span>
                            </div>

                            <p className="mt-2 text-[9px] font-semibold text-white">
                                🌞 Your morning brief is ready
                            </p>

                            <p className="mt-1 truncate text-[7px] text-gray-500">
                                6 stories · AI & Tech, Markets, Startups · Voice: Aria · {briefTime}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <span className="text-[6px] font-medium uppercase tracking-[0.18em] text-[#8b5cf6]">
                        WHAT YOU'LL RECEIVE
                    </span>
                </div>

                <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2.5 rounded-xl border border-[#292931] bg-[#18181d] px-3 py-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#245b45] bg-[#163326]">
                            <FiBell
                                size={12}
                                className="text-[#35c98b]"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[8px] font-semibold text-white">
                                    Morning brief ready
                                </span>

                                <span className="shrink-0 text-[6px] font-medium text-[#35c98b]">
                                    Daily · {briefTime}
                                </span>
                            </div>

                            <p className="mt-1 text-[7px] leading-3 text-gray-500">
                                Your daily audio briefing is waiting
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 rounded-xl border border-[#292931] bg-[#18181d] px-3 py-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#49315f] bg-[#211b32]">
                            <FiZap
                                size={12}
                                className="text-[#a78bfa]"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[8px] font-semibold text-white">
                                    Breaking story
                                </span>

                                <span className="shrink-0 text-[6px] font-medium text-[#8b5cf6]">
                                    When it happens
                                </span>
                            </div>

                            <p className="mt-1 text-[7px] leading-3 text-gray-500">
                                A major story just broke in your niches
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 rounded-xl border border-[#292931] bg-[#18181d] px-3 py-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#284567] bg-[#182638]">
                            <FiTrendingUp
                                size={12}
                                className="text-[#60a5fa]"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[8px] font-semibold text-white">
                                    Weekly digest
                                </span>

                                <span className="shrink-0 text-[6px] font-medium text-[#60a5fa]">
                                    Sundays · {briefTime}
                                </span>
                            </div>

                            <p className="mt-1 text-[7px] leading-3 text-gray-500">
                                The most-saved stories from this week
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-6">
                    <button
                        type="button"
                        onClick={handleAllowNotifications}
                        disabled={loading}
                        className="w-full rounded-[13px] bg-gradient-to-r from-[#9474ff] to-[#7044f5] py-3.5 text-[9px] font-medium text-black shadow-[0_10px_30px_rgba(111,68,245,0.28)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Requesting..."
                            : "Allow notifications"}
                    </button>

                    <button
                        type="button"
                        onClick={handleNotNow}
                        disabled={loading}
                        className="mt-2 w-full rounded-[13px] border border-[#292931] bg-[#15151a] py-3.5 text-[9px] font-medium text-gray-500 transition hover:border-[#45404f] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Not now
                    </button>
                </div>
            </div>
        </main>
    );
}