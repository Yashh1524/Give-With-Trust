import { getAllHeldDonation } from '@/actions/donation.action'
import { getSubmittedNGOs } from '@/actions/ngo.action'
import React from 'react'
import NgoSendMoneyCard from '@/components/NgoSendMoneyCard'

const page = async () => {
  const ngoToSendMoney = await getSubmittedNGOs()
  const allHeldDonations = await getAllHeldDonation()

  const heldTotalsByNgo: Record<string, number> = {}

  allHeldDonations.forEach(donation => {
    const id = donation.ngoId
    if (!heldTotalsByNgo[id]) {
      heldTotalsByNgo[id] = 0
    }
    heldTotalsByNgo[id] += donation.amount
  })

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Held Donations per NGO</h1>
      <ul className="space-y-3">
        {ngoToSendMoney.map(ngo => (
          <NgoSendMoneyCard
            key={ngo.id}
            ngoDetails={ngo}
            amount={heldTotalsByNgo[ngo.id] || 0}
            donations={allHeldDonations.filter((donation) => donation.ngoId === ngo.id)}
          />
        ))}
      </ul>
    </div>
  )
}

export default page
