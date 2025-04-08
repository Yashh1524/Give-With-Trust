"use client";

import {
    BellIcon,
    HomeIcon,
    LogOutIcon,
    UserIcon,
    NotebookTextIcon,
    Building2Icon,
    LayoutDashboardIcon,
    LogInIcon,
    UserPlusIcon,
    PlusIcon,
} from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
    useAuth,
    SignInButton,
    SignOutButton,
    SignUpButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getNgoByUserId } from "@/actions/ngo.action";
import { getDbUserId } from "@/actions/user.action";

const MobileSidebar = ({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) => {
    const { isSignedIn } = useAuth();
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
        <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
            <SheetContent side="left" className="w-full max-w-xs">
                <SheetHeader>
                    <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                    <nav className="flex flex-col space-y-4 mt-2">
                        <Button
                            variant="ghost"
                            className="flex items-center gap-3 justify-start"
                            asChild
                        >
                            <Link href="/">
                                <HomeIcon className="w-4 h-4" />
                                Home
                            </Link>
                        </Button>

                        <Button
                            variant="ghost"
                            className="flex items-center gap-3 justify-start"
                            asChild
                        >
                            <Link href="/about">
                                <NotebookTextIcon className="w-4 h-4" />
                                About
                            </Link>
                        </Button>

                        <Button
                            variant="ghost"
                            className="flex items-center gap-3 justify-start"
                            asChild
                        >
                            <Link href="/ngos">
                                <Building2Icon className="w-4 h-4" />
                                NGOs
                            </Link>
                        </Button>

                        {isSignedIn && (
                            <>
                                {hasNgo ? (
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-3 justify-start"
                                        asChild
                                    >
                                        <Link href="/dashboard">
                                            <LayoutDashboardIcon className="w-4 h-4" />
                                            Dashboard
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-3 justify-start"
                                        asChild
                                    >
                                        <Link href="/register-ngo">
                                            <PlusIcon className="w-4 h-4" />
                                            Become an NGO
                                        </Link>
                                    </Button>
                                )}

                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-3 justify-start"
                                    asChild
                                >
                                    <Link href="/notifications">
                                        <BellIcon className="w-4 h-4" />
                                        Notifications
                                    </Link>
                                </Button>

                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-3 justify-start"
                                    asChild
                                >
                                    <Link href="/profile">
                                        <UserIcon className="w-4 h-4" />
                                        Profile
                                    </Link>
                                </Button>

                                <SignOutButton>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-3 justify-start w-full"
                                    >
                                        <LogOutIcon className="w-4 h-4" />
                                        Logout
                                    </Button>
                                </SignOutButton>
                            </>
                        )}

                        {!isSignedIn && (
                            <>
                                <SignInButton mode="modal">
                                    <Button
                                        variant="default"
                                        className="flex items-center gap-3 justify-center mx-5"
                                    >
                                        <LogInIcon className="w-4 h-4" />
                                        Sign In
                                    </Button>
                                </SignInButton>

                                <SignUpButton mode="modal">
                                    <Button
                                        variant="default"
                                        className="flex items-center gap-3 justify-center mx-5"
                                    >
                                        <UserPlusIcon className="w-4 h-4" />
                                        Sign Up
                                    </Button>
                                </SignUpButton>
                            </>
                        )}
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default MobileSidebar;
