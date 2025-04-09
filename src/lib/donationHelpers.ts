export function getMonthlyDonationData(donations: any[]) {
    const months = Array(12).fill(0);

    donations.forEach(donation => {
        const date = new Date(donation.createdAt);
        const yearMatch = date.getFullYear() === new Date().getFullYear();
        if (yearMatch) {
            const month = date.getMonth(); // 0 = Jan, 11 = Dec
            months[month] += donation.amount;
        }
    });

    return months;
}

export function getYearlyDonationTotals(donations: any[]) {
    const yearlyTotals: { [year: number]: number } = {};

    donations.forEach(donation => {
        const date = new Date(donation.createdAt);
        const year = date.getFullYear();

        if (!yearlyTotals[year]) {
            yearlyTotals[year] = 0;
        }

        yearlyTotals[year] += donation.amount;
    });

    return yearlyTotals;
}
