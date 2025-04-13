import { getDonationByNgoId } from '@/actions/donation.action'
import { getNgoByNgoId } from '@/actions/ngo.action'
import AdminNgoViewPageClient from '@/components/AdminNgoViewPageClient'
import React from 'react'

const page = async ({params}: {params: Promise<{id: string}>}) => {

    const ngoId = (await params).id
    const ngo = await getNgoByNgoId(ngoId)
    const donations = await getDonationByNgoId(ngoId)
    // console.log(ngo);
    console.log(donations)
    
    return (
        <AdminNgoViewPageClient ngo={ngo} donations={donations}/>
    )
}

export default page