import { getDonationByNgoId } from '@/actions/donation.action'
import { getNgoByNgoId } from '@/actions/ngo.action'
import { getCurrentUserRole } from '@/actions/user.action'
import AdminNgoViewPageClient from '@/components/AdminNgoViewPageClient'
import UnauthorizedAccess from '@/components/UnauthorizedAccess'
import React from 'react'

const page = async ({params}: {params: Promise<{id: string}>}) => {

    const ngoId = (await params).id
    const ngo = await getNgoByNgoId(ngoId)
    const donations = await getDonationByNgoId(ngoId)
    const userRole = await getCurrentUserRole()
    // console.log(ngo);
    // console.log(donations)
    
    return (
        <>
            {
                userRole === "ADMIN" ? (
                    <AdminNgoViewPageClient ngo={ngo} donations={donations}/>
                ) : (
                    <UnauthorizedAccess />
                )
            }
        </>
    )
}

export default page