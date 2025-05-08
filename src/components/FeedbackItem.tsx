import React from 'react'

interface FeedbackItemProps {
    message: string
    rating: number
    user: {
        name: string | null
        image: string | null
    }
}

const FeedbackItem = ({ message, rating, user }: FeedbackItemProps) => {
    return (
        <div className="bg-gray-200 dark:bg-[#2d3a4a] text-gray-800 dark:text-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
                {user.image && (
                    <img
                        src={user.image}
                        alt={user.name || 'User'}
                        className="w-8 h-8 rounded-full"
                    />
                )}
                <span className="font-medium">{user.name || 'Anonymous'}</span>
                <span className="ml-auto text-yellow-500 font-semibold">⭐ {rating}/5</span>
            </div>
            <p className="text-sm">{message}</p>
        </div>
    )
}

export default FeedbackItem
