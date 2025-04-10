import { getNgoByNgoId } from '@/actions/ngo.action'
import EditNgoDetail from '@/components/EditNgoDetails'

const page = async ({ params }: { params: { id: string } }) => {
    const ngoId = params.id
    const ngo = await getNgoByNgoId(ngoId)

    return <EditNgoDetail ngo={ngo} ngoId={ngoId} />
}

export default page
