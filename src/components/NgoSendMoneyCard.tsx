'use client'

import { updateDonationStatusByNgoId } from '@/actions/donation.action'
import { createPayout } from '@/actions/payout.action'
import { Donation, DonationStatus, NGOProfile } from '@prisma/client'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";
import { updateNgoProofStatus } from '@/actions/ngo.action'

interface DonationWithDonor extends Donation {
    donor: {
        id: string
        name: string | null
        email: string | null
        image: string | null
    }
}

interface NgoSendMoneyCardProps {
    ngoDetails: NGOProfile
    amount: number
    donations: DonationWithDonor[]
    failedNgo?: NGOProfile
}

const NgoSendMoneyCard: React.FC<NgoSendMoneyCardProps> = ({ ngoDetails, amount, donations, failedNgo }) => {
    const [loading, setLoading] = useState(false)
    const [showDonations, setShowDonations] = useState(false)

    const handleSendMoney = async () => {
        if (!amount) return;
        setLoading(true);

        try {
            const res = await fetch('/api/send-money-to-submitted-ngo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ngo: ngoDetails, amount }),
            });

            const data = await res.json();

            if (data.success) {
                await createPayout(ngoDetails.id, amount, data.payoutId);
                toast.success(`Sent ₹${amount} to ${ngoDetails.name}`);

                // If there are any REASSIGNED donations, update REASSIGNED_RELEASED for the failed NGO
                if (failedNgo?.id) {
                    const hasReassigned = donations.some(d => d.status === "REASSIGNED");
                    if (hasReassigned) {
                        await updateDonationStatusByNgoId(
                            "REASSIGNED_RELEASED" as DonationStatus,
                            failedNgo.id
                        );
                    }

                    // Also update proof status if needed
                    await updateNgoProofStatus(failedNgo.id, "PENDING");
                }

                // Always update RELEASED status for the selected NGO
                await updateDonationStatusByNgoId(
                    "RELEASED" as DonationStatus,
                    ngoDetails.id
                );
            } else {
                toast.error(`Failed: ${data.error}`);
            }
        } catch (err: any) {
            console.error("Send Money Error:", err);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="w-full">
            {failedNgo && (
                <div className="rounded-t-xl bg-red-100 dark:bg-red-800 p-3 text-sm text-red-800 dark:text-red-100 font-medium">
                    <span className="font-semibold underline"><Link href={`/ngos/${failedNgo.id}`}>{failedNgo.name}</Link></span> failed to upload monthly work proofs. Donations are reallocated to <span className="font-semibold underline"><Link href={`/ngos/${ngoDetails.id}`}>{ngoDetails.name}</Link></span> based on voting results.
                </div>
            )}

            <li className={`bg-white dark:bg-gray-800 p-4 shadow-md ${failedNgo ? "rounded-b-xl" : "rounded-xl"}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* NGO Identity Section */}
                    <div className="flex items-center gap-4">
                        {failedNgo ? (
                            <>
                                <div className="flex flex-col md:flex-row justify-center items-center gap-3">
                                    <Link href={`/ngos/${failedNgo.id}`}>
                                        <img src={failedNgo.logo as string} alt="NGO" className="w-10 h-10 rounded-full object-cover" />
                                    </Link>
                                    <Link href={`/ngos/${failedNgo.id}`} className="font-semibold text-gray-800 dark:text-white hover:text-purple-600 hidden md:block">
                                        {failedNgo.name}
                                    </Link>
                                </div>
                                <FaArrowRight size={20} className="text-gray-500" />
                            </>
                        ) : null}

                        <div className="flex flex-col md:flex-row justify-center items-center gap-3">
                            <Link href={`/ngos/${ngoDetails.id}`}>
                                <img src={ngoDetails.logo as string} alt="NGO" className="w-10 h-10 rounded-full object-cover" />
                            </Link>
                            <Link href={`/ngos/${ngoDetails.id}`} className="font-semibold text-gray-800 dark:text-white hover:text-purple-600 hidden md:block">
                                {ngoDetails.name}
                            </Link>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-green-600 font-semibold text-lg">₹{amount}</span>
                        <button
                            onClick={handleSendMoney}
                            disabled={loading || amount === 0}
                            className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : 'Send Money'}
                        </button>
                        <button onClick={() => setShowDonations(!showDonations)} className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
                            {showDonations ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />}
                        </button>
                    </div>
                </div>

                {/* Donations List */}
                {showDonations && (
                    <ul className="mt-5 space-y-4">
                        {donations.map((donation) => (
                            <li
                                key={donation.id}
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border bg-gray-50 dark:bg-gray-900 dark:border-gray-700 shadow-sm"
                            >
                                {/* Donor Avatar */}
                                <div className="w-12 h-12 rounded-full overflow-hidden border shrink-0">
                                    {donation.isAnonymousDonation ? (
                                        <img
                                            src="/avatar.png"
                                            alt={'Anonymous Donor'}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <img src={donation.donor.image || "/avatar.png"}
                                            alt={donation.donor.name || 'Donor'}
                                            className="object-cover w-full h-full"
                                        />
                                    )}
                                </div>

                                {/* Donor Info */}
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between flex-wrap gap-2 items-start sm:items-center">
                                        {
                                            donation.isAnonymousDonation ? (
                                                <p className="font-semibold text-gray-800 dark:text-white">
                                                    *Anonymous Donor*
                                                </p>
                                            ) : (
                                                <Link href={`/profile/${donation.donorId}`} className="font-semibold text-gray-800 dark:text-white">
                                                    {donation.donor?.name || 'donor'}
                                                </Link>
                                            )
                                        }

                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                ₹{donation.amount.toFixed(2)}
                                            </p>
                                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-md inline-block mt-1">
                                                {donation.status}
                                            </span>
                                        </div>
                                    </div>

                                    {donation.message && (
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 italic">"{donation.message}"</p>
                                    )}

                                    <p className="text-xs text-gray-400 mt-1">
                                        Donated on {new Date(donation.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </li>
        </div>
    )

}

export default NgoSendMoneyCard
