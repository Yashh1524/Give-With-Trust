import { getAllVotingSession } from '@/actions/voting.action'
import { format } from 'date-fns'
import Link from 'next/link'
import React from 'react'

const page = async () => {

    const votingSessions = await getAllVotingSession()

    return (
        <>
            <h1 className='text-lg md:text-xl my-10'>Voting Sessions</h1>
            {votingSessions.length > 0 ? (
                <div className="space-y-4">
                    {votingSessions.map((session) => {
                        const createdDate = new Date(session.createdAt);
                        // const isFinished = isAfter(new Date(), addDays(createdDate, 3));

                        return (
                            <div
                                key={session.id}
                                className="p-4 bg-white dark:bg-[#1f2937] rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                            >
                                <Link  
                                    href={`/voting-session/${session.id}`}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-3">
                                        {session.failedNgo.logo && (
                                            <img
                                                src={session.failedNgo.logo}
                                                alt={session.failedNgo.name}
                                                className="w-10 h-10 rounded-full object-cover border"
                                            />
                                        )}
                                        <div>
                                            <p
                                                className="text-lg font-semibold text-blue-700 dark:text-blue-300"
                                            >
                                                {session.failedNgo.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Voting Started on:{" "}
                                                {format(createdDate, "MMMM d, yyyy 'at' h:mm a")}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Month: <span className="font-medium">{session.month}</span> &nbsp;
                                                Year: <span className="font-medium">{session.year}</span>
                                            </p>
                                            <p className={`text-sm font-semibold ${session.isOngoing ? "text-green-500-500" : "text-red-500"}`}>
                                                Status: {session.isOngoing ? "Ongoing" : "Finished"}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8 text-muted-foreground">No votes yet</div>
            )}
        </>
    )
}

export default page
