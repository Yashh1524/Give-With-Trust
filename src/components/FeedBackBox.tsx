'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { createFeedback, getFeedbackByNgoId } from '@/actions/feedback.action'
import FeedbackForm from './FeedbackForm'
import FeedbackList from './FeedbackList'

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

interface FeedBackBoxProps {
    ngoId: string
    userId: string | null | undefined
    hasUserDonatedToThisNgo: boolean
}

const FeedBackBox = ({ ngoId, userId, hasUserDonatedToThisNgo }: FeedBackBoxProps) => {
    const [rating, setRating] = useState(0)
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
    const [hasSubmitted, setHasSubmitted] = useState(false)

    useEffect(() => {
        async function fetchFeedbacks() {
            const res = await getFeedbackByNgoId(ngoId)
            const normalized = (res || []).map(f => ({
                ...f,
                createdAt: f.createdAt.toString(),
            }))
            setFeedbacks(normalized)

            const existing = normalized.find(f => f.user.id === userId)
            if (existing) {
                setMessage(existing.message)
                setRating(existing.rating)
                setHasSubmitted(true)
            }
        }
        fetchFeedbacks()
    }, [ngoId, userId])

    async function handleSubmit() {
        if (!userId) {
            toast.error('You must be logged in to leave feedback.')
            return
        }
        if (rating < 1 || rating > 5) {
            toast.error('Rating must be between 1 and 5.')
            return
        }
        if (hasSubmitted) {
            toast.error('You have already submitted feedback.')
            return
        }

        try {
            setIsLoading(true)
            await createFeedback({ ngoId, userId, message, rating })
            toast.success('Feedback submitted.')

            const updated = await getFeedbackByNgoId(ngoId)
            setFeedbacks(
                (updated || []).map(f => ({
                    ...f,
                    createdAt: f.createdAt.toString(),
                }))
            )
            setHasSubmitted(true)
        } catch (error) {
            toast.error('Something went wrong.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="mt-6">
            {hasUserDonatedToThisNgo && (
                <FeedbackForm
                    rating={rating}
                    setRating={setRating}
                    message={message}
                    setMessage={setMessage}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    hasSubmitted={hasSubmitted}
                />
            )}
            <FeedbackList feedbacks={feedbacks} />
        </div>
    )
}

export default FeedBackBox
