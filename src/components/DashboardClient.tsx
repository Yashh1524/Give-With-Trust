'use client';

import { NGOProfile, Proof } from '@prisma/client';
import { ReactNode, useEffect, useState } from 'react';
import { getDonationByNgoId } from '@/actions/donation.action';
import { getMonthlyDonationData, getYearlyDonationTotals } from '@/lib/donationHelpers';
import MonthlyDonationPieChart from './MonthlyDonationPieChart';
import YearlyDonationPieChart from './YearlyDonationPieChart';
import NGODonations from './NGODonations';
import { format } from 'date-fns'
import {
    BiSolidDetail,
    BiTrendingUp,
    BiDonateHeart,
    BiCalendarCheck,
    BiCalendarAlt,
    BiMedal,
} from 'react-icons/bi';
import { MdDoNotDisturbAlt, MdOutlinePendingActions } from "react-icons/md";
import Link from 'next/link';
import MonthlyProofs from './MonthlyProofs';
import { FaDonate } from 'react-icons/fa';
import { getPayoutsByNgoId } from '@/actions/payout.action';

export default function DashboardClient(
    {
        ngos,
        monthlyWorkProofs
    }: {
        ngos: NGOProfile[],
        monthlyWorkProofs: Proof[]
    }
) {
    const [selectedNgoId, setSelectedNgoId] = useState(ngos[0]?.id);
    const selectedNgo = ngos.find((ngo) => ngo.id === selectedNgoId);
    const [donations, setDonations] = useState<any[]>([]);
    const [payouts, setPayouts] = useState<any[]>([]);

    const monthlyData = getMonthlyDonationData(donations);
    const yearlyData = getYearlyDonationTotals(donations);

    const monthlyWorkProofsByNgoId = monthlyWorkProofs.filter((proof) => proof.ngoId === selectedNgoId)

    const fetchDonations = async (ngoId: string) => {
        const data = await getDonationByNgoId(ngoId);
        setDonations(data);
    };

    const fetchPayouts = async (ngoId: string) => {
        const data = await getPayoutsByNgoId(ngoId)
        setPayouts(data)
    }

    useEffect(() => {
        if (selectedNgoId) {
            fetchDonations(selectedNgoId);
            fetchPayouts(selectedNgoId)
        }
    }, [selectedNgoId]);

    const totalRaised = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const held = donations.filter((d) => d.status === 'HELD');
    const released = donations.filter((d) => d.status === 'RELEASED');
    const reassigned = donations.filter((d) => d.status === 'REASSIGNED');

    const donorTotals: Record<string, { amount: number; name: string; image: string }> = {};
    donations.forEach((donation) => {
        const donorId = donation.donorId;
        if (!donorId || donation.isAnonymousDonation) return;

        if (!donorTotals[donorId]) {
            donorTotals[donorId] = {
                amount: 0,
                name: donation.donor?.name || 'Anonymous',
                image: donation.donor?.image || '/default-avatar.png',
            };
        }
        donorTotals[donorId].amount += donation.amount;
    });

    const anonymousDonationTotal = donations
        .filter(d => d.isAnonymousDonation)
        .reduce((sum, d) => sum + d.amount, 0);

    const topDonors = Object.entries(donorTotals)
        .sort((a, b) => b[1].amount - a[1].amount)
        .slice(0, 3);

    const getHighestMonth = (data: number[]) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const maxVal = Math.max(...data);
        const idx = data.indexOf(maxVal);
        return maxVal > 0 ? `${months[idx]} (₹${maxVal})` : 'N/A';
    };

    return (
        <div className="space-y-6">
            {/* NGO Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="font-semibold text-lg">Select NGO:</label>
                <select
                    value={selectedNgoId}
                    onChange={(e) => setSelectedNgoId(e.target.value)}
                    className="border px-4 py-2 rounded-md dark:bg-[#1f2937]"
                >
                    {ngos.map((ngo) => (
                        <option key={ngo.id} value={ngo.id}>
                            {ngo.name}
                        </option>
                    ))}
                </select>

                <Link
                    href={`/edit-ngo-details/${selectedNgoId}`}
                    className="inline-block px-5 py-2 rounded-lg text-white font-medium transition 
                        bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none
                        dark:bg-blue-800 dark:hover:bg-blue-900 dark:focus:ring-blue-500"
                >
                    Edit Details
                </Link>

                {
                    selectedNgo?.approved && (
                        <Link
                            href={`/upload-monthly-works/${selectedNgoId}`}
                            className="inline-block px-5 py-2 rounded-lg text-white font-medium transition 
                                bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none
                                dark:bg-blue-800 dark:hover:bg-blue-900 dark:focus:ring-blue-500"
                        >
                            Upload Monthy Works Proof
                        </Link>
                    )
                }
            </div>

            {!selectedNgo?.approved && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md shadow-sm mb-6">
                    <h2 className="font-semibold text-lg mb-1">Verification in Progress</h2>
                    <p>Your NGO registration request is under review. This process typically takes 24 to 48 hours. We appreciate your patience!</p>
                </div>
            )}

            {/* Summary Cards */}
            <div className="flex flex-col gap-4 md:grid md:grid-cols-4">
                <StatCard
                    title="Total Raised"
                    value={`₹${totalRaised.toFixed(2)}`}
                    icon={<FaDonate className="text-pink-500 text-2xl" />}
                />
                <StatCard
                    title="Held Donations"
                    value={held.length}
                    icon={<MdOutlinePendingActions className="text-yellow-500 text-2xl" />}
                />
                <StatCard
                    title="Released Donations"
                    value={released.length}
                    icon={<BiDonateHeart className="text-green-500 text-2xl" />}
                />
                <StatCard
                    title="Reassigned Donations"
                    value={reassigned.length}
                    icon={<MdDoNotDisturbAlt className="text-red-500 text-2xl" />}
                />
            </div>


            {/* NGO Info Section */}
            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-4 auto-rows-[50px]">
                <div className="col-span-1 row-span-4 p-6 bg-white dark:bg-[#1f2937] rounded-lg shadow flex flex-col items-center justify-center">
                    {selectedNgo?.logo ? (
                        <img
                            src={selectedNgo.logo}
                            alt="NGO Logo"
                            className="w-40 h-40 rounded-full object-cover border-4 border-gray-300"
                        />
                    ) : (
                        <p className="text-gray-400">No logo uploaded</p>
                    )}
                </div>

                {/* NGO Details */}
                <div className="p-6 bg-white dark:bg-[#1f2937] rounded-lg shadow col-span-3 row-span-4">
                    <h2 className="flex gap-2 items-center text-xl font-semibold mb-2">
                        <BiSolidDetail /> NGO Details
                    </h2>
                    <p className="text-sm">{selectedNgo?.description}</p>
                    <div className="mt-4 text-sm space-y-1">
                        <p><strong>Address:</strong> {selectedNgo?.address}</p>
                        <p><strong>Contact:</strong> {selectedNgo?.contactInfo}</p>
                        <p><strong>Established:</strong> {selectedNgo?.establishedDate ? new Date(selectedNgo.establishedDate).toDateString() : 'N/A'}</p>
                        <p className='flex flex-col'><strong>Email:</strong> {selectedNgo?.email}</p>
                        <p><strong>Website:</strong> {selectedNgo?.website || 'N/A'}</p>
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-[#1f2937] rounded-lg shadow col-span-2 row-span-4">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><BiDonateHeart /> Payment Details</h2>
                    <div className="text-sm space-y-2">
                        <p><strong>🏦 Account No:</strong> {selectedNgo?.accountNumber || 'N/A'}</p>
                        <p><strong>🏛️ Bank:</strong> {selectedNgo?.bankName || 'N/A'}</p>
                        <p><strong>🧾 IFSC:</strong> {selectedNgo?.ifscCode || 'N/A'}</p>
                        <p><strong>👤 Account Holder:</strong> {selectedNgo?.accountHolderName || 'N/A'}</p>
                        <p><strong>🔗 UPI ID:</strong> {selectedNgo?.upiId || 'N/A'}</p>
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-[#1f2937] rounded-lg shadow col-span-2 row-span-4 space-y-3 text-sm">
                    <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><BiCalendarCheck /> Key Insights</h2>
                    <p className="flex items-center gap-2"><BiDonateHeart /> <strong>Total Donations:</strong> {donations.length}</p>
                    <p className="flex items-center gap-2"><BiCalendarAlt /> <strong>Active Donation Period:</strong> {donations.length > 0 ? `${donations.at(0).year} - ${donations.at(-1).year}` : 'N/A'}</p>
                    <p className="flex items-center gap-2"><BiTrendingUp /> <strong>Highest Month:</strong> {getHighestMonth(monthlyData)}</p>
                </div>
            </div>

            {/* NGO Images */}
            {selectedNgo?.images?.length as number > 0 && (
                <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Images</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {selectedNgo?.images.map((img, idx) => (
                            <img key={idx} src={img} alt={`NGO Image ${idx + 1}`} className="rounded-md object-cover w-full h-40" />
                        ))}
                    </div>
                </div>
            )}

            {/* NGO Monthly Works Proofs */}
            {
                monthlyWorkProofsByNgoId.length > 0 && (
                    <MonthlyProofs proofs={monthlyWorkProofsByNgoId} ngoId={selectedNgoId} />
                )
            }

            {/* Charts*/}
            <div className="flex flex-col gap-6 md:grid md:grid-cols-3">
                {monthlyData.some((m) => m > 0) && (
                    <div className="p-6 bg-white dark:bg-[#1f2937] rounded-lg shadow col-span-1">
                        <h3 className="font-semibold mb-4">Monthly Donations (This Year)</h3>
                        <MonthlyDonationPieChart monthlyData={monthlyData} />
                    </div>
                )}
                {Object.values(yearlyData).some((y) => y > 0) && (
                    <div className="p-6 bg-white dark:bg-[#1f2937] rounded-lg shadow col-span-1">
                        <h3 className="font-semibold mb-4">Donations by Year</h3>
                        <YearlyDonationPieChart yearlyTotals={yearlyData} />
                    </div>
                )}
                <div className="p-6 bg-white dark:bg-[#1f2937] rounded-lg shadow col-span-2">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <BiMedal /> Top Donors
                    </h3>
                    <ul className="space-y-2">
                        {topDonors.map(([id, info]) => (
                            <li key={id}>
                                <Link
                                    href={`/profile/${id}`}
                                    className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-[#1a1a22]"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={info.image}
                                            alt={info.name}
                                            className="w-9 h-9 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                                        />
                                        <span className="font-medium text-sm text-gray-800 dark:text-gray-100 truncate max-w-[120px]">
                                            {info.name}
                                        </span>
                                    </div>
                                    <span className="font-semibold text-green-600 dark:text-green-400 text-sm whitespace-nowrap">
                                        ₹{info.amount.toFixed(0)}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Anonymous Donations */}
                <div className="p-6 rounded-2xl shadow-md bg-[#1e293b] border border-gray-700 col-span-4 flex items-center justify-between hover:shadow-lg transition-all duration-200 flex-col">
                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                            <BiMedal className="text-yellow-500 text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white tracking-wide">
                                Anonymous Donations
                            </h3>
                            <p className="text-sm text-gray-400">
                                Total received from anonymous contributors
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-full">
                        <img
                            src="/avatar.png"
                            alt="Anonymous Avatar"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-white font-bold text-lg">
                            ₹{anonymousDonationTotal.toLocaleString()}
                        </span>
                    </div>
                </div>

            </div>

            {/* Donation Table */}
            <div className="p-6 bg-white dark:bg-[#1f2937] rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">All Donations</h3>
                <NGODonations donations={donations} />
            </div>

            {/* Payouts */}
            <div className='p-6 bg-white dark:bg-[#1f2937] rounded-lg shadow'>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Payout History</h2>
                <ul className="grid grid-cols-1 w-full gap-6">
                    {payouts.map(payout => (
                        <li key={payout.id} className="bg-white dark:bg-gray-900 rounded-xl shadow p-5 border dark:border-gray-700">
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={payout.ngo.logo as string}
                                    alt={payout.ngo.name}
                                    className="rounded-full object-cover border h-10 w-10"
                                />
                                <div>
                                    <h2 className="font-semibold text-lg">{payout.ngo.name}</h2>
                                    <p className="text-sm text-gray-500">{payout.ngo.address}</p>
                                </div>
                            </div>

                            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                <p><strong>Amount:</strong> ₹{payout.amount}</p>
                                <p><strong>Payout ID:</strong> {payout.razorpayPayoutId}</p>
                                <p><strong>Date:</strong> {format(new Date(payout.createdAt), 'PPP p')}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export function StatCard({ title, value, icon }: { title: string; value: string | number; icon: ReactNode }) {
    return (
        <div className="flex items-center gap-4 p-4 bg-white dark:bg-[#1f2937] rounded-lg shadow">
            <div className="p-3 rounded-full bg-white/10">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h3 className="text-lg font-bold mt-1">{value}</h3>
            </div>
        </div>
    );
}

