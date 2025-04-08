"use client";

import {
    BellIcon,
    HomeIcon,
    LogOutIcon,
    MenuIcon,
    UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth, SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import ToggleDarkModeButton from "./ToggleDarkModelButton";

function MobileNavbar() {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const { isSignedIn } = useAuth();

    return (
        <div className="flex md:hidden items-center space-x-2">
            <ToggleDarkModeButton />

            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MenuIcon className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                    <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col space-y-4 mt-6">
                        <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
                            <Link href="/">
                                <HomeIcon className="w-4 h-4" />
                                Home
                            </Link>
                        </Button>

                        <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
                            <Link href="/about">
                                ℹ️
                                About
                            </Link>
                        </Button>

                        <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
                            <Link href="/ngos">
                                🏥
                                NGOs
                            </Link>
                        </Button>

                        {isSignedIn ? (
                            <>
                                <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
                                    <Link href="/dashboard">
                                        📊
                                        Dashboard
                                    </Link>
                                </Button>

                                <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
                                    <Link href="/notifications">
                                        <BellIcon className="w-4 h-4" />
                                        Notifications
                                    </Link>
                                </Button>

                                <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
                                    <Link href="/profile">
                                        <UserIcon className="w-4 h-4" />
                                        Profile
                                    </Link>
                                </Button>

                                <SignOutButton>
                                    <Button variant="ghost" className="flex items-center gap-3 justify-start w-full">
                                        <LogOutIcon className="w-4 h-4" />
                                        Logout
                                    </Button>
                                </SignOutButton>
                            </>
                        ) : (
                            <>
                                <SignInButton mode="modal">
                                    <Button variant="default" className="w-full">
                                        Sign In
                                    </Button>
                                </SignInButton>
                                <SignUpButton mode='modal'>
                                    <Button variant="default" className="w-full">
                                        Sign Up
                                    </Button>
                                </SignUpButton>
                            </>
                        )}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default MobileNavbar;