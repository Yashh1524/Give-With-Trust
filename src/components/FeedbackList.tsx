import React from 'react'
import FeedbackItem from './FeedbackItem'

interface Feedback {
    id: string
    message: string
    rating: number
    createdAt: string
    user: {
        id: string
        name: string | null
        image: string | null
    }
}

interface FeedbackListProps {
    feedbacks: Feedback[]
}

const FeedbackList = ({ feedbacks }: FeedbackListProps) => {
    return (
        <div className="mt-2 space-y-4">
            <h3 className="text-lg font-semibold">🗣️ Donor Feedback</h3>
            {feedbacks.length === 0 ? (
                <p className="text-muted-foreground text-sm">No feedback yet.</p>
            ) : (
                feedbacks.map(feedback => (
                    <FeedbackItem
                        key={feedback.id}
                        message={feedback.message}
                        rating={feedback.rating}
                        user={feedback.user}
                    />
                ))
            )}
        </div>
    )
}

export default FeedbackList
