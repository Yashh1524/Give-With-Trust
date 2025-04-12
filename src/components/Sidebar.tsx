
import { checkIfUserHasNgo, getDbUserId, getUserDetails } from "@/actions/user.action";
import SidebarClient from "./SidebarClient";

export default async function Sidebar() {

    const userId = await getDbUserId()
    let hasNgo = false;

    if (userId) {
        hasNgo = await checkIfUserHasNgo();
    }
    const user = await getUserDetails(userId as string)

    return <SidebarClient userId={userId} isSignedIn={!!userId} hasNgo={hasNgo} userRole={user?.role}/>;
}

