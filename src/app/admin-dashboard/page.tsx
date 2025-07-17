// app/admin-dashboard/page.tsx

import { getAllNgo } from '@/actions/ngo.action'
import AdminNgoList from '@/components/AdminNgoList'
import React from 'react'
import { Card } from '@/components/ui/card'
import { Users, CheckCircle, Clock } from 'lucide-react'
import { MdOutlinePendingActions } from "react-icons/md";
import { SiTicktick } from "react-icons/si";
import NotifyButton from '@/components/NotifyButton'
import Link from 'next/link'
import ApprovedNgoForAdminClient from '@/components/ApprovedNgoForAdminClient'
import { RxCrossCircled } from "react-icons/rx";
import { getCurrentUserRole } from '@/actions/user.action'
import UnauthorizedAccess from '@/components/UnauthorizedAccess'

const AdminDashboardPage = async () => {
    const ngos = await getAllNgo()
    const userRole = await getCurrentUserRole()

    const unapprovedNgos = ngos.filter((ngo) => !ngo.approved)
    const approvedNgos = ngos.filter((ngo) => ngo.approved)
    const submittedNgos = ngos.filter((ngo) => ngo.status === "SUBMITTED")
    const pendingToSubmitNgos = ngos.filter((ngo) => ngo.status === "PENDING")
    const NotSubmittedNgos = ngos.filter((ngo) => ngo.status === "NOT_SUBMITTED")

    return (
        <>
            {
                userRole === "ADMIN" ? (
                    <div className="p-6 space-y-5">
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

                        {/* Buttons */}
                        <div>
                            <NotifyButton />
                            <div className='flex flex-col lg:flex-row lg:items-center gap-4'>
                                <Link
                                    href="/admin-dashboard/send-money"
                                    className="inline-flex items-center justify-center px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                    Send Money To NGO
                                </Link>
                                <Link
                                    href="/admin-dashboard/voting-sessions"
                                    className="inline-flex items-center justify-center px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                    Voting Sessions
                                </Link>
                                <Link
                                    href="/admin-dashboard/payouts"
                                    className="inline-flex items-center justify-center px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                    Payouts
                                </Link>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <section className="mt-8 space-y-4 dark:bg-[#292739] shadow-lg px-4 py-6 rounded-xl">
                            <h2 className="text-xl font-bold text-purple-500">NGOs by Approval Status</h2>
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
                        </section>
                        {/* Monthly Work Proof Section */}
                        <section className="mt-8 space-y-4 dark:bg-[#292739] shadow-lg px-4 py-6 rounded-xl">
                            <h2 className="text-xl font-bold text-purple-500">NGOs by Monthly Work Proof Status</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Submitted Work Proof */}
                                <Card className="p-6 rounded-xl shadow-inner border border-purple-300 bg-purple-50">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-full bg-purple-200 text-purple-800">
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-purple-700">Submitted Work Proof</p>
                                            <h2 className="text-3xl font-bold text-purple-900">{submittedNgos.length}</h2>
                                        </div>
                                    </div>
                                </Card>

                                {/* Pending Submission */}
                                <Card className="p-6 rounded-xl shadow-inner border border-orange-300 bg-orange-50">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-full bg-orange-200 text-orange-800">
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-orange-700">Pending Submission</p>
                                            <h2 className="text-3xl font-bold text-orange-900">{pendingToSubmitNgos.length}</h2>
                                        </div>
                                    </div>
                                </Card>

                                {/* Not Submitted */}
                                <Card className="p-6 rounded-xl shadow-inner border border-red-300 bg-red-50">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-full bg-red-200 text-red-800">
                                            <RxCrossCircled className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-red-700">Not Submitted</p>
                                            <h2 className="text-3xl font-bold text-red-900">{NotSubmittedNgos.length}</h2>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </section>

                        {/* Unapproved NGO List */}
                        <section className='dark:bg-[#292739] bg-gray-50 shadow-lg p-4 rounded-xl'>
                            <div className='flex gap-3 items-center text-yellow-500'>
                                <MdOutlinePendingActions size={25} />
                                <h2 className="text-xl font-semibold mb-2">Pending Approval NGOs</h2>
                            </div>
                            <AdminNgoList ngos={unapprovedNgos} />
                        </section>

                        {/* Approved NGO List */}
                        <section className='dark:bg-[#292739] bg-gray-50 shadow-lg p-4 rounded-xl space-y-6'>
                            <div className='flex gap-3 items-center text-green-600'>
                                <SiTicktick size={25} />
                                <h2 className="text-xl font-semibold mb-2">Approved NGOs</h2>
                            </div>
                            <ApprovedNgoForAdminClient ngos={approvedNgos} />
                        </section>
                    </div>
                ) : (
                    <UnauthorizedAccess />
                )
            }
        </>
    )
}

export default AdminDashboardPage
