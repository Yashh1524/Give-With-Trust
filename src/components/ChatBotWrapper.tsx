"use client";

import { useState } from "react";
import ChatBot from "@/components/ChatBot";
import { TbMessageChatbot } from "react-icons/tb";
import { IoCloseSharp } from "react-icons/io5";

export default function ChatBotWrapper() {
    const [isChatBotOpen, setIsChatBotOpen] = useState(false);

    return (
        <>
            {/* Floating Chat Button */}
            <div
                className="fixed h-12 w-12 bg-[#1b5e7b] bottom-10 right-10 rounded-full flex items-center justify-center cursor-pointer z-50"
                onClick={() => setIsChatBotOpen(!isChatBotOpen)}
            >
                {isChatBotOpen ? (
                    <IoCloseSharp size={25} className="text-white" />
                ) : (
                    <TbMessageChatbot size={25} className="text-white" />
                )}
            </div>

            {/* ChatBot UI */}
            <ChatBot isOpen={isChatBotOpen} onClose={() => setIsChatBotOpen(false)} />
        </>
    );
}
