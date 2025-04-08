"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { SignOutButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { IoHomeSharp } from "react-icons/io5";
import { LuNotepadText } from "react-icons/lu";
import { MdAssignmentInd, MdDashboard } from "react-icons/md";
import { PiBuildingOfficeFill } from "react-icons/pi";
import { IoMdNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { TbLogin2, TbLogout2, TbLayoutSidebarLeftExpand, TbLayoutSidebarRightExpand } from "react-icons/tb";
import { useState } from "react";

const Sidebar = () => {
    const { isSignedIn } = useAuth();
    const [openSidebar, setOpenSidebar] = useState(true);

    return (
        <div className="relative z-50">
            {/* Sidebar */}
            {openSidebar && (
                <aside className="hidden md:flex flex-col w-64 border-r dark:border-gray-800 p-4 bg-white dark:bg-[#100f1b] h-full transition-all duration-300">
                    <nav className="flex flex-col gap-2">
                        <Link href="/">
                            <Button variant="ghost" className="w-full justify-start">
                                <IoHomeSharp /> Home
                            </Button>
                        </Link>

                        <Link href="/about">
                            <Button variant="ghost" className="w-full justify-start">
                                <LuNotepadText /> About
                            </Button>
                        </Link>

                        <Link href="/ngos">
                            <Button variant="ghost" className="w-full justify-start">
                                <PiBuildingOfficeFill /> NGOs
                            </Button>
                        </Link>

                        {isSignedIn && (
                            <>
                                <Link href="/dashboard">
                                    <Button variant="ghost" className="w-full justify-start">
                                        <MdDashboard /> Dashboard
                                    </Button>
                                </Link>

                                <Link href="/notifications">
                                    <Button variant="ghost" className="w-full justify-start">
                                        <IoMdNotifications /> Notifications
                                    </Button>
                                </Link>

                                <Link href="/profile">
                                    <Button variant="ghost" className="w-full justify-start">
                                        <FaUser /> Profile
                                    </Button>
                                </Link>
                            </>
                        )}

                        <div className="mt-4">
                            {isSignedIn ? (
                                <SignOutButton>
                                    <Button variant="ghost" className="w-full justify-start">
                                        <TbLogout2 /> Sign Out
                                    </Button>
                                </SignOutButton>
                            ) : (
                                <>
                                    <SignInButton mode="modal">
                                        <Button className="w-full justify-start" variant="ghost">
                                            <TbLogin2 /> Sign In
                                        </Button>
                                    </SignInButton>
                                    <SignUpButton mode="modal">
                                        <Button className="w-full justify-start" variant="ghost">
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
                className={`absolute top-1/2 -translate-y-1/2 right-0 transform translate-x-1/2 bg-primary text-white p-2 rounded-full shadow-md transition duration-300 md:block hidden dark:bg-white dark:text-black ${openSidebar ? "" : ""
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
