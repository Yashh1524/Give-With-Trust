'use client'

import React, { useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { createFeedback, getFeedbackByNgoId } from '@/actions/feedback.action'

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
            // console.log(ngoId)
            // console.log(userId)
            // console.log(message)
            // console.log(rating)
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
            {
                hasUserDonatedToThisNgo && (
                    <div className="bg-gray-100 dark:bg-[#1F2937] text-gray-900 dark:text-gray-100 rounded-2xl shadow-md p-6 space-y-4 hover:scale-[1.01] transition">
                        <h2 className="text-xl font-bold">Share Your Feedback</h2>
                        <p className="text-sm text-muted-foreground">
                            Help others by sharing your experience with this NGO.
                        </p>

                        <div>
                            <label className="block mb-1 font-medium">Rating (1-5)</label>
                            <Input
                                type="number"
                                min={1}
                                max={5}
                                value={rating}
                                onChange={e => setRating(Number(e.target.value))}
                                disabled={hasSubmitted}
                                className="bg-white dark:bg-[#263447]"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Message</label>
                            <Textarea
                                placeholder="Your thoughts..."
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                disabled={hasSubmitted}
                                className="bg-white dark:bg-[#263447]"
                            />
                        </div>

                        <Button disabled={isLoading || hasSubmitted} onClick={handleSubmit}>
                            Submit Feedback
                        </Button>

                        {hasSubmitted && (
                            <p className="text-sm text-green-600 dark:text-green-400">
                                ✅ You have already submitted feedback.
                            </p>
                        )}
                    </div>
                )
            }

            <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold">🗣️ Donor Feedback</h3>
                {feedbacks.length === 0 && (
                    <p className="text-muted-foreground text-sm">No feedback yet. Be the first!</p>
                )}
                {feedbacks.map(feedback => (
                    <div
                        key={feedback.id}
                        className="bg-white dark:bg-[#1F2937] text-gray-800 dark:text-gray-100 rounded-xl p-4 shadow-sm"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            {feedback.user.image && (
                                <img
                                    src={feedback.user.image}
                                    alt={feedback.user.name || 'User'}
                                    className="w-8 h-8 rounded-full"
                                />
                            )}
                            <span className="font-medium">{feedback.user.name || 'Anonymous'}</span>
                            <span className="ml-auto text-yellow-500 font-semibold">
                                ⭐ {feedback.rating}/5
                            </span>
                        </div>
                        <p className="text-sm">{feedback.message}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FeedBackBox
