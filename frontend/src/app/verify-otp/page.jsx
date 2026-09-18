"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BsSoundwave } from "react-icons/bs";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function VerifyOtpPage() {
    const router = useRouter();

    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [userId, setUserId] = useState("");
    const [isNewUser, setIsNewUser] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const storedUserId =
            sessionStorage.getItem("nuzi_otp_user_id");

        const storedEmail =
            sessionStorage.getItem("nuzi_otp_email");

        const storedIsNewUser =
            sessionStorage.getItem("nuzi_is_new_user");

        if (!storedUserId || !storedEmail) {
            router.replace("/login");
            return;
        }

        setUserId(storedUserId);
        setEmail(storedEmail);
        setIsNewUser(
            storedIsNewUser === "true"
        );
    }, [router]);

    useEffect(() => {
        if (timeLeft <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((previous) => previous - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        return `${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    const handleOtpChange = (e) => {
        const value = e.target.value
            .replace(/\D/g, "")
            .slice(0, 6);

        setOtp(value);
        setError("");
    };

    const handleVerify = async (e) => {
        e.preventDefault();

        setError("");

        if (otp.length !== 6) {
            setError("Please enter the 6-digit OTP");
            return;
        }

        if (timeLeft <= 0) {
            setError("OTP has expired. Please login again.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/auth/verify-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        userId,
                        otp,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(
                    data.message ||
                    "Unable to verify OTP"
                );
                return;
            }

            sessionStorage.setItem(
                "nuzi_user_email",
                email.trim().toLowerCase()
            );

            sessionStorage.removeItem(
                "nuzi_otp_user_id"
            );

            sessionStorage.removeItem(
                "nuzi_otp_email"
            );

            sessionStorage.removeItem(
                "nuzi_is_new_user"
            );

            if (isNewUser) {
                router.push("/preference");
            } else {
                router.push("/preference");
            }
        } catch (error) {
            setError(
                "Unable to connect to server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#09090f] flex items-center justify-center px-4 py-6 sm:px-6">
            <div className="relative flex min-h-[720px] w-full max-w-[390px] flex-col rounded-[32px] bg-[#101016] px-5 py-8 text-white shadow-2xl sm:px-6">

                <div className="flex items-center justify-center text-sm font-semibold tracking-wide">
                    <BsSoundwave
                        size={20}
                        className="mr-2 text-white"
                    />

                    <span className="text-2xl text-white">
                        Nuzio
                    </span>

                    <span className="text-[#8b5cf6]">
                        AI
                    </span>
                </div>

                <div className="mt-16 sm:mt-20">
                    <p className="mb-1 text-[10px] text-gray-500">
                        Verify your email
                    </p>

                    <h1 className="text-[25px] font-semibold leading-tight">
                        Check your inbox.
                    </h1>

                    <h2 className="mt-1 font-serif text-[23px] italic text-[#a78bfa]">
                        Your code is waiting.
                    </h2>

                    <p className="mt-4 max-w-[300px] text-[9px] leading-4 text-gray-500">
                        We sent a 6-digit verification code to
                        <span className="ml-1 text-gray-300">
                            {email}
                        </span>
                    </p>
                </div>

                <form
                    onSubmit={handleVerify}
                    className="mt-auto"
                >
                    <label className="mb-2 block text-[9px] text-gray-500">
                        Verification code
                    </label>

                    <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={otp}
                        onChange={handleOtpChange}
                        placeholder="000000"
                        className="w-full rounded-xl border border-[#292931] bg-[#19191f] px-4 py-4 text-center text-[20px] font-semibold tracking-[8px] text-white outline-none placeholder:text-gray-700 focus:border-[#8b5cf6]"
                    />

                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-[9px] text-gray-600">
                            Code expires in
                        </span>

                        <span
                            className={`text-[9px] font-medium ${timeLeft <= 30
                                    ? "text-red-400"
                                    : "text-[#a78bfa]"
                                }`}
                        >
                            {formatTime()}
                        </span>
                    </div>

                    {error && (
                        <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-[9px] leading-4 text-red-400">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={
                            loading ||
                            otp.length !== 6 ||
                            timeLeft <= 0
                        }
                        className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#9b7cff] to-[#6d3df5] py-3 text-[10px] font-medium text-white shadow-lg shadow-purple-900/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify & Continue"}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/login")}
                        className="mt-3 w-full py-1 text-[9px] text-gray-500 transition hover:text-gray-300"
                    >
                        Back to Login
                    </button>

                    <p className="mt-4 text-center text-[7px] leading-3 text-gray-600">
                        Enter the code sent to your email to continue.
                    </p>
                </form>
            </div>
        </main>
    );
}