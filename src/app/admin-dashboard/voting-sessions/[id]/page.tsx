import { getVotingSessionBySessionId } from '@/actions/voting.action'
import AdminVotingSessionDetailsPageClient from '@/components/AdminVotingSessionDetailsPageClient'

const page = async ({ params }: { params: { id: string } }) => {
    const session = await getVotingSessionBySessionId(params.id)

    if (!session) {
        return <div className="text-center text-red-500">Voting session not found</div>
    }

    return <AdminVotingSessionDetailsPageClient voteSession={session} />
}

export default page
