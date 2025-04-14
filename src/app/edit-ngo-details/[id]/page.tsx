import { getNgoByNgoId } from '@/actions/ngo.action'
import { getDbUserId } from '@/actions/user.action'
import EditNgoDetail from '@/components/EditNgoDetails'
import UnauthorizedAccess from '@/components/UnauthorizedAccess'

const page = async ({ params }: { params: { id: string } }) => {
    const ngoId = params.id
    const ngo = await getNgoByNgoId(ngoId)
    const userId = await getDbUserId()

    return (
        <>
            {
                ngo.userId === userId ? (
                    <EditNgoDetail ngo={ngo} ngoId={ngoId} />
                ) : (
                    <UnauthorizedAccess />
                )
            }
        </>
    )
}

export default page
