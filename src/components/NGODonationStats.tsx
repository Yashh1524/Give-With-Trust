'use client';

import { useEffect, useState } from 'react';
import { getDonationByNgoId } from '@/actions/donation.action';
import { getMonthlyDonationData, getYearlyDonationTotals } from '@/lib/donationHelpers';
import NGODonations from './NGODonations';
import MonthlyDonationPieChart from './MonthlyDonationPieChart';
import YearlyDonationPieChart from './YearlyDonationPieChart';

interface NGODonationStatsProps {
    ngoId: string;
}

export default function NGODonationStats({ ngoId }: NGODonationStatsProps) {
    const [donations, setDonations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const monthlyData = getMonthlyDonationData(donations);
    const yearlyData = getYearlyDonationTotals(donations);

    const fetchDonations = async () => {
        try {
            setLoading(true);
            const ngoDonations = await getDonationByNgoId(ngoId);
            setDonations(ngoDonations);
        } catch (error) {
            console.error('Failed to fetch donations', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, [ngoId]);

    if (loading) {
        return (
            <div className="w-full flex justify-center items-center py-10">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col lg:flex-row items-center justify-evenly">
                {monthlyData.some(m => m > 0) && (
                    <div className="my-10">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-10">
                            Donations (This Year)
                        </h2>
                        <MonthlyDonationPieChart monthlyData={monthlyData} />
                    </div>
                )}
                {Object.values(yearlyData).some(v => v > 0) && (
                    <div className="my-10">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-10">
                            Donations by Year
                        </h2>
                        <YearlyDonationPieChart yearlyTotals={yearlyData} />
                    </div>
                )}
            </div>
        </>
    );
}
