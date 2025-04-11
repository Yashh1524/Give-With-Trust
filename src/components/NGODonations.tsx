'use client'

import { DonationStatus } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';

type NGODonationsProps = {
    donations: {
        id: string;
        amount: number;
        message?: string | null;
        createdAt: Date;
        status: DonationStatus;
        reAssignedNgo?: {
            id: string;
            name: string;
        } | null;
        donor: {
            id: string;
            name: string | null;
            email: string;
            image: string | null;
        };
    }[];
    ngoId: string
};

export default function NGODonations({ donations, ngoId }: NGODonationsProps) {
    const [showMore, setShowMore] = useState(false);

    if (donations.length === 0) {
        return <p className="text-sm text-gray-500 mt-4">No donations yet for this NGO.</p>;
    }

    const getStatusBadge = (status: DonationStatus) => {
        switch (status) {
            case 'HELD':
                return <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Held</span>;
            case 'RELEASED':
                return <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">Released</span>;
            case 'REASSIGNED':
                return <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">Reassigned</span>;
            default:
                return null;
        }
    };

    const displayedDonations = showMore ? donations : donations.slice(0, 5);

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">💸 Donations Received</h2>

            {/* Explanation for donation Status */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-2 lg:space-y-0 text-sm text-gray-700 dark:text-gray-300 mb-4">
                <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Held</span>
                    <p>Funds are securely held and will be sent to NGO after monthly proof is submitted.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">Released</span>
                    <p>Funds have been sent to the NGO after proof verification.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">Reassigned</span>
                    <p>Funds were reassigned to another NGO due to missing proof.</p>
                </div>
            </div>

            <ul className="space-y-4">
                {displayedDonations.map((donation) => (
                    <li
                        key={donation.id}
                        className="flex flex-col md:flex-row items-start gap-4 p-4 rounded-md border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm"
                    >
                        <div className="w-12 h-12 rounded-full overflow-hidden border">
                            {donation.donor.image ? (
                                <img
                                    src={donation.donor.image}
                                    alt={donation.donor.name || 'Donor'}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500 text-sm">
                                    ?
                                </div>
                            )}
                        </div>

                        <div className="flex-1 w-full">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Link href={`/profile/${donation.donor.id}`} className="font-semibold text-gray-800 dark:text-white">
                                        {donation.donor.name}
                                    </Link>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                        ₹{donation.amount.toFixed(2)}
                                    </p>
                                    <div className="mt-1">
                                        {getStatusBadge(donation.status)}
                                    </div>
                                </div>
                            </div>

                            {donation.message && (
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 italic">
                                    "{donation.message}"
                                </p>
                            )}

                            <p className="text-xs text-gray-400 mt-1">
                                Donated on {new Date(donation.createdAt).toLocaleString()}
                            </p>

                            {donation.status === 'REASSIGNED' && donation.reAssignedNgo && (
                                <p className="text-xs text-red-500 mt-1">
                                    This donation is reassigned to{' '}
                                    <a href={`/ngos/${donation.reAssignedNgo.id}`}>
                                        <span className="font-semibold underline">{donation.reAssignedNgo.name}</span>.
                                    </a>
                                </p>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {donations.length > 5 && !showMore && (
                <button
                    onClick={() => setShowMore(true)}
                    className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                    Show More
                </button>
            )}
            {donations.length > 5 && showMore && (
                <button
                    onClick={() => setShowMore(false)}
                    className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                    Show less
                </button>
            )}
        </div>
    );
}
