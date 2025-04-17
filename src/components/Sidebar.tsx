"use client"

import { useEffect, useState } from "react"
import { checkIfUserHasNgo, getDbUserId, getUserDetails } from "@/actions/user.action"
import { Role } from "@prisma/client"
import { useAuth } from "@clerk/nextjs"
import SidebarClient from "./SidebarClient"

export default function Sidebar() {
    const { isSignedIn } = useAuth()

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

        if (isSignedIn) {
            fetchUserData()
        }
    }, [isSignedIn])

    return (
        <SidebarClient
            userId={userId}
            isSignedIn={!!userId}
            hasNgo={hasNgo}
            userRole={userRole}
        />
    )
}
