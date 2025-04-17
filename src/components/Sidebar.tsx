"use client"

import { useEffect, useState } from "react"
import { checkIfUserHasNgo, getDbUserId, getUserDetails } from "@/actions/user.action"
import { Role } from "@prisma/client"
import { useUser } from "@clerk/nextjs"  // Use useUser instead of useAuth for better reactivity
import SidebarClient from "./SidebarClient"

export default function Sidebar() {
    const { isSignedIn, isLoaded } = useUser()  // isLoaded ensures Clerk state is ready

    const [userId, setUserId] = useState<string | null>(null)
    const [hasNgo, setHasNgo] = useState(false)
    const [userRole, setUserRole] = useState<Role | undefined>(undefined)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const id = await getDbUserId()
                if (!id) return
                const user = await getUserDetails(id)
                const hasNgo = await checkIfUserHasNgo()

                setUserId(id)
                setHasNgo(hasNgo)
                setUserRole(user?.role)
            } catch (error) {
                console.error("Error fetching user data for sidebar:", error)
                setUserId(null)
                setHasNgo(false)
                setUserRole(undefined)
            }
        }

        // Only fetch user data if Clerk's isLoaded state is true (i.e., Clerk is initialized)
        if (isLoaded) {
            if (isSignedIn) {
                fetchUserData()
            } else {
                // Reset user data when signed out
                setUserId(null)
                setHasNgo(false)
                setUserRole(undefined)
            }
        }
    }, [isSignedIn, isLoaded])  // Re-run effect when isSignedIn or isLoaded changes

    return (
        <SidebarClient
            userId={userId}
            isSignedIn={!!userId}  // Make sure to pass boolean indicating if signed in
            hasNgo={hasNgo}
            userRole={userRole}
        />
    )
}
