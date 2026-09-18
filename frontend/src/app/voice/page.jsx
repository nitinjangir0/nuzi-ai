"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BsSoundwave } from "react-icons/bs";
import { FiCheck, FiPlay } from "react-icons/fi";

const voices = [
    {
        id: "aria",
        name: "Aria",
        badge: "US",
        description: "Warm · Unhurried · British,",
        language: "English",
        avatar: "A",
    },
    {
        id: "kai",
        name: "Kai",
        badge: "US",
        description: "Crisp · Focused · American,",
        language: "English",
        avatar: "K",
    },
    {
        id: "meera",
        name: "Meera",
        badge: "IN",
        description: "Bright · Curious · Indian,",
        language: "Hindi",
        avatar: "M",
    },
    {
        id: "zoya",
        name: "Zoya",
        badge: "IN",
        description: "Calm · Clear · Indian",
        language: "English",
        avatar: "Z",
    },
];

const briefLengths = [
    {
        id: "5",
        label: "5 min",
    },
    {
        id: "10",
        label: "10 min",
    },
    {
        id: "15",
        label: "15 min",
    },
    {
        id: "custom",
        label: "Custom",
    },
];

export default function VoicePage() {
    const router = useRouter();

    const [selectedVoice, setSelectedVoice] = useState("aria");
    const [briefLength, setBriefLength] = useState("5");
    const [customLength, setCustomLength] = useState("");

    useEffect(() => {
        const savedVoice = sessionStorage.getItem("nuzi_voice");
        const savedBriefLength = sessionStorage.getItem("nuzi_brief_length");

        if (savedVoice) {
            try {
                setSelectedVoice(JSON.parse(savedVoice));
            } catch {
                setSelectedVoice("aria");
            }
        }

        if (savedBriefLength) {
            try {
                const savedLength = JSON.parse(savedBriefLength);

                if (savedLength === "Custom") {
                    setBriefLength("custom");
                } else {
                    const minutes = savedLength.replace(" min", "");
                    setBriefLength(minutes);
                }
            } catch {
                setBriefLength("5");
            }
        }
    }, []);

    function handleBriefLengthChange(value) {
        setBriefLength(value);

        if (value !== "custom") {
            setCustomLength("");
        }
    }

    function handleContinue() {
        if (briefLength === "custom") {
            const minutes = Number(customLength);

            if (!minutes || minutes < 1 || minutes > 60) {
                return;
            }
        }

        const finalBriefLength =
            briefLength === "custom"
                ? `${customLength} min`
                : `${briefLength} min`;

        sessionStorage.setItem(
            "nuzi_voice",
            JSON.stringify(selectedVoice)
        );

        sessionStorage.setItem(
            "nuzi_brief_length",
            JSON.stringify(finalBriefLength)
        );

        router.push("/listening");
    }

    function handleSkip() {
        router.push("/listening");
    }

    const selectedVoiceName =
        voices.find(
            (voice) => voice.id === selectedVoice
        )?.name || "Aria";

    const displayLength =
        briefLength === "custom"
            ? customLength
                ? `${customLength} min`
                : "Custom"
            : `${briefLength} min`;

    const isCustomValid =
        briefLength !== "custom" ||
        (customLength &&
            Number(customLength) >= 1 &&
            Number(customLength) <= 60);

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
                        <div className="h-[3px] flex-1 rounded-full bg-[#292931]" />
                        <div className="h-[3px] flex-1 rounded-full bg-[#292931]" />
                        <div className="h-[3px] flex-1 rounded-full bg-[#292931]" />
                    </div>

                    <div className="mt-4">
                        <span className="text-[7px] font-medium uppercase tracking-[0.18em] text-[#8b5cf6]">
                            STEP 3 OF 6
                        </span>
                    </div>
                </div>

                <div className="mt-3">
                    <h1 className="text-[24px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[26px]">
                        Pick a
                        <br />
                        <span className="font-serif italic font-normal text-[#a78bfa]">
                            narrator voice.
                        </span>
                    </h1>

                    <p className="mt-3 text-[9px] leading-4 text-gray-500 sm:text-[10px]">
                        Tap ▶ to hear a 10-second sample.
                    </p>
                </div>

                <div className="mt-5 space-y-2">
                    {voices.map((voice) => {
                        const isSelected =
                            selectedVoice === voice.id;

                        return (
                            <button
                                key={voice.id}
                                type="button"
                                onClick={() =>
                                    setSelectedVoice(
                                        voice.id
                                    )
                                }
                                className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition sm:p-3 ${isSelected
                                    ? "border-[#7c3aed] bg-[#211638]"
                                    : "border-[#292931] bg-[#18181d] hover:border-[#45404f]"
                                    }`}
                            >
                                <div
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${isSelected
                                        ? "bg-[#9b7cff] text-white"
                                        : "bg-[#6378ff] text-white"
                                        }`}
                                >
                                    {voice.avatar}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] font-semibold text-white">
                                            {voice.name}
                                        </span>

                                        <span className="rounded bg-[#25254a] px-1 py-[1px] text-[5px] text-[#a78bfa]">
                                            {voice.badge}
                                        </span>
                                    </div>

                                    <p className="mt-1 truncate text-[7px] text-gray-500">
                                        {voice.description}
                                    </p>

                                    <p className="text-[6px] text-gray-600">
                                        {voice.language}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    {isSelected && (
                                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#35c98b] text-black">
                                            <FiCheck size={8} />
                                        </span>
                                    )}

                                    <span
                                        onClick={(event) =>
                                            event.stopPropagation()
                                        }
                                        className={`flex h-5 w-5 items-center justify-center rounded-md ${isSelected
                                            ? "bg-[#7044f5] text-white"
                                            : "bg-[#29292f] text-gray-500"
                                            }`}
                                    >
                                        <FiPlay size={8} />
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-5">
                    <span className="text-[6px] font-medium uppercase tracking-[0.18em] text-[#8b5cf6]">
                        BRIEF LENGTH
                    </span>

                    <h2 className="mt-1 text-[17px] font-semibold leading-tight">
                        How long is
                        <br />
                        <span className="font-serif italic font-normal text-[#a78bfa]">
                            your morning?
                        </span>
                    </h2>

                    <p className="mt-2 text-[8px] text-gray-500">
                        Set your ideal brief length.
                    </p>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2">
                    {briefLengths.map((length) => {
                        const isSelected =
                            briefLength === length.id;

                        return (
                            <button
                                key={length.id}
                                type="button"
                                onClick={() =>
                                    handleBriefLengthChange(
                                        length.id
                                    )
                                }
                                className={`rounded-lg border py-2.5 text-[7px] font-medium transition ${isSelected
                                    ? "border-[#7c3aed] bg-[#7044f5] text-white"
                                    : "border-[#292931] bg-[#18181d] text-gray-500 hover:border-[#45404f]"
                                    }`}
                            >
                                {length.label}
                            </button>
                        );
                    })}
                </div>

                {briefLength === "custom" && (
                    <div className="mt-3">
                        <div className="flex items-center rounded-xl border border-[#292931] bg-[#18181d] px-3">
                            <input
                                type="number"
                                min="1"
                                max="60"
                                value={customLength}
                                onChange={(event) =>
                                    setCustomLength(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter minutes"
                                className="w-full bg-transparent py-3 text-[9px] text-white outline-none placeholder:text-gray-600"
                            />

                            <span className="text-[8px] text-gray-600">
                                min
                            </span>
                        </div>

                        <p className="mt-1.5 text-[7px] text-gray-600">
                            Choose between 1 and 60 minutes.
                        </p>
                    </div>
                )}

                <div className="mt-auto pt-6">
                    <button
                        type="button"
                        disabled={!isCustomValid}
                        onClick={handleContinue}
                        className={`w-full rounded-[13px] py-3.5 text-[9px] font-medium transition ${isCustomValid
                            ? "bg-gradient-to-r from-[#9474ff] to-[#7044f5] text-black shadow-[0_10px_30px_rgba(111,68,245,0.28)] hover:opacity-90"
                            : "cursor-not-allowed bg-[#29272f] text-gray-600"
                            }`}
                    >
                        Continue with {selectedVoiceName} ·{" "}
                        {displayLength} →
                    </button>
                </div>
            </div>
        </main>
    );
}