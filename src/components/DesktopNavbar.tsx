import { currentUser } from '@clerk/nextjs/server';
import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { BellIcon, HomeIcon, UserIcon } from 'lucide-react';
import ToggleDarkModelButton from './ToggleDarkModelButton';
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

const DesktopNavbar = async () => {
    const user = await currentUser();

    const getUsername = () =>
        user?.username ?? user?.emailAddresses?.[0]?.emailAddress.split('@')[0];

    return (
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <ToggleDarkModelButton />

            <Button asChild className="nav-button">
                <Link href="/" className="flex items-center gap-2">
                    <HomeIcon className="w-4 h-4" />
                    <span className="hidden lg:inline">Home</span>
                </Link>
            </Button>

            {user ? (
                <>
                    <Button asChild className="nav-button">
                        <Link href="/notifications" className="flex items-center gap-2">
                            <BellIcon className="w-4 h-4" />
                            <span className="hidden lg:inline">Notifications</span>
                        </Link>
                    </Button>

                    <Button asChild className="nav-button">
                        <Link
                            href={`/profile/${getUsername()}`}
                            className="flex items-center gap-2"
                        >
                            <UserIcon className="w-4 h-4" />
                            <span className="hidden lg:inline">Profile</span>
                        </Link>
                    </Button>

                    <UserButton />
                </>
            ) : (
                <>
                    <SignInButton mode="modal">
                        <Button className="nav-button">Sign In</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <Button className="nav-button">Sign Up</Button>
                    </SignUpButton>
                </>
            )}
        </div>
    );
};

export default DesktopNavbar;
