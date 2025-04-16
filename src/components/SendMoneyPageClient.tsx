'use client'

import React from 'react'
import NgoSendMoneyCard from '@/components/NgoSendMoneyCard'
import SendMoneyToAllButton from '@/components/SendMoneyToAllButton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Donation, NGOProfile } from '@prisma/client'

interface Props {
    submittedNgos: NGOProfile[]
    notSubmittedNgos: NGOProfile[]
    heldDonations: any[]
    reassignedDonations: any[]
    heldTotalsByNgo: Record<string, number>
}

const SendMoneyPageClient = ({
    submittedNgos,
    notSubmittedNgos,
    heldDonations,
    reassignedDonations,
    heldTotalsByNgo
}: Props) => {
    return (
        <Tabs defaultValue="submitted" className="w-full">
            <TabsList className='bg-gray-200 dark:bg-[#2e2b4b] '>
                <TabsTrigger value="submitted">Submitted NGOs</TabsTrigger>
                <TabsTrigger value="notSubmitted">Not Submitted NGOs</TabsTrigger>
            </TabsList>

            <TabsContent value="submitted">
                <div className="p-6">
                    <h1 className="text-xl font-semibold mb-4">Monthly Work Proof Submitted NGOs</h1>
                    <SendMoneyToAllButton ngos={submittedNgos} donations={heldDonations} heldTotalsByNgo={heldTotalsByNgo} />
                    <ul className="space-y-3">
                        {submittedNgos.map(ngo => (
                            <NgoSendMoneyCard
                                key={ngo.id}
                                ngoDetails={ngo}
                                amount={heldTotalsByNgo[ngo.id] || 0}
                                donations={heldDonations.filter((donation) => donation.ngoId === ngo.id)}
                            />
                        ))}
                    </ul>
                </div>
            </TabsContent>

            <TabsContent value="notSubmitted">
                {/* You'll build this later */}
                <h1>Not Submitted NGOs</h1>
            </TabsContent>
        </Tabs>
    )
}

export default SendMoneyPageClient
