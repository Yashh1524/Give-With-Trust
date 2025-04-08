"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
    SignOutButton,
    SignInButton,
    SignUpButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import {
    IoHomeSharp,
} from "react-icons/io5";
import { LuNotepadText } from "react-icons/lu";
import {
    MdAssignmentInd,
    MdDashboard,
} from "react-icons/md";
import { PiBuildingOfficeFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa";
import {
    TbLogin2,
    TbLogout2,
    TbLayoutSidebarLeftExpand,
    TbLayoutSidebarRightExpand,
} from "react-icons/tb";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoMdNotifications } from "react-icons/io";
import { getDbUserId } from "@/actions/user.action";
import { getNgoByUserId } from "@/actions/ngo.action";

const Sidebar = () => {
    const { isSignedIn } = useAuth();
    const [openSidebar, setOpenSidebar] = useState(true);
    const [hasNgo, setHasNgo] = useState(false);
    
    useEffect(() => {
        const checkNgoStatus = async () => {
            try {
                const userId = await getDbUserId();
                if (!userId) return;
                const ngo = await getNgoByUserId(userId);
                setHasNgo(!!ngo); // true if ngo exists, false otherwise
            } catch (error) {
                console.error("Failed to check NGO status:", error);
                setHasNgo(false);
            }
        };
    
        if (isSignedIn) {
            checkNgoStatus();
        }
    }, [isSignedIn]);
    

    return (
        <div className="relative h-[90vh]">
            {openSidebar && (
                <aside className="hidden md:flex flex-col w-64 border-r border-gray-300 dark:border-gray-800 p-4 bg-white dark:bg-[#100f1b] h-full">
                    <nav className="flex flex-col gap-2 text-black dark:text-white">
                        <Link href="/">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-black dark:text-white"
                            >
                                <IoHomeSharp /> Home
                            </Button>
                        </Link>

                        <Link href="/about">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-black dark:text-white"
                            >
                                <LuNotepadText /> About
                            </Button>
                        </Link>

                        <Link href="/ngos">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-black dark:text-white"
                            >
                                <PiBuildingOfficeFill /> NGOs
                            </Button>
                        </Link>

                        {isSignedIn && (
                            <>
                                {hasNgo ? (
                                    <Link href="/dashboard">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-black dark:text-white"
                                        >
                                            <MdDashboard /> Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/register-ngo">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-black dark:text-white"
                                        >
                                            <FaPlus /> Become an NGO
                                        </Button>
                                    </Link>
                                )}

                                <Link href="/notifications">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-black dark:text-white"
                                    >
                                        <IoMdNotifications /> Notifications
                                    </Button>
                                </Link>

                                <Link href="/profile">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-black dark:text-white"
                                    >
                                        <FaUser /> Profile
                                    </Button>
                                </Link>
                            </>
                        )}

                        <div className="mt-4">
                            {isSignedIn ? (
                                <SignOutButton>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-black dark:text-white"
                                    >
                                        <TbLogout2 /> Sign Out
                                    </Button>
                                </SignOutButton>
                            ) : (
                                <>
                                    <SignInButton mode="modal">
                                        <Button
                                            className="w-full justify-start text-black dark:text-white"
                                            variant="ghost"
                                        >
                                            <TbLogin2 /> Sign In
                                        </Button>
                                    </SignInButton>
                                    <SignUpButton mode="modal">
                                        <Button
                                            className="w-full justify-start text-black dark:text-white"
                                            variant="ghost"
                                        >
                                            <MdAssignmentInd /> Sign Up
                                        </Button>
                                    </SignUpButton>
                                </>
                            )}
                        </div>
                    </nav>
                </aside>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setOpenSidebar((prev) => !prev)}
                className={`absolute top-1/2 -translate-y-1/2 left-full transform -translate-x-1/2 bg-primary text-white p-2 rounded-full shadow-md md:block hidden dark:bg-white dark:text-black ${openSidebar ? "" : "-left-3"
                    }`}
            >
                {openSidebar ? (
                    <TbLayoutSidebarRightExpand size={20} />
                ) : (
                    <TbLayoutSidebarLeftExpand size={20} />
                )}
            </button>
        </div>
    );
};

export default Sidebar;
