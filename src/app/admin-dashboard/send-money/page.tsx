import { getAllHeldDonation } from '@/actions/donation.action'
import { getSubmittedNGOs } from '@/actions/ngo.action'
import Link from 'next/link'
import React from 'react'

const page = async () => {
  const ngoToSendMoney = await getSubmittedNGOs()
  const allHeldDonations = await getAllHeldDonation()
  console.log(ngoToSendMoney);

  // Map of ngoId => total held amount
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
          <li
            key={ngo.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow"
          >
            <div className="flex justify-between items-center">
              <div className='flex items-center gap-3'>
                <img src={ngo.logo as string} alt="logo" className='w-10 h-10 rounded-full object-cover'/>
                <Link href={`/ngos/${ngo.id}`} className="font-medium hover:text-purple-600">{ngo.name}</Link>
              </div>
              <span className="text-green-600 font-semibold">
                ₹{heldTotalsByNgo[ngo.id] || 0}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default page
