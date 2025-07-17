'use client'

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function YearlyDonationPieChart({ yearlyTotals }: { yearlyTotals: { [year: number]: number } }) {
    const labels = Object.keys(yearlyTotals);
    const values = Object.values(yearlyTotals);

    const data = {
        labels,
        datasets: [
            {
                label: '₹ Donations by Year',
                data: values,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#9CCC65',
                    '#FF7043', '#7E57C2', '#26A69A', '#EC407A',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
    };

    return (
        <div className="w-50 h-50 mx-auto lg:mt-10">
            <Pie data={data} options={options} />
        </div>
    );
}
