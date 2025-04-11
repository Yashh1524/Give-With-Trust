import { getDbUserId } from '@/actions/user.action';
import { getNgoByUserId } from '@/actions/ngo.action';
import DashboardClient from '@/components/DashboardClient';
import { getMonthlyWorkProofs } from '@/actions/proofs.action';

const Page = async () => {
    const userId = await getDbUserId();

    if (!userId) {
        return <div className="p-6 text-red-500">You must be logged in to view this page.</div>;
    }

    const ngos = await getNgoByUserId(userId);
    const monthlyWorkProofs = await getMonthlyWorkProofs()
    console.log(monthlyWorkProofs);

    return (
        <div className="p-6">
            <DashboardClient ngos={ngos ?? []} monthlyWorkProofs={monthlyWorkProofs ?? []}/>
        </div>
    );
};

export default Page;
