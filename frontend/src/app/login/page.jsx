"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function LoginPage() {
    const router = useRouter();

    const [showEmailForm, setShowEmailForm] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleEmailLogin = async (e) => {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/auth/start`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(
                    data.message ||
                    "Unable to continue. Please try again."
                );
                return;
            }

            sessionStorage.setItem(
                "nuzi_user_email",
                email.trim().toLowerCase()
            );

            if (data.user?.name) {
                sessionStorage.setItem(
                    "nuzi_user_name",
                    data.user.name
                );
            }

            if (data.requiresOtp) {
                sessionStorage.setItem(
                    "nuzi_otp_user_id",
                    data.userId
                );

                sessionStorage.setItem(
                    "nuzi_otp_email",
                    email
                );

                sessionStorage.setItem(
                    "nuzi_is_new_user",
                    data.isNewUser ? "true" : "false"
                );

                router.push("/verify-otp");
                return;
            }

            router.push("/home");
        } catch (error) {
            setError(
                "Unable to connect to server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#09090f] px-4 py-6 sm:px-6">
            <div className="relative flex min-h-[720px] w-full max-w-[390px] flex-col overflow-hidden rounded-[32px] bg-[#101016] px-5 py-8 text-white shadow-2xl sm:px-6">

                <div className="pointer-events-none absolute left-1/2 top-[-100px] h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.22)_0%,rgba(124,58,237,0.08)_38%,transparent_70%)] blur-2xl" />

                <div className="relative flex flex-col items-center justify-center pt-1">
                    <div className="flex items-center justify-center">
                        <div className="flex h-[64px] w-[64px] items-center justify-center">
                            <img
                                src="/logo-1.png"
                                alt="Nuzio AI"
                                className="h-[56px] w-auto object-contain"
                            />
                        </div>

                        <h1 className="ml-2 text-[19px] font-semibold tracking-[-0.03em] text-white">
                            Nuzio{" "}
                            <span className="text-[#8b5cf6]">
                                AI
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="relative mt-16 sm:mt-20">
                    <h2 className="text-[29px] font-semibold leading-tight tracking-[-0.02em]">
                        Good morning.
                    </h2>

                    <h3 className="mt-1 font-serif text-[27px] italic text-[#a78bfa]">
                        News on go.
                    </h3>

                    <p className="mt-4 max-w-[280px] text-[12px] leading-4 text-gray-500">
                        personalised audio news for indian
                    </p>
                    <p className="text-[12px] leading-4 text-gray-500">
                       professionals -- Curated every morning
                    </p>
                </div>

                <div className="relative mt-auto">

                    {!showEmailForm ? (
                        <>
                            <button
                                type="button"
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#292931] bg-[#19191f] py-3 text-[10px] font-medium text-white transition hover:bg-[#202027]"
                            >
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-[#4285f4]">
                                    G
                                </span>

                                Continue with Google
                            </button>

                            <div className="my-4 flex items-center gap-3">
                                <div className="h-px flex-1 bg-[#25252d]" />

                                <span className="text-[8px] text-gray-600">
                                    OR
                                </span>

                                <div className="h-px flex-1 bg-[#25252d]" />
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowEmailForm(true);
                                    setError("");
                                }}
                                className="w-full rounded-xl bg-gradient-to-r from-[#9b7cff] to-[#6d3df5] py-3 text-[10px] font-medium text-white shadow-lg shadow-purple-900/30 transition hover:opacity-90"
                            >
                                Continue with Email
                            </button>
                        </>
                    ) : (
                        <form
                            onSubmit={handleEmailLogin}
                            className="space-y-3"
                        >
                            <div>
                                <label className="mb-1.5 block text-[9px] text-gray-500">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    className="w-full rounded-xl border border-[#292931] bg-[#19191f] px-3 py-3 text-[11px] text-white outline-none placeholder:text-gray-600 focus:border-[#8b5cf6]"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[9px] text-gray-500">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className="w-full rounded-xl border border-[#292931] bg-[#19191f] px-3 py-3 text-[11px] text-white outline-none placeholder:text-gray-600 focus:border-[#8b5cf6]"
                                />
                            </div>

                            {error && (
                                <p className="rounded-lg bg-red-500/10 px-3 py-2 text-[9px] leading-4 text-red-400">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-gradient-to-r from-[#9b7cff] to-[#6d3df5] py-3 text-[10px] font-medium text-white shadow-lg shadow-purple-900/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Please wait..."
                                    : "Continue"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowEmailForm(false);
                                    setError("");
                                }}
                                className="w-full py-1 text-[9px] text-gray-500 transition hover:text-gray-300"
                            >
                                Back
                            </button>
                        </form>
                    )}

                    <p className="mt-4 text-center text-[7px] leading-3 text-gray-600">
                        By continuing, you agree to our Terms of Service
                        and Privacy Policy.
                    </p>
                </div>
            </div>
        </main>
    );
}