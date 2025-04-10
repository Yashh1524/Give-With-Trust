import { getDbUserId, getUserDetails } from '@/actions/user.action';
import { getNgoByUserId } from '@/actions/ngo.action';
import DashboardClient from '@/components/DashboardClient';

const Page = async () => {
    const userId = await getDbUserId();
    const ngos = await getNgoByUserId(userId) ?? [];
    console.log(ngos);
    
    return (
        <div className="p-6">
            <DashboardClient ngos={ngos} />
        </div>
    );
};

export default Page;
