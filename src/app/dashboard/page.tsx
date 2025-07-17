import { getDbUserId } from '@/actions/user.action';
import { getNgoByUserId } from '@/actions/ngo.action';
import DashboardClient from '@/components/DashboardClient';
import { getMonthlyWorkProofs } from '@/actions/proofs.action';
import Link from 'next/link';
import UnauthorizedAccess from '@/components/UnauthorizedAccess';

const Page = async () => {
    const userId = await getDbUserId();

    if (!userId) {
        return (
            <div className="p-6 text-red-500">
                You must be logged in to view this page.
            </div>
        );
    }

    const ngos = await getNgoByUserId(userId);
    const monthlyWorkProofs = await getMonthlyWorkProofs();

    return (
        <div className="p-6">
            {ngos && ngos.length > 0 ? (
                <>
                    {
                        ngos[0].userId === userId ? (
                            <DashboardClient ngos={ngos} monthlyWorkProofs={monthlyWorkProofs ?? []} />
                        ) : (
                            <UnauthorizedAccess />
                        )
                    }
                </>
            ) : (
                <div className="max-w-xl mx-auto bg-yellow-50 dark:bg-[#2a2a30] p-6 rounded-lg border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 shadow">
                    <h2 className="text-xl font-semibold mb-2">No NGO Profile Found</h2>
                    <p className="mb-4">It looks like you haven't registered your NGO yet.</p>
                    <Link
                        href="/register-ngo"
                        className="inline-block px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                    >
                        Register Your NGO
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Page;
