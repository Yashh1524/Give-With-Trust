// app/(your-folder)/page.tsx

import { getAllNoneAnonymousDonations } from '@/actions/donation.action';
import TopDonorsClient from '@/components/TopDonorsClient';
import React from 'react';

export const dynamic = 'force-dynamic'; // This forces dynamic rendering (no caching)

const Page = async () => {
    const allNotAnonymousDonations = await getAllNoneAnonymousDonations();

    const donorTotals: Record<string, { amount: number; name: string; image: string; id: string }> = {};

    allNotAnonymousDonations.forEach((donation) => {
        const donorId = donation.donorId;
        if (!donorId || donation.isAnonymousDonation) return;

        if (!donorTotals[donorId]) {
            donorTotals[donorId] = {
                amount: 0,
                name: donation.donor?.name || 'Anonymous',
                image: donation.donor?.image || '/avatar.png',
                id: donorId,
            };
        }
        donorTotals[donorId].amount += donation.amount;
    });

    const topDonors = Object.entries(donorTotals)
        .sort((a, b) => b[1].amount - a[1].amount)
        .slice(0, 10);

    return (
        <div className="p-6">
            <TopDonorsClient donors={topDonors} />
        </div>
    );
};

export default Page;
