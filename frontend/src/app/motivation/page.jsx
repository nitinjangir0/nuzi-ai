"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BsSoundwave } from "react-icons/bs";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const topics = [
    {
        name: "AI & Technology",
        icon: "🤖",
    },
    {
        name: "Financial Markets",
        icon: "💰",
    },
    {
        name: "Indian Business",
        icon: "🇮🇳",
    },
    {
        name: "Global Politics",
        icon: "🌍",
    },
    {
        name: "Startups",
        icon: "🚀",
    },
    {
        name: "Science",
        icon: "🔬",
    },
    {
        name: "Health & Medicine",
        icon: "🩺",
    },
    {
        name: "Climate & Energy",
        icon: "🌱",
    },
    {
        name: "Sports",
        icon: "⚽",
    },
    {
        name: "Culture & Arts",
        icon: "🎨",
    },
    {
        name: "Legal & Policy",
        icon: "⚖️",
    },
];

export default function MotivationPage() {
    const router = useRouter();

    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedTopics = sessionStorage.getItem("nuzi_topics");

        if (savedTopics) {
            try {
                setSelected(JSON.parse(savedTopics));
            } catch {
                setSelected([]);
            }
        }
    }, []);

    function toggleTopic(name) {
        setSelected((current) => {
            if (current.includes(name)) {
                return current.filter((item) => item !== name);
            }

            if (current.length >= 7) {
                return current;
            }

            return [...current, name];
        });
    }

    async function handleContinue() {
        if (selected.length === 0 || loading) return;

        try {
            setLoading(true);

            const email = sessionStorage.getItem("nuzi_user_email");

            if (!email) {
                router.push("/login");
                return;
            }

            const response = await fetch(
                `${API_URL}/preferences/topics`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email,
                        topics: selected,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                console.error(data.message);
                return;
            }

            sessionStorage.setItem(
                "nuzi_topics",
                JSON.stringify(selected)
            );

            router.push("/voice");
        } catch (error) {
            console.error("Save topics error:", error);
        } finally {
            setLoading(false);
        }
    }

    function handleSkip() {
        router.push("/voice");
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
                        <div className="h-[3px] flex-1 rounded-full bg-[#292931]" />
                        <div className="h-[3px] flex-1 rounded-full bg-[#292931]" />
                        <div className="h-[3px] flex-1 rounded-full bg-[#292931]" />
                        <div className="h-[3px] flex-1 rounded-full bg-[#292931]" />
                    </div>

                    <div className="mt-4">
                        <span className="text-[7px] font-medium uppercase tracking-[0.18em] text-[#8b5cf6]">
                            STEP 2 OF 6
                        </span>
                    </div>
                </div>

                <div className="mt-3">
                    <h1 className="text-[24px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[26px]">
                        What moves
                        <br />
                        <span className="font-serif italic font-normal text-[#a78bfa]">
                            your world?
                        </span>
                    </h1>

                    <p className="mt-3 max-w-[330px] text-[9px] leading-4 text-gray-500 sm:text-[10px]">
                        Pick up to 7 niches.
                    </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                    {topics.map((topic) => {
                        const isSelected = selected.includes(
                            topic.name
                        );

                        const isDisabled =
                            selected.length >= 7 && !isSelected;

                        return (
                            <button
                                key={topic.name}
                                type="button"
                                disabled={isDisabled}
                                onClick={() =>
                                    toggleTopic(topic.name)
                                }
                                className={`flex items-center gap-1.5 rounded-full border px-3 py-2.5 text-[8px] font-medium transition sm:px-3.5 sm:text-[9px] ${isSelected
                                        ? "border-[#7c3aed] bg-[#211638] text-white"
                                        : isDisabled
                                            ? "cursor-not-allowed border-[#292931] bg-[#18181d] text-gray-600 opacity-60"
                                            : "border-[#292931] bg-[#18181d] text-gray-400 hover:border-[#45404f]"
                                    }`}
                            >
                                <span className="text-[10px] leading-none">
                                    {topic.icon}
                                </span>

                                <span>
                                    {topic.name}
                                </span>

                                {isSelected && (
                                    <span className="ml-0.5 text-[#a78bfa]">
                                        ✓
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-auto pt-8">
                    <button
                        type="button"
                        disabled={
                            selected.length === 0 || loading
                        }
                        onClick={handleContinue}
                        className={`w-full rounded-[14px] py-4 text-[10px] font-medium transition ${selected.length > 0 && !loading
                                ? "bg-gradient-to-r from-[#9474ff] to-[#7044f5] text-black shadow-[0_10px_30px_rgba(111,68,245,0.28)] hover:opacity-90"
                                : "cursor-not-allowed bg-[#29272f] text-gray-600"
                            }`}
                    >
                        {loading ? "Saving..." : "Continue →"}
                    </button>
                </div>
            </div>
        </main>
    );
}