"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BsSoundwave } from "react-icons/bs";

const times = [
    "4:30",
    "5:00",
    "5:30",
    "6:00",
    "6:30",
    "7:00",
    "7:30",
    "8:00",
    "8:30",
    "9:00",
    "9:30",
    "10:00",
];

export default function ListeningPage() {
    const router = useRouter();

    const pickerRef = useRef(null);
    const isRestoringRef = useRef(false);

    const [period, setPeriod] = useState("AM");
    const [selectedTime, setSelectedTime] = useState("6:30");

    useEffect(() => {
        const savedTime = sessionStorage.getItem("nuzi_brief_time");

        if (!savedTime) {
            requestAnimationFrame(() => {
                const picker = pickerRef.current;

                if (!picker) return;

                const index = times.indexOf("6:30");

                picker.scrollTop = 124 + index * 52;
            });

            return;
        }

        try {
            const parsedTime = JSON.parse(savedTime);

            const savedSelectedTime = times.includes(parsedTime?.time)
                ? parsedTime.time
                : "6:30";

            const savedPeriod =
                parsedTime?.period === "PM" ? "PM" : "AM";

            isRestoringRef.current = true;

            setSelectedTime(savedSelectedTime);
            setPeriod(savedPeriod);

            requestAnimationFrame(() => {
                const picker = pickerRef.current;

                if (!picker) {
                    isRestoringRef.current = false;
                    return;
                }

                const index = times.indexOf(savedSelectedTime);

                picker.scrollTop = 124 + index * 52;

                requestAnimationFrame(() => {
                    isRestoringRef.current = false;
                });
            });
        } catch {
            sessionStorage.removeItem("nuzi_brief_time");

            setSelectedTime("6:30");
            setPeriod("AM");

            requestAnimationFrame(() => {
                const picker = pickerRef.current;

                if (!picker) return;

                const index = times.indexOf("6:30");

                picker.scrollTop = 124 + index * 52;
            });
        }
    }, []);

    function handleScroll() {
        if (isRestoringRef.current) return;

        const picker = pickerRef.current;

        if (!picker) return;

        const itemHeight = 52;
        const topPadding = 124;

        const index = Math.round(
            (picker.scrollTop - topPadding) / itemHeight
        );

        const safeIndex = Math.max(
            0,
            Math.min(index, times.length - 1)
        );

        const nextTime = times[safeIndex];

        if (nextTime !== selectedTime) {
            setSelectedTime(nextTime);

            sessionStorage.setItem(
                "nuzi_brief_time",
                JSON.stringify({
                    time: nextTime,
                    period,
                })
            );
        }
    }

    function handleScrollEnd() {
        if (isRestoringRef.current) return;

        const picker = pickerRef.current;

        if (!picker) return;

        const itemHeight = 52;
        const topPadding = 124;

        const index = Math.round(
            (picker.scrollTop - topPadding) / itemHeight
        );

        const safeIndex = Math.max(
            0,
            Math.min(index, times.length - 1)
        );

        const nextTime = times[safeIndex];

        picker.scrollTo({
            top: topPadding + safeIndex * itemHeight,
            behavior: "smooth",
        });

        setSelectedTime(nextTime);

        sessionStorage.setItem(
            "nuzi_brief_time",
            JSON.stringify({
                time: nextTime,
                period,
            })
        );
    }

    function handleTimeClick(time, index) {
        const picker = pickerRef.current;

        setSelectedTime(time);

        sessionStorage.setItem(
            "nuzi_brief_time",
            JSON.stringify({
                time,
                period,
            })
        );

        if (!picker) return;

        picker.scrollTo({
            top: 124 + index * 52,
            behavior: "smooth",
        });
    }

    function handlePeriodChange(value) {
        setPeriod(value);

        sessionStorage.setItem(
            "nuzi_brief_time",
            JSON.stringify({
                time: selectedTime,
                period: value,
            })
        );
    }

    function handleContinue() {
        sessionStorage.setItem(
            "nuzi_brief_time",
            JSON.stringify({
                time: selectedTime,
                period,
            })
        );

        router.push("/notifications");
    }

    function handleSkip() {
        router.push("/notifications");
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
                        <div className="h-[3px] flex-1 rounded-full bg-[#292931]" />
                        <div className="h-[3px] flex-1 rounded-full bg-[#292931]" />
                    </div>

                    <div className="mt-4">
                        <span className="text-[7px] font-medium uppercase tracking-[0.18em] text-[#8b5cf6]">
                            STEP 4 OF 6
                        </span>
                    </div>
                </div>

                <div className="mt-3">
                    <h1 className="text-[24px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[26px]">
                        When do you
                        <br />
                        <span className="font-serif italic font-normal text-[#a78bfa]">
                            want your brief?
                        </span>
                    </h1>

                    <p className="mt-3 text-[9px] leading-4 text-gray-500 sm:text-[10px]">
                        Nuzio will have your brief ready and waiting each morning.
                    </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                    {["AM", "PM"].map((item) => {
                        const isSelected = period === item;

                        return (
                            <button
                                key={item}
                                type="button"
                                onClick={() =>
                                    handlePeriodChange(item)
                                }
                                className={`rounded-xl border py-3.5 text-[10px] font-semibold transition ${isSelected
                                        ? "border-[#7c3aed] bg-gradient-to-r from-[#9474ff] to-[#7044f5] text-black"
                                        : "border-[#292931] bg-[#18181d] text-gray-500 hover:border-[#45404f]"
                                    }`}
                            >
                                {item}
                            </button>
                        );
                    })}
                </div>

                <div className="relative mt-5 flex min-h-0 flex-1 items-center justify-center">

                    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-[#101016] via-[#101016]/80 to-transparent" />

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-[#101016] via-[#101016]/80 to-transparent" />

                    <div
                        ref={pickerRef}
                        onScroll={handleScroll}
                        onTouchEnd={handleScrollEnd}
                        className="h-[300px] w-full snap-y snap-mandatory overflow-y-auto overscroll-contain scrollbar-none"
                        style={{
                            scrollBehavior: "smooth",
                        }}
                    >
                        <div className="h-[124px]" />

                        {times.map((time, index) => {
                            const isSelected =
                                selectedTime === time;

                            return (
                                <div
                                    key={time}
                                    className="flex h-[52px] snap-center items-center justify-center"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleTimeClick(
                                                time,
                                                index
                                            )
                                        }
                                        className={`flex h-[52px] w-[82%] items-center justify-center rounded-xl transition-all duration-200 ${isSelected
                                                ? "border border-[#35205b] bg-[#171126]"
                                                : "bg-transparent"
                                            }`}
                                    >
                                        <span
                                            className={`font-semibold leading-none transition-all duration-200 ${isSelected
                                                    ? "text-[38px] text-white"
                                                    : "text-[20px] text-gray-600"
                                                }`}
                                        >
                                            {time}
                                        </span>

                                        {isSelected && (
                                            <span className="ml-2 mt-3 text-[8px] font-semibold text-[#8b5cf6]">
                                                {period}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            );
                        })}

                        <div className="h-[124px]" />
                    </div>
                </div>

                <div className="pt-5">
                    <button
                        type="button"
                        onClick={handleContinue}
                        className="w-full rounded-[13px] bg-gradient-to-r from-[#9474ff] to-[#7044f5] py-4 text-[10px] font-medium text-black shadow-[0_10px_30px_rgba(111,68,245,0.28)] transition hover:opacity-90"
                    >
                        Continue →
                    </button>
                </div>
            </div>
        </main>
    );
}