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
    reassignedTotalsByNgo: Record<string, number>
}

const SendMoneyPageClient = ({
    submittedNgos,
    notSubmittedNgos,
    heldDonations,
    reassignedDonations,
    heldTotalsByNgo,
    reassignedTotalsByNgo
}: Props) => {

    console.log("notSubmittedNgos:", notSubmittedNgos);
    console.log("reassignedDonations:", reassignedDonations);
    console.log("reassignedTotalsByNgo:", reassignedTotalsByNgo);

    return (
        <Tabs defaultValue="submitted" className="w-full">
            <TabsList className='bg-gray-200 dark:bg-[#2e2b4b] '>
                <TabsTrigger value="submitted">Submitted NGOs</TabsTrigger>
                <TabsTrigger value="notSubmitted">Not Submitted NGOs</TabsTrigger>
            </TabsList>

            <TabsContent value="submitted">
                {
                    heldDonations.length > 0 ? (
                        <div className="p-6">
                            <h1 className="text-xl font-semibold mb-4">Monthly Work Proof Submitted NGOs</h1>
                            <SendMoneyToAllButton
                                ngos={submittedNgos}
                                donations={heldDonations}
                                heldTotalsByNgo={heldTotalsByNgo}
                            />
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
                    ) : (
                        <div 
                            className="p-10 mt-10 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-[#2E2B4B] rounded-xl shadow-sm"
                        >
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-white">No NGOs found</h2>
                        </div>
                    )
                }

            </TabsContent>

            <TabsContent value="notSubmitted">
                {
                    reassignedDonations.length > 0 ? (
                        <div className="p-6">
                            <h1 className="text-xl font-semibold mb-10">Reassigned Donations from NGOs that Didn't Submit Proof</h1>

                            {/* List cards where each notSubmittedNgo's donation goes to a reAssignedNgo */}
                            <ul className="space-y-3">
                                {notSubmittedNgos.map(notSubmittedNgo => {
                                    // Get all donations originally meant for this not-submitted NGO
                                    const relatedDonations = reassignedDonations.filter(
                                        (donation) => donation.ngoId === notSubmittedNgo.id
                                    );

                                    // All reassigned donations for this NGO go to one reassigned NGO
                                    const reAssignedNgo = relatedDonations[0]?.reAssignedNgo;
                                    const reAssignedNgoId = relatedDonations[0]?.reAssignedNgoId;

                                    if (!reAssignedNgo || !reAssignedNgoId) return null;

                                    return (
                                        <div className='flex flex-col '>
                                            <NgoSendMoneyCard
                                                key={notSubmittedNgo.id}
                                                ngoDetails={reAssignedNgo}
                                                amount={reassignedTotalsByNgo[notSubmittedNgo.id] || 0}
                                                donations={relatedDonations}
                                                failedNgo={notSubmittedNgo}
                                            />
                                        </div>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : (
                        <div className="p-10 mt-10 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-[#2E2B4B] rounded-xl shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-white">No NGOs found</h2>
                        </div>
                    )
                }
            </TabsContent>

        </Tabs>
    )
}

export default SendMoneyPageClient
