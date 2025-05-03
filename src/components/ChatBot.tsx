"use client";

import { useState } from "react";

export default function ChatBot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [messages, setMessages] = useState([
        { from: "bot", text: "Hi! How can I help you today?" },
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = { from: "user", text: input };
        const botMessage = {
            from: "bot",
            text: "Thanks for your message! We'll get back to you shortly.",
        };

        setMessages((prev) => [...prev, userMessage, botMessage]);
        setInput("");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-24 right-10 w-80 h-[500px] rounded-2xl shadow-lg border border-border bg-background text-foreground flex flex-col z-50 overflow-hidden">
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-4 py-2 flex justify-between items-center">
                <span className="font-semibold">ChatBot</span>
                <button onClick={onClose} className="text-sm font-bold hover:opacity-75">✕</button>
            </div>

            {/* Scrollable messages */}
            <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-2 rounded-lg text-sm max-w-[75%] ${msg.from === "bot"
                                ? "bg-muted text-muted-foreground self-start"
                                : "bg-primary text-primary-foreground self-end ml-auto"
                            }`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="flex border-t border-border">
                <input
                    className="flex-1 px-3 py-2 text-sm bg-background text-foreground outline-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button
                    onClick={handleSend}
                    className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
