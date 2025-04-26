'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NGOProfile, User } from '@prisma/client';
import { FileTextIcon, HeartIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import EditProfileDialog from './EditProfileDialog';

type DonationWithNgo = {
    id: string;
    createdAt: Date;
    orderId: string;
    paymentId: string;
    donorId: string;
    ngoId: string;
    amount: number;
    message: string | null;
    month: string;
    year: number;
    status: 'HELD' | 'RELEASED' | 'REASSIGNED';
    reAssignedNgoId: string | null;
    ngo: {
        id: string;
        name: string;
        logo: string | null;
    };
};

type Props = {
    user: User;
    currUserId: string | null | undefined;
    donations: any[];
    ngos: NGOProfile[];
};

const ProfileClient: React.FC<Props> = ({ user, currUserId, donations, ngos }) => {
    const hasNgos = ngos.length > 0;
    const [selectedTab, setSelectedTab] = useState<'donations' | 'ngos' | 'votes'>('donations');

    const filteredDonations = currUserId === user.id
        ? donations
        : donations.filter((donation) => donation.isAnonymousDonation === false);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'HELD':
                return (
                    <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                        Held
                    </span>
                );
            case 'RELEASED':
                return (
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                        Released
                    </span>
                );
            case 'REASSIGNED':
                return (
                    <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                        Reassigned
                    </span>
                );
            case 'REASSIGNED_RELEASED':
                return (
                    <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                        Reassigned
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <img
                        src={user.image || '/default-avatar.png'}
                        alt={user.name || "user"}
                        className="w-20 h-20 rounded-full object-cover border-4 border-gray-300"
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            {user.name || user.username}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
                        <p className="text-sm text-blue-600 font-medium mt-1">{user.role}</p>
                        {user.bio && <p className="text-sm mt-2 text-gray-600 dark:text-gray-300 max-w-md">{user.bio}</p>}
                    </div>
                </div>

                {user.id === currUserId && <EditProfileDialog user={user} />}
            </div>

            {/* Tabs */}
            {hasNgos ? (
                <Tabs defaultValue="donations" value={selectedTab} onValueChange={(val) => setSelectedTab(val as 'donations' | 'ngos')} className="w-full">
                    <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                        <TabsTrigger
                            value="donations"
                            className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 font-semibold"
                        >
                            <HeartIcon className={`size-4 ${selectedTab === 'donations' ? 'fill-red-500 text-pink-500' : ''}`} />
                            Donations
                        </TabsTrigger>

                        <TabsTrigger
                            value="ngos"
                            className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 font-semibold"
                        >
                            <FileTextIcon className={`size-4 ${selectedTab === 'ngos' ? 'dark:fill-white dark:text-black fill-black text-white' : ''}`} />
                            Your NGOs
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="donations" className="mt-6">
                        {filteredDonations.length > 0 ? (
                            <>
                                <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 p-4 rounded-xl shadow-sm text-sm text-yellow-800 dark:text-yellow-200 mb-5 font-bold">
                                        Anonymous Donations are only visible for you
                                </div>
                                <div className="space-y-4">
                                    {filteredDonations.map((donation) => (
                                        <div
                                            key={donation.id}
                                            className="p-4 bg-white dark:bg-[#1f2937] rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    {donation.ngo.logo && (
                                                        <img
                                                            src={donation.ngo.logo}
                                                            alt={donation.ngo.name}
                                                            className="w-10 h-10 rounded-full object-cover border"
                                                        />
                                                    )}
                                                    <div>
                                                        <Link
                                                            href={`/ngos/${donation.ngo.id}`}
                                                            className="text-lg font-semibold text-blue-700 dark:text-blue-300"
                                                        >
                                                            {donation.ngo.name}
                                                        </Link>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {donation.message || 'No message'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-bold">₹{donation.amount}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {donation.month} {donation.year}
                                                    </p>
                                                    <div className="mt-1">{getStatusBadge(donation.status)}</div>
                                                    {donation.isAnonymousDonation && (
                                                        <div className="mt-1">Anonymous Donation</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">No donations yet</div>
                        )}
                    </TabsContent>

                    <TabsContent value="ngos" className="mt-6">
                        {ngos.length > 0 ? (
                            <div className="space-y-4">
                                {ngos.map((ngo) => (
                                    <div key={ngo.id} className="p-4 bg-white dark:bg-[#1f2937] rounded-lg shadow-md border dark:border-gray-700">
                                        <div className="flex items-center gap-4">
                                            {ngo.logo && (
                                                <img src={ngo.logo} alt={ngo.name} className="w-14 h-14 rounded-full object-cover border" />
                                            )}
                                            <div>
                                                <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300">{ngo.name}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{ngo.description}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{ngo.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">No NGOs registered yet</div>
                        )}
                    </TabsContent>

                </Tabs>
            ) : (
                // Only Donations
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Donation History</h2>
                    {filteredDonations.length > 0 ? (
                        <>
                            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 p-4 rounded-xl shadow-sm text-sm text-yellow-800 dark:text-yellow-200 mb-5 font-bold">
                                Anonymous Donations are only visible for you
                            </div>
                            <div className="space-y-4">
                                {filteredDonations.map((donation) => (
                                    <div
                                        key={donation.id}
                                        className="p-4 bg-white dark:bg-[#1f2937] rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                {donation.ngo.logo && (
                                                    <img
                                                        src={donation.ngo.logo}
                                                        alt={donation.ngo.name}
                                                        className="w-10 h-10 rounded-full object-cover border"
                                                    />
                                                )}
                                                <div>
                                                    <Link
                                                        href={`/ngos/${donation.ngo.id}`}
                                                        className="text-lg font-semibold text-blue-700 dark:text-blue-300"
                                                    >
                                                        {donation.ngo.name}
                                                    </Link>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {donation.message || 'No message'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold">₹{donation.amount}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {donation.month} {donation.year}
                                                </p>
                                                <div className="mt-1">{getStatusBadge(donation.status)}</div>
                                                {donation.isAnonymousDonation && (
                                                    <div className="mt-1">Anonymous Donation</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">No donations yet</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfileClient;
