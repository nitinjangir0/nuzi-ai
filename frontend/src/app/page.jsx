"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

export default function Home() {
  const [language, setLanguage] = useState("english");
  const [location, setLocation] = useState(false);
  const router = useRouter();

  function handleContinue() {
    sessionStorage.setItem("nuzi_language", language);
    sessionStorage.setItem(
      "nuzi_location_enabled",
      location.toString()
    );

    router.push("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-0 py-0 sm:px-4 sm:py-6">
      <div
        className="
                    relative flex min-h-screen w-full max-w-[390px]
                    flex-col overflow-hidden
                    rounded-none bg-[#0a0a0a]
                    px-5 py-8 text-white
                    shadow-2xl
                    sm:min-h-[720px] sm:rounded-[32px]
                "
      >
        <div
          className="
                        pointer-events-none absolute
                        left-1/2 top-[-90px]
                        h-[260px] w-[260px]
                        -translate-x-1/2
                        rounded-full
                        bg-[radial-gradient(circle,rgba(124,58,237,0.20)_0%,rgba(124,58,237,0.08)_35%,transparent_70%)]
                        blur-2xl
                    "
        />

        <div className="relative flex items-center justify-center pt-1">
          <div
            className="
            flex h-[80px] w-[100px]
            items-center justify-center
            rounded-full
            bg-[radial-gradient(circle,rgba(139,92,246,0.22),transparent_68%)]
        "
          >
            <img
              src="/logo-1.png"
              alt="Nuzio AI"
              className="h-[64px] w-auto object-contain"
            />
          </div>

          <h1 className="text-[19px] font-semibold tracking-[-0.02em] text-white">
            Nuzio <span className="text-[#a78bfa] text-[14px]">AI</span>
          </h1>
        </div>

        <div className="relative mt-10">
          <h1 className="text-[22px] font-semibold leading-[1.15] tracking-[-0.02em]">
            Choose your
            <br />
            <span className="font-serif italic text-[#a78bfa]">
              language
            </span>
          </h1>

          <p className="mt-2 text-[10px] leading-4 text-[#8b8b94]">
            Select the language for your daily brief.
          </p>
        </div>

        <div className="relative mt-6 space-y-2.5">
          <button
            type="button"
            onClick={() => setLanguage("english")}
            className={`w-full rounded-2xl border px-4 py-3.5 text-left transition ${language === "english"
              ? "border-[#7c3aed] bg-[#17131f]"
              : "border-[#24242b] bg-[#131316]"
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[23px] leading-none">
                  🇬🇧
                </span>

                <div>
                  <p className="text-[11px] font-semibold">
                    English
                  </p>

                  <p className="mt-1 text-[8px] leading-3 text-[#777780]">
                    Get your daily brief in English
                  </p>
                </div>
              </div>

              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border ${language === "english"
                  ? "border-[#8b5cf6]"
                  : "border-[#44444d]"
                  }`}
              >
                {language === "english" && (
                  <span className="h-2 w-2 rounded-full bg-[#8b5cf6]" />
                )}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setLanguage("hindi")}
            className={`w-full rounded-2xl border px-4 py-3.5 text-left transition ${language === "hindi"
              ? "border-[#7c3aed] bg-[#17131f]"
              : "border-[#24242b] bg-[#131316]"
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[23px] leading-none">
                  🇮🇳
                </span>

                <div>
                  <p className="text-[11px] font-semibold">
                    हिंदी
                  </p>

                  <p className="mt-1 text-[8px] leading-3 text-[#777780]">
                    अपनी भाषा में दैनिक ब्रीफ पाएं
                  </p>
                </div>
              </div>

              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border ${language === "hindi"
                  ? "border-[#8b5cf6]"
                  : "border-[#44444d]"
                  }`}
              >
                {language === "hindi" && (
                  <span className="h-2 w-2 rounded-full bg-[#8b5cf6]" />
                )}
              </span>
            </div>
          </button>
        </div>

        <div className="relative mt-3 rounded-2xl border border-[#24242b] bg-[#131316] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1e1a27]">
                <MapPin
                  size={17}
                  strokeWidth={1.8}
                  className="text-[#a78bfa]"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold">
                  Enable Location
                </p>

                <p className="mt-1 text-[7.5px] leading-3 text-[#777780]">
                  Get personalized recommendations near you.
                </p>

                <div className="mt-1.5 flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${location
                      ? "bg-[#8b5cf6]"
                      : "bg-[#55555f]"
                      }`}
                  />

                  <span className="text-[7px] font-medium tracking-[0.08em] text-[#777780]">
                    {location
                      ? "LOCATION ENABLED"
                      : "SET LATER"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              aria-label="Toggle location"
              onClick={() => setLocation(!location)}
              className={`relative h-5 w-9 shrink-0 rounded-full transition ${location
                ? "bg-[#7c3aed]"
                : "bg-[#303038]"
                }`}
            >
              <span
                className={`absolute top-[3px] h-3.5 w-3.5 rounded-full bg-white shadow-sm transition ${location
                  ? "left-[19px]"
                  : "left-[3px]"
                  }`}
              />
            </button>
          </div>
        </div>

        <div className="relative mt-auto pt-10">
          <button
            type="button"
            onClick={handleContinue}
            className="
                            w-full rounded-2xl
                            bg-[#7c3aed]
                            py-3.5
                            text-[10px] font-semibold
                            text-white
                            shadow-[0_8px_30px_rgba(124,58,237,0.20)]
                            transition
                            hover:bg-[#8b5cf6]
                            active:scale-[0.99]
                        "
          >
            Continue
            <span className="ml-1.5">→</span>
          </button>
        </div>
      </div>
    </main>
  );
}