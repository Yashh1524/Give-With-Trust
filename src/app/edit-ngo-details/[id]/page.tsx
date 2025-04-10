import { getNgoByNgoId } from '@/actions/ngo.action'
import EditNgoDetails from '@/components/EditNgoDetails'
import React from 'react'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const ngoId = (await params).id
    const ngo = await getNgoByNgoId(ngoId)

    return (
        <EditNgoDetails ngo={ngo} />
    )
}

export default page
