'use client'

import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface FeedbackFormProps {
    rating: number
    setRating: (val: number) => void
    message: string
    setMessage: (val: string) => void
    handleSubmit: () => void
    isLoading: boolean
    hasSubmitted: boolean
}

const FeedbackForm = ({
    rating,
    setRating,
    message,
    setMessage,
    handleSubmit,
    isLoading,
    hasSubmitted
}: FeedbackFormProps) => {
    return (
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
                    step={0.1} // 🔹 Allow decimal steps
                    value={rating}
                    onChange={e => setRating(parseFloat(e.target.value))}
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

export default FeedbackForm
