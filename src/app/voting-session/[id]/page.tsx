import VotingPageClient from '@/components/VotingPageClient'
import { getVotingSessionBySessionId } from '@/actions/voting.action'
import { getDbUserId } from '@/actions/user.action'
import UnauthorizedAccess from '@/components/UnauthorizedAccess'

const page = async ({ params }: { params: { id: string } }) => {
    const sessionId = params.id
    const voteSession = await getVotingSessionBySessionId(sessionId)
    const userId = await getDbUserId()

    const isVoter = voteSession?.voters?.some(voter => voter.id === userId)

    if (!isVoter) return <UnauthorizedAccess />

    return <VotingPageClient voteSession={voteSession} userId={userId}/>
}

export default page
