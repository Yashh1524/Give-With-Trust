'use client'

import { updateDonationStatus, updateDonationStatusByNgoId } from '@/actions/donation.action'
import { createPayout } from '@/actions/payout.action'
import { Donation, DonationStatus, NGOProfile } from '@prisma/client'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

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
}

const NgoSendMoneyCard: React.FC<NgoSendMoneyCardProps> = ({ ngoDetails, amount, donations }) => {
    const [loading, setLoading] = useState(false)
    const [showDonations, setShowDonations] = useState(false)

    const handleSendMoney = async () => {
        if (!amount) return
        setLoading(true)
        try {
            const res = await fetch('/api/send-money-to-submitted-ngo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ngo: ngoDetails, amount }),
            })
            const data = await res.json()
            console.log(data);
            console.log(ngoDetails);
            console.log(amount)
            
            if (data.success) {
                await createPayout(ngoDetails.id, amount, data.payoutId)
                toast.success(`Sent ₹${amount} to ${ngoDetails.name}`)
                for (const donation of donations) {
                    // await updateDonationStatus("RELEASED" as DonationStatus, donation.id)
                    await updateDonationStatusByNgoId("RELEASED" as DonationStatus, ngoDetails.id)
                }
            } else {
                toast.error(`Failed: ${data.error}`)
            }
        } catch (err) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <li className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <img
                        src={ngoDetails.logo as string}
                        alt="logo"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <Link href={`/ngos/${ngoDetails.id}`} className="font-medium hover:text-purple-600">
                        {ngoDetails.name}
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-green-600 font-semibold">₹{amount}</span>
                    <button
                        onClick={handleSendMoney}
                        disabled={loading || amount === 0}
                        className={`px-4 py-1 rounded bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:bg-gray-400`}
                    >
                        {loading ? 'Sending...' : 'Send Money'}
                    </button>
                    <button
                        onClick={() => setShowDonations(!showDonations)}
                    >
                        {
                            !showDonations ? <IoIosArrowDown size={25} /> : <IoIosArrowUp size={25} />
                        }

                    </button>
                </div>
            </div>
            {showDonations && (
                <ul className="mt-4 space-y-3 w-full">
                    {donations.map((donation) => (
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
                                        <Link
                                            href={`/profile/${donation.donorId}`}
                                            className="font-semibold text-gray-800 dark:text-white"
                                        >
                                            {donation.donor?.name || 'Anonymous'}
                                        </Link>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                            ₹{donation.amount.toFixed(2)}
                                        </p>
                                        <div className="mt-1">
                                            {/* You can customize getStatusBadge to return a styled badge */}
                                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">
                                                {donation.status}
                                            </span>
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
                            </div>
                        </li>
                    ))}
                </ul>
            )}

        </li>
    )
}

export default NgoSendMoneyCard
