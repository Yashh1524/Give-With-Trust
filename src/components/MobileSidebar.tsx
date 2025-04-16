"use client";

import {
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
import { checkIfUserHasNgo, getDbUserId, getUserDetails } from "@/actions/user.action";
import { Role } from "@prisma/client";
import { RiAdminFill } from "react-icons/ri";
import { FaVoteYea } from "react-icons/fa";

const MobileSidebar = ({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) => {
    const { isSignedIn } = useAuth();
    const [hasNgo, setHasNgo] = useState(false);
    const [userId, setUserId] = useState("")
    const [userRole, setUserRole] = useState<Role | undefined>("DONOR")

    useEffect(() => {

        return () => {
            console.log(userId);
        };
    }, []);

    useEffect(() => {
        const checkNgoStatus = async () => {
            try {
                const userId = await getDbUserId();
                if (!userId) return;
                const user = await getUserDetails(userId)
                setUserId(userId)
                setHasNgo(await checkIfUserHasNgo())
                setUserRole(user?.role)
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
            <SheetContent side="left" className="w-full max-w-xs dark:bg-[#100f1b]">
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
                                    <>
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
                                        <Button
                                            variant="ghost"
                                            className="flex items-center gap-3 justify-start"
                                            asChild
                                        >
                                            <Link href="/register-ngo">
                                                <PlusIcon className="w-4 h-4" />
                                                Add more NGO
                                            </Link>
                                        </Button>
                                    </>
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

                                {
                                    userRole === "ADMIN" && (
                                        <Link href="/admin-dashboard">
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-black dark:text-white"
                                            >
                                                <RiAdminFill /> Admin Dashboard
                                            </Button>
                                        </Link>
                                    )
                                }
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-3 justify-start"
                                    asChild
                                >
                                    <Link href="/notifications">
                                        <FaVoteYea className="w-4 h-4" />
                                        Voting Sessions
                                    </Link>
                                </Button>

                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-3 justify-start"
                                    asChild
                                >
                                    <Link href={`/profile/${userId}`}>
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
