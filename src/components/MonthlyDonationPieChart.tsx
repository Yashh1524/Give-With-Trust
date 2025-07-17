'use client'

import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function MonthlyDonationPieChart({ monthlyData }: { monthlyData: number[] }) {
    const filtered = monthlyData
        .map((amount, index) => ({ label: MONTH_NAMES[index], value: amount }))
        .filter(item => item.value > 0);

    if (filtered.length === 0) {
        return <p className="text-gray-500 text-center">No donations this year.</p>;
    }

    const data = {
        labels: filtered.map(item => item.label),
        datasets: [
            {
                label: '₹ Donations',
                data: filtered.map(item => item.value),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#9CCC65',
                    '#FF7043', '#7E57C2', '#26A69A', '#EC407A',
                    '#42A5F5', '#D4E157', '#5C6BC0', '#FFA726'
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    boxWidth: 12,
                    font: {
                        size: 12,
                    },
                },
            },
        },
    };

    return (
        <div className="w-50 h-50 mx-auto lg:mt-10">
            <Pie data={data} options={options} />
        </div>
    );
}
