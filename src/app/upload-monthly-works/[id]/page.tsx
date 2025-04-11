import { getNgoByNgoId } from '@/actions/ngo.action'
import UploadMonthlyWorkProofsDialog from '@/components/UploadMonthlyWorkProofsDialog'
import React from 'react'

const page = async ({params}: {params: Promise<{id: string}>}) => {

    const ngoId = (await params).id
    const ngo = await getNgoByNgoId(ngoId)
    
    return (
        <div>   
            <UploadMonthlyWorkProofsDialog ngo={ngo}/>
        </div>
    )
}

export default page
