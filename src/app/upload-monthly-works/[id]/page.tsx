import { getNgoByNgoId } from '@/actions/ngo.action'
import { getDbUserId } from '@/actions/user.action'
import UnauthorizedAccess from '@/components/UnauthorizedAccess'
import UploadMonthlyWorkProofsDialog from '@/components/UploadMonthlyWorkProofsDialog'
import React from 'react'

const page = async ({params}: {params: Promise<{id: string}>}) => {

    const ngoId = (await params).id
    const ngo = await getNgoByNgoId(ngoId)
    const userId = await getDbUserId()
    
    return (
        <div>
            {
                ngo.userId === userId ? (
                    <UploadMonthlyWorkProofsDialog ngo={ngo}/>
                ) : (
                    <UnauthorizedAccess />
                )
            }   
        </div>
    )
}

export default page
