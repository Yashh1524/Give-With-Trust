import { getVotingSessionBySessionId } from '@/actions/voting.action'
import AdminVotingSessionDetailsPageClient from '@/components/AdminVotingSessionDetailsPageClient'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id
    const session = await getVotingSessionBySessionId(id)

    if (!session) {
        return <div className="text-center text-red-500">Voting session not found</div>
    }

    return <AdminVotingSessionDetailsPageClient voteSession={session} />
}

export default page
