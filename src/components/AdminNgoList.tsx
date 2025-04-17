'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Card } from './ui/card'
import { NGOProfile, User } from '@prisma/client'

interface NgoListProps {
    ngos: (NGOProfile & { user: { name: string | null } })[]; 
}


const AdminNgoList: React.FC<NgoListProps> = ({ ngos }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()

    const filteredNgos = ngos.filter((ngo) =>
        ngo.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    
    return (
        <div>
            <Input
                placeholder="Search NGOs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md mb-4"
            />

            <div className="flex overflow-x-auto scrollbar-thin">
                {filteredNgos.length > 0 ? (
                    filteredNgos.map((ngo) => {
                        let statusLabel = 'Not Submitted'
                        let statusColor = 'text-red-600'
                        let borderColor = 'border-red-500'

                        if (ngo.approved) {
                            if (ngo.status === 'SUBMITTED') {
                                statusLabel = '🟢 Submitted'
                                statusColor = 'text-green-600'
                                borderColor = 'border-green-500'
                            } else if (ngo.status === 'PENDING') {
                                statusLabel = '🟡 Pending'
                                statusColor = 'text-yellow-600'
                                borderColor = 'border-yellow-500'
                            }
                        }

                        return (
                            <Card
                                key={ngo.id}
                                className={`flex-shrink-0 w-64 min-h-64 p-4 m-2 cursor-pointer rounded-2xl shadow hover:shadow-lg transition dark:bg-[#1f1d30] border-2 ${ngo.approved ? borderColor : 'border-gray-300'}`}
                                onClick={() => router.push(`/admin-dashboard/admin-ngo-view-page/${ngo.id}`)}
                            >
                                <div className="flex flex-col h-full">
                                    <img
                                        src={ngo.logo as string}
                                        alt={ngo.name}
                                        width={80}
                                        height={80}
                                        className="rounded-xl object-cover mb-3"
                                    />
                                    <div className="font-bold text-lg truncate">{ngo.name}</div>
                                    <div className="text-sm text-gray-600 truncate">
                                        Owner: {ngo.user?.name|| 'N/A'}
                                    </div>
                                    {ngo.approved && (
                                        <div className={`mt-auto pt-3 text-sm font-semibold ${statusColor}`}>
                                            {statusLabel}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )
                    })
                ) : (
                    <p className="text-gray-500">No NGOs found.</p>
                )}
            </div>
        </div>
    )
}

export default AdminNgoList
