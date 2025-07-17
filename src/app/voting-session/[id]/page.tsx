import VotingPageClient from '@/components/VotingPageClient'
import { getVotingSessionBySessionId } from '@/actions/voting.action'
import { getDbUserId } from '@/actions/user.action'
import UnauthorizedAccess from '@/components/UnauthorizedAccess'

// Reuse this helper to serialize all Date fields to strings
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
    const sessionId = (await params).id;
    const voteSession = await getVotingSessionBySessionId(sessionId);
    const userId = await getDbUserId();

    if (!voteSession) {
        return <div className="text-center text-red-500">Voting session not found</div>;
    }

    const isVoter = voteSession.voters?.some(voter => voter.id === userId);

    if (!isVoter) return <UnauthorizedAccess />;

    const serializedSession = serializeDates(voteSession);

    return <VotingPageClient voteSession={serializedSession} userId={userId} />;
};

export default page;
