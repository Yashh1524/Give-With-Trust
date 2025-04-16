import { getAllPayouts } from '@/actions/payout.action'
import { getCurrentUserRole } from '@/actions/user.action'
import AdminPayoutListClient from '@/components/AdminPayoutListClient'
import UnauthorizedAccess from '@/components/UnauthorizedAccess'
import React from 'react'

const page = async () => {

    const userRole = await getCurrentUserRole()
    const payouts = await getAllPayouts()

    return (
        <>
            { 
                userRole === "ADMIN" ? (
                    <AdminPayoutListClient payouts={payouts}/>
                ) : (
                    <UnauthorizedAccess />
                )
            }
        </>
    )
}

export default page
