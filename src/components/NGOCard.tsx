'use client';

import { NGOProfile, AccentTag } from "@prisma/client";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface NgoCardProps {
    ngo: NGOProfile & { user: { name: string | null } };
}

const accentTagStyles: Record<AccentTag, { label: string; color: string }> = {
    NEW: { label: "New", color: "bg-blue-500/20 text-blue-300" },
    TRUSTED: { label: "Trusted", color: "bg-green-500/20 text-green-300" },
    FEATURED: { label: "Featured", color: "bg-pink-500/20 text-pink-300" },
    VERIFIED: { label: "Verified", color: "bg-purple-500/20 text-purple-300" },
    IMPACTFUL: { label: "Impactful", color: "bg-cyan-500/20 text-cyan-300" },
};

const NGOCard = ({ ngo }: NgoCardProps) => {
    const tag = accentTagStyles[ngo.accentTags as AccentTag];
    
    return (
        <Link
            href={`/ngos/${ngo.id}`}
            className="rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 bg-[#fff] dark:bg-[#1a1925] hover:shadow-lg transition flex flex-col gap-4 min-h-[380px]"
        >
            {/* Logo */}
            {ngo.logo && (
                <div className="w-full h-44 relative rounded-lg overflow-hidden">
                    <img
                        src={ngo.logo}
                        alt={`${ngo.name} logo`}
                        className="object-cover w-full h-full"
                    />
                </div>
            )}

            {/* Name + Accent Tag */}
            <div className="flex justify-between items-center mt-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {ngo.name}
                </h2>
                {tag && (
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${tag.color}`}>
                        <Sparkles size={12} /> {tag.label}
                    </span>
                )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {ngo.description}
            </p>

            {/* Owner and info */}
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1 mt-auto">
                <p><strong>Owner:</strong> {ngo.user.name || "Unnamed"}</p>
                <p><strong>Established:</strong> {new Date(ngo.establishedDate).toDateString()}</p>
                {/* <p><strong>Raised this month:</strong> ₹{ngo.raisedThisMonth.toFixed(2)}</p> */}
            </div>
        </Link>
    );
};

export default NGOCard;
