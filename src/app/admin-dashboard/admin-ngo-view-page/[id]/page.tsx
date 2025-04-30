import { getDonationByNgoId } from '@/actions/donation.action'
import { getNgoByNgoId } from '@/actions/ngo.action'
import { getPayoutsByNgoId } from '@/actions/payout.action'
import { getMonthlyWorkProofsByNgoId } from '@/actions/proofs.action'
import { getCurrentUserRole } from '@/actions/user.action'
import AdminNgoViewPageClient from '@/components/AdminNgoViewPageClient'
import UnauthorizedAccess from '@/components/UnauthorizedAccess'
import { Donation, NGOProfile, Proof, User } from '@prisma/client'
import React from 'react'

type ExtendedDonation = Donation & {
    donor: User
    reAssignedNgo: NGOProfile | null | undefined
    ngo: NGOProfile
}

type ExtendedNgo = NGOProfile & {
    proofs: Proof[]
    user: User
}

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const ngoId = (await params).id
    const ngo: ExtendedNgo = await getNgoByNgoId(ngoId)
    const donations = await getDonationByNgoId(ngoId)
    const userRole = await getCurrentUserRole()
    const payouts = await getPayoutsByNgoId(ngoId)
    const monthlyWorkProofs = await getMonthlyWorkProofsByNgoId(ngoId)
    
    return (
        <>
            {userRole === "ADMIN" ? (
                <AdminNgoViewPageClient
                    ngo={ngo}
                    donations={donations as ExtendedDonation[]}
                    payouts={payouts}
                    monthlyWorkProofs={monthlyWorkProofs}
                />
            ) : (
                <UnauthorizedAccess />
            )}
        </>
    )
}

export default page
