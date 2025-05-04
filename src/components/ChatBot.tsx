"use client";

import { useState, useEffect, useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { getGeminiResponse } from "@/actions/gemini.action";
import { getAllNgo, getNGOsByStatus } from "@/actions/ngo.action";
import Link from "next/link";

type NGO = {
    id: string;
    name: string;
    des: string;
};

type Message = {
    from: "user" | "bot";
    text?: string;
    time: string;
    buttons?: { name: string; url: string }[];
};

const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function ChatBot({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [messages, setMessages] = useState<Message[]>([
        {
            from: "bot",
            text: "👋 Hello! How can I assist you today?",
            time: getCurrentTime(),
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [pendingQuery, setPendingQuery] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    useEffect(() => {
        if (!pendingQuery) return;

        const fetchBotResponse = async () => {
            setLoading(true);
            try {
                // const ngos = await getNGOsByStatus("PENDING");
                const ngos = await getAllNgo();
                const formattedNgos: NGO[] = ngos.map((ngo: any) => ({
                    id: ngo.id,
                    name: ngo.name,
                    des: ngo.description,
                }));

                const response = await getGeminiResponse(pendingQuery, formattedNgos);

                const buttons =
                    response.ngos?.length > 0
                        ? response.ngos.map((ngo: NGO) => ({
                            name: ngo.name,
                            url: `/ngos/${ngo.id}`,
                        }))
                        : undefined;

                setMessages((prev) => [
                    ...prev,
                    {
                        from: "bot",
                        text: response.message,
                        buttons,
                        time: getCurrentTime(),
                    },
                ]);
            } catch (err) {
                console.error("Gemini chatbot error:", err);
                setMessages((prev) => [
                    ...prev,
                    {
                        from: "bot",
                        text:
                            "❌ Sorry, I couldn’t fetch the data right now. Please try again later.",
                        time: getCurrentTime(),
                    },
                ]);
            } finally {
                setLoading(false);
                setPendingQuery(null);
            }
        };

        fetchBotResponse();
    }, [pendingQuery]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            from: "user",
            text: input,
            time: getCurrentTime(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setPendingQuery(input);
        setInput("");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-6 right-4 sm:right-8 w-[90%] sm:w-96 max-w-md h-[80vh] sm:h-[500px] rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col z-50 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex justify-between items-center border-b border-gray-300 dark:border-gray-700">
                <span className="font-semibold text-sm sm:text-base">
                    💬 Chat Assistant
                </span>
                <button onClick={onClose} className="cursor-pointer">
                    <IoCloseSharp size={25} className="text-white" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 px-4 py-3 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex flex-col ${msg.from === "user" ? "items-end" : "items-start"
                            }`}
                    >
                        {(msg.text || msg.buttons) && (
                            <div
                                className={`px-4 py-2 rounded-lg text-sm sm:text-base max-w-[80%] shadow space-y-2 ${msg.from === "bot"
                                    ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                                    : "bg-blue-600 text-white"
                                    }`}
                            >
                                <div>
                                    {msg.text}

                                    {msg.buttons && msg.buttons.length > 0 && (
                                        <div className="flex flex-col gap-1 mt-2">
                                            {msg.buttons.map((btn, i) => (
                                                <Link
                                                    onClick={onClose}
                                                    key={i}
                                                    href={btn.url}
                                                    className="block w-full px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-500 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium shadow-sm"
                                                >
                                                    {btn.name}
                                                </Link>

                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {msg.time}
                        </span>
                    </div>
                ))}

                {loading && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                        Bot is typing...
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                <input
                    className="flex-1 px-4 py-2 text-sm sm:text-base bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-lg outline-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button
                    onClick={handleSend}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm sm:text-base rounded-lg transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
