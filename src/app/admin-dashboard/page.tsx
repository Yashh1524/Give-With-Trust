// app/admin-dashboard/page.tsx

import { getAllNgo } from '@/actions/ngo.action'
import AdminNgoList from '@/components/AdminNgoList'
import React from 'react'
import { Card } from '@/components/ui/card'
import { Users, CheckCircle, Clock } from 'lucide-react'
import { MdOutlinePendingActions } from "react-icons/md";
import { SiTicktick } from "react-icons/si";

const AdminDashboardPage = async () => {
    const ngos = await getAllNgo()
    console.log(ngos)
    const unapprovedNgos = ngos.filter((ngo) => !ngo.approved)
    const approvedNgos = ngos.filter((ngo) => ngo.approved)

    return (
        <div className="p-6 space-y-5">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total NGOs */}
                <Card className="p-6 rounded-2xl shadow-md border border-blue-200 bg-blue-50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-200 text-blue-800">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-blue-700 font-semibold">Total NGOs</p>
                            <h2 className="text-3xl font-bold text-blue-900">{ngos.length}</h2>
                        </div>
                    </div>
                </Card>

                {/* Approved NGOs */}
                <Card className="p-6 rounded-2xl shadow-md border border-green-200 bg-green-50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-green-200 text-green-800">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-green-700 font-semibold">Approved NGOs</p>
                            <h2 className="text-3xl font-bold text-green-900">{approvedNgos.length}</h2>
                        </div>
                    </div>
                </Card>

                {/* Pending NGOs */}
                <Card className="p-6 rounded-2xl shadow-md border border-yellow-200 bg-yellow-50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-yellow-200 text-yellow-800">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-yellow-700 font-semibold">Pending NGOs</p>
                            <h2 className="text-3xl font-bold text-yellow-900">{unapprovedNgos.length}</h2>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Unapproved NGO List */}
            <section className='dark:bg-[#292739] bg-gray-50 shadow-lg p-4 rounded-xl'>
                <div className='flex gap-3 items-center text-yellow-500'>
                    <MdOutlinePendingActions size={25} />
                    <h2 className="text-xl font-semibold mb-2">Pending Approval NGOs</h2>
                </div>
                <AdminNgoList ngos={unapprovedNgos} />
            </section>

            {/* Approved NGO List */}
            <section className='dark:bg-[#292739] bg-gray-50 shadow-lg p-4 rounded-xl'>
                <div className='flex gap-3 item-center text-green-600'>
                    <SiTicktick size={25}/>
                    <h2 className="text-xl font-semibold mb-2">Approved NGOs</h2>
                </div>
                <AdminNgoList ngos={approvedNgos} />
            </section>
        </div>
    )
}

export default AdminDashboardPage
