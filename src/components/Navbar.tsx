"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import MobileSidebar from "./MobileSidebar";
import ToggleDarkModeButton from "./ToggleDarkModelButton";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="sticky h-[10vh] top-0 z-50 w-full border-b bg-white dark:bg-[#100f1b]">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-primary dark:text-white">
                    GiveWithTrust
                </Link>
                <div className="flex gap-3 items-center">
                    <UserButton />
                    <ToggleDarkModeButton />
                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Sheet */}
            <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
        </nav>
    );
};

export default Navbar;
