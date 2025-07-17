'use client';

import { useEffect, useState } from 'react';
import { AccentTag, Donation, NGOProfile, NGOStatus, Payout, Proof, User } from '@prisma/client';
import { updateNgoFieldsByAdmin } from '@/actions/ngo.action';
import Link from 'next/link';
import {
    BiSolidDetail,
    BiDonateHeart,
    BiCalendarCheck,
    BiTrendingUp,
    BiMedal
} from 'react-icons/bi';
import NGODonationStats from './NGODonationStats';
import { FaDonate, FaFilePdf } from 'react-icons/fa';
import { MdDoNotDisturbAlt, MdOutlinePendingActions } from 'react-icons/md';
import toast from 'react-hot-toast';
import NGODonations from './NGODonations';
import { format } from 'date-fns';
import MonthlyProofs from './MonthlyProofs';
import { getAverageRatingByNgoId, getFeedbackByNgoId } from '@/actions/feedback.action';
import FeedbackList from './FeedbackList';
import { FaStar } from 'react-icons/fa6';

interface Feedback {
    id: string;
    message: string;
    rating: number;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

type FullDonation = Donation & {
    donor: User;
    reAssignedNgo: NGOProfile | null;
    ngo: NGOProfile;
};

interface AdminNgoViewPageClientProps {
    ngo: {
        id: string;
        name: string | null;
        email: string;
        createdAt: Date;
        status: NGOStatus;
        userId: string;
        establishedDate: Date;
        address: string;
        contactInfo: string;
        description: string;
        images: string[];
        logo: string | null;
        accentTags: AccentTag;
        approved: boolean;
        accountNumber: string | null;
        bankName: string | null;
        ifscCode: string | null;
        accountHolderName: string | null;
        upiId: string | null;
        website: string | null;
        proofPdf: string | null;
        proofs: Proof[];
        user: {
            id: string;
            name: string | null;
            email: string;
            username: string;
            bio: string | null;
            image: string | null;
            createdAt: Date;
        };
    };
    donations: (Donation & { donor: User })[];
    payouts: (Payout & { ngo: NGOProfile })[];
    monthlyWorkProofs: Proof[]
}

export default function AdminNgoViewPageClient({ ngo, donations, payouts,  monthlyWorkProofs }: AdminNgoViewPageClientProps) {
    const [status, setStatus] = useState<NGOStatus>(ngo.status);
    const [accentTags, setAccentTags] = useState<AccentTag>(ngo.accentTags);
    const [approved, setApproved] = useState<boolean>(ngo.approved);
    const [isSaving, setIsSaving] = useState(false);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [avgRating, setAvgRating] = useState(0)

    const fetchFeedbacks = async (ngoId: string) => {
        const data = await getFeedbackByNgoId(ngoId);
        const normalized = (data || []).map(f => ({
            ...f,
            createdAt: f.createdAt.toString()
        }));
        setFeedbacks(normalized);
    };

    const fetchAvgRating = async (ngoId: string) => {
        const data = await getAverageRatingByNgoId(ngoId)
        setAvgRating(data)
    }

    useEffect(() => {
        fetchFeedbacks(ngo.id);
        fetchAvgRating(ngo.id)
    }, [ngo.id]);

    const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0);
    const heldDonations = donations
        .filter((d) => d.status === 'HELD')
        .reduce((sum, d) => sum + d.amount, 0);
    const releasedDonations = donations
        .filter((d) => d.status === 'RELEASED')
        .reduce((sum, d) => sum + d.amount, 0);
    const reassignedDonations = donations
        .filter((d) => d.status === 'REASSIGNED' || d.status === 'REASSIGNED_RELEASED')
        .reduce((sum, d) => sum + d.amount, 0);

    // Donors
    const donorMap: { [key: string]: { id: string; name: string; email: string; image: string | undefined; amount: number } } = {};

    donations.forEach((donation) => {
        if (donation.isAnonymousDonation) return; // skip anonymous donations

        const donorId = donation.donor.id;
        if (!donorMap[donorId]) {
            donorMap[donorId] = {
                id: donation.donor.id,
                name: donation.donor.name || "unknown",
                email: donation.donor.email,
                image: donation.donor.image || "/avatar.png",
                amount: 0
            };
        }
        donorMap[donorId].amount += donation.amount;
    });


    const anonymousDonationTotal = donations
        .filter(d => d.isAnonymousDonation)
        .reduce((sum, d) => sum + d.amount, 0);

    const topDonors = Object.values(donorMap)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5); // Top 5 donors

    const handleSave = async () => {
        setIsSaving(true);
        await updateNgoFieldsByAdmin({
            ngoId: ngo.id,
            status,
            accentTags,
            approved,
        });
        setIsSaving(false);
        toast.success('Updated successfully');
    };

    const fullDonations = donations.map((d) => ({
        ...d,
        reAssignedNgoId: d.reAssignedNgoId ?? null,
        ngoId: d.ngoId, // or d.ngo ?? {} if it's possibly missing
    }));

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{ngo.name}</h1>
                    <p className="text-sm text-gray-500">{ngo.email}</p>
                    <p className="text-md text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <span className="flex items-center">
                            <FaStar className="text-yellow-500" />  
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">{avgRating.toFixed(1)}</span>
                    </p>
                    <div className="flex flex-wrap gap-2 mt-10">
                        {/* Editable status */}
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as NGOStatus)}
                            className={
                                `px-2 py-1 text-md rounded 
                                    ${status === 'SUBMITTED' ? 'bg-green-100 text-green-700' : ''}
                                    ${status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : ''}
                                    ${status === 'NOT_SUBMITTED' ? 'bg-red-100 text-red-700' : ''}
                                `}
                        >
                            {Object.values(NGOStatus).map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>

                        {/* Editable tags */}
                        <select
                            value={accentTags}
                            onChange={(e) => setAccentTags(e.target.value as AccentTag)}
                            className={`px-2 py-1 text-md rounded 
                                    ${accentTags === 'TRUSTED' ? 'bg-blue-100 text-blue-700' : ''}
                                    ${accentTags === 'FEATURED' ? 'bg-purple-100 text-purple-700' : ''}
                                    ${accentTags === 'VERIFIED' ? 'bg-green-100 text-green-700' : ''}
                                    ${accentTags === 'NEW' ? 'bg-yellow-100 text-yellow-700' : ''}
                                    ${accentTags === 'IMPACTFUL' ? 'bg-pink-100 text-pink-700' : ''}
                                `}
                        >
                            {Object.values(AccentTag).map((tag) => (
                                <option key={tag} value={tag}>{tag}</option>
                            ))}
                        </select>

                        {/* Editable approved */}
                        <select
                            value={approved ? 'true' : 'false'}
                            onChange={(e) => setApproved(e.target.value === 'true')}
                            className={`px-2 py-1 text-md rounded ${approved ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                        >
                            <option value="true">Approved</option>
                            <option value="false">Not Approved</option>
                        </select>

                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-200 ${isSaving ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'}`}
                    >
                        {isSaving ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Save Changes
                            </>
                        )}
                    </button>
                </div>

                {ngo.logo && (
                    <img
                        src={ngo.logo}
                        alt="NGO Logo"
                        className="rounded-md border mt-4 md:mt-0 w-40 h-40"
                    />
                )}
            </div>

            {/* Owner Details */}
            <div className="my-10">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Owner Details</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
                    {ngo.user.image ? (
                        <img
                            src={ngo.user.image}
                            alt="Owner Profile"
                            className="w-20 h-20 rounded-full border object-cover mx-auto sm:mx-0"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300 mx-auto sm:mx-0">
                            {ngo.user.name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="text-center sm:text-left">
                        <p className="text-md font-medium text-gray-800 dark:text-white">{ngo.user.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Email:</strong> {ngo.user.email}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>User ID:</strong> {ngo.user.id}
                        </p>
                        <Link href={`/profile/${ngo.user.id}`} className="text-sm underline text-blue-500">
                            View Profile
                        </Link>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Key Insights */}
                <div className="col-span-2 lg:col-span-2 p-6 bg-[#1e293b] rounded-2xl shadow space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                        <BiCalendarCheck /> Key Insights
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                        {/* Total Raised */}
                        <div className="bg-[#334155] rounded-xl p-4 flex items-center gap-3">
                            <FaDonate className="text-pink-400 text-2xl" />
                            <div>
                                <p className="text-sm font-semibold text-white">Total Raised</p>
                                <p className="text-pink-400 font-medium">₹{totalRaised}</p>
                            </div>
                        </div>

                        {/* Held Donations */}
                        <div className="bg-[#334155] rounded-xl p-4 flex items-center gap-3">
                            <MdOutlinePendingActions className="text-yellow-400 text-2xl" />
                            <div>
                                <p className="text-sm font-semibold text-white">Held Donations</p>
                                <p className="text-yellow-400 font-medium">₹{heldDonations}</p>
                            </div>
                        </div>

                        {/* Released Donations */}
                        <div className="bg-[#334155] rounded-xl p-4 flex items-center gap-3">
                            <BiDonateHeart className="text-green-400 text-2xl" />
                            <div>
                                <p className="text-sm font-semibold text-white">Released Donations</p>
                                <p className="text-green-400 font-medium">₹{releasedDonations}</p>
                            </div>
                        </div>

                        {/* Reassigned Donations */}
                        <div className="bg-[#334155] rounded-xl p-4 flex items-center gap-3">
                            <MdDoNotDisturbAlt className="text-red-400 text-2xl" />
                            <div>
                                <p className="text-sm font-semibold text-white">Reassigned Donations</p>
                                <p className="text-red-400 font-medium">₹{reassignedDonations}</p>
                            </div>
                        </div>
                    </div>

                    {/* Top Donors */}
                    <div className="bg-[#1e293b] rounded-2xl p-6 shadow space-y-4 text-white">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <BiTrendingUp /> Top Donors
                        </h2>
                        {topDonors.length > 0 ? (
                            <ul className="space-y-4">
                                {topDonors.map((donor, idx) => (
                                    <li
                                        key={idx}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-600 pb-3 gap-3"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={donor.image || '/default-avatar.png'}
                                                alt={donor.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <Link href={`/profile/${donor.id}`} className="font-medium text-base hover:text-purple-500">{donor.name}</Link>
                                                <p className="text-sm text-gray-400 break-all">{donor.email}</p>
                                            </div>
                                        </div>
                                        <p className="text-green-400 font-semibold whitespace-nowrap sm:self-auto self-end">
                                            ₹{donor.amount}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No donors yet.</p>
                        )}
                    </div>
                </div>

                {/* Anonymous Donations */}
                <div className="p-6 rounded-2xl shadow-md bg-[#1e293b] border border-gray-700 col-span-2 flex flex-col items-center justify-between hover:shadow-lg transition-all duration-200">
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

                {/* NGO Details */}
                <div className="col-span-2 bg-[#1e293b] rounded-2xl p-6 shadow space-y-2 text-sm text-white">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 col-span-2">
                        <BiSolidDetail /> NGO Details
                    </h2>
                    <p>{ngo.description}</p>
                    <p><strong>Address:</strong> {ngo.address}</p>
                    <p><strong>Contact:</strong> {ngo.contactInfo}</p>
                    <p><strong>Established:</strong> {new Date(ngo.establishedDate).toDateString()}</p>
                    <p><strong>Email:</strong> {ngo.email}</p>
                    {ngo.website && (
                        <p>
                            <strong>Website:</strong>{' '}
                            <a href={ngo.website} className="text-blue-400 underline" target="_blank">
                                {ngo.website}
                            </a>
                        </p>
                    )}

                    {/* Proof PDF of NGO */}
                    {ngo.proofPdf && (
                        <div className="flex flex-wrap gap-4">
                            <a
                            href={ngo.proofPdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 mt-3 bg-white border border-gray-200 shadow-sm rounded-lg hover:shadow-md hover:border-red-500 transition-all duration-200 group"
                            >
                            <div className="text-red-600 group-hover:text-red-700 text-xl">
                                <FaFilePdf />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">
                                View NGO proof PDF
                            </span>
                            </a>
                        </div>
                    )}

                </div>

                {/* Payment Details */}
                <div className="col-span-2 bg-[#1e293b] rounded-2xl p-6 shadow space-y-2 text-sm text-white">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
                        <BiDonateHeart /> Payment Details
                    </h2>
                    <p><strong>Account No:</strong> {ngo.accountNumber || 'N/A'}</p>
                    <p><strong>Bank:</strong> {ngo.bankName || 'N/A'}</p>
                    <p><strong>IFSC:</strong> {ngo.ifscCode || 'N/A'}</p>
                    <p><strong>Account Holder:</strong> {ngo.accountHolderName || 'N/A'}</p>
                    <p><strong>UPI ID:</strong> {ngo.upiId || 'N/A'}</p>
                </div>

                {/* Images */}
                {ngo.images?.length > 0 && (
                    <div className="col-span-2 overflow-x-auto w-full bg-[#1e293b] rounded-2xl p-6 shadow text-white">
                        <h2 className="text-xl font-semibold mb-4">Images</h2>
                        <div className="flex gap-2 md:grid md:grid-cols-4">
                            {ngo.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`NGO Image ${idx + 1}`}
                                    className="rounded-lg object-cover w-full h-40 border border-gray-600"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Monthly Work Proofs */}
            {
                monthlyWorkProofs.length > 0 && (
                    <div className='mt-5'>
                        <MonthlyProofs proofs={monthlyWorkProofs} ngoId={ngo.id}/>
                    </div>
                )
            }

            <NGODonationStats ngoId={ngo.id} donations={donations}/>
            <NGODonations donations={fullDonations as FullDonation[]} />

            {/* FeedBacks */}
            <div className="px-6 py-4 bg-white dark:bg-[#1f2937] rounded-lg shadow">
                <FeedbackList feedbacks={feedbacks} />
            </div>

            {/* Payouts */}
            <div className='mt-10 p-6 bg-white dark:bg-[#1f2937] rounded-lg shadow'>
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
                                    <Link href={`/ngos/${payout.ngoId}`}>
                                        <h2 className="font-semibold text-lg hover:text-purple-500">{payout.ngo.name}</h2>
                                    </Link>
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
