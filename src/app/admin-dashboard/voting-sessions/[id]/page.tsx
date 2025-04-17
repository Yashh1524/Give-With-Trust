import { getVotingSessionBySessionId } from '@/actions/voting.action'
import AdminVotingSessionDetailsPageClient from '@/components/AdminVotingSessionDetailsPageClient'

// Helper function to serialize date fields
const serializeDates = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;

    if (Array.isArray(obj)) {
        return obj.map(serializeDates);
    }

    if (typeof obj === 'object') {
        const newObj: any = {};
        for (const key in obj) {
            const value = obj[key];
            newObj[key] = value instanceof Date ? value.toISOString() : serializeDates(value);
        }
        return newObj;
    }

    return obj;
};

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;
    const session = await getVotingSessionBySessionId(id);

    if (!session) {
        return <div className="text-center text-red-500">Voting session not found</div>;
    }

    const serializedSession = serializeDates(session);

    return <AdminVotingSessionDetailsPageClient voteSession={serializedSession} />;
};

export default page;
