import { getDonationByUserId } from '@/actions/donation.action';
import { getNgoByUserId } from '@/actions/ngo.action';
import { getDbUserId, getUserDetails } from '@/actions/user.action';
import { getVotingSessionByUserId } from '@/actions/voting.action';
import ProfileClient from '@/components/ProfileClient';
import React from 'react';

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const currUserId = await getDbUserId();
    const { id: userId } = await params;
    const user = await getUserDetails(userId);
    const donations = await getDonationByUserId(userId);
    const ngos = await getNgoByUserId(userId);

    if (!user) {
        return (
            <div className="text-center text-lg py-10 text-gray-500 dark:text-gray-400">
                User not found.
            </div>
        );
    }

    return (
        <ProfileClient
            user={user}
            currUserId={currUserId}
            donations={donations}
            ngos={ngos}
        />
    );
};

export default page;
