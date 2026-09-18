"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Bell,
    Compass,
    ExternalLink,
    Pause,
    Play,
    Search,
    Settings,
    SkipBack,
    SkipForward,
} from "lucide-react";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const voices = {
    aria: "Aria",
    kai: "Kai",
    meera: "Meera",
    zoya: "Zoya",
};

const defaultCategories = [
    "All",
    "AI & Tech",
    "Markets",
    "Startups",
    "Science",
];

const waveform = [
    12, 18, 30, 24, 15, 22, 14, 18, 16, 15,
    14, 15, 20, 35, 18, 25, 15, 14, 18, 28,
    15, 38, 22, 18, 26, 32, 20, 16, 24, 16,
    15, 25, 18, 14, 16, 22, 16, 12,
];

export default function HomePage() {
    const router = useRouter();

    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState("All");

    const [userName, setUserName] = useState("there");
    const [voice, setVoice] = useState("Aria");
    const [briefLength, setBriefLength] = useState("10 min");
    const [briefTime, setBriefTime] = useState("6:30 AM");
    const [topics, setTopics] = useState([]);

    const [stories, setStories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const savedName =
            sessionStorage.getItem("nuzi_user_name");

        const savedVoice =
            sessionStorage.getItem("nuzi_voice");

        const savedLength =
            sessionStorage.getItem("nuzi_brief_length");

        const savedTime =
            sessionStorage.getItem("nuzi_brief_time");

        const savedTopics =
            sessionStorage.getItem("nuzi_topics");

        if (savedName) {
            setUserName(savedName);
        }

        if (savedVoice && voices[savedVoice]) {
            setVoice(voices[savedVoice]);
        }

        if (savedLength) {
            setBriefLength(savedLength);
        }

        if (savedTime) {
            try {
                const parsedTime =
                    JSON.parse(savedTime);

                if (
                    parsedTime?.time &&
                    parsedTime?.period
                ) {
                    setBriefTime(
                        `${parsedTime.time} ${parsedTime.period}`
                    );
                }
            } catch {
                setBriefTime("6:30 AM");
            }
        }

        if (savedTopics) {
            try {
                const parsedTopics =
                    JSON.parse(savedTopics);

                if (Array.isArray(parsedTopics)) {
                    setTopics(parsedTopics);
                }
            } catch {
                setTopics([]);
            }
        }
    }, []);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                setError("");

                const email =
                    sessionStorage.getItem(
                        "nuzi_user_email"
                    );

                if (!email) {
                    router.replace("/login");
                    return;
                }

                const response = await fetch(
                    `${API_URL}/news/personalized?email=${encodeURIComponent(
                        email
                    )}`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message ||
                            "Unable to load news"
                    );
                }

                setStories(
                    Array.isArray(data.news)
                        ? data.news
                        : []
                );
            } catch (error) {
                console.error(
                    "News fetch error:",
                    error
                );

                setError(
                    "Unable to load your personalized news."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [router]);

    useEffect(() => {
        return () => {
            if (
                typeof window !== "undefined" &&
                window.speechSynthesis
            ) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const filteredStories =
        activeTab === "All"
            ? stories
            : stories.filter((story) => {
                  if (activeTab === "AI & Tech") {
                      return (
                          story.category ===
                              "AI & Tech" ||
                          story.topics?.some(
                              (topic) =>
                                  topic ===
                                  "AI & Technology"
                          )
                      );
                  }

                  if (activeTab === "Markets") {
                      return (
                          story.category ===
                              "Markets" ||
                          story.topics?.some(
                              (topic) =>
                                  topic ===
                                      "Financial Markets" ||
                                  topic ===
                                      "Indian Business"
                          )
                      );
                  }

                  return (
                      story.category ===
                      activeTab
                  );
              });

    useEffect(() => {
        setCurrentIndex(0);

        if (
            typeof window !== "undefined" &&
            window.speechSynthesis
        ) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        }
    }, [activeTab]);

    const storyCount = stories.length;

    const currentStory =
        filteredStories[currentIndex] ||
        filteredStories[0] ||
        stories[0];

    const getBrowserVoice = () => {
        if (
            typeof window === "undefined" ||
            !window.speechSynthesis
        ) {
            return null;
        }

        const availableVoices =
            window.speechSynthesis.getVoices();

        if (!availableVoices.length) {
            return null;
        }

        const preferredNames = {
            Aria: [
                "Aria",
                "Google UK English Female",
                "Microsoft Sonia",
                "Microsoft Libby",
            ],
            Kai: [
                "Kai",
                "Google US English",
                "Microsoft Guy",
                "Microsoft Ryan",
            ],
            Meera: [
                "Meera",
                "Google हिन्दी",
                "Microsoft Swara",
                "Google Hindi",
            ],
            Zoya: [
                "Zoya",
                "Google UK English Female",
                "Microsoft Sonia",
                "Microsoft Libby",
            ],
        };

        const names =
            preferredNames[voice] || [];

        for (const name of names) {
            const found =
                availableVoices.find(
                    (item) =>
                        item.name
                            .toLowerCase()
                            .includes(
                                name.toLowerCase()
                            )
                );

            if (found) {
                return found;
            }
        }

        if (voice === "Meera") {
            return (
                availableVoices.find(
                    (item) =>
                        item.lang
                            ?.toLowerCase()
                            .startsWith("hi")
                ) || null
            );
        }

        return (
            availableVoices.find(
                (item) =>
                    item.lang
                        ?.toLowerCase()
                        .startsWith("en")
            ) || null
        );
    };

    const speakStory = () => {
        if (
            !currentStory ||
            typeof window === "undefined" ||
            !window.speechSynthesis
        ) {
            return;
        }

        window.speechSynthesis.cancel();

        const text = `${currentStory.title}. ${currentStory.preview || ""}`;

        const utterance =
            new SpeechSynthesisUtterance(text);

        utterance.rate = 0.92;
        utterance.pitch = 1;
        utterance.volume = 1;

        const browserVoice =
            getBrowserVoice();

        if (browserVoice) {
            utterance.voice = browserVoice;
            utterance.lang =
                browserVoice.lang;
        } else {
            utterance.lang =
                voice === "Meera"
                    ? "hi-IN"
                    : "en-US";
        }

        utterance.onstart = () => {
            setIsPlaying(true);
        };

        utterance.onend = () => {
            setIsPlaying(false);
        };

        utterance.onerror = () => {
            setIsPlaying(false);
        };

        window.speechSynthesis.speak(
            utterance
        );
    };

    const togglePlay = () => {
        if (
            typeof window === "undefined" ||
            !window.speechSynthesis
        ) {
            return;
        }

        if (isPlaying) {
            window.speechSynthesis.pause();
            setIsPlaying(false);
            return;
        }

        if (
            window.speechSynthesis.paused
        ) {
            window.speechSynthesis.resume();
            setIsPlaying(true);
            return;
        }

        speakStory();
    };

    const changeStory = (direction) => {
        if (!filteredStories.length) {
            return;
        }

        if (
            typeof window !== "undefined" &&
            window.speechSynthesis
        ) {
            window.speechSynthesis.cancel();
        }

        setIsPlaying(false);

        setCurrentIndex((previous) => {
            if (direction === "next") {
                return (
                    (previous + 1) %
                    filteredStories.length
                );
            }

            return (
                (previous -
                    1 +
                    filteredStories.length) %
                filteredStories.length
            );
        });
    };

    useEffect(() => {
        if (!isPlaying) {
            return;
        }

        if (
            typeof window !== "undefined" &&
            window.speechSynthesis
        ) {
            window.speechSynthesis.cancel();
            speakStory();
        }
    }, [currentIndex]);

    const displayCount =
        storyCount > 0 ? storyCount : 0;

    return (
        <main className="min-h-screen bg-[#09090f] px-0 py-0 text-white sm:flex sm:items-center sm:justify-center sm:px-4 sm:py-6">
            <div className="relative flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden bg-[#101016] sm:min-h-[720px] sm:max-h-[844px] sm:rounded-[32px] sm:shadow-2xl">

                <header className="shrink-0 px-4 pb-2 pt-5 sm:px-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 items-center gap-[2px]">
                                <span className="h-3 w-[2px] rounded-full bg-purple-400" />
                                <span className="h-5 w-[2px] rounded-full bg-purple-500" />
                                <span className="h-3 w-[2px] rounded-full bg-purple-400" />
                            </div>

                            <span className="text-[14px] font-semibold tracking-wide">
                                Nuzio{" "}
                                <span className="font-normal text-[#8b5cf6]">
                                    AI
                                </span>
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-[#19191f] text-gray-400 transition hover:text-white"
                            >
                                <Search size={14} />
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        "/notifications"
                                    )
                                }
                                className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-[#19191f] text-gray-400 transition hover:text-white"
                            >
                                <Bell size={14} />

                                <span className="absolute right-[7px] top-[6px] h-1.5 w-1.5 rounded-full bg-[#8b5cf6]" />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2 scrollbar-none sm:px-5">

                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {defaultCategories.map(
                            (category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() =>
                                        setActiveTab(
                                            category
                                        )
                                    }
                                    className={`shrink-0 rounded-full px-3 py-1.5 text-[9px] font-medium transition ${
                                        activeTab ===
                                        category
                                            ? "bg-[#10b981] text-black"
                                            : "border border-white/5 bg-[#19191f] text-gray-500 hover:text-gray-300"
                                    }`}
                                >
                                    {category}
                                </button>
                            )
                        )}
                    </div>

                    <section className="mt-5">
                        <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#a78bfa]">
                            MORNING BRIEF
                        </p>

                        <h1 className="mt-1.5 font-serif text-[21px] font-normal leading-tight text-white">
                            Good morning,{" "}
                            {userName}
                            <span className="text-gray-500">
                                {" "}
                                —
                            </span>
                            <br />
                            <span className="italic text-[#a78bfa]">
                                {displayCount}{" "}
                                things.
                            </span>
                        </h1>

                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[8px] text-gray-500">
                            <span className="flex items-center gap-1 text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Audio live
                            </span>

                            <span>•</span>

                            <span>
                                Voice:{" "}
                                <strong className="font-medium text-gray-300">
                                    {voice}
                                </strong>
                            </span>

                            <span>•</span>

                            <span>
                                {briefLength}
                            </span>

                            <span>•</span>

                            <span>
                                {briefTime}
                            </span>
                        </div>
                    </section>

                    {loading ? (
                        <section className="mt-4 rounded-[20px] border border-white/5 bg-[#17171e] p-5 shadow-xl">
                            <div className="animate-pulse">
                                <div className="h-5 w-24 rounded-full bg-[#25252d]" />
                                <div className="mt-4 h-5 w-full rounded bg-[#25252d]" />
                                <div className="mt-2 h-5 w-4/5 rounded bg-[#25252d]" />
                                <div className="mt-5 h-2 w-full rounded bg-[#25252d]" />
                                <div className="mt-4 flex justify-center">
                                    <div className="h-12 w-12 rounded-full bg-[#25252d]" />
                                </div>
                            </div>
                        </section>
                    ) : error ? (
                        <section className="mt-4 rounded-[20px] border border-red-500/10 bg-[#17171e] p-5 text-center">
                            <p className="text-[10px] text-red-400">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    window.location.reload()
                                }
                                className="mt-3 rounded-full bg-[#7c3aed] px-4 py-2 text-[9px] font-medium"
                            >
                                Try again
                            </button>
                        </section>
                    ) : currentStory ? (
                        <>
                            <section className="mt-4 rounded-[20px] border border-white/5 bg-[#17171e] p-4 shadow-xl">

                                <div className="flex items-center justify-between">
                                    <span className="rounded-full border border-purple-500/10 bg-[#22222d] px-2 py-1 text-[8px] font-medium tracking-wide text-purple-300">
                                        NOW PLAYING
                                        {" • "}
                                        {
                                            currentStory.category
                                        }
                                    </span>

                                    <span className="text-[8px] tracking-wide text-gray-600">
                                        {String(
                                            currentIndex +
                                                1
                                        ).padStart(
                                            2,
                                            "0"
                                        )}{" "}
                                        /{" "}
                                        {filteredStories.length}
                                    </span>
                                </div>

                                <h2 className="mt-3 font-serif text-[15px] leading-5 text-gray-100">
                                    {
                                        currentStory.title
                                    }
                                </h2>

                                <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[8px]">
                                        <span className="font-semibold tracking-wider text-[#a78bfa]">
                                            {
                                                currentStory.source
                                            }
                                        </span>

                                        <span className="text-gray-700">
                                            •
                                        </span>

                                        <span className="text-gray-500">
                                            {
                                                currentStory.duration
                                            }
                                        </span>

                                        <span className="text-gray-700">
                                            •
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (
                                                    currentStory.url
                                                ) {
                                                    window.open(
                                                        currentStory.url,
                                                        "_blank",
                                                        "noopener,noreferrer"
                                                    );
                                                }
                                            }}
                                            className="flex items-center gap-0.5 text-emerald-400"
                                        >
                                            SOURCE
                                            <ExternalLink
                                                size={
                                                    9
                                                }
                                            />
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        className="text-[8px] uppercase tracking-wider text-gray-500 transition hover:text-white"
                                    >
                                        Save
                                    </button>
                                </div>

                                <p className="mt-2 truncate text-[8px] text-gray-600">
                                    {
                                        currentStory.preview
                                    }
                                </p>

                                <div className="mt-4">
                                    <div className="flex h-8 items-end justify-between gap-[2px] px-1">
                                        {waveform.map(
                                            (
                                                height,
                                                index
                                            ) => (
                                                <div
                                                    key={
                                                        index
                                                    }
                                                    style={{
                                                        height: `${height * 0.8}px`,
                                                    }}
                                                    className={`w-[3px] rounded-full transition ${
                                                        index <
                                                        15
                                                            ? "bg-purple-500"
                                                            : "bg-gray-700/70"
                                                    }`}
                                                />
                                            )
                                        )}
                                    </div>

                                    <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-gray-800">
                                        <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-purple-600 to-purple-400" />
                                    </div>

                                    <div className="mt-1 flex justify-between text-[7px] font-mono text-gray-600">
                                        <span>
                                            00:00
                                        </span>

                                        <span>
                                            {
                                                currentStory.duration
                                            }
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between px-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            changeStory(
                                                "previous"
                                            )
                                        }
                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-[#20202a] text-gray-400 transition hover:text-white"
                                    >
                                        <SkipBack
                                            size={
                                                13
                                            }
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            togglePlay
                                        }
                                        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7c3aed] text-white shadow-lg shadow-purple-600/30 transition active:scale-95"
                                    >
                                        {isPlaying ? (
                                            <Pause
                                                size={
                                                    18
                                                }
                                                fill="currentColor"
                                            />
                                        ) : (
                                            <Play
                                                size={
                                                    18
                                                }
                                                fill="currentColor"
                                            />
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            changeStory(
                                                "next"
                                            )
                                        }
                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-[#20202a] text-gray-400 transition hover:text-white"
                                    >
                                        <SkipForward
                                            size={
                                                13
                                            }
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/5 bg-[#20202a] text-[8px] text-gray-400"
                                    >
                                        1x
                                    </button>
                                </div>
                            </section>

                            <div className="mt-4 flex items-center gap-2 rounded-[14px] border border-emerald-500/15 bg-[#121c17] px-3 py-4">
                                <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-400" />

                                <p className="truncate text-[10px] text-emerald-400">
                                    Now narrating —{" "}
                                    {
                                        currentStory.title
                                    }
                                </p>
                            </div>
                        </>
                    ) : (
                        <section className="mt-4 rounded-[20px] border border-white/5 bg-[#17171e] p-5 text-center">
                            <p className="text-[10px] text-gray-500">
                                No personalized news
                                available right now.
                            </p>
                        </section>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4 pt-8">
                    <div className="relative flex items-center justify-between rounded-full border border-white/5 bg-[#17171f]/95 px-8 py-2.5 shadow-2xl backdrop-blur-md">

                        <button
                            type="button"
                            className="flex flex-col items-center gap-0.5 text-[#a78bfa]"
                        >
                            <Compass size={16} />

                            <span className="text-[7px] font-medium tracking-wider">
                                DISCOVER
                            </span>
                        </button>

                        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-[68%]">
                            <button
                                type="button"
                                onClick={
                                    togglePlay
                                }
                                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7c3aed] text-white shadow-xl shadow-purple-600/40 ring-4 ring-[#101016] transition active:scale-95"
                            >
                                {isPlaying ? (
                                    <Pause
                                        size={16}
                                        fill="currentColor"
                                    />
                                ) : (
                                    <Play
                                        size={16}
                                        fill="currentColor"
                                    />
                                )}
                            </button>
                        </div>

                        <button
                            type="button"
                            className="flex flex-col items-center gap-0.5 text-gray-500 transition hover:text-gray-300"
                        >
                            <Settings size={16} />

                            <span className="text-[7px] font-medium tracking-wider">
                                SETTINGS
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}