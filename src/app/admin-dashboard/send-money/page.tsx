import { getAllDonationByStatus } from '@/actions/donation.action'
import { getNGOsByStatus } from '@/actions/ngo.action'
import React from 'react'
import { getCurrentUserRole } from '@/actions/user.action'
import UnauthorizedAccess from '@/components/UnauthorizedAccess'
import SendMoneyPageClient from '@/components/SendMoneyPageClient'

const page = async () => {
  const userRole = await getCurrentUserRole()
  const monthyWorkProofSubmittedNgo = await getNGOsByStatus("SUBMITTED")
  const monthyWorkProofNotSubmittedNgo = await getNGOsByStatus("NOT_SUBMITTED")
  const allHeldDonations = await getAllDonationByStatus("HELD")
  const allReassignedDonations = await getAllDonationByStatus("REASSIGNED")

  const heldTotalsByNgo: Record<string, number> = {}
  allHeldDonations.forEach(donation => {
    const id = donation.ngoId
    heldTotalsByNgo[id] = (heldTotalsByNgo[id] || 0) + donation.amount
  })

  if (userRole !== "ADMIN") return <UnauthorizedAccess />

  return (
    <SendMoneyPageClient
      submittedNgos={monthyWorkProofSubmittedNgo}
      notSubmittedNgos={monthyWorkProofNotSubmittedNgo}
      heldDonations={allHeldDonations}
      reassignedDonations={allReassignedDonations}
      heldTotalsByNgo={heldTotalsByNgo}
    />
  )
}

export default page
