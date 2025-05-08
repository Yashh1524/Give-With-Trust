'use client';

import { useState } from 'react';
import { getMonthlyDonationData, getYearlyDonationTotals } from '@/lib/donationHelpers';
import MonthlyDonationPieChart from './MonthlyDonationPieChart';
import YearlyDonationPieChart from './YearlyDonationPieChart';

interface NGODonationStatsProps {
    ngoId: string;
    donations: any[];
}

export default function NGODonationStats({ ngoId, donations }: NGODonationStatsProps) {
    const [loading, setLoading] = useState(false); // Removed fetchDonations and useEffect
    const monthlyData = getMonthlyDonationData(donations);
    const yearlyData = getYearlyDonationTotals(donations);

    if (loading) {
        return (
            <div className="w-full flex justify-center items-center py-10">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row items-center justify-evenly">
            {monthlyData.some((m) => m > 0) && (
                <div className="my-10">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-10">
                        Month-Wise Donations
                    </h2>
                    <MonthlyDonationPieChart monthlyData={monthlyData} />
                </div>
            )}
            {Object.values(yearlyData).some((v) => v > 0) && (
                <div className="my-10">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-10">
                        Donations by Year
                    </h2>
                    <YearlyDonationPieChart yearlyTotals={yearlyData} />
                </div>
            )}
        </div>
    );
}
