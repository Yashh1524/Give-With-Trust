'use client'

import React from 'react'
import { Payout, NGOProfile } from '@prisma/client'
import { format } from 'date-fns'
import Link from 'next/link'

interface Props {
    payouts: (Payout & { ngo: NGOProfile })[]
}

const AdminPayoutListClient = ({ payouts }: Props) => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Payout History</h1>
            {
                payouts.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        No payouts found.
                    </div>
                ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {payouts.map(payout => (
                            <li key={payout.id} className="bg-white dark:bg-gray-900 rounded-xl shadow p-5 border dark:border-gray-700">
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={payout.ngo.logo as string}
                                        alt={payout.ngo.name}
                                        className="rounded-full object-cover border h-10 w-10"
                                    />
                                    <div>
                                        <Link href={`/ngos/${payout.ngoId}`}>
                                            <h2 className="font-semibold text-lg hover:text-purple-500">{payout.ngo.name}</h2>
                                        </Link>
                                        <p className="text-sm text-gray-500">{payout.ngo.address}</p>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    <p><strong>Amount:</strong> ₹{payout.amount}</p>
                                    <p><strong>Payout ID:</strong> {payout.razorpayPayoutId}</p>
                                    <p><strong>Date:</strong> {format(new Date(payout.createdAt), 'PPP p')}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )
            }
        </div>
    )
}

export default AdminPayoutListClient
