
import { checkIfUserHasNgo, getDbUserId } from "@/actions/user.action";
import SidebarClient from "./SidebarClient";

export default async function Sidebar() {

    const userId = await getDbUserId()
    let hasNgo = false;

    if (userId) {
        hasNgo = await checkIfUserHasNgo();
    }

    return <SidebarClient userId={userId} isSignedIn={!!userId} hasNgo={hasNgo} />;
}

