"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BsSoundwave } from "react-icons/bs";
import {
    FiBriefcase,
    FiCheck,
    FiClock,
    FiHeadphones,
} from "react-icons/fi";

const voices = [
    {
        id: "aria",
        name: "Aria",
        description: "British, warm",
    },
    {
        id: "kai",
        name: "Kai",
        description: "American, focused",
    },
    {
        id: "meera",
        name: "Meera",
        description: "Indian, bright",
    },
    {
        id: "zoya",
        name: "Zoya",
        description: "Indian, calm",
    },
];

export default function ReadyPage() {
    const router = useRouter();

    const [userName, setUserName] = useState("User");
    const [profession, setProfession] = useState([]);
    const [topics, setTopics] = useState([]);
    const [voice, setVoice] = useState("aria");
    const [briefLength, setBriefLength] = useState("5 min");
    const [briefTime, setBriefTime] = useState("6:30 AM");
    const [notifications, setNotifications] = useState(true);

    useEffect(() => {
        try {
            const savedEmail =
                sessionStorage.getItem("nuzi_user_email");

            if (savedEmail) {
                const emailName = savedEmail
                    .split("@")[0]
                    .replace(/[0-9]+/g, "")
                    .replace(/[._-]+/g, " ")
                    .trim();

                const formattedName = emailName
                    .split(" ")
                    .filter(Boolean)
                    .map(
                        (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1)
                    )
                    .join(" ");

                if (formattedName) {
                    setUserName(formattedName);
                }
            }

            const savedProfession =
                sessionStorage.getItem("nuzi_profession");

            const savedTopics =
                sessionStorage.getItem("nuzi_topics");

            const savedVoice =
                sessionStorage.getItem("nuzi_voice");

            const savedBriefLength =
                sessionStorage.getItem("nuzi_brief_length");

            const savedBriefTime =
                sessionStorage.getItem("nuzi_brief_time");

            const savedNotifications =
                sessionStorage.getItem("nuzi_notifications");

            if (savedProfession) {
                setProfession(JSON.parse(savedProfession));
            }

            if (savedTopics) {
                setTopics(JSON.parse(savedTopics));
            }

            if (savedVoice) {
                setVoice(JSON.parse(savedVoice));
            }

            if (savedBriefLength) {
                setBriefLength(JSON.parse(savedBriefLength));
            }

            if (savedBriefTime) {
                const parsedTime = JSON.parse(savedBriefTime);

                if (
                    parsedTime?.time &&
                    parsedTime?.period
                ) {
                    setBriefTime(
                        `${parsedTime.time} ${parsedTime.period}`
                    );
                }
            }

            if (savedNotifications !== null) {
                setNotifications(
                    JSON.parse(savedNotifications)
                );
            }
        } catch (error) {
            console.error(
                "Unable to load preferences:",
                error
            );
        }
    }, []);

    const selectedVoice =
        voices.find((item) => item.id === voice) ||
        voices[0];

    const professionText =
        profession.length > 0
            ? profession.join(", ")
            : "Not selected";

    const topicText =
        topics.length > 0
            ? topics.length > 3
                ? `${topics.slice(0, 3).join(", ")} +${topics.length - 3}`
                : topics.join(", ")
            : "Not selected";

    const deliveryText = notifications
        ? `Daily at ${briefTime}`
        : "Notifications off";

    function handleStartListening() {
        router.push("/home");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#09090f] px-0 py-0 sm:px-4 sm:py-6">
            <div className="relative flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden rounded-none bg-[#101016] px-3 py-7 text-white shadow-2xl sm:min-h-[720px] sm:rounded-[32px] sm:px-5 sm:py-8">

                <div className="flex items-center">
                    <span className="mr-1 text-[9px] text-[#35c98b]">
                        ✓
                    </span>

                    <span className="text-[7px] font-medium uppercase tracking-[0.18em] text-[#35c98b]">
                        ALL SET
                    </span>
                </div>

                <div className="mt-4 flex flex-col items-center text-center">
                    <div className="relative flex h-[66px] w-[66px] items-center justify-center rounded-full border-2 border-[#7044f5]">
                        <div className="absolute inset-[-2px] rounded-full border-2 border-transparent border-r-[#35c98b] border-t-[#35c98b]" />

                        <FiCheck
                            size={29}
                            strokeWidth={2}
                            className="text-[#35c98b]"
                        />
                    </div>

                    <h1 className="mt-4 text-[23px] font-semibold leading-tight tracking-[-0.03em] sm:text-[25px]">
                        You're ready,
                        <br />
                        <span className="font-serif italic font-normal text-[#35c98b]">
                            {userName}.
                        </span>
                    </h1>

                    <p className="mt-3 max-w-[285px] text-[8px] leading-4 text-gray-500 sm:text-[9px]">
                        Your first brief will be ready tomorrow at{" "}
                        {briefTime}.
                        <br />
                        We're already curating.
                    </p>
                </div>

                <div className="mt-8">
                    <span className="text-[6px] font-medium uppercase tracking-[0.18em] text-[#8b5cf6]">
                        YOUR BRIEF PROFILE
                    </span>
                </div>

                <div className="mt-3 space-y-1.5">

                    <div className="flex items-center gap-2.5 rounded-xl border border-[#292931] bg-[#18181d] px-2.5 py-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#25252d]">
                            <FiBriefcase
                                size={11}
                                className="text-gray-400"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <span className="block text-[5px] uppercase tracking-[0.15em] text-gray-600">
                                PROFESSION
                            </span>

                            <p className="mt-0.5 truncate text-[8px] font-semibold text-white">
                                {professionText}
                            </p>
                        </div>

                        <FiCheck
                            size={11}
                            className="shrink-0 text-[#35c98b]"
                        />
                    </div>

                    <div className="flex items-center gap-2.5 rounded-xl border border-[#292931] bg-[#18181d] px-2.5 py-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#25252d]">
                            <BsSoundwave
                                size={11}
                                className="text-gray-400"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <span className="block text-[5px] uppercase tracking-[0.15em] text-gray-600">
                                NICHES
                            </span>

                            <p className="mt-0.5 truncate text-[8px] font-semibold text-white">
                                {topicText}
                            </p>
                        </div>

                        <FiCheck
                            size={11}
                            className="shrink-0 text-[#35c98b]"
                        />
                    </div>

                    <div className="flex items-center gap-2.5 rounded-xl border border-[#292931] bg-[#18181d] px-2.5 py-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#25252d]">
                            <FiHeadphones
                                size={11}
                                className="text-gray-400"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <span className="block text-[5px] uppercase tracking-[0.15em] text-gray-600">
                                VOICE
                            </span>

                            <p className="mt-0.5 truncate text-[8px] font-semibold text-white">
                                {selectedVoice.name} —{" "}
                                {selectedVoice.description}
                            </p>
                        </div>

                        <FiCheck
                            size={11}
                            className="shrink-0 text-[#35c98b]"
                        />
                    </div>

                    <div className="flex items-center gap-2.5 rounded-xl border border-[#292931] bg-[#18181d] px-2.5 py-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#25252d]">
                            <FiClock
                                size={11}
                                className="text-gray-400"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <span className="block text-[5px] uppercase tracking-[0.15em] text-gray-600">
                                LENGTH
                            </span>

                            <p className="mt-0.5 truncate text-[8px] font-semibold text-white">
                                {briefLength}
                            </p>
                        </div>

                        <FiCheck
                            size={11}
                            className="shrink-0 text-[#35c98b]"
                        />
                    </div>

                    <div className="flex items-center gap-2.5 rounded-xl border border-[#292931] bg-[#18181d] px-2.5 py-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#25252d]">
                            <span className="text-[11px]">
                                ☀️
                            </span>
                        </div>

                        <div className="min-w-0 flex-1">
                            <span className="block text-[5px] uppercase tracking-[0.15em] text-gray-600">
                                DELIVERY
                            </span>

                            <p className="mt-0.5 truncate text-[8px] font-semibold text-white">
                                {deliveryText}
                            </p>
                        </div>

                        <FiCheck
                            size={11}
                            className="shrink-0 text-[#35c98b]"
                        />
                    </div>
                </div>

                <div className="mt-auto pt-7">
                    <button
                        type="button"
                        onClick={handleStartListening}
                        className="w-full rounded-[13px] bg-gradient-to-r from-[#35c98b] to-[#4c9cff] py-3.5 text-[9px] font-medium text-black shadow-[0_10px_30px_rgba(53,201,139,0.18)] transition hover:opacity-90"
                    >
                        Start listening →
                    </button>
                </div>
            </div>
        </main>
    );
}